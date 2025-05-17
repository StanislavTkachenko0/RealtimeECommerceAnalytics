using RealtimeECommerceAnalytics.Services;
using RealtimeECommerceAnalytics.Services.Backgrounds;
using RealtimeECommerceAnalytics.Services.Interfaces;

namespace RealtimeECommerceAnalytics.Shared.Extensions
{
    public static class ServiceExtensions
    {
        public static void AddServices(this IServiceCollection services)
        {
            services.AddScoped<IMarketplaceService, FakeStoreService>();
            services.AddScoped<IMarketplaceService, DummyJsonService>();
            services.AddScoped<IMarketplaceAggregatorService, MarketplaceAggregatorService>();
            services.AddScoped<ICryptoService, CryptoService>();
            services.AddScoped<MarketplaceService>();
        }

        public static void AddHttpClients(this IServiceCollection services)
        {
            services.AddHttpClient<FakeStoreService>();
            services.AddHttpClient<DummyJsonService>();
        }

        public static void AddHostedServices(this IServiceCollection services)
        {
            services.AddHostedService<MarketplaceStatsBackgroundService>();
            services.AddHostedService<CryptoDataBackgroundService>();
        }
    }
}
