using Microsoft.Extensions.Options;
using MongoDB.Driver;
using RealtimeECommerceAnalytics.Models.Configs;
using RealtimeECommerceAnalytics.Models.DTOs;

namespace RealtimeECommerceAnalytics.Services.Mongo
{
    public class MongoDataService
    {
        private readonly IMongoCollection<ProductDto> _collection;

        public MongoDataService(IOptions<MongoSettings> settings)
        {
            var client = new MongoClient(settings.Value.ConnectionString);
            var database = client.GetDatabase(settings.Value.DatabaseName);
            _collection = database.GetCollection<ProductDto>(settings.Value.CollectionName);
        }

        public async Task SaveManyAsync(IEnumerable<ProductDto> data)
        {
            if (data.Any())
            {
                await _collection.InsertManyAsync(data);
            }
        }

        public async Task<List<ProductDto>> GetAllAsync()
        {
            return await _collection.Find(FilterDefinition<ProductDto>.Empty).ToListAsync();
        }

        public async Task<List<ProductDto>> GetBySourceAsync(string source)
        {
            return await _collection.Find(p => p.Source.ToString() == source).ToListAsync();
        }
    }
}
