using Microsoft.EntityFrameworkCore;
using RealtimeECommerceAnalytics.DataBaseContext;
using RealtimeECommerceAnalytics.Enums;
using RealtimeECommerceAnalytics.Models;
using RealtimeECommerceAnalytics.Models.DTOs;
using RealtimeECommerceAnalytics.Services.Interfaces;
using System.Security.Claims;
using System.Text.Json;

namespace RealtimeECommerceAnalytics.Services
{
    public class UserService : IUserService
    {
        private readonly ECommerceDbContext _context;

        public UserService(
            ECommerceDbContext context
        )
        {
            _context = context;
        }

        public async Task<IEnumerable<UserDto>> GetUsers()
        {
            try
            {
                var users = await _context.Users.Select(x => new UserDto()
                {
                    Id = x.Id,
                    Email = x.Email,
                    FirstName = x.FirstName,
                    LastName = x.LastName,
                    Role = x.Role,
                    IsDelete = x.IsDelete,
                }).ToListAsync();

                return users.Any() ? users : Enumerable.Empty<UserDto>();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<UserDto> GetUser(string email)
        {
            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(x => x.Email == email);

                if (user is null)
                {
                    return null;
                }

                return new UserDto()
                {
                    Id = user.Id,
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Role = user.Role,
                    IsDelete = user.IsDelete
                };
            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }
        }

        public async Task<ResponseCode> UpdateField(JsonElement field, string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            
            if (user == null) return ResponseCode.NOT_FOUND;

            if (field.TryGetProperty("firstName", out var firstName))
                user.FirstName = firstName.GetString();
            if (field.TryGetProperty("lastName", out var lastName))
                user.LastName = lastName.GetString();

            await _context.SaveChangesAsync();

            return ResponseCode.OK;
        }

        public async Task<bool> ArchiveUser(int id)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);

                if (user == null)
                    return false;

                user.IsDelete = true;

                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<ResponseCode> ChangePassword(string newPassword, string email)
        {
            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(x => x.Email == email);

                if (user == null) return ResponseCode.NOT_FOUND;

                if (BCrypt.Net.BCrypt.Verify(newPassword, user.PasswordHash))
                {
                    return ResponseCode.BAD_REQUEST;
                }

                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);

                await _context.SaveChangesAsync();

                return ResponseCode.OK;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
