using Microsoft.AspNetCore.Mvc;

namespace Api_09.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UtilityController : ControllerBase
    {
        [HttpGet("GetBackupList")]
        public async Task<ActionResult> GetBackupList()
        {
            var backups = new[]
            {
                new { id = 1, fileName = "backup_2024_01_15.bak", size = "125 MB", date = "2024-01-15 10:30:00", status = "Completed" },
                new { id = 2, fileName = "backup_2024_01_10.bak", size = "118 MB", date = "2024-01-10 09:15:00", status = "Completed" },
                new { id = 3, fileName = "backup_2024_01_05.bak", size = "112 MB", date = "2024-01-05 08:45:00", status = "Completed" }
            };
            return Ok(backups);
        }

        [HttpGet("GetRestoreList")]
        public async Task<ActionResult> GetRestoreList()
        {
            var restores = new[]
            {
                new { id = 1, fileName = "backup_2024_01_10.bak", restoreDate = "2024-01-12 14:20:00", status = "Success", duration = "5 minutes" },
                new { id = 2, fileName = "backup_2024_01_05.bak", restoreDate = "2024-01-08 11:30:00", status = "Success", duration = "4 minutes" }
            };
            return Ok(restores);
        }

        [HttpGet("GetSettings")]
        public async Task<ActionResult> GetSettings()
        {
            var settings = new[]
            {
                new { id = 1, category = "System", name = "Auto Backup", value = "Enabled", description = "Automatic daily backup" },
                new { id = 2, category = "Security", name = "Session Timeout", value = "30 minutes", description = "User session timeout" },
                new { id = 3, category = "Email", name = "SMTP Server", value = "smtp.company.com", description = "Email server configuration" },
                new { id = 4, category = "System", name = "Max File Size", value = "10 MB", description = "Maximum upload file size" }
            };
            return Ok(settings);
        }

        [HttpGet("GetLogs")]
        public async Task<ActionResult> GetLogs()
        {
            var logs = new[]
            {
                new { id = 1, timestamp = "2024-01-20 14:30:15", level = "INFO", message = "User login successful", user = "admin", module = "Authentication" },
                new { id = 2, timestamp = "2024-01-20 14:25:10", level = "WARNING", message = "Failed login attempt", user = "unknown", module = "Authentication" },
                new { id = 3, timestamp = "2024-01-20 14:20:05", level = "INFO", message = "Database backup completed", user = "system", module = "Backup" },
                new { id = 4, timestamp = "2024-01-20 14:15:00", level = "ERROR", message = "Connection timeout", user = "system", module = "Database" }
            };
            return Ok(logs);
        }

        [HttpGet("GetMaintenanceStatus")]
        public async Task<ActionResult> GetMaintenanceStatus()
        {
            var maintenance = new[]
            {
                new { id = 1, task = "Database Cleanup", status = "Completed", lastRun = "2024-01-20 02:00:00", nextRun = "2024-01-21 02:00:00", duration = "15 minutes" },
                new { id = 2, task = "Log Rotation", status = "Scheduled", lastRun = "2024-01-19 03:00:00", nextRun = "2024-01-20 03:00:00", duration = "5 minutes" },
                new { id = 3, task = "Index Rebuild", status = "Running", lastRun = "2024-01-20 01:00:00", nextRun = "2024-01-27 01:00:00", duration = "45 minutes" }
            };
            return Ok(maintenance);
        }
    }
}