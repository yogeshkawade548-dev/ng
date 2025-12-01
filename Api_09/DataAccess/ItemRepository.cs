using Microsoft.Data.SqlClient;
using Api_09.Models;

namespace Api_09.DataAccess
{
    public class ItemRepository
    {
        private readonly string _connectionString;

        public ItemRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<IEnumerable<Item>> GetAllAsync()
        {
            var items = new List<Item>();
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();
            
            using var command = new SqlCommand("SELECT Id, Name, Description, CategoryId, Price, Quantity FROM Items", connection);
            using var reader = await command.ExecuteReaderAsync();
            
            while (await reader.ReadAsync())
            {
                items.Add(new Item
                {
                    Id = (int)reader["Id"],
                    Name = reader["Name"].ToString(),
                    Description = reader["Description"].ToString(),
                    CategoryId = (int)reader["CategoryId"],
                    Price = (decimal)reader["Price"],
                    Quantity = (int)reader["Quantity"]
                });
            }
            return items;
        }

        public async Task<Item> GetByIdAsync(int id)
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();
            
            using var command = new SqlCommand("SELECT Id, Name, Description, CategoryId, Price, Quantity FROM Items WHERE Id = @Id", connection);
            command.Parameters.AddWithValue("@Id", id);
            using var reader = await command.ExecuteReaderAsync();
            
            if (await reader.ReadAsync())
            {
                return new Item
                {
                    Id = (int)reader["Id"],
                    Name = reader["Name"].ToString(),
                    Description = reader["Description"].ToString(),
                    CategoryId = (int)reader["CategoryId"],
                    Price = (decimal)reader["Price"],
                    Quantity = (int)reader["Quantity"]
                };
            }
            return null;
        }

        public async Task CreateAsync(Item item)
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();
            
            using var command = new SqlCommand("INSERT INTO Items (Name, Description, CategoryId, Price, Quantity) VALUES (@Name, @Description, @CategoryId, @Price, @Quantity)", connection);
            command.Parameters.AddWithValue("@Name", item.Name);
            command.Parameters.AddWithValue("@Description", item.Description);
            command.Parameters.AddWithValue("@CategoryId", item.CategoryId);
            command.Parameters.AddWithValue("@Price", item.Price);
            command.Parameters.AddWithValue("@Quantity", item.Quantity);
            await command.ExecuteNonQueryAsync();
        }

        public async Task UpdateAsync(Item item)
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();
            
            using var command = new SqlCommand("UPDATE Items SET Name = @Name, Description = @Description, CategoryId = @CategoryId, Price = @Price, Quantity = @Quantity WHERE Id = @Id", connection);
            command.Parameters.AddWithValue("@Id", item.Id);
            command.Parameters.AddWithValue("@Name", item.Name);
            command.Parameters.AddWithValue("@Description", item.Description);
            command.Parameters.AddWithValue("@CategoryId", item.CategoryId);
            command.Parameters.AddWithValue("@Price", item.Price);
            command.Parameters.AddWithValue("@Quantity", item.Quantity);
            await command.ExecuteNonQueryAsync();
        }

        public async Task DeleteAsync(int id)
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();
            
            using var command = new SqlCommand("DELETE FROM Items WHERE Id = @Id", connection);
            command.Parameters.AddWithValue("@Id", id);
            await command.ExecuteNonQueryAsync();
        }
    }
}