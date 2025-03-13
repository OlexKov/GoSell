using Microsoft.AspNetCore.Mvc;
using Olx.BLL.Interfaces;


namespace OLX.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BackupController(IBackupDataService backupDataService) : ControllerBase
    {
        [HttpGet("info")]
        public IActionResult GetBackupInfos() => Ok( backupDataService.GetBackupFileInfos());

        [HttpGet("get")]
        public async Task<IActionResult> GetBackupFile([FromQuery]  string backupName) 
        {
            var file = await backupDataService.GetBackupFile(backupName);
            return File(file, "application/octet-stream", $"{backupName}.back");
        }

        [HttpPost("backup")]
        public async Task<IActionResult> CreateBackup() => Ok(await backupDataService.BackupDatabase());

        [HttpPost("restore")]
        public async Task<IActionResult> RestoreDataBase([FromQuery] string backupName) 
        {
            await backupDataService.RestoreDatabase(backupName);
            return Ok();
        }

        [HttpPut("add")]
        public async Task<IActionResult> AddBackupFile(IFormFile backupFile)
        {
            await backupDataService.AddBackupFile(backupFile);
            return Ok();
        }

        [HttpDelete("delete")]
        public IActionResult DeleteBackup([FromQuery] string backupName)
        {
            backupDataService.RemoveBackupFile(backupName);
            return Ok();
        } 



    }
}
