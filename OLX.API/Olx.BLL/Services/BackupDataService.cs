using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Olx.BLL.Exceptions;
using Olx.BLL.Interfaces;
using Olx.BLL.Models;
using System.Diagnostics;
using System.IO.Compression;
using System.Net;


namespace Olx.BLL.Services
{
    public class BackupDataService(IConfiguration config) : IBackupDataService
    {
        private readonly string _host = config["DbSetings:Host"]!;
        private readonly string _dbName = config["DbSetings:DbName"]!;
        private readonly string _username = config["DbSetings:Username"]!;
        private readonly string _backupDir = Path.Combine(config["BackupDir"]!);
        private readonly string _imagesDir = Path.Combine(config["ImagesDir"]!);
        private readonly string _backupTempDir = Path.Combine(config["BackupDir"]!, "temp");
        private readonly string _password = config["DbSetings:Password"]!;
        private readonly string _imagesTempFolder = Path.Combine(config["BackupDir"]!, "temp", "images");

        private async Task<string?> CreateDbBackupAsync()
        {
            var backupName = $"{_dbName}_backup_{DateTime.Now:yyyyMMdd_HHmmss}";
            if (!Directory.Exists(_backupDir))
            {
                Directory.CreateDirectory(_backupDir);
            }
            Directory.CreateDirectory(_backupTempDir);
            var bdBackupFilePath = Path.Combine(_backupTempDir, $"{backupName}.dump");
            var pgDumpCommand = $"-h {_host} -U {_username} -d {_dbName}  -F c -b -v -f \"{bdBackupFilePath}\"";

            var processStartInfo = new ProcessStartInfo
            {
                FileName = "pg_dump",
                Arguments = pgDumpCommand,
                RedirectStandardError = true,
                CreateNoWindow = true,
                Environment = { ["PGPASSWORD"] = _password }
            };
            processStartInfo.EnvironmentVariables["PGPASSWORD"] = _password;
            Process? process = null;
            try
            {

                process = Process.Start(processStartInfo)
                ?? throw new HttpException("Не вдалося запустити процес pg_dump.", HttpStatusCode.InternalServerError);
               
                await process.WaitForExitAsync().WaitAsync(TimeSpan.FromSeconds(60));


                if (process.ExitCode != 0)
                {
                    var error = await process.StandardError.ReadToEndAsync();
                    if (error != null) 
                    {
                        throw new HttpException(error, HttpStatusCode.InternalServerError);
                    }
                    
                }
                else if (File.Exists(bdBackupFilePath))
                {
                    var imageFiles = Directory.GetFiles(_imagesDir);
                    Directory.CreateDirectory(_imagesTempFolder);
                    imageFiles.AsParallel().ForAll(filePath => 
                    {
                        File.Copy(filePath, Path.Combine(_imagesTempFolder,Path.GetFileName(filePath)));
                    });
                    string zipPath = Path.Combine(_backupDir, $"{backupName}.back");
                    ZipFile.CreateFromDirectory(_backupTempDir, zipPath,CompressionLevel.SmallestSize,false);
                    return backupName;
                }
            }
            catch (Exception ex)
            {
                throw new HttpException($"Помилка при створенні бекапу: {ex.Message}",HttpStatusCode.InternalServerError);

            }
            finally 
            {
                process?.Close();
                Directory.Delete(_backupTempDir, true);
            }
            return null;
        }

        private async Task RestoreDatabaseAsync(string backupName)
        {
            var backupFilePath = Path.Combine(_backupDir,$"{backupName}.back");
            if (File.Exists(backupFilePath)) 
            {
                ZipFile.ExtractToDirectory(backupFilePath, _backupTempDir, true);
                var dbBackupFilePath = Path.Combine(_backupTempDir,$"{backupName}.dump");
                if (File.Exists(dbBackupFilePath))
                {
                    var pgRestoreCommand = $" -h {_host} -U {_username} -d {_dbName} --if-exists --clean --no-reconnect --disable-triggers  --verbose  --exit-on-error  -v \"{dbBackupFilePath}\"";
                    var processStartInfo = new ProcessStartInfo
                    {
                        FileName = "pg_restore",
                        Arguments = pgRestoreCommand,
                        CreateNoWindow = true,
                        Environment = { ["PGPASSWORD"] = _password }
                    };
                    processStartInfo.EnvironmentVariables["PGPASSWORD"] = config["DbSetings:Password"]!;
                    Process? process = null;
                    try
                    {

                        process = Process.Start(processStartInfo)
                        ?? throw new HttpException("Не вдалося запустити процес pg_restore.",HttpStatusCode.InternalServerError);
                       
                        
                        await process.WaitForExitAsync().WaitAsync(TimeSpan.FromSeconds(60));
                        

                        if (process.ExitCode != 0)
                        {
                            var error = await process.StandardError.ReadToEndAsync();
                            Console.WriteLine($"Помилка при відновленні бази: {error}");
                            throw new HttpException($"Помилка при відновленні бази: {error}",HttpStatusCode.InternalServerError);
                        }
                        else 
                        {
                            
                            var oldFiles = Directory.GetFiles(_imagesDir);
                            oldFiles.AsParallel().ForAll(file =>  File.Delete(file));
                            var newfiles = Directory.GetFiles(_imagesTempFolder);
                            newfiles.AsParallel().ForAll(filePath =>
                            {
                                File.Copy(filePath, Path.Combine(_imagesDir, Path.GetFileName(filePath)));
                            });
                            Console.WriteLine("База даних успішно відновлена!");
                            return;
                        }
                      
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Помилка при відновленні бази: {ex.Message}");
                        throw new HttpException($"Помилка при відновленні бази: {ex.Message}",HttpStatusCode.InternalServerError);
                    }
                    finally 
                    {
                        process?.Dispose();
                        Directory.Delete(_backupTempDir, true);
                    }
                }
                
            }
            throw new HttpException($"Не вірне ім'я файлу", HttpStatusCode.BadRequest);

        }

        public async Task<string> BackupDatabase()
        {
            Console.WriteLine("Backup start");
            var backupName = await CreateDbBackupAsync()
                ?? throw new HttpException("Error backup create", HttpStatusCode.InternalServerError);
            return backupName;
        }

        public async Task RestoreDatabase(string backupName)
        {
             await RestoreDatabaseAsync(backupName);
        }

        public async Task<byte[]> GetBackupFile(string fileName)
        {
            var filePath = Path.Combine(_backupDir, $"{fileName}.back");
            if (File.Exists(filePath))
            {
              return await File.ReadAllBytesAsync(filePath);
            }
            else
            {
                throw new HttpException("Invalid backup file name", HttpStatusCode.BadRequest);
            }
        }

        public async Task AddBackupFile(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                throw new HttpException("Invalid upload file", HttpStatusCode.BadRequest);
            }
           
            var filePath = Path.Combine(_backupDir, file.FileName);
            using var stream = new FileStream(filePath, FileMode.Create);
            await file.CopyToAsync(stream);
        }

        public IEnumerable<BackupFileInfo> GetBackupFileInfos()
        {
            var files = Directory.GetFiles(_backupDir);
            return files.Select(f => new BackupFileInfo() 
            {
                Name = Path.GetFileNameWithoutExtension(f),
                DateCreationDate = File.GetCreationTimeUtc(f),
                Size = new FileInfo(f).Length
            });
        }

        public void RemoveBackupFile(string fileName)
        {
            var filePath = Path.Combine(_backupDir, $"{fileName}.back");
            if (File.Exists(filePath))
            {
                File.Delete(filePath);
            }
            else 
            {
                throw new HttpException("Invalid backup file name", HttpStatusCode.BadRequest);
            }
        }
    }
}
