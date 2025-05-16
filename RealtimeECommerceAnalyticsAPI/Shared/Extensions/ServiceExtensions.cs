using RealtimeECommerceAnalytics.Services;
using RealtimeECommerceAnalytics.Services.Interfaces;

namespace RealtimeECommerceAnalytics.Shared.Extensions
{
    public static class ServiceExtensions
    {
        public static void AddServices(this IServiceCollection services)
        {
            services.AddScoped<IMarketplaceService, FakeStoreService>();
            services.AddScoped<IMarketplaceService, DummyJsonService>();
            services.AddScoped<MarketplaceService>();
        }

        public static void AddHttpClients(this IServiceCollection services)
        {
            services.AddHttpClient<FakeStoreService>();
            services.AddHttpClient<DummyJsonService>();
        }
    }
}
