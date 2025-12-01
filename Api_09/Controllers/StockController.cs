using Microsoft.AspNetCore.Mvc;
using Api_09.DataAccess;

namespace Api_09.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StockController : ControllerBase
    {
        private readonly string _connectionString;

        public StockController(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        [HttpGet("GetAllStock")]
        public async Task<ActionResult> GetStock()
        {
            // Mock data for now
            var stock = new[]
            {
                new { id = 1, itemId = 1, warehouse = "Main Warehouse", currentStock = 25, minimumStock = 5, maximumStock = 50 },
                new { id = 2, itemId = 2, warehouse = "Main Warehouse", currentStock = 15, minimumStock = 3, maximumStock = 30 },
                new { id = 3, itemId = 3, warehouse = "Secondary Warehouse", currentStock = 8, minimumStock = 2, maximumStock = 20 }
            };
            return Ok(stock);
        }
    }
}