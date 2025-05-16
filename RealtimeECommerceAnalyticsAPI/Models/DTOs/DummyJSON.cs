namespace RealtimeECommerceAnalytics.Models.DTOs
{
    public class DummyJsonResponse
    {
        public List<DummyJsonProduct> Products { get; set; }
    }

    public class DummyJsonProduct
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public string Category { get; set; }
        public string Thumbnail { get; set; }
    }
}
