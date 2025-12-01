using Microsoft.AspNetCore.Mvc;
using Api_09.DataAccess;
using Api_09.Models;

namespace Api_09.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ItemsController : ControllerBase
    {
        private readonly ItemRepository _repository;

        public ItemsController(ItemRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Item>>> GetItems()
        {
            var items = await _repository.GetAllAsync();
            return Ok(items);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Item>> GetItem(int id)
        {
            var item = await _repository.GetByIdAsync(id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        [HttpPost]
        public async Task<ActionResult> CreateItem([FromBody] Item item)
        {
            await _repository.CreateAsync(item);
            return Ok(new { message = "Item created successfully" });
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateItem(int id, [FromBody] Item item)
        {
            item.Id = id;
            await _repository.UpdateAsync(item);
            return Ok(new { message = "Item updated successfully" });
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteItem(int id)
        {
            await _repository.DeleteAsync(id);
            return Ok(new { message = "Item deleted successfully" });
        }
    }
}