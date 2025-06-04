using Microsoft.AspNetCore.Mvc;
using RealtimeECommerceAnalytics.Services.Interfaces;

namespace RealtimeECommerceAnalytics.Controllers
{
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
