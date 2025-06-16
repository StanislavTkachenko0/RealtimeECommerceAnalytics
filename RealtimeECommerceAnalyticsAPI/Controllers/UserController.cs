using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RealtimeECommerceAnalytics.Enums;
using RealtimeECommerceAnalytics.Models;
using RealtimeECommerceAnalytics.Models.DTOs;
using RealtimeECommerceAnalytics.Services.Interfaces;
using System.Security.Claims;
using System.Text.Json;

namespace RealtimeECommerceAnalytics.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
    public class UserController : Controller
    {
        private readonly IUserService _userService;

        public UserController(
            IUserService userService
        )
        {
            _userService = userService;
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        [Route(nameof(GetUsers))]
        public async Task<IEnumerable<UserDto>> GetUsers()
        {
            var users = await _userService.GetUsers();

            return users;
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        [Route(nameof(ArchiveUser))]
        public async Task<IActionResult> ArchiveUser(int id)
        {
            var response = await _userService.ArchiveUser(id);

            return Ok(response);
        }

        [HttpGet]
        [Authorize]
        [Route(nameof(GetUser))]
        public async Task<IActionResult> GetUser(string email)
        {
            var user = await _userService.GetUser(email);

            if (user is null)
            {
                return NotFound("User not found");
            }

            return Ok(user);
        }

        [Authorize]
        [HttpPatch(nameof(UpdateField))]
        public async Task<IActionResult> UpdateField([FromBody] JsonElement body)
        {
            var email = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var result = await _userService.UpdateField(body, email);
            
            if (result == ResponseCode.NOT_FOUND)
            {
                return NotFound();
            }

            return NoContent();
        }

        [Authorize]
        [HttpPatch(nameof(ChangePassword))]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePassword model)
        {
            var email = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var result = await _userService.ChangePassword(model.NewPassword, email);

            if (result == ResponseCode.NOT_FOUND)
            {
                return NotFound();
            }
            else if (result == ResponseCode.BAD_REQUEST)
            {
                return BadRequest("Password can't be same");
            }

            return NoContent();
        }
    }
}
