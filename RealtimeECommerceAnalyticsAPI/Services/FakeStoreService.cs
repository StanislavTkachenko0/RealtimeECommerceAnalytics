using RealtimeECommerceAnalytics.Models.DTOs;
using RealtimeECommerceAnalytics.Services.Interfaces;
using System.Text.Json;

namespace RealtimeECommerceAnalytics.Services
{
    public class FakeStoreService : IMarketplaceService
    {
        private readonly HttpClient _httpClient;
        private const string ApiUrl = "https://fakestoreapi.com/products";

        public FakeStoreService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<IEnumerable<ProductDto>> GetProductsAsync()
        {
            var response = await _httpClient.GetAsync("https://fakestoreapi.com/products");
            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();
            var items = JsonSerializer.Deserialize<List<FakeStoreProduct>>(json, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            return items.Select(x => new ProductDto
            {
                Title = x.Title,
                Description = x.Description,
                Price = x.Price,
                Category = x.Category,
                ImageUrl = x.Image,
                Source = "FakeStore"
            });
        }
    }

    public class FakeStoreProduct
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public string Category { get; set; }
        public string Image { get; set; }
    }
}
