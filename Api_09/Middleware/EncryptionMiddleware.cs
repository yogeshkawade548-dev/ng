using Api_09.Helpers;
using Newtonsoft.Json;
using System.Text;

namespace Api_09.Middleware
{
    public class EncryptionMiddleware
    {
        private readonly RequestDelegate _next;

        public EncryptionMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            // Decrypt request body
            if (context.Request.Method != "GET" && context.Request.ContentLength > 0)
            {
                context.Request.EnableBuffering();
                var body = await new StreamReader(context.Request.Body).ReadToEndAsync();
                context.Request.Body.Position = 0;

                try
                {
                    var encryptedRequest = JsonConvert.DeserializeObject<dynamic>(body);
                    if (encryptedRequest?.data != null)
                    {
                        Console.WriteLine($"Decrypting request: {encryptedRequest.data}");
                        var decryptedData = EncryptionHelper.Decrypt<object>(encryptedRequest.data.ToString());
                        var decryptedJson = JsonConvert.SerializeObject(decryptedData);
                        Console.WriteLine($"Decrypted to: {decryptedJson}");
                        
                        var bytes = Encoding.UTF8.GetBytes(decryptedJson);
                        context.Request.Body = new MemoryStream(bytes);
                        context.Request.ContentLength = bytes.Length;
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Request decryption failed: {ex.Message}");
                    // If decryption fails, continue with original request
                }
            }

            // Capture response
            var originalBodyStream = context.Response.Body;
            using var responseBody = new MemoryStream();
            context.Response.Body = responseBody;

            await _next(context);

            // Encrypt response
            context.Response.Body.Seek(0, SeekOrigin.Begin);
            var responseText = await new StreamReader(context.Response.Body).ReadToEndAsync();
            
            if (!string.IsNullOrEmpty(responseText))
            {
                try
                {
                    var responseData = JsonConvert.DeserializeObject(responseText);
                    var encryptedResponse = new { data = EncryptionHelper.Encrypt(responseData) };
                    var encryptedJson = JsonConvert.SerializeObject(encryptedResponse);
                    
                    context.Response.Headers.Add("X-Encrypted", "true");
                    var encryptedBytes = Encoding.UTF8.GetBytes(encryptedJson);
                    context.Response.ContentLength = encryptedBytes.Length;
                    
                    await originalBodyStream.WriteAsync(encryptedBytes, 0, encryptedBytes.Length);
                }
                catch
                {
                    // If encryption fails, return original response
                    var originalBytes = Encoding.UTF8.GetBytes(responseText);
                    await originalBodyStream.WriteAsync(originalBytes, 0, originalBytes.Length);
                }
            }
        }
    }
}