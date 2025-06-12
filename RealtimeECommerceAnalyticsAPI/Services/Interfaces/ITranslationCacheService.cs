using RealtimeECommerceAnalytics.Enums;

namespace RealtimeECommerceAnalytics.Services.Interfaces
{
    public interface ITranslationCacheService
    {
        T Get<T>(object key) where T : class;
        object Get(object key);
        string GetKey(TranslationType type, string lang = null);
        object GetSyncObject(object key);
        void ResetCache();
        T Set<T>(object key, T value);
    }
}
