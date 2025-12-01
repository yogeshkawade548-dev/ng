using Microsoft.Data.SqlClient;
using Api_09.Models;

namespace Api_09.DataAccess
{
    public class CompanyRepository
    {
        private readonly string _connectionString;

        public CompanyRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<IEnumerable<Company>> GetAllAsync()
        {
            var companies = new List<Company>();
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();
            
            using var command = new SqlCommand("SELECT Id, Name, Address, Phone FROM Companies", connection);
            using var reader = await command.ExecuteReaderAsync();
            
            while (await reader.ReadAsync())
            {
                companies.Add(new Company
                {
                    Id = (int)reader["Id"],
                    Name = reader["Name"].ToString(),
                    Address = reader["Address"].ToString(),
                    Phone = reader["Phone"].ToString()
                });
            }
            return companies;
        }

        public async Task<Company> GetByIdAsync(int id)
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();
            
            using var command = new SqlCommand("SELECT Id, Name, Address, Phone FROM Companies WHERE Id = @Id", connection);
            command.Parameters.AddWithValue("@Id", id);
            using var reader = await command.ExecuteReaderAsync();
            
            if (await reader.ReadAsync())
            {
                return new Company
                {
                    Id = (int)reader["Id"],
                    Name = reader["Name"].ToString(),
                    Address = reader["Address"].ToString(),
                    Phone = reader["Phone"].ToString()
                };
            }
            return null;
        }

        public async Task CreateAsync(Company company)
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();
            
            using var command = new SqlCommand("INSERT INTO Companies (Name, Address, Phone) VALUES (@Name, @Address, @Phone)", connection);
            command.Parameters.AddWithValue("@Name", company.Name);
            command.Parameters.AddWithValue("@Address", company.Address);
            command.Parameters.AddWithValue("@Phone", company.Phone);
            await command.ExecuteNonQueryAsync();
        }

        public async Task UpdateAsync(Company company)
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();
            
            using var command = new SqlCommand("UPDATE Companies SET Name = @Name, Address = @Address, Phone = @Phone WHERE Id = @Id", connection);
            command.Parameters.AddWithValue("@Id", company.Id);
            command.Parameters.AddWithValue("@Name", company.Name);
            command.Parameters.AddWithValue("@Address", company.Address);
            command.Parameters.AddWithValue("@Phone", company.Phone);
            await command.ExecuteNonQueryAsync();
        }

        public async Task DeleteAsync(int id)
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();
            
            using var command = new SqlCommand("DELETE FROM Companies WHERE Id = @Id", connection);
            command.Parameters.AddWithValue("@Id", id);
            await command.ExecuteNonQueryAsync();
        }
    }
}