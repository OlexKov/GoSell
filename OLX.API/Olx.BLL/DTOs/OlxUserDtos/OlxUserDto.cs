namespace Olx.BLL.DTOs.OlxUserDtos
{
    public class OlxUserDto
    {
        public int Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public bool EmailConfirmed { get; set; }
        public bool PhoneNumberConfirmed { get; set; }
        public bool TwoFactorEnabled { get; set; }
        public string? PhoneNumber { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Photo { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime LastActivity { get; set; }
        public string? WebSite { get; set; }
        public string? About { get; set; }
        public string? SettlementRef { get; set; }
        public string? SettlementDescrption { get; set; }
        public IEnumerable<int> Adverts { get; set; } = [];
        public IEnumerable<int> FavoriteAdverts { get; set; } = [];
    }
}
