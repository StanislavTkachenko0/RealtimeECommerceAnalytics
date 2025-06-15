using Microsoft.EntityFrameworkCore;
using RealtimeECommerceAnalytics.DataBaseContext;
using RealtimeECommerceAnalytics.Models;
using RealtimeECommerceAnalytics.Models.DTOs;
using RealtimeECommerceAnalytics.Services.Interfaces;

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

    }
}
