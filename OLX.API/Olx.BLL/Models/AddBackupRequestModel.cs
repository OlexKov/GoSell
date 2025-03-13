using Microsoft.AspNetCore.Http;

namespace Olx.BLL.Models
{
    public class AddBackupRequestModel
    {
        public IFormFile BackupFile { get; set; }
    }
}
