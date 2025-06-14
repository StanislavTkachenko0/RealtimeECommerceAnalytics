using Newtonsoft.Json;

namespace RealtimeECommerceAnalytics.Models
{
    public class LanguageJsonHolder
    {
        public string json { get; set; }
        public string languageCode { get; set; }

        [JsonIgnore]
        public int Version { get; set; }
    }
}
