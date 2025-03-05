
namespace Olx.BLL.Models.Chat
{
    public class SetReadedRequest
    {
        public IEnumerable<int> Ids { get; set; }
        public int ChatId { get; set; }
    }
}
