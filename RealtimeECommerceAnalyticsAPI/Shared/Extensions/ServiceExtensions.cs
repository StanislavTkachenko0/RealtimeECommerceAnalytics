using RealtimeECommerceAnalytics.Services;
using RealtimeECommerceAnalytics.Services.Backgrounds;
using RealtimeECommerceAnalytics.Services.Interfaces;
using RealtimeECommerceAnalytics.Services.Mongo;

namespace RealtimeECommerceAnalytics.Shared.Extensions
{
    public static class ServiceExtensions
    {
        public static void AddServices(this IServiceCollection services)
        {
            // DI
            services.AddScoped<IApiSourceService, FakeStoreService>();
            services.AddScoped<IApiSourceService, DummyJsonService>();
            services.AddScoped<IApiSourceService, OpenLibraryService>();
            services.AddScoped<IApiSourceService, OpenFoodFactsApiService>();
            services.AddScoped<IApiSourceService, CryptoService>();
            services.AddScoped<IAggregatorService, AggregatorService>();
            services.AddScoped<ITranslationCacheService, TranslationCacheService>();
            services.AddScoped<ILanguageService, LanguageService>();
            services.AddScoped<MarketplaceService>();

            // Singleton
            services.AddSingleton<MongoDataService>();
        }

        public static void AddHttpClients(this IServiceCollection services)
        {
            services.AddHttpClient<FakeStoreService>();
            services.AddHttpClient<DummyJsonService>();
            services.AddHttpClient<OpenLibraryService>();
            services.AddHttpClient<OpenFoodFactsApiService>();
        }

        public static void AddHostedServices(this IServiceCollection services)
        {
            services.AddHostedService<DataCollectorService>();
        }
    }
}
