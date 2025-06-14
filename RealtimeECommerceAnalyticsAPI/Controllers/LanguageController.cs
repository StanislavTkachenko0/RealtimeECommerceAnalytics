using Microsoft.AspNetCore.Mvc;
using RealtimeECommerceAnalytics.Models;
using RealtimeECommerceAnalytics.Models.Admin;
using RealtimeECommerceAnalytics.Services.Interfaces;
using RealtimeECommerceAnalytics.Shared.Toolkit;
using System.Text;

namespace RealtimeECommerceAnalytics.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LanguageController : Controller
    {
        private readonly ILanguageService _languageService;
        private readonly ITranslationCacheService _translationCacheService;

        public LanguageController(
            ILanguageService languageService,          
            ITranslationCacheService translationCacheService

            )
        {
            _languageService = languageService;
            _translationCacheService = translationCacheService;
        }

        [HttpGet]
        [Route(nameof(GetLanguagesList))]
        public async Task<List<LanguageModel>> GetLanguagesList()
        {
            var languages = await _languageService.GetLanguagesInfo();
            return languages;
        }

        [HttpPost]
        [Route(nameof(UploadJson))]
        public async Task<IActionResult> UploadJson(string code)
        {
            using (var reader = new StreamReader(Request.Body))
            {
                var data = Convert.FromBase64String(await reader.ReadToEndAsync());
                var json = Encoding.UTF8.GetString(data);
                await _languageService.UploadJson(code, json);
                _translationCacheService.ResetCache();
            }

            return Ok();
        }

        [HttpDelete]
        [Route(nameof(RemoveLanguage))]
        public async Task<IActionResult> RemoveLanguage(string code)
        {
            await _languageService.RemoveLanguage(code);
            _translationCacheService.ResetCache();

            return Ok();
        }

        [HttpGet]
        [Route(nameof(GetLanguage))]
        public LanguageModel GetLanguage(string code = "")
        {
            var storedLanguage = _languageService.GetLanguage(code);
            var lang = ObjectCopier.Clone(storedLanguage);
            return lang;
        }

        [HttpGet]
        [Route(nameof(GetLanguageJsonHolder))]
        public LanguageJsonHolder GetLanguageJsonHolder(string code = "")
        {
            var storedLanguage = _languageService.GetLanguageJsonHolder(code);
            var lang = ObjectCopier.Clone(storedLanguage);

            return lang;
        }

        [HttpPost]
        [Route(nameof(AddLanguage))]
        public async Task<IActionResult> AddLanguage([FromBody] AddLanguageModel model)
        {
            await _languageService.AddLanguage(model);
            _translationCacheService.ResetCache();
            return Ok();
        }

        [HttpGet]
        [Route(nameof(DownloadJson))]
        public async Task<IActionResult> DownloadJson(string code)
        {
            var json = await _languageService.GetJson(code);
            var jsonBytes = Encoding.UTF8.GetBytes(json);

            return File(jsonBytes, "application/octet-stream");
        }
    }
}
