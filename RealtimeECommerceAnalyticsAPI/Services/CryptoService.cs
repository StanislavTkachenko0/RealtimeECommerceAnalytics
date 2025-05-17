using Microsoft.AspNetCore.SignalR;
using RealtimeECommerceAnalytics.HUBs;
using RealtimeECommerceAnalytics.Models.DTOs;
using RealtimeECommerceAnalytics.Services.Interfaces;
using System.Text.Json;

namespace RealtimeECommerceAnalytics.Services
{
    public class CryptoService : ICryptoService
    {
        private readonly HttpClient _httpClient;
        private readonly IHubContext<CryptoHub> _hubContext;

        public CryptoService(
            HttpClient httpClient,
            IHubContext<CryptoHub> hubContext
        )
        {
            _httpClient = httpClient;
            _httpClient.DefaultRequestHeaders.UserAgent.ParseAdd("Mozilla/5.0 (compatible; MyApp/1.0)");
            _hubContext = hubContext;
        }

        public async Task<IEnumerable<CryptoPriceDto>> GetTopCryptoPricesAsync(int top = 10)
        {
            var url = $"https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page={top}&page=1&sparkline=false";

            var response = await _httpClient.GetAsync(url);

            if (!response.IsSuccessStatusCode)
            {
                var msg = await response.Content.ReadAsStringAsync();
                throw new Exception($"Failed to fetch crypto data: {response.StatusCode}. {msg}");
            }

            var content = await response.Content.ReadAsStringAsync();
            var rawData = JsonSerializer.Deserialize<List<JsonElement>>(content);

            var result = rawData.Select(item => new CryptoPriceDto()
            {
                Id = item.GetProperty("id").GetString(),
                Symbol = item.GetProperty("symbol").GetString(),
                Name = item.GetProperty("name").GetString(),
                CurrentPrice = item.GetProperty("current_price").GetDecimal(),
                MarketCap = item.GetProperty("market_cap").GetDecimal(),
                PriceChangePercentage24h = item.TryGetProperty("price_change_percentage_24h", out var change)
                                                ? change.GetDecimal()
                                                : 0,
                TimeStamp = DateTime.UtcNow
            });

            return result;
        }

        public async Task UpdateAndBroadcast()
        {
            var prices = await GetTopCryptoPricesAsync();

            await _hubContext.Clients.All.SendAsync("ReceiveCryptoPrices", prices);
        }
    }
}
