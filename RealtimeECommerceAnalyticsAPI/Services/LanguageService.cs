using Microsoft.AspNetCore.Components.Web;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using RealtimeECommerceAnalytics.DataBaseContext;
using RealtimeECommerceAnalytics.Enums;
using RealtimeECommerceAnalytics.Models;
using RealtimeECommerceAnalytics.Services.Interfaces;

namespace RealtimeECommerceAnalytics.Services
{
    public class LanguageService : ILanguageService
    {
        private readonly ECommerceDbContext _context;

        private readonly ITranslationCacheService _translationCacheService;

        public string DefaultLanguage => "en";

        public LanguageService(
            ECommerceDbContext context,
            ITranslationCacheService translationCacheService
            )
        {
            _context = context;
            _translationCacheService = translationCacheService;
        }

        public async Task<List<LanguageModel>> GetLanguagesInfo()
        {
            var tempLangs = new List<LanguageModel>();
            var langs = _context.Languages.ToList();

            if (langs.All(lang => lang.LanguageCode != this.DefaultLanguage))
            {
                await AddFirstLanguageAsync();
                langs = _context.Languages.ToList();
            }

            for (var langIndex = 0; langIndex < langs.Count; langIndex++)
            {
                tempLangs.Add(new LanguageModel()
                {
                    LanguageCode = langs[langIndex].LanguageCode,
                    LanguageName = langs[langIndex].LanguageName,
                    Version = langs[langIndex].Version
                });
            }

            return tempLangs;
        }

        public async Task AddLanguage(string languageName, string languageCode)
        {
            if (_context.Languages.Any(lng => lng.LanguageCode == languageCode.ToLower()))
            {
                throw new Exception("Language with \"" + languageCode.ToLower() + "\" already exsit");
            }

            var jsonPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Template", "default_language.json");
            var json = File.ReadAllText(jsonPath);

            var enLang = _context.Languages.SingleOrDefault(lng => lng.LanguageCode == this.DefaultLanguage);

            _context.Languages.Add(new LanguageModel()
            {
                LanguageName = languageName,
                LanguageCode = languageCode.ToLower(),
                TranslationJson = json,
            });

            await _context.SaveChangesAsync();
        }

        public async Task RemoveLanguage(string code)
        {
            var lang = _context.Languages.SingleOrDefault(lng => lng.LanguageCode == code.ToLower());

            _context.Remove(lang);
            await _context.SaveChangesAsync();
        }

        public LanguageModel GetLanguage(string code)
        {
            var key = _translationCacheService.GetKey(TranslationType.LanguageModel, code);
            lock (_translationCacheService.GetSyncObject(key))
            {
                if (_translationCacheService.Get(key) is LanguageModel languageModel && this.GetVersion(languageModel.LanguageCode).Equals(languageModel.Version))
                {
                    return languageModel;
                }

                if (!this.HasLanguage(code))
                {
                    code = this.DefaultLanguage;
                }

                var storedLang = _context.Languages.Single(lng => EF.Functions.Like(lng.LanguageCode, $"%{code}%"));
                var language = new LanguageModel
                {
                    LanguageName = storedLang.LanguageName,
                    LanguageCode = storedLang.LanguageCode,
                    Version = storedLang.Version,
                };

                _translationCacheService.Set(key, language);
                return language;
            }
        }

        public async Task<string> GetJson(string code)
        {
            if (!_context.Languages.Any(lng => lng.LanguageCode == this.DefaultLanguage))
            {
                await AddFirstLanguageAsync();
            }

            var enLang = await _context.Languages.FirstAsync(lng => lng.LanguageCode == this.DefaultLanguage);
            var lang = await _context.Languages.SingleOrDefaultAsync(lng => lng.LanguageCode == code.ToLower());
            var translations = JsonConvert.DeserializeObject<Dictionary<string, string>>(lang.TranslationJson);

            return JsonConvert.SerializeObject(translations);
        }

        public int GetVersion(string code)
        {
            if (!this.HasLanguage(code))
            {
                code = this.DefaultLanguage;
            }

            var lang = _context.Languages.SingleOrDefault(lng => lng.LanguageCode == code.ToLower());
            return lang.Version;
        }

        public bool HasLanguage(string code)
        {
            return !string.IsNullOrWhiteSpace(code) && _context.Languages.Any(lng => lng.LanguageCode == code.ToLower());
        }

        public async Task UploadJson(string code, string json)
        {
            var lang = await _context.Languages.SingleOrDefaultAsync(lng => lng.LanguageCode == code.ToLower());
            lang.TranslationJson = json;
            lang.Version++;

            await _context.SaveChangesAsync();
        }

        private async Task AddFirstLanguageAsync()
        {
            var jsonPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Template", "default_language.json");
            var json = File.ReadAllText(jsonPath);

            _context.Languages.Add(new LanguageModel()
            {
                LanguageName = "English",
                LanguageCode = this.DefaultLanguage,
                TranslationJson = json,
            });

            await _context.SaveChangesAsync();
        }
    }
}
