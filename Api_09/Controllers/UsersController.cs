using Microsoft.AspNetCore.Mvc;
using Api_09.DataAccess;
using Api_09.Models;

namespace Api_09.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly UserRepository _userRepository;

        public UsersController(UserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        [HttpGet("GetAllUsers")]
        public async Task<ActionResult> GetUsers()
        {
            var users = await _userRepository.GetAllAsync();
            return Ok(users);
        }
    
        [HttpGet("GetUserById")]
        public async Task<ActionResult> GetUser(int id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null) return NotFound();
            return Ok(user);
        }

        [HttpPost("CreateUser")]
        public async Task<ActionResult> CreateUser(User user)
        {
            var id = await _userRepository.CreateAsync(user);
            return CreatedAtAction(nameof(GetUser), new { id }, new { id });
        }

        [HttpPut("UpdateUserById/{id}")]
        public async Task<IActionResult> UpdateUser(int id, User user)
        {
            await _userRepository.UpdateAsync(id, user);
            return NoContent();
        }

        [HttpDelete("DeleteUserById")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var success = await _userRepository.DeleteAsync(id);
            if (!success) return NotFound();
            
            return NoContent();
        }
    }
}
