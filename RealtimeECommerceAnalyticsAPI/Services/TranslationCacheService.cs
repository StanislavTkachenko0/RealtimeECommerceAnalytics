using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using RealtimeECommerceAnalytics.Enums;
using RealtimeECommerceAnalytics.Services.Interfaces;

namespace RealtimeECommerceAnalytics.Services
{
    public class TranslationCacheService : ITranslationCacheService
    {
        private readonly TimeSpan expirationTime = TimeSpan.FromHours(24);
        private readonly object rootSyncObject = new object();
        private readonly Dictionary<object, object> syncObjects = new Dictionary<object, object>();
        private MemoryCache cache;

        public TranslationCacheService()
        {
            this.CreateCache();
        }

        public T Get<T>(object key) where T : class
        {
            return this.cache.Get<T>(key);
        }

        public object Get(object key)
        {
            return this.cache.Get(key);
        }

        public string GetKey(TranslationType type, string lang)
        {
            return string.IsNullOrWhiteSpace(lang) ? type.ToString() : $"{type}_{lang}";
        }

        public object GetSyncObject(object key)
        {
            lock (this.rootSyncObject)
            {
                if (!this.syncObjects.ContainsKey(key))
                {
                    this.syncObjects.Add(key, new object());
                }

                return this.syncObjects[key];
            }
        }

        public void ResetCache()
        {
            this.CreateCache();
        }

        public T Set<T>(object key, T value)
        {
            return this.cache.Set(key, value, this.expirationTime);
        }

        private void CreateCache()
        {
            var options = Options.Create(new MemoryCacheOptions());
            this.cache = new MemoryCache(options);
        }
    }
}
