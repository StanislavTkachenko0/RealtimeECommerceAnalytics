using RealtimeECommerceAnalytics.Models.DTOs;
using RealtimeECommerceAnalytics.Services.Interfaces;
using System.Text.Json;

namespace RealtimeECommerceAnalytics.Services
{
    public class DummyJsonService : IApiSourceService
    {
        private readonly HttpClient _httpClient;
        public string SourceName => "DummyJSON";

        public DummyJsonService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<IEnumerable<ProductDto>> GetLatestDataAsync()
        {
            var response = await _httpClient.GetAsync("https://dummyjson.com/products");
            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();
            var data = JsonSerializer.Deserialize<DummyJsonResponse>(json, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            return data.Products.Select(p => new ProductDto
            {
                Title = p.Title,
                Description = p.Description,
                Price = p.Price,
                Category = p.Category,
                ImageUrl = p.Thumbnail,
                Source = "DummyJSON",
            });
        }
    }
}
