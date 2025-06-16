namespace RealtimeECommerceAnalytics.Models.Auth
{
    public class LoginInfo
    {
        public long Id { get; set; }
        public string Email { get; set; }
        public DateTime Date { get; set; }
        public string Code { get; set; }
        public string Ip { get; set; }
        public bool IsCompleted { get; set; }
        public string OS { get; set; }
        public string UserAgent { get; set; }
    }
}
