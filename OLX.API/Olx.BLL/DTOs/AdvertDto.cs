using Olx.BLL.DTOs.FilterDtos;

namespace Olx.BLL.DTOs
{
    public class AdvertDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public OlxUserShortDto? User { get; set; }
        public string PhoneNumber { get; set; } = string.Empty;
        public string ContactEmail { get; set; } = string.Empty;
        public string ContactPersone { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public bool IsContractPrice { get; set; }
        public decimal Price { get; set; }
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public bool Approved { get; set; } = false;
        public bool Blocked { get; set; } = false;
        public bool Completed { get; set; } = false;
        public string SettlementName { get; set; } = string.Empty;
        public string SettlementRef { get; set; } = string.Empty;
        public string RegionRef { get; set; } = string.Empty;
        public string AreaRef { get; set; } = string.Empty;
        public ICollection<FilterValueDto> FilterValues { get; set; } = new HashSet<FilterValueDto>();
        public ICollection<AdvertImageDto> Images { get; set; } = new HashSet<AdvertImageDto>();
    }
}
