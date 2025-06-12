using Microsoft.AspNetCore.Mvc;
using RealtimeECommerceAnalytics.Models;
using RealtimeECommerceAnalytics.Services.Interfaces;
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
    }
}
