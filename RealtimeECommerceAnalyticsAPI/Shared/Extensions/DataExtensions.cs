using System.Text.Json;

namespace RealtimeECommerceAnalytics.Shared.Extensions
{
    public static class DataExtensions
    {
        public static JsonElement GetPropertyOrDefault(this JsonElement element, string propertyName)
        {
            return element.TryGetProperty(propertyName, out var property) ? property : default;
        }
    }
}
