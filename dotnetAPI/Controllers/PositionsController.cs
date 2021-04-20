using API.Entities;
using AutoMapper;
using DotnetApi.DTOs;
using DotnetApi.Extensions;
using DotnetApi.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DotnetApi.Controllers
{
    [Authorize]
    public class PositionsController : BaseApiController
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public PositionsController(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        [HttpPost]
        public async Task<IActionResult> CreatePosition([FromBody] CreatePositionDto createPositionDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = User.GetUserId();
            var portfolio = await _unitOfWork.PortfolioRepository.GetPortfolioWithPositionsAsync(createPositionDto.PortfolioId);

            if (portfolio.AppUserId != userId)
            {
                return Unauthorized("You are not authorized to add a position to this portfolio.");
            }

            foreach (var p in portfolio.Positions)
            {
                if (p.Ticker == createPositionDto.Ticker)
                {
                    return BadRequest("Ticker symbol is already present in the portfolio.");
                }
            }

            createPositionDto.Ticker = createPositionDto.Ticker.ToUpper();

            var position = _mapper.Map<Position>(createPositionDto);

            position.CostBasis = position.Shares * position.PricePerShare;
            if (position.CommissionFee != null)
            {
                position.CostBasis = (decimal)(position.CostBasis + position.CommissionFee);
            }

            await _unitOfWork.PositionRepository.CreatePosition(position);

            if (await _unitOfWork.Complete()) return CreatedAtRoute("GetPositionByIdAsync", new { id = position.Id }, position);
            return BadRequest();
        }

        [HttpPut]
        public async Task<ActionResult> UpdatePosition([FromBody] UpdatePositionDto updatePositionDto)
        {
            if (!ModelState.IsValid || updatePositionDto.Id < 1)
            {
                return BadRequest(ModelState);
            }
            var position = await _unitOfWork.PositionRepository.GetPositionByIdAsync(updatePositionDto.Id);
            if (position == null)
            {
                return BadRequest("Submitted data is invalid.");
            }
            var userId = User.GetUserId();
            var portfolio = await _unitOfWork.PortfolioRepository.GetPortfolioByIdAsync(position.PortfolioId);
            if (userId != portfolio.AppUserId)
            {
                return Unauthorized("You are not authorized to edit this position.");
            }
            _mapper.Map(updatePositionDto, position);
            _unitOfWork.PositionRepository.UpdatePosition(position);
            if (await _unitOfWork.Complete()) return NoContent();

            return BadRequest();
        }

        [HttpGet("{id}", Name = "GetPositionByIdAsync")]
        public async Task<Position> GetPositionByIdAsync(int id)
        {
            return await _unitOfWork.PositionRepository.GetPositionByIdAsync(id);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeletePosition(int id)
        {
            if (id < 1)
            {
                return BadRequest("Error deleting. Invalid ID.");
            }
            var positionFromDb = await _unitOfWork.PositionRepository.GetPositionByIdAsync(id);
            if (positionFromDb == null)
            {
                return BadRequest("Error deleting. Position not found.");
            }
            var userId = User.GetUserId();
            var portfolio = await _unitOfWork.PortfolioRepository.GetPortfolioByIdAsync(positionFromDb.PortfolioId);
            if (userId != portfolio.AppUserId)
            {
                return Unauthorized("You are not authorized to delete this position.");
            }
            _unitOfWork.PositionRepository.DeletePosition(positionFromDb);
            if (await _unitOfWork.Complete()) return Ok();

            return BadRequest("Error deleting the position.");
        }
    }
}
