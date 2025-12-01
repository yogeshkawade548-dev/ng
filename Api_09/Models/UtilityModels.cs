namespace Api_09.Models
{
    public class BackupInfo
    {
        public int Id { get; set; }
        public string FileName { get; set; } = string.Empty;
        public string FilePath { get; set; } = string.Empty;
        public DateTime CreatedDate { get; set; }
        public long Size { get; set; }
    }

    public class LogEntry
    {
        public int Id { get; set; }
        public string Level { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
        public int? UserId { get; set; }
    }

    public class SystemSetting
    {
        public int Id { get; set; }
        public string Key { get; set; } = string.Empty;
        public string Value { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
    }

    public class MaintenanceStatus
    {
        public DateTime LastRun { get; set; }
        public string Status { get; set; } = string.Empty;
        public int Duration { get; set; }
    }
}