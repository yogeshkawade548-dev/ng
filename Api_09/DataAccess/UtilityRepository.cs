using Microsoft.Data.SqlClient;
using Api_09.Models;

namespace Api_09.DataAccess
{
    public class UtilityRepository
    {
        private readonly string _connectionString;

        public UtilityRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task CreateBackupAsync()
        {
            var fileName = $"Backup_{DateTime.Now:yyyyMMdd_HHmmss}.bak";
            var filePath = $"C:\\Backups\\{fileName}";
            
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();
            
            var command = new SqlCommand($"BACKUP DATABASE [YourDatabase] TO DISK = '{filePath}'", connection);
            await command.ExecuteNonQueryAsync();
            
            // Save backup info to database
            var insertCommand = new SqlCommand("INSERT INTO Backups (FileName, FilePath, CreatedDate, Size) VALUES (@FileName, @FilePath, @CreatedDate, @Size)", connection);
            insertCommand.Parameters.AddWithValue("@FileName", fileName);
            insertCommand.Parameters.AddWithValue("@FilePath", filePath);
            insertCommand.Parameters.AddWithValue("@CreatedDate", DateTime.Now);
            insertCommand.Parameters.AddWithValue("@Size", new FileInfo(filePath).Length);
            await insertCommand.ExecuteNonQueryAsync();
        }

        public async Task<IEnumerable<BackupInfo>> GetBackupsAsync()
        {
            var backups = new List<BackupInfo>();
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();
            
            using var command = new SqlCommand("SELECT Id, FileName, FilePath, CreatedDate, Size FROM Backups ORDER BY CreatedDate DESC", connection);
            using var reader = await command.ExecuteReaderAsync();
            
            while (await reader.ReadAsync())
            {
                backups.Add(new BackupInfo
                {
                    Id = (int)reader["Id"],
                    FileName = reader["FileName"].ToString(),
                    FilePath = reader["FilePath"].ToString(),
                    CreatedDate = (DateTime)reader["CreatedDate"],
                    Size = (long)reader["Size"]
                });
            }
            return backups;
        }

        public async Task DeleteBackupAsync(int id)
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();
            
            using var command = new SqlCommand("DELETE FROM Backups WHERE Id = @Id", connection);
            command.Parameters.AddWithValue("@Id", id);
            await command.ExecuteNonQueryAsync();
        }

        public async Task RestoreBackupAsync(int id)
        {
            // Implementation for database restore
            await Task.Delay(1000); // Simulate restore process
        }

        public async Task<IEnumerable<SystemSetting>> GetSettingsAsync()
        {
            var settings = new List<SystemSetting>();
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();
            
            using var command = new SqlCommand("SELECT Id, [Key], Value, Description FROM SystemSettings", connection);
            using var reader = await command.ExecuteReaderAsync();
            
            while (await reader.ReadAsync())
            {
                settings.Add(new SystemSetting
                {
                    Id = (int)reader["Id"],
                    Key = reader["Key"].ToString(),
                    Value = reader["Value"].ToString(),
                    Description = reader["Description"].ToString()
                });
            }
            return settings;
        }

        public async Task UpdateSettingAsync(SystemSetting setting)
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();
            
            using var command = new SqlCommand("UPDATE SystemSettings SET Value = @Value WHERE Id = @Id", connection);
            command.Parameters.AddWithValue("@Id", setting.Id);
            command.Parameters.AddWithValue("@Value", setting.Value);
            await command.ExecuteNonQueryAsync();
        }

        public async Task<IEnumerable<LogEntry>> GetLogsAsync()
        {
            var logs = new List<LogEntry>();
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();
            
            using var command = new SqlCommand("SELECT TOP 1000 Id, Level, Message, Timestamp, UserId FROM SystemLogs ORDER BY Timestamp DESC", connection);
            using var reader = await command.ExecuteReaderAsync();
            
            while (await reader.ReadAsync())
            {
                logs.Add(new LogEntry
                {
                    Id = (int)reader["Id"],
                    Level = reader["Level"].ToString(),
                    Message = reader["Message"].ToString(),
                    Timestamp = (DateTime)reader["Timestamp"],
                    UserId = reader["UserId"] as int?
                });
            }
            return logs;
        }

        public async Task ClearLogsAsync()
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();
            
            using var command = new SqlCommand("DELETE FROM SystemLogs", connection);
            await command.ExecuteNonQueryAsync();
        }

        public async Task RunMaintenanceAsync()
        {
            // Simulate maintenance operations
            await Task.Delay(2000);
        }

        public async Task<MaintenanceStatus> GetMaintenanceStatusAsync()
        {
            return new MaintenanceStatus
            {
                LastRun = DateTime.Now.AddHours(-2),
                Status = "Success",
                Duration = 45
            };
        }
    }
}