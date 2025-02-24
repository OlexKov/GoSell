namespace Olx.BLL.DTOs.NewPost
{
    public class SettlementDto
    {
        public string Ref { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string SettlementTypeDescription { get; set; } = string.Empty;
        public string? Region { get; set; }
        public string? Area { get; set; }
        public int Warehouse { get; set; }
    }
}