using System.Net;

namespace Olx.BLL.Helpers.Email
{
    internal static class EmailTemplates
    {
        private static string _path = Path.Combine(Directory.GetCurrentDirectory(), "Helpers/EmailTemplates");

        public static string GetAdvertBoughtTemplate(string text)
        {
            var html = File.ReadAllText(Path.Combine(_path, "AdvertBought.html"));
            html = html.Replace("[text]", text);
            return html;
        }
        public static string GetAccountRemovedTemplate(string reason)
        {
            var html = File.ReadAllText(Path.Combine(_path, "AccountRemoved.html"));
            html = html.Replace("[reason]", reason);
            return html;
        }
        public static string GetAdvertRemovedTemplate(string reason)
        {
            var html = File.ReadAllText(Path.Combine(_path, "AdvertRemoved.html"));
            html = html.Replace("[reason]", reason);
            return html;
        }
        public static string GetAdvertLockedTemplate( string reason)
        {
            var html = File.ReadAllText(Path.Combine(_path, "AdvertLocked.html"));
            html = html.Replace("[reason]", reason);
            return html;
        }
        public static string GetEmailConfirmationTemplate(string url,string token, int id)
        {
            var html = File.ReadAllText(Path.Combine(_path,"EmailConfirmation.html"));
            html = html.Replace("[token]",WebUtility.UrlEncode(token));
            html = html.Replace("[id]", id.ToString());
            html = html.Replace("[url]", url);
            return html;
        }
        public static string GetEmailConfirmedTemplate(string url)
        {
            var html = File.ReadAllText(Path.Combine(_path, "EmailConfirmed.html"));
            html = html.Replace("[url]", url);
            return html;
        }
        public static string GetPasswordResetTemplate(string url, string token, int id)
        {
            var html = File.ReadAllText(Path.Combine(_path, "PasswordReset.html"));
            html = html.Replace("[token]", WebUtility.UrlEncode(token));
            html = html.Replace("[id]", id.ToString());
            html = html.Replace("[url]", url);
            return html;
        }

        public static string GetAccountBlockedTemplate(string reason, string lockoutEnd)
        {
            var html = File.ReadAllText(Path.Combine(_path, "AccountBlocked.html"));
            html = html.Replace("[reason]",reason);
            html = html.Replace("[LockoutEnd]", lockoutEnd);
            return html;
        }

        public static string GetAccountUnblockedTemplate() => File.ReadAllText(Path.Combine(_path, "AccountUnblocked.html"));
        
    }
}
