using Microsoft.Data.SqlClient;
using Api_09.Models;
using BCrypt.Net;

namespace Api_09.DataAccess
{
    public class UserRepository : BaseRepository
    {
        public UserRepository(string connectionString) : base(connectionString)
        {
        }

        public async Task<List<object>> GetAllAsync()
        {
            try
            {
                using var connection = await CreateAndOpenConnectionAsync();
                
                using var command = new SqlCommand(@"SELECT u.Id, u.Name, u.Email, u.Username, u.Mobile, u.CreatedAt, u.IsActive, r.Name as RoleName 
                                                     FROM Users u INNER JOIN Roles r ON u.RoleId = r.Id", connection);
                using var reader = await command.ExecuteReaderAsync();
                
                var users = new List<object>();
                while (await reader.ReadAsync())
                {
                    users.Add(new {
                        id = (int)reader["Id"],
                        name = reader["Name"].ToString(),
                        email = reader["Email"].ToString(),
                        username = reader["Username"].ToString(),
                        mobile = reader["Mobile"].ToString(),
                        createdAt = (DateTime)reader["CreatedAt"],
                        isActive = (bool)reader["IsActive"],
                        role = reader["RoleName"].ToString()
                    });
                }
                
                return users;
            }
            catch (Exception ex)
            {
                throw new Exception($"Failed to retrieve users: {ex.Message}");
            }
        }

        public async Task<object> GetByIdAsync(int id)
        {
            try
            {
                using var connection = await CreateAndOpenConnectionAsync();
                
                using var command = new SqlCommand(@"SELECT u.Id, u.Name, u.Email, u.Username, u.Mobile, u.CreatedAt, u.IsActive, r.Name as RoleName 
                                                     FROM Users u INNER JOIN Roles r ON u.RoleId = r.Id WHERE u.Id = @Id", connection);
                command.Parameters.AddWithValue("@Id", id);
                using var reader = await command.ExecuteReaderAsync();
                
                if (!await reader.ReadAsync()) return null;
                
                return new {
                    id = (int)reader["Id"],
                    name = reader["Name"].ToString(),
                    email = reader["Email"].ToString(),
                    username = reader["Username"].ToString(),
                    mobile = reader["Mobile"].ToString(),
                    createdAt = (DateTime)reader["CreatedAt"],
                    isActive = (bool)reader["IsActive"],
                    role = reader["RoleName"].ToString()
                };
            }
            catch (Exception ex)
            {
                throw new Exception($"Failed to retrieve user with ID {id}: {ex.Message}");
            }
        }

        public async Task<int> CreateAsync(User user)
        {
            try
            {
                using var connection = await CreateAndOpenConnectionAsync();
                
                using var command = new SqlCommand(@"INSERT INTO Users (Name, Email, Username, Password, Mobile, RoleId, CreatedAt, IsActive) 
                                                     OUTPUT INSERTED.Id VALUES (@Name, @Email, @Username, @Password, @Mobile, @RoleId, @CreatedAt, @IsActive)", connection);
                command.Parameters.AddWithValue("@Name", user.Name);
                command.Parameters.AddWithValue("@Email", user.Email);
                command.Parameters.AddWithValue("@Username", user.Username);
                command.Parameters.AddWithValue("@Password", user.Password);
                command.Parameters.AddWithValue("@Mobile", user.Mobile ?? "1234567890");
                command.Parameters.AddWithValue("@RoleId", user.RoleId);
                command.Parameters.AddWithValue("@CreatedAt", user.CreatedAt);
                command.Parameters.AddWithValue("@IsActive", user.IsActive);
                
                return Convert.ToInt32(await command.ExecuteScalarAsync());
            }
            catch (Exception ex)
            {
                throw new Exception($"Failed to create user: {ex.Message}");
            }
        }

        public async Task UpdateAsync(int id, User user)
        {
            try
            {
                using var connection = await CreateAndOpenConnectionAsync();
                
                using var command = new SqlCommand(@"UPDATE Users SET Name = @Name, Email = @Email, Username = @Username, 
                                                     Mobile = @Mobile, RoleId = @RoleId, IsActive = @IsActive WHERE Id = @Id", connection);
                command.Parameters.AddWithValue("@Id", id);
                command.Parameters.AddWithValue("@Name", user.Name);
                command.Parameters.AddWithValue("@Email", user.Email);
                command.Parameters.AddWithValue("@Username", user.Username);
                command.Parameters.AddWithValue("@Mobile", user.Mobile ?? "");
                command.Parameters.AddWithValue("@RoleId", user.RoleId);
                command.Parameters.AddWithValue("@IsActive", user.IsActive);
                
                await command.ExecuteNonQueryAsync();
            }
            catch (Exception ex)
            {
                throw new Exception($"Failed to update user with ID {id}: {ex.Message}");
            }
        }

        public async Task<bool> DeleteAsync(int id)
        {
            try
            {
                using var connection = await CreateAndOpenConnectionAsync();
                
                using var command = new SqlCommand("DELETE FROM Users WHERE Id = @Id", connection);
                command.Parameters.AddWithValue("@Id", id);
                
                return await command.ExecuteNonQueryAsync() > 0;
            }
            catch (Exception ex)
            {
                throw new Exception($"Failed to delete user with ID {id}: {ex.Message}");
            }
        }
    }
}