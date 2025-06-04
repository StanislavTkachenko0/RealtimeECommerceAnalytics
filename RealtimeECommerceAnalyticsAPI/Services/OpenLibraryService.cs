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
                result.Add(new ProductDto
                {
                    Title = book.GetProperty("title").GetString(),
                    Category = "Programming",
                    Price = null,
                    Source = "OpenLibrary",
                });
            }

            return result;
        }
    }
}
