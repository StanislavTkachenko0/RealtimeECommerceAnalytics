using RealtimeECommerceAnalytics.Models.DTOs;
using RealtimeECommerceAnalytics.Services.Interfaces;
using System.Text.Json;

namespace RealtimeECommerceAnalytics.Services
{
    public class OpenFoodFactsApiService : IApiSourceService
    {
        private readonly HttpClient _httpClient;
        public string SourceName => "OpenFoodFacts";

        public OpenFoodFactsApiService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<IEnumerable<ProductDto>> GetLatestDataAsync()
        {
            var url = "https://world.openfoodfacts.org/api/v2/search?fields=product_name,categories_tags,nutriments&sort_by=unique_scans_n&page_size=20";
            var response = await _httpClient.GetAsync(url);
            if (!response.IsSuccessStatusCode)
            {
                var msg = await response.Content.ReadAsStringAsync();
                throw new Exception($"Failed to fetch food data: {response.StatusCode}. {msg}");
            }

            var content = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(content);
            var products = doc.RootElement.GetProperty("products");

            var result = products.EnumerateArray()
                .Select(p => new ProductDto
                {
                    Title = p.TryGetProperty("product_name", out var name) ? name.GetString() : "Unknown",
                    Category = p.TryGetProperty("categories_tags", out var tags) && tags.GetArrayLength() > 0
                                ? tags[0].GetString()?.Replace("en:", "") : "food",
                    Price = null,
                    Source = "OpenFoodFacts",
                });

            return result;
        }
    }
}
