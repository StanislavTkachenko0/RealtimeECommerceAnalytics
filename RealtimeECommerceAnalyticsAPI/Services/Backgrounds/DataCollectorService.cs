using RealtimeECommerceAnalytics.Services.Interfaces;

namespace RealtimeECommerceAnalytics.Services.Backgrounds
{
    public class DataCollectorService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<DataCollectorService> _logger;

        public DataCollectorService(IServiceProvider serviceProvider, ILogger<DataCollectorService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                using var scope = _serviceProvider.CreateScope();
                var aggregateService = scope.ServiceProvider.GetRequiredService<IAggregatorService>();

                try
                {
                    _logger.LogInformation("Starting background aggregation at: {time}", DateTimeOffset.Now);
                    await aggregateService.GetAggregatedDataAsync();
                    await aggregateService.SendAggregatedDataAsync();
                    _logger.LogInformation("Aggregation complete at: {time}", DateTimeOffset.Now);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error during data aggregation");
                }

                // Інтервал - кожну годину
                await Task.Delay(TimeSpan.FromHours(1), stoppingToken);
            }
        }
    }
}
