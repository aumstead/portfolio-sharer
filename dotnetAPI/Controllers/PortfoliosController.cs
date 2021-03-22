using DotnetApi.Extensions;
using DotnetApi.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DotnetApi.Controllers
{
    [Authorize]
    public class PortfoliosController : BaseApiController
    {
        private readonly IPortfolioRepository _portfolioRepository;

        public PortfoliosController(IPortfolioRepository portfolioRepository)
        {
            _portfolioRepository = portfolioRepository;
        }

        [HttpPut]
        public async Task<ActionResult> UpdateName([FromQuery] int id, string updatedName)
        {
            var userId = User.GetUserId();

            var portfolio = await _portfolioRepository.GetPortfolioByIdAsync(id);

            if (portfolio.AppUserId != userId) return Unauthorized();

            portfolio.Name = updatedName;
            _portfolioRepository.UpdateName(portfolio);
            if (await _portfolioRepository.SaveAllAsync()) return NoContent();
            return BadRequest();
        }
    }
}
