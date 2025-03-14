using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Olx.BLL.Helpers;
using Olx.BLL.Interfaces;
using Olx.BLL.Models;


namespace OLX.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = Roles.Admin)]
    public class BackupController(IBackupDataService backupDataService) : ControllerBase
    {
        [HttpGet("info")]
        public IActionResult GetBackupInfos() => Ok( backupDataService.GetBackupFileInfos());

        [HttpGet("get")]
        public IActionResult GetBackupFile([FromQuery]  string backupName) 
        {
            var fileStream = backupDataService.GetBackupFileStream(backupName);
            return File(fileStream, "application/octet-stream", $"{backupName}.back");
        }

        [HttpPost("backup")]
        public async Task<IActionResult> CreateBackup()
        {
            await backupDataService.BackupDatabase();
            return Ok();
        } 

        [HttpPost("restore")]
        public async Task<IActionResult> RestoreDataBase([FromQuery] string backupName) 
        {
            await backupDataService.RestoreDatabase(backupName);
            return Ok();
        }

        [HttpPut("add")]
        public async Task<IActionResult> AddBackupFile([FromForm] AddBackupRequestModel backupRequest)
        {
            await backupDataService.AddBackupFile(backupRequest.BackupFile);
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
