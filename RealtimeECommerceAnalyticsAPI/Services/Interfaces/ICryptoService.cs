using RealtimeECommerceAnalytics.Models.DTOs;

namespace RealtimeECommerceAnalytics.Services.Interfaces
{
    public interface ICryptoService
    {
        Task<IEnumerable<CryptoPriceDto>> GetTopCryptoPricesAsync(int top = 10);
        Task UpdateAndBroadcast();
    }
}
