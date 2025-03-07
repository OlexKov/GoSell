

namespace Olx.BLL.Models.Advert
{
    public class AdvertLockRequest
    {
        public int Id { get; set; }
        public bool Status { get; set; } 
        public string? LockReason { get; set; }
    }
}
