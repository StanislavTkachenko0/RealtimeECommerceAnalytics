using Microsoft.AspNetCore.Mvc;
using RealtimeECommerceAnalytics.Enums;
using RealtimeECommerceAnalytics.Models;
using RealtimeECommerceAnalytics.Models.DTOs;
using System.Text.Json;

namespace RealtimeECommerceAnalytics.Services.Interfaces
{
    public interface IUserService
    {
        public string GetOSFromUserAgent(string userAgent);
        public Task<IEnumerable<UserDto>> GetUsers();
        public Task<UserDto> GetUser(string email);
        public Task<ResponseCode> UpdateField(JsonElement field, string email);
        public Task<bool> ArchiveUser(int id);
        public Task<ResponseCode> ChangePassword(string newPassword, string email);
    }
}
