using Microsoft.AspNetCore.Mvc;
using RealtimeECommerceAnalytics.Services;

namespace RealtimeECommerceAnalytics.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly MarketplaceAggregatorService _aggregatorService;

        public ProductsController(MarketplaceAggregatorService aggregatorService)
        {
            _aggregatorService = aggregatorService;
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAll()
        {
            var products = await _aggregatorService.GetAllProductsAsync();
            return Ok(products);
        }
    }
}
