using DotnetApi.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DotnetApi.Controllers
{
    public class PortfoliosController : BaseApiController
    {
        private readonly IPortfolioRepository _portfolioRepository;

        public PortfoliosController(IPortfolioRepository portfolioRepository)
        {
            _portfolioRepository = portfolioRepository;
        }

        [HttpPut]
        public async Task<ActionResult> UpdateName(int id, string updatedName)
        {
            var portfolio = await _portfolioRepository.GetPortfolioByIdAsync(id);
            portfolio.Name = updatedName;
            _portfolioRepository.UpdateName(portfolio);
            if (await _portfolioRepository.SaveAllAsync()) return NoContent();
            return BadRequest();
        }
    }
}
