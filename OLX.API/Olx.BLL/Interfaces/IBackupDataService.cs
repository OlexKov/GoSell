
using Microsoft.AspNetCore.Http;
using Olx.BLL.Models;

namespace Olx.BLL.Interfaces
{
    public interface IBackupDataService
    {
        Task<string> BackupDatabase();
        Task RestoreDatabase(string backupName);
        IEnumerable<BackupFileInfo> GetBackupFileInfos();
        Task<byte[]> GetBackupFile(string fileName);
        Task AddBackupFile(IFormFile file);
        void RemoveBackupFile(string fileName);
    }
}
