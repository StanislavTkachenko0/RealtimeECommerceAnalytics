using Microsoft.AspNetCore.SignalR;
using RealtimeECommerceAnalytics.Enums;
using RealtimeECommerceAnalytics.HUBs;
using RealtimeECommerceAnalytics.Models.DTOs;
using RealtimeECommerceAnalytics.Services.Interfaces;
using System.Text.Json;

namespace RealtimeECommerceAnalytics.Services
{
    public class CryptoService : IApiSourceService
    {
        private readonly HttpClient _httpClient;
        public string SourceName => "CoinGecko";

        public CryptoService(
            HttpClient httpClient
        )
        {
            _httpClient = httpClient;
            _httpClient.DefaultRequestHeaders.UserAgent.ParseAdd("Mozilla/5.0 (compatible; MyApp/1.0)");
        }

        public async Task<IEnumerable<ProductDto>> GetLatestDataAsync()
        {
            var url = $"https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false";

            var response = await _httpClient.GetAsync(url);
            if (!response.IsSuccessStatusCode)
            {
                var msg = await response.Content.ReadAsStringAsync();
                throw new Exception($"Failed to fetch crypto data: {response.StatusCode}. {msg}");
            }

            var content = await response.Content.ReadAsStringAsync();
            var rawData = JsonSerializer.Deserialize<List<JsonElement>>(content);

            var result = rawData.Select(item => new ProductDto
            {
                Title = item.GetProperty("name").GetString(),
                Category = "crypto",
                Price = item.TryGetProperty("current_price", out var price) ? price.GetDouble() : null,
                Source = DataSource.CoinGecko,
            });

            return result;
        }

        //public async Task<IEnumerable<CryptoPriceDto>> GetTopCryptoPricesAsync(int top = 10)
        //{
        //    var url = $"https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page={top}&page=1&sparkline=false";

        //    var response = await _httpClient.GetAsync(url);

        //    if (!response.IsSuccessStatusCode)
        //    {
        //        var msg = await response.Content.ReadAsStringAsync();
        //        throw new Exception($"Failed to fetch crypto data: {response.StatusCode}. {msg}");
        //    }

        //    var content = await response.Content.ReadAsStringAsync();
        //    var rawData = JsonSerializer.Deserialize<List<JsonElement>>(content);

        //    var result = rawData.Select(item => new CryptoPriceDto()
        //    {
        //        Id = item.GetProperty("id").GetString(),
        //        Symbol = item.GetProperty("symbol").GetString(),
        //        Name = item.GetProperty("name").GetString(),
        //        CurrentPrice = item.GetProperty("current_price").GetDecimal(),
        //        MarketCap = item.GetProperty("market_cap").GetDecimal(),
        //        PriceChangePercentage24h = item.TryGetProperty("price_change_percentage_24h", out var change)
        //                                        ? change.GetDecimal()
        //                                        : 0,
        //        TimeStamp = DateTime.UtcNow
        //    });

        //    return result;
        //}
    }
}
