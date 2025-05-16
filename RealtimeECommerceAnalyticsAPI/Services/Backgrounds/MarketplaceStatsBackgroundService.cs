namespace RealtimeECommerceAnalytics.Services.Backgrounds
{
    public class MarketplaceStatsBackgroundService : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;

        public MarketplaceStatsBackgroundService(IServiceScopeFactory scopeFactory)
        {
            _scopeFactory = scopeFactory;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                using var scope = _scopeFactory.CreateScope();
                var marketplaceService = scope.ServiceProvider.GetRequiredService<MarketplaceService>();

                await marketplaceService.AggregateAndBroadcastProductStatsAsync();

                await Task.Delay(TimeSpan.FromSeconds(30), stoppingToken); // каждые 30 секунд
            }
        }
    }
}
