using RealtimeECommerceAnalytics.Enums;
using RealtimeECommerceAnalytics.Models.DTOs;
using RealtimeECommerceAnalytics.Services.Interfaces;
using System.Text.Json;

namespace RealtimeECommerceAnalytics.Services
{
    public class OpenLibraryService : IApiSourceService
    {
        private readonly HttpClient _httpClient;
        public string SourceName => "OpenLibrary";

        public OpenLibraryService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<IEnumerable<ProductDto>> GetLatestDataAsync()
        {
            var response = await _httpClient.GetAsync("https://openlibrary.org/subjects/programming.json?limit=20");

            if (!response.IsSuccessStatusCode)
                return Enumerable.Empty<ProductDto>();

            var json = await response.Content.ReadAsStringAsync();
            var data = JsonDocument.Parse(json);
            var books = data.RootElement.GetProperty("works");

            var result = new List<ProductDto>();

            foreach (var book in books.EnumerateArray())
            {
                var title = book.GetProperty("title").GetString() ?? "Unknown";
                var authors = book.TryGetProperty("authors", out var authorsArray) && authorsArray.ValueKind == JsonValueKind.Array
                    ? authorsArray.GetArrayLength()
                    : 1;

                double pseudoPrice = Math.Round((title.Length + authors * 3) / 5.0, 2);

                result.Add(new ProductDto
                {
                    Title = title,
                    Category = "Programming",
                    Price = pseudoPrice,
                    Source = DataSource.OpenLibrary,
                });
            }

            return result;
        }
    }
}
