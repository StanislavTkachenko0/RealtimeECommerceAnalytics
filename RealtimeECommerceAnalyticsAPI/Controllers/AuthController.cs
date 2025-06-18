using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using RealtimeECommerceAnalytics.DataBaseContext;
using RealtimeECommerceAnalytics.Models;
using RealtimeECommerceAnalytics.Models.Auth;
using RealtimeECommerceAnalytics.Services.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace RealtimeECommerceAnalytics.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ECommerceDbContext _dbContext;
        private readonly IConfiguration _config;
        private readonly IEmailService _emailService;
        private readonly IUserService _userService;

        public AuthController(
            ECommerceDbContext dbContext, 
            IConfiguration config,
            IEmailService emailService,
            IUserService userService
            )
        {
            _dbContext = dbContext;
            _config = config;
            _emailService = emailService;
            _userService = userService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            if (_dbContext.Users.Any(u => u.Email == dto.Email))
                return BadRequest("Email already registered");

            var user = new UserModel
            {
                Email = dto.Email,
                FirstName = string.Empty,
                LastName = string.Empty,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = dto.Role
            };

            _dbContext.Users.Add(user);
            await _dbContext.SaveChangesAsync();

            return Ok("User registered");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] AuthModel dto)
        {
            var user = _dbContext.Users.FirstOrDefault(u => u.Email == dto.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                return Unauthorized("Invalid email or password");

            if (user.IsDelete)
            {
                return Unauthorized("User was archived, please contact manager: TG: @skye_utf");
            }

            var code = new Random().Next(100000, 999999).ToString();

            var loginInfo = new LoginInfo
            {
                Email = dto.Email,
                Code = code,
                Date = DateTime.UtcNow,
                Ip = HttpContext.Connection.RemoteIpAddress?.ToString(),
                OS = _userService.GetOSFromUserAgent(Request.Headers["User-Agent"]),
                UserAgent = Request.Headers["User-Agent"].ToString(),
                IsCompleted = false
            };

            await _dbContext.Logins.AddAsync(loginInfo);
            await _dbContext.SaveChangesAsync();

            await _emailService.SendEmailAsync(
                dto.Email,
                "Login Code",
                $"<p>Your login code is: <strong>{code}</strong></p>");

            return Ok(new { message = "Code sent." });
        }

        [HttpPost(nameof(VerifyCode))]
        public async Task<IActionResult> VerifyCode([FromBody] VerifyCode model)
        {
            var latest = await _dbContext.Logins
                .Where(x => x.Email == model.Email && !x.IsCompleted)
                .OrderByDescending(x => x.Date)
                .FirstOrDefaultAsync();

            if (latest == null || latest.Code != model.Code || (DateTime.UtcNow - latest.Date).TotalMinutes > 10)
                return BadRequest("Invalid or expired code");

            latest.IsCompleted = true;
            await _dbContext.SaveChangesAsync();

            var user = await _dbContext.Users.FirstOrDefaultAsync(x => x.Email == model.Email);

            var token = GenerateJwtToken(user.Email, user.Role);
            return Ok(new { token });
        }

        private string GenerateJwtToken(string email, string role)
        {
            var claims = new[]
            {
            new Claim(ClaimTypes.NameIdentifier, email),
            new Claim(ClaimTypes.Role, role)
        };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                _config["Jwt:Issuer"],
                _config["Jwt:Audience"],
                claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
