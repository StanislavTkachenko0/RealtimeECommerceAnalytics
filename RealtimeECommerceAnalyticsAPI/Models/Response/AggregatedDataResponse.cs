using RealtimeECommerceAnalytics.Models.DTOs;

namespace RealtimeECommerceAnalytics.Models.Response
{
    public class AggregatedDataResponse
    {
        public IEnumerable<ProductDto> FakeStoreData { get; set; }
        public IEnumerable<ProductDto> DummyJsonData { get; set; }
        public IEnumerable<ProductDto> OpenLibraryData { get; set; }
        public IEnumerable<ProductDto> OpenFoodFactsData { get; set; }
        public IEnumerable<ProductDto> CryptoData { get; set; }
    }
}
