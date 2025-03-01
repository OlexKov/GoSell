using Microsoft.AspNetCore.Http;

namespace Olx.BLL.Models.Advert
{
    public class AdvertCreationModel
    {
        public int Id { get; init; }
        public int UserId { get; init; }
        public string PhoneNumber { get; init; } = string.Empty;
        public string ContactEmail { get; init; } = string.Empty;
        public string ContactPersone { get; init; } = string.Empty;
        public string Title { get; init; } = string.Empty;
        public string Description { get; init; } = string.Empty;
        public bool IsContractPrice { get; init; }
        public string SettlementRef { get; init; } = string.Empty;
        public decimal Price { get; init; }
        public int CategoryId { get; init; }
        public ICollection<int> FilterValueIds { get; init; } = new HashSet<int>();
        public ICollection<IFormFile> ImageFiles { get; init; } = new HashSet<IFormFile>();
    }
}
