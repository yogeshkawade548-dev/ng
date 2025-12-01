using Microsoft.AspNetCore.Mvc;
using Api_09.Helpers;

namespace Api_09.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EncryptionController : ControllerBase
    {
        [HttpPost("encrypt")]
        public ActionResult<string> Encrypt([FromBody] EncryptRequest request)
        {
            try
            {
                var encrypted = EncryptionHelper.Encrypt(request.Data);
                return Ok(new { encrypted = encrypted });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("decrypt")]
        public ActionResult<string> Decrypt([FromBody] DecryptRequest request)
        {
            try
            {
                var decrypted = EncryptionHelper.Decrypt<string>(request.EncryptedData);
                return Ok(new { decrypted = decrypted });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }

    public class EncryptRequest
    {
        public string Data { get; set; } = string.Empty;
    }

    public class DecryptRequest
    {
        public string EncryptedData { get; set; } = string.Empty;
    }
}