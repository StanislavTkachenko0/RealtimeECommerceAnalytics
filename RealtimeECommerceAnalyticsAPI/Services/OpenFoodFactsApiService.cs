using RealtimeECommerceAnalytics.Enums;
using RealtimeECommerceAnalytics.Models.DTOs;
using RealtimeECommerceAnalytics.Services.Interfaces;
using RealtimeECommerceAnalytics.Shared.Extensions;
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
            try
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

                var result = new List<ProductDto>();

                foreach (var p in products.EnumerateArray())
                {
                    double pseudoPrice = 0;

                    if (p.TryGetProperty("nutriments", out var nutriments) &&
                        nutriments.TryGetProperty("energy-kcal_100g", out var kcalElement) &&
                        kcalElement.TryGetDouble(out var kcal))
                    {
                        pseudoPrice = Math.Round(kcal / 10, 2);
                    }

                    result.Add(new ProductDto
                    {
                        Title = p.TryGetProperty("product_name", out var name) ? name.GetString() : "Unknown",
                        Category = p.TryGetProperty("categories_tags", out var tags) && tags.GetArrayLength() > 0
                                    ? tags[0].GetString()?.Replace("en:", "") : "food",
                        Price = pseudoPrice,
                        Source = DataSource.OpenFoodFacts,
                    });
                }

                return result.Where(r => r.Price.HasValue).ToList();
            }
            catch (Exception ex)
            {
                throw new Exception($"OpenFoodFacts error: {ex.Message}", ex);
            }
        }
    }
}
