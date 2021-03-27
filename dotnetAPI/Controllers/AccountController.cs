using API.Data;
using API.Entities;
using AutoMapper;
using DotnetApi.DTOs;
using DotnetApi.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace DotnetApi.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;

        public AccountController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, ITokenService tokenService, IMapper mapper)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _tokenService = tokenService;
            _mapper = mapper;
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if (await EmailExists(registerDto.Email)) return BadRequest(new { type = "email", message = "That email is already in use." });

            if (await UsernameExists(registerDto.Username)) return BadRequest(new { type = "username", message = "That username is already in use." });

            if (registerDto.DateOfBirth == new DateTime()) return BadRequest(new { type = "birthday", message = "A date of birth is required." });

            var user = _mapper.Map<AppUser>(registerDto);

            Random rndmInt = new Random();
            var imageFileName = rndmInt.Next(1, 17);

            var image = new Photo
            {
                Url = "/assets/thumbs/" + imageFileName + ".jpg",
                PublicId = null
            };

            user.Email = registerDto.Email.ToLower();
            user.UserName = registerDto.Username.ToLower();
            user.Photo = image;

            var result = _userManager.CreateAsync(user, registerDto.Password);

            if (!result.Result.Succeeded) return BadRequest(result.Result.Errors);

            var roleResult = await _userManager.AddToRoleAsync(user, "Member");
            if (!roleResult.Succeeded) return BadRequest(result.Result.Errors);

            return new UserDto { Username = user.UserName, Token = await _tokenService.CreateToken(user), PhotoUrl = user.Photo.Url };
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _userManager.Users
                .Include(u => u.Photo)
                .SingleOrDefaultAsync(user => user.UserName == loginDto.Username.ToLower());

            if (user == null) return Unauthorized(new { source = "login", type = "username" });

            if (loginDto.Password == "" | loginDto.Password == null) return Unauthorized(new { source = "login", type = "password" });

            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);

            if (!result.Succeeded) return Unauthorized(new { source = "login", type = "password" });

            return new UserDto { Username = user.UserName, Token = await _tokenService.CreateToken(user), PhotoUrl = user.Photo?.Url };
        }

        private async Task<bool> UsernameExists(string username)
        {
            return await _userManager.Users.AnyAsync(user => user.UserName == username.ToLower());
        }

        private async Task<bool> EmailExists(string email)
        {
            return await _userManager.Users.AnyAsync(user => user.Email == email.ToLower());
        }
    }
}
