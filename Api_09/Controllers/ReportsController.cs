using Microsoft.AspNetCore.Mvc;
using Api_09.DataAccess;

namespace Api_09.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReportsController : ControllerBase
    {
        private readonly ReportRepository _repository;

        public ReportsController(ReportRepository repository)
        {
            _repository = repository;
        }

        [HttpGet("GetSalesReport")]
        public async Task<ActionResult> GetSalesReport()
        {
            var salesData = new[]
            {
                new { month = "January", sales = 45000, orders = 120, avgOrderValue = 375 },
                new { month = "February", sales = 52000, orders = 135, avgOrderValue = 385 },
                new { month = "March", sales = 48000, orders = 128, avgOrderValue = 375 },
                new { month = "April", sales = 55000, orders = 142, avgOrderValue = 387 }
            };
            return Ok(salesData);
        }

        [HttpGet("GetInventoryReport")]
        public async Task<ActionResult> GetInventoryReport()
        {
            var inventoryData = new[]
            {
                new { item = "Laptop", currentStock = 25, minStock = 5, maxStock = 50, value = 24999.75, status = "Normal" },
                new { item = "Printer", currentStock = 3, minStock = 5, maxStock = 25, value = 899.97, status = "Low Stock" },
                new { item = "Monitor", currentStock = 30, minStock = 10, maxStock = 60, value = 7499.70, status = "Normal" },
                new { item = "Keyboard", currentStock = 2, minStock = 20, maxStock = 100, value = 99.98, status = "Critical" }
            };
            return Ok(inventoryData);
        }

        [HttpGet("GetUserActivityReport")]
        public async Task<ActionResult> GetUserActivityReport()
        {
            var activityData = new[]
            {
                new { user = "admin", loginCount = 45, lastLogin = "2024-01-20 14:30:00", actions = 156, module = "User Management" },
                new { user = "manager1", loginCount = 32, lastLogin = "2024-01-20 13:15:00", actions = 89, module = "Inventory" },
                new { user = "user1", loginCount = 28, lastLogin = "2024-01-20 12:45:00", actions = 67, module = "Reports" },
                new { user = "user2", loginCount = 15, lastLogin = "2024-01-19 16:20:00", actions = 34, module = "Company" }
            };
            return Ok(activityData);
        }

        [HttpGet("GetFinancialReport")]
        public async Task<ActionResult> GetFinancialReport()
        {
            var financialData = new[]
            {
                new { category = "Revenue", q1 = 125000, q2 = 135000, q3 = 142000, q4 = 158000, total = 560000 },
                new { category = "Expenses", q1 = 85000, q2 = 92000, q3 = 98000, q4 = 105000, total = 380000 },
                new { category = "Profit", q1 = 40000, q2 = 43000, q3 = 44000, q4 = 53000, total = 180000 },
                new { category = "Tax", q1 = 8000, q2 = 8600, q3 = 8800, q4 = 10600, total = 36000 }
            };
            return Ok(financialData);
        }
    }
}