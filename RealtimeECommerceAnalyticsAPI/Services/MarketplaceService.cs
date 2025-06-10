using Microsoft.AspNetCore.SignalR;
using RealtimeECommerceAnalytics.HUBs;
using RealtimeECommerceAnalytics.Services.Interfaces;

namespace RealtimeECommerceAnalytics.Services
{
    public class MarketplaceService
    {
        private readonly IAggregatorService _aggregatorService;

        public MarketplaceService(
            IAggregatorService aggregatorService
            )
        {
            _aggregatorService = aggregatorService;
        }

        public async Task AggregateAndBroadcastProductStatsAsync()
        {
           
        }
    }
}
