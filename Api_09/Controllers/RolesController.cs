using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Api_09.DataAccess;
using Api_09.Models;

namespace Api_09.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RolesController : ControllerBase
    {
        private readonly RoleRepository _roleRepository;

        public RolesController(RoleRepository roleRepository)
        {
            _roleRepository = roleRepository;
        }

        [HttpGet]
        public async Task<ActionResult> GetRoles()
        {
            var roles = await _roleRepository.GetAllAsync();
            return Ok(roles);
        }

        [HttpGet("GetAllRoles")]
        public async Task<ActionResult> GetAllRoles()
        {
            var roles = new[]
            {
                new { id = 1, name = "Admin" },
                new { id = 2, name = "Manager" },
                new { id = 3, name = "User" }
            };
            return Ok(roles);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> GetRole(int id)
        {
            var role = await _roleRepository.GetByIdAsync(id);
            if (role == null) return NotFound();
            return Ok(role);
        }

        [HttpPost]
        public async Task<ActionResult> CreateRole(Role role)
        {
            var id = await _roleRepository.CreateAsync(role);
            return CreatedAtAction(nameof(GetRole), new { id }, new { id });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRole(int id, Role role)
        {
            if (id != role.Id) return BadRequest();
            
            await _roleRepository.UpdateAsync(id, role);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRole(int id)
        {
            var success = await _roleRepository.DeleteAsync(id);
            if (!success) return NotFound();
            
            return NoContent();
        }
    }
}