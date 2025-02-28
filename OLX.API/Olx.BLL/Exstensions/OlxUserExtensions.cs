
using Olx.BLL.Entities;

namespace Olx.BLL.Exstensions
{
    public static class OlxUserExtensions
    {
        public static string? GetUserDescription(this OlxUser? user)
        {
            string? description = user?.Email;
            if (user != null)
            {
                var userDescription = user.FirstName + " " + user.LastName;
                if (!String.IsNullOrWhiteSpace(userDescription))
                {
                    description = userDescription;
                }
            }
            return description;
        }
    }
}
