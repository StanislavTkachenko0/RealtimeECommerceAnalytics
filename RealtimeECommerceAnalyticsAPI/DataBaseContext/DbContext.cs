using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using RealtimeECommerceAnalytics.Models;

namespace RealtimeECommerceAnalytics.DataBaseContext
{
    public class ECommerceDbContext: DbContext
    {
        public ECommerceDbContext(DbContextOptions<ECommerceDbContext> options) : base(options) { }

        public DbSet<UserModel> Users { get; set; }
        public DbSet<LanguageModel> Languages { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            var stringListComparer = new ValueComparer<IList<string>>(
                                                                      (c1, c2) => c1.SequenceEqual(c2),
                                                                      c => c.Aggregate(0, (a, v) => HashCode.Combine(a, v.GetHashCode())),
                                                                      c => c.ToList());

            modelBuilder.Entity<LanguageModel>(e =>
            {
                e.Property(x => x.Version).IsConcurrencyToken();
            });
        }
    }
}
