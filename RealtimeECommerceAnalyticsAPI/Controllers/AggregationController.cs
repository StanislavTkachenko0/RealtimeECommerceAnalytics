using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RealtimeECommerceAnalytics.Services.Interfaces;

namespace RealtimeECommerceAnalytics.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
    public class AggregationController : Controller
    {
        private readonly IAggregatorService _aggregator;

        public AggregationController(IAggregatorService aggregator)
        {
            _aggregator = aggregator;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllData()
        {
            var data = await _aggregator.GetAggregatedDataAsync();
            return Ok(data);
        }
    }
}
