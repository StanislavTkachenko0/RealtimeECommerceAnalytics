using RealtimeECommerceAnalytics.Models;
using RealtimeECommerceAnalytics.Models.Admin;

namespace RealtimeECommerceAnalytics.Services.Interfaces
{
    public interface ILanguageService
    {
        public string DefaultLanguage { get; }
        bool HasLanguage(string code);
        Task UploadJson(string code, string json);
        int GetVersion(string code);
        Task<List<LanguageModel>> GetLanguagesInfo();
        Task AddLanguage(AddLanguageModel model);
        Task RemoveLanguage(string code);
        LanguageModel GetLanguage(string code);
        Task<string> GetJson(string code);
        LanguageJsonHolder GetLanguageJsonHolder(string code);
    }
}
