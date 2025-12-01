using Microsoft.AspNetCore.Mvc;
using Api_09.DataAccess;
using Api_09.Models;

namespace Api_09.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CompaniesController : ControllerBase
    {
        private readonly CompanyRepository _repository;

        public CompaniesController(CompanyRepository repository)
        {
            _repository = repository;
        }

        [HttpGet("GetAllCompany")]
        public async Task<ActionResult<IEnumerable<Company>>> GetCompanies()
        {
            var companies = await _repository.GetAllAsync();
            return Ok(companies);
        }

        [HttpGet("GetCompanyById")]
        public async Task<ActionResult<Company>> GetCompany(int id)
        {
            var company = await _repository.GetByIdAsync(id);
            if (company == null) return NotFound();
            return Ok(company);
        }

        [HttpPost("CreateCompany")]
        public async Task<ActionResult> CreateCompany([FromBody] Company company)
        {
            await _repository.CreateAsync(company);
            return Ok(new { message = "Company created successfully" });
        }

        [HttpPut("UpdateCompanyById/{id}")]
        public async Task<ActionResult> UpdateCompany(int id, [FromBody] Company company)
        {
            company.Id = id;
            await _repository.UpdateAsync(company);
            return Ok(new { message = "Company updated successfully" });
        }

        [HttpDelete("DeleteCompany")]
        public async Task<ActionResult> DeleteCompany(int id)
        {
            await _repository.DeleteAsync(id);
            return Ok(new { message = "Company deleted successfully" });
        }
    }
}