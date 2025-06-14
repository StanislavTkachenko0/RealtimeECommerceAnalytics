using Newtonsoft.Json;

namespace RealtimeECommerceAnalytics.Shared.Toolkit
{
    public static class ObjectCopier
    {
        public static T Clone<T>(T source)
        {
            if (ReferenceEquals(source, null))
            {
                return default;
            }

            var deserializeSettings = new JsonSerializerSettings
            {
                ObjectCreationHandling = ObjectCreationHandling.Replace
            };

            return JsonConvert.DeserializeObject<T>(JsonConvert.SerializeObject(source), deserializeSettings);
        }
    }
}
