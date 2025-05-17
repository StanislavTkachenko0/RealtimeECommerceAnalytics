using RealtimeECommerceAnalytics.Services.Interfaces;

namespace RealtimeECommerceAnalytics.Services.Backgrounds
{
    public class CryptoDataBackgroundService : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;

        public CryptoDataBackgroundService(IServiceScopeFactory scopeFactory)
        {
            _scopeFactory = scopeFactory;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                using var scope = _scopeFactory.CreateScope();
                var cryptoService = scope.ServiceProvider.GetRequiredService<ICryptoService>();

                // Відправка по SignalR
                await cryptoService.UpdateAndBroadcast();

                await Task.Delay(TimeSpan.FromSeconds(30), stoppingToken); // кожні 30 секунд
            }
        }
    }
}
