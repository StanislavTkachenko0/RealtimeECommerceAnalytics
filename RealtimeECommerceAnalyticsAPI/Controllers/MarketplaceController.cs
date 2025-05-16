using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RealtimeECommerceAnalytics.Models.DTOs;
using RealtimeECommerceAnalytics.Services;
using RealtimeECommerceAnalytics.Services.Interfaces;

namespace RealtimeECommerceAnalytics.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MarketplaceController : ControllerBase
    {
        private readonly IEnumerable<IMarketplaceService> _marketplaceServices;
        private readonly MarketplaceService _marketplaceService;

        public MarketplaceController(
            IEnumerable<IMarketplaceService> marketplaceServices,
            MarketplaceService marketplaceService
            )
        {
            _marketplaceServices = marketplaceServices;
            _marketplaceService = marketplaceService;
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAll()
        {
            var products = await _aggregatorService.GetAllProductsAsync();
            return Ok(products);
        }

        [HttpGet("update-and-broadcast")]
        public async Task<IActionResult> UpdateAndBroadcast()
        {
            await _marketplaceService.AggregateAndBroadcastProductStatsAsync();
            return Ok("Stats updated and broadcasted");
        }
    }
}
