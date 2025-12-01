using System.Net;
using System.Net.Mail;

namespace Api_09.Services
{
    public interface IEmailService
    {
        Task<bool> SendPasswordResetEmailAsync(string toEmail, string resetToken);
    }

    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<bool> SendPasswordResetEmailAsync(string toEmail, string resetToken)
        {
            try
            {
                var smtpSettings = _configuration.GetSection("SmtpSettings");
                
                using var client = new SmtpClient(smtpSettings["Host"], int.Parse(smtpSettings["Port"]))
                {
                    EnableSsl = bool.Parse(smtpSettings["EnableSsl"]),
                    UseDefaultCredentials = false,
                    Credentials = new NetworkCredential(smtpSettings["Username"], smtpSettings["Password"])
                };

                var message = new MailMessage
                {
                    From = new MailAddress(smtpSettings["FromEmail"], smtpSettings["FromName"]),
                    Subject = "Password Reset Request",
                    Body = $@"
                        <h2>Password Reset Request</h2>
                        <p>You have requested to reset your password.</p>
                        <p>Your reset token is: <strong>{resetToken}</strong></p>
                        <p>This token will expire in 1 hour.</p>
                        <p>If you did not request this, please ignore this email.</p>
                    ",
                    IsBodyHtml = true
                };
                message.To.Add(toEmail);

                await client.SendMailAsync(message);
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Email sending failed: {ex.Message}");
                return false;
            }
        }
    }
}