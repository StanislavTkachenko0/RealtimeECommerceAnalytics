using RealtimeECommerceAnalytics.Enums;
using System.Text.Json.Serialization;

namespace RealtimeECommerceAnalytics.Models.DTOs
{
    public class ProductDto
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
        public double? Price { get; set; }
        public string? Category { get; set; }
        public string? ImageUrl { get; set; }

        [JsonConverter(typeof(JsonStringEnumConverter))]
        public DataSource Source { get; set; }
    }
}
