
using Org.BouncyCastle.Asn1.Mozilla;

namespace Olx.BLL.Models.SignaR
{
    public class SetChatMessageReaded
    {
        public IEnumerable<int> MessegesIds { get; set; }
        public int ChatId { get; set; }
    }
}
