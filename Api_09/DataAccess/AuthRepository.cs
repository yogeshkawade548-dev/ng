using Microsoft.Data.SqlClient;
using Api_09.Models;
using Api_09.Services;

namespace Api_09.DataAccess
{
    public class AuthRepository
    {
        private readonly string _connectionString;
        private readonly IEmailService _emailService;

        public AuthRepository(string connectionString, IEmailService emailService)
        {
            _connectionString = connectionString;
            _emailService = emailService;
        }

        public async Task<(bool Success, object User)> LoginAsync(string username, string password)
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();
            
            using var command = new SqlCommand(@"SELECT u.Id, u.Name, u.Email, u.Username, r.Name as RoleName 
                                                 FROM Users u INNER JOIN Roles r ON u.RoleId = r.Id 
                                                 WHERE u.Username = @Username AND u.Password = @Password AND u.IsActive = 1", connection);
            command.Parameters.AddWithValue("@Username", username);
            command.Parameters.AddWithValue("@Password", password);
            
            using var reader = await command.ExecuteReaderAsync();
            
            if (!await reader.ReadAsync())
            {
                return (false, null);
            }

            var user = new {
                id = (int)reader["Id"],
                name = reader["Name"].ToString(),
                email = reader["Email"].ToString(),
                username = reader["Username"].ToString(),
                role = reader["RoleName"].ToString()
            };

            return (true, user);
        }

        public async Task<bool> SendPasswordResetAsync(string email)
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();
            
            string resetToken = Guid.NewGuid().ToString();
            DateTime expiry = DateTime.UtcNow.AddHours(1);
            
            using var command = new SqlCommand("SELECT COUNT(*) FROM Users WHERE Email = @Email", connection);
            command.Parameters.AddWithValue("@Email", email);
            
            int result = Convert.ToInt32(await command.ExecuteScalarAsync());
            
            if (result > 0)
            {
                await _emailService.SendPasswordResetEmailAsync(email, resetToken);
            }
            
            return result > 0;
        }


    }
}