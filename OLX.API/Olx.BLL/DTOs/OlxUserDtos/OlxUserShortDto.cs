namespace Olx.BLL.DTOs.OlxUserDtos
{
    public class OlxUserShortDto
    {
        public int Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Photo { get; set; }
        public DateTime LastActivity { get; set; }
        public DateTime CreatedDate { get; set; }
        public string? WebSite { get; set; }
        public string? SettlementDescrption { get; set; }
    }
}
