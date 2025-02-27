namespace Olx.BLL.Models.AdminMessage
{
    public class AdminMessageCreationModel
    {
        public string? MessageLogo { get; set; }
        public string Content { get; init; } = string.Empty;
        public string Subject { get; init; } = string.Empty;
        public int? UserId { get; init; }
        public IEnumerable<int>? UserIds { get; init; }

    }
}
