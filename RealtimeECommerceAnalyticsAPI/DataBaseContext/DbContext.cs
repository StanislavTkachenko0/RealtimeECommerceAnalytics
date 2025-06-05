using Microsoft.EntityFrameworkCore;
using RealtimeECommerceAnalytics.Models;

namespace RealtimeECommerceAnalytics.DataBaseContext
{
    public class ECommerceDbContext: DbContext
    {
        public ECommerceDbContext(DbContextOptions<ECommerceDbContext> options) : base(options) { }

        public DbSet<UserModel> Users { get; set; }
    }
}
