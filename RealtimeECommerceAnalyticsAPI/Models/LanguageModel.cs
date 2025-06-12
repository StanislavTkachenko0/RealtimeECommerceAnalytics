namespace RealtimeECommerceAnalytics.Models
{
    public class LanguageModel
    {
        public long Id { get; set; }
        public string LanguageName { get; set; }
        public string LanguageCode { get; set; }
        public string TranslationJson { get; set; }
        public int Version { get; set; }
    }
}
