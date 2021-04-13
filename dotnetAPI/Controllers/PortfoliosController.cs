using API.Entities;
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
        private readonly IUnitOfWork _unitOfWork;

        public PortfoliosController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        [HttpPost]
        public async Task<IActionResult> CreatePortfolio([FromQuery] string portfolioName)
        {
            var id = User.GetUserId();
            var user = await _unitOfWork.UserRepository.GetUserWithPortfoliosAsync(id);
            if (user.Portfolios.Count >= 6)
            {
                return BadRequest("There is a max limit of 6 portfolios.");
            }

            var portfolio = new Portfolio
            {
                Name = portfolioName,
                AppUserId = id
            };

            await _unitOfWork.PortfolioRepository.CreatePortfolio(portfolio);

            if (await _unitOfWork.PortfolioRepository.SaveAllAsync()) return CreatedAtRoute("GetPortfolioByIdAsync", new { id = portfolio.Id}, portfolio);
            return BadRequest();
        }

        [HttpPut]
        public async Task<ActionResult> UpdateName([FromQuery] int id, string updatedName)
        {
            var userId = User.GetUserId();

            var portfolio = await _unitOfWork.PortfolioRepository.GetPortfolioByIdAsync(id);

            if (portfolio.AppUserId != userId) return Unauthorized();

            portfolio.Name = updatedName;
            _unitOfWork.PortfolioRepository.UpdateName(portfolio);
            if (await _unitOfWork.PortfolioRepository.SaveAllAsync()) return NoContent();
            return BadRequest();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeletePortfolio(int id)
        {
            if (id < 1)
            {
                return BadRequest("Error deleting. Invalid ID.");
            }
            var portfolioFromDb = await _unitOfWork.PortfolioRepository.GetPortfolioByIdAsync(id);
            if (portfolioFromDb == null)
            {
                return BadRequest("Error deleting. Portfolio not found.");
            }
            var userId = User.GetUserId();
            if (userId != portfolioFromDb.AppUserId)
            {
                return Unauthorized("You are not authorized to delete this portfolio.");
            }
            _unitOfWork.PortfolioRepository.DeletePortfolio(portfolioFromDb);
            if (await _unitOfWork.Complete()) return Ok();

            return BadRequest("Error deleting the portfolio.");
        }


        [HttpGet("{id}", Name = "GetPortfolioByIdAsync")]
        public async Task<Portfolio> GetPortfolioByIdAsync(int id)
        {
            return await _unitOfWork.PortfolioRepository.GetPortfolioByIdAsync(id);
        }
    }
}
