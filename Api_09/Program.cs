using Api_09.DataAccess;
using Api_09.Middleware;
using Api_09.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped(provider => new AuthRepository(connectionString, provider.GetRequiredService<IEmailService>()));
builder.Services.AddScoped(provider => new UserRepository(connectionString));
builder.Services.AddScoped(provider => new RoleRepository(connectionString));
builder.Services.AddScoped(provider => new CompanyRepository(connectionString));
builder.Services.AddScoped(provider => new CategoryRepository(connectionString));
builder.Services.AddScoped(provider => new ItemRepository(connectionString));
builder.Services.AddScoped(provider => new UtilityRepository(connectionString));
builder.Services.AddScoped(provider => new ReportRepository(connectionString));


builder.Services.AddControllers().AddNewtonsoftJson();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
    });
});

// JWT Configuration
var jwtKey = builder.Configuration["Jwt:Key"] ?? "YourSecretKeyHere123456789012345678901234567890";
var key = Encoding.ASCII.GetBytes(jwtKey);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateIssuer = false,
            ValidateAudience = false,
            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "API V1");
    c.RoutePrefix = string.Empty;
});

app.UseHttpsRedirection();
app.UseCors("AllowAngular");
app.UseMiddleware<EncryptionMiddleware>();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();