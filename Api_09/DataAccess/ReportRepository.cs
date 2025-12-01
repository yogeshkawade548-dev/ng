using Microsoft.Data.SqlClient;
using Api_09.Models;

namespace Api_09.DataAccess
{
    public class ReportRepository
    {
        private readonly string _connectionString;

        public ReportRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<IEnumerable<object>> GetSalesReportAsync(DateTime startDate, DateTime endDate)
        {
            var reports = new List<object>();
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();
            
            using var command = new SqlCommand(@"
                SELECT 
                    CAST(OrderDate AS DATE) as Date,
                    SUM(TotalAmount) as TotalSales,
                    COUNT(*) as TotalOrders,
                    'Sample Product' as TopProduct,
                    SUM(TotalAmount) as Revenue
                FROM PurchaseOrders 
                WHERE OrderDate BETWEEN @StartDate AND @EndDate
                GROUP BY CAST(OrderDate AS DATE)
                ORDER BY Date", connection);
            
            command.Parameters.AddWithValue("@StartDate", startDate);
            command.Parameters.AddWithValue("@EndDate", endDate);
            
            using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                reports.Add(new {
                    date = reader["Date"],
                    totalSales = reader["TotalSales"],
                    totalOrders = reader["TotalOrders"],
                    topProduct = reader["TopProduct"],
                    revenue = reader["Revenue"]
                });
            }
            return reports;
        }

        public async Task<IEnumerable<object>> GetInventoryReportAsync()
        {
            var reports = new List<object>();
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();
            
            using var command = new SqlCommand(@"
                SELECT 
                    i.Name as ItemName,
                    ISNULL(s.Quantity, 0) as CurrentStock,
                    10 as MinStock,
                    100 as MaxStock,
                    CASE 
                        WHEN ISNULL(s.Quantity, 0) = 0 THEN 'Out'
                        WHEN ISNULL(s.Quantity, 0) <= 10 THEN 'Low'
                        ELSE 'Normal'
                    END as Status
                FROM Items i
                LEFT JOIN Stocks s ON i.Id = s.ItemId", connection);
            
            using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                reports.Add(new {
                    itemName = reader["ItemName"],
                    currentStock = reader["CurrentStock"],
                    minStock = reader["MinStock"],
                    maxStock = reader["MaxStock"],
                    status = reader["Status"]
                });
            }
            return reports;
        }

        public async Task<IEnumerable<object>> GetUserActivityReportAsync(DateTime startDate, DateTime endDate)
        {
            var reports = new List<object>();
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();
            
            using var command = new SqlCommand(@"
                SELECT 
                    u.Id as UserId,
                    u.Name as UserName,
                    COUNT(l.Id) as LoginCount,
                    MAX(l.Timestamp) as LastLogin,
                    COUNT(l.Id) * 5 as ActionsPerformed
                FROM Users u
                LEFT JOIN SystemLogs l ON u.Id = l.UserId AND l.Timestamp BETWEEN @StartDate AND @EndDate
                GROUP BY u.Id, u.Name", connection);
            
            command.Parameters.AddWithValue("@StartDate", startDate);
            command.Parameters.AddWithValue("@EndDate", endDate);
            
            using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                reports.Add(new {
                    userId = reader["UserId"],
                    userName = reader["UserName"],
                    loginCount = reader["LoginCount"],
                    lastLogin = reader["LastLogin"],
                    actionsPerformed = reader["ActionsPerformed"]
                });
            }
            return reports;
        }

        public async Task<IEnumerable<object>> GetFinancialReportAsync(int year)
        {
            var reports = new List<object>();
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();
            
            using var command = new SqlCommand(@"
                WITH Months AS (
                    SELECT 1 as MonthNum, 'January' as MonthName
                    UNION SELECT 2, 'February' UNION SELECT 3, 'March'
                    UNION SELECT 4, 'April' UNION SELECT 5, 'May'
                    UNION SELECT 6, 'June' UNION SELECT 7, 'July'
                    UNION SELECT 8, 'August' UNION SELECT 9, 'September'
                    UNION SELECT 10, 'October' UNION SELECT 11, 'November'
                    UNION SELECT 12, 'December'
                )
                SELECT 
                    m.MonthName as Month,
                    ISNULL(SUM(po.TotalAmount), 0) as Income,
                    ISNULL(SUM(po.TotalAmount) * 0.7, 0) as Expenses,
                    ISNULL(SUM(po.TotalAmount) * 0.3, 0) as Profit,
                    30.0 as ProfitMargin
                FROM Months m
                LEFT JOIN PurchaseOrders po ON MONTH(po.OrderDate) = m.MonthNum AND YEAR(po.OrderDate) = @Year
                GROUP BY m.MonthNum, m.MonthName
                ORDER BY m.MonthNum", connection);
            
            command.Parameters.AddWithValue("@Year", year);
            
            using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                reports.Add(new {
                    month = reader["Month"],
                    income = reader["Income"],
                    expenses = reader["Expenses"],
                    profit = reader["Profit"],
                    profitMargin = reader["ProfitMargin"]
                });
            }
            return reports;
        }

        public async Task<byte[]> ExportReportAsync(string reportType, string format)
        {
            // Simulate PDF generation
            await Task.Delay(500);
            return System.Text.Encoding.UTF8.GetBytes($"PDF Report: {reportType}");
        }
    }
}