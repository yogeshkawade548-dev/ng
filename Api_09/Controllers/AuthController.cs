using Microsoft.AspNetCore.Mvc;
using Api_09.DataAccess;
using Api_09.Models.DTOs;

namespace Api_09.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthRepository _authRepository;

        public AuthController(AuthRepository authRepository)
        {
            _authRepository = authRepository;
        }

        [HttpPost("login")]
        public async Task<ActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                var (success, user) = await _authRepository.LoginAsync(request.Username, request.Password);
                
                if (!success)
                {
                    return Unauthorized(new { message = "Invalid credentials" });
                }

                return Ok(new { 
                    message = "Login successful",
                    user
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("forgot-password")]
        public async Task<ActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            var success = await _authRepository.SendPasswordResetAsync(request.Email);
            
            if (!success)
            {
                return BadRequest(new { message = "Email not found" });
            }

            return Ok(new { message = "Password reset instructions sent to your email" + request.Email });
        }
    }
}