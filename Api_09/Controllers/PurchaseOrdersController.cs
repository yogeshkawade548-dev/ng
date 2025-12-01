using Microsoft.AspNetCore.Mvc;

namespace Api_09.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PurchaseOrdersController : ControllerBase
    {
        [HttpGet("GetAllPurchaseOrders")]
        public async Task<ActionResult> GetPurchaseOrders()
        {
            var orders = new[]
            {
                new { id = 1, orderNumber = "PO-2024-001", supplierId = 1, orderDate = "2024-01-15", status = "Completed", totalAmount = 15000.00 },
                new { id = 2, orderNumber = "PO-2024-002", supplierId = 2, orderDate = "2024-01-18", status = "In Transit", totalAmount = 8750.00 },
                new { id = 3, orderNumber = "PO-2024-003", supplierId = 3, orderDate = "2024-01-20", status = "Pending", totalAmount = 12000.00 }
            };
            return Ok(orders);
        }
    }
}