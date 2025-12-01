-- Remove Master menu access from Manager and User roles
DELETE FROM RoleMenuPermissions WHERE RoleId IN (2, 3) AND MenuId IN (2, 3, 4, 5);

-- Update Manager permissions - remove Master menu completely
DELETE FROM RoleMenuPermissions WHERE RoleId = 2 AND MenuId = 2;

-- Update User permissions - remove Master menu completely  
DELETE FROM RoleMenuPermissions WHERE RoleId = 3 AND MenuId = 2;

-- Verify current permissions
SELECT r.Name as RoleName, m.Name as MenuName, rmp.CanView, rmp.CanCreate, rmp.CanEdit, rmp.CanDelete
FROM RoleMenuPermissions rmp
INNER JOIN Roles r ON rmp.RoleId = r.Id
INNER JOIN Menus m ON rmp.MenuId = m.Id
WHERE m.Name IN ('Master', 'User Management', 'Company', 'Category')
ORDER BY r.Id, m.DisplayOrder;