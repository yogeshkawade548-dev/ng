using Microsoft.Data.SqlClient;
using Api_09.Models;

namespace Api_09.DataAccess
{
    public class RoleRepository
    {
        private readonly string _connectionString;

        public RoleRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<List<object>> GetAllAsync()
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();
            
            var query = "SELECT Id, Name, Description, CreatedAt, IsActive FROM Roles";
            using var command = new SqlCommand(query, connection);
            using var reader = await command.ExecuteReaderAsync();
            
            var roles = new List<object>();
            while (await reader.ReadAsync())
            {
                roles.Add(new {
                    id = (int)reader["Id"],
                    name = reader["Name"].ToString(),
                    description = reader["Description"] == DBNull.Value ? null : reader["Description"].ToString(),
                    createdAt = (DateTime)reader["CreatedAt"],
                    isActive = (bool)reader["IsActive"]
                });
            }
            
            return roles;
        }

        public async Task<object> GetByIdAsync(int id)
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();
            
            var query = "SELECT Id, Name, Description, CreatedAt, IsActive FROM Roles WHERE Id = @id";
            using var command = new SqlCommand(query, connection);
            command.Parameters.AddWithValue("@id", id);
            using var reader = await command.ExecuteReaderAsync();
            
            if (!await reader.ReadAsync()) return null;
            
            return new {
                id = (int)reader["Id"],
                name = reader["Name"].ToString(),
                description = reader["Description"] == DBNull.Value ? null : reader["Description"].ToString(),
                createdAt = (DateTime)reader["CreatedAt"],
                isActive = (bool)reader["IsActive"]
            };
        }

        public async Task<int> CreateAsync(Role role)
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();
            
            var query = @"INSERT INTO Roles (Name, Description, CreatedAt, IsActive) 
                         OUTPUT INSERTED.Id VALUES (@name, @description, @createdAt, @isActive)";
            
            using var command = new SqlCommand(query, connection);
            command.Parameters.AddWithValue("@name", role.Name);
            command.Parameters.AddWithValue("@description", (object)role.Description ?? DBNull.Value);
            command.Parameters.AddWithValue("@createdAt", role.CreatedAt);
            command.Parameters.AddWithValue("@isActive", role.IsActive);
            
            return Convert.ToInt32(await command.ExecuteScalarAsync());
        }

        public async Task UpdateAsync(int id, Role role)
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();
            
            var query = "UPDATE Roles SET Name = @name, Description = @description, IsActive = @isActive WHERE Id = @id";
            using var command = new SqlCommand(query, connection);
            command.Parameters.AddWithValue("@id", id);
            command.Parameters.AddWithValue("@name", role.Name);
            command.Parameters.AddWithValue("@description", (object)role.Description ?? DBNull.Value);
            command.Parameters.AddWithValue("@isActive", role.IsActive);
            
            await command.ExecuteNonQueryAsync();
        }

        public async Task<bool> DeleteAsync(int id)
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();
            
            var query = "DELETE FROM Roles WHERE Id = @id";
            using var command = new SqlCommand(query, connection);
            command.Parameters.AddWithValue("@id", id);
            
            return await command.ExecuteNonQueryAsync() > 0;
        }
    }
}