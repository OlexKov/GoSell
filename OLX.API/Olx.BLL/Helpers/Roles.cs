using System.Reflection;

namespace Olx.BLL.Helpers
{
    public static class Roles
    {
        public const string Admin = "Admin";
        public const string User = "User";
        public static IEnumerable<string> Get() => typeof(Roles).GetFields(BindingFlags.Public | BindingFlags.Static |
               BindingFlags.FlattenHierarchy).Select(x => (string)x.GetValue(null)!);
    }
}
