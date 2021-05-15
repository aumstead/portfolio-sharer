using API.Data;
using API.Entities;
using AutoMapper;
using DotnetApi.Controllers;
using DotnetApi.DTOs;
using DotnetApi.Extensions;
using DotnetApi.Helpers;
using DotnetApi.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace API.Controllers
{
    [Authorize]
    public class UsersController : BaseApiController
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IPhotoService _photoService;

        public UsersController(IUnitOfWork unitOfWork, IMapper mapper, IPhotoService photoService)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _photoService = photoService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AppUserDto>>> GetUsers([FromQuery]UserParams userParams)
        {
            userParams.CurrentUsername = User.GetUsername();
            var users = await _unitOfWork.UserRepository.GetUsersAsync(userParams);
            var usersToReturn = _mapper.Map<IEnumerable<AppUserDto>>(users);
            Response.AddPaginationHeader(users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPages);
            return Ok(usersToReturn);
        }

        [HttpGet("positions/{username}", Name = "GetUserPositions")]
        public async Task<ActionResult<AppUserDto>>GetUserPositions(string username)
        {
            //var symbols = new List<string>();
            var user = await _unitOfWork.UserRepository.GetUserPositionsAsync(username);
            //foreach (var portfolio in user.Portfolios)
            //{
            //    foreach (var position in portfolio.Positions)
            //    {
            //        symbols.Add(position.Ticker);
            //    }
            //}
            return _mapper.Map<AppUserDto>(user);
        }

        //[HttpGet("{username/dividends}", Name = "GetUserDividends")]
        //public async Task<ActionResult<AppUserDto>> GetUserDividends(string username)
        //{
        //    var user = await _unitOfWork.UserRepository.GetUserDividendsAsync(username);
        //    return _mapper.Map<AppUserDto>(user);
        //}

        [HttpPut]
        public async Task<ActionResult> UpdateUser(AppUserUpdateDto appUserUpdateDto)
        {
            
            var user = await _unitOfWork.UserRepository.GetUserByUsernameAsync(User.GetUsername());
            _mapper.Map(appUserUpdateDto, user);
            _unitOfWork.UserRepository.Update(user);
            if (await _unitOfWork.Complete()) return NoContent();

            return BadRequest();
        }

        [HttpPost("add-photo")]
        public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file)
        {
            var user = await _unitOfWork.UserRepository.GetUserByUsernameAsync(User.GetUsername());

            if (user == null) return BadRequest("Could not get user from database.");

            var result = await _photoService.AddPhotoAsync(file);

            if (result.Error != null) return BadRequest(result.Error.Message);

            if (user.Photo.PublicId != null)
            {
                // then delete the old photo from cloudinary
                var cloudinaryResult = await _photoService.DeletePhotoAsync(user.Photo.PublicId);
                if (cloudinaryResult.Error != null) return BadRequest(cloudinaryResult.Error.Message);
            }

            var photo = new Photo
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId
            };

            user.Photo = photo;

            if (await _unitOfWork.Complete())
            {
                return CreatedAtRoute("GetUser", new { username = user.UserName }, _mapper.Map<PhotoDto>(photo));
            }

            return BadRequest("Problem adding photo");
        }

    }
}
