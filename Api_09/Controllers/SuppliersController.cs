using Microsoft.AspNetCore.Mvc;

namespace Api_09.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SuppliersController : ControllerBase
    {
        [HttpGet("GetAllSuppliers")]
        public async Task<ActionResult> GetSuppliers()
        {
            var suppliers = new[]
            {
                new { id = 1, name = "Tech Distributors Inc", contactPerson = "John Smith", email = "john@techdist.com", phone = "555-1001" },
                new { id = 2, name = "Office Supply Co", contactPerson = "Sarah Johnson", email = "sarah@officesupply.com", phone = "555-1002" },
                new { id = 3, name = "Electronics Wholesale", contactPerson = "Mike Chen", email = "mike@elecwholesale.com", phone = "555-1003" }
            };
            return Ok(suppliers);
        }
    }
}