using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;

namespace Api_09.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MenuController : ControllerBase
    {
        private readonly string _connectionString;

        public MenuController(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        [HttpGet("GetUserMenus/{roleId}")]
        public async Task<ActionResult> GetUserMenus(int roleId)
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            var query = @"
                SELECT m.Id, m.Name, m.Route, m.Icon, m.ParentId, m.DisplayOrder,
                       rmp.CanView, rmp.CanCreate, rmp.CanEdit, rmp.CanDelete
                FROM Menus m
                INNER JOIN RoleMenuPermissions rmp ON m.Id = rmp.MenuId
                WHERE rmp.RoleId = @RoleId AND rmp.CanView = 1 AND m.IsActive = 1
                ORDER BY m.DisplayOrder";

            using var command = new SqlCommand(query, connection);
            command.Parameters.AddWithValue("@RoleId", roleId);

            using var reader = await command.ExecuteReaderAsync();
            var menus = new List<object>();

            while (await reader.ReadAsync())
            {
                menus.Add(new
                {
                    id = (int)reader["Id"],
                    name = reader["Name"].ToString(),
                    route = reader["Route"]?.ToString(),
                    icon = reader["Icon"]?.ToString(),
                    parentId = reader["ParentId"] == DBNull.Value ? (int?)null : (int)reader["ParentId"],
                    displayOrder = (int)reader["DisplayOrder"],
                    permissions = new
                    {
                        canView = (bool)reader["CanView"],
                        canCreate = (bool)reader["CanCreate"],
                        canEdit = (bool)reader["CanEdit"],
                        canDelete = (bool)reader["CanDelete"]
                    }
                });
            }

            return Ok(menus);
        }

        [HttpGet("GetComponentPermissions/{roleId}/{componentName}")]
        public async Task<ActionResult> GetComponentPermissions(int roleId, string componentName)
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            var query = @"
                SELECT rmp.CanView, rmp.CanCreate, rmp.CanEdit, rmp.CanDelete
                FROM RoleMenuPermissions rmp
                INNER JOIN Menus m ON rmp.MenuId = m.Id
                WHERE rmp.RoleId = @RoleId AND m.Name = @ComponentName";

            using var command = new SqlCommand(query, connection);
            command.Parameters.AddWithValue("@RoleId", roleId);
            command.Parameters.AddWithValue("@ComponentName", componentName);

            using var reader = await command.ExecuteReaderAsync();
            
            if (await reader.ReadAsync())
            {
                var permissions = new
                {
                    canView = (bool)reader["CanView"],
                    canCreate = (bool)reader["CanCreate"],
                    canEdit = (bool)reader["CanEdit"],
                    canDelete = (bool)reader["CanDelete"],
                    canDownload = (bool)reader["CanView"] // Download based on view permission
                };
                return Ok(permissions);
            }

            // Default no permissions
            return Ok(new { canView = false, canCreate = false, canEdit = false, canDelete = false, canDownload = false });
        }

        [HttpGet("GetAllMenus")]
        public async Task<ActionResult> GetAllMenus()
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            var query = "SELECT Id, Name FROM Menus WHERE IsActive = 1 ORDER BY DisplayOrder";
            using var command = new SqlCommand(query, connection);
            using var reader = await command.ExecuteReaderAsync();
            
            var menus = new List<object>();
            while (await reader.ReadAsync())
            {
                menus.Add(new { id = (int)reader["Id"], name = reader["Name"].ToString() });
            }
            
            return Ok(menus);
        }

        [HttpGet("GetRolePermissions/{roleId}")]
        public async Task<ActionResult> GetRolePermissions(int roleId)
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            var query = "SELECT RoleId, MenuId, CanView, CanCreate, CanEdit, CanDelete FROM RoleMenuPermissions WHERE RoleId = @RoleId";
            using var command = new SqlCommand(query, connection);
            command.Parameters.AddWithValue("@RoleId", roleId);
            using var reader = await command.ExecuteReaderAsync();
            
            var permissions = new List<object>();
            while (await reader.ReadAsync())
            {
                permissions.Add(new {
                    roleId = (int)reader["RoleId"],
                    menuId = (int)reader["MenuId"],
                    canView = (bool)reader["CanView"],
                    canCreate = (bool)reader["CanCreate"],
                    canEdit = (bool)reader["CanEdit"],
                    canDelete = (bool)reader["CanDelete"]
                });
            }
            
            return Ok(permissions);
        }

        [HttpPost("SaveRolePermissions")]
        public async Task<ActionResult> SaveRolePermissions([FromBody] dynamic request)
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            // Delete existing permissions for the role
            var deleteQuery = "DELETE FROM RoleMenuPermissions WHERE RoleId = @RoleId";
            using var deleteCommand = new SqlCommand(deleteQuery, connection);
            deleteCommand.Parameters.AddWithValue("@RoleId", (int)request.roleId);
            await deleteCommand.ExecuteNonQueryAsync();

            // Insert new permissions
            var insertQuery = @"INSERT INTO RoleMenuPermissions (RoleId, MenuId, CanView, CanCreate, CanEdit, CanDelete) 
                               VALUES (@RoleId, @MenuId, @CanView, @CanCreate, @CanEdit, @CanDelete)";
            
            foreach (var permission in request.permissions)
            {
                using var insertCommand = new SqlCommand(insertQuery, connection);
                insertCommand.Parameters.AddWithValue("@RoleId", (int)permission.roleId);
                insertCommand.Parameters.AddWithValue("@MenuId", (int)permission.menuId);
                insertCommand.Parameters.AddWithValue("@CanView", (bool)permission.canView);
                insertCommand.Parameters.AddWithValue("@CanCreate", (bool)permission.canCreate);
                insertCommand.Parameters.AddWithValue("@CanEdit", (bool)permission.canEdit);
                insertCommand.Parameters.AddWithValue("@CanDelete", (bool)permission.canDelete);
                await insertCommand.ExecuteNonQueryAsync();
            }

            return Ok(new { message = "Permissions saved successfully" });
        }
    }
}