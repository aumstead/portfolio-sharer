using API.Data;
using API.Entities;
using DotnetApi.DTOs;
using DotnetApi.Interfaces;
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
        private readonly DataContext _context;
        private readonly ITokenService _tokenService;

        public AccountController(DataContext context, ITokenService tokenService)
        {
            _context = context;
            _tokenService = tokenService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if (await EmailExists(registerDto.Email)) return BadRequest("That email address is already registered!");

            if (await UsernameExists(registerDto.Username)) return BadRequest("That username is already in use!");

            using var hmac = new HMACSHA512();

            var image = new Photo
            {
                Url = "/assets/orange.jpg",
                PublicId = null
            };

            var user = new AppUser
            {
                Email = registerDto.Email.ToLower(),
                UserName = registerDto.Username.ToLower(),
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password)),
                PasswordSalt = hmac.Key,
                Photo = image
            };

            _context.Users.Add(user);

            await _context.SaveChangesAsync();

            return new UserDto { Username = user.UserName, Token = _tokenService.CreateToken(user) };
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _context.Users.Include(u => u.Photo).SingleOrDefaultAsync(user => user.UserName == loginDto.Username);

            if (user == null) return Unauthorized(new { source = "login", type="username"});

            using var hmac = new HMACSHA512(user.PasswordSalt);

            if (loginDto.Password == "" | loginDto.Password == null) return Unauthorized(new { source = "login", type = "password" });

            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));

            for (int i = 0; i < computedHash.Length; i++)
            {
                if (computedHash[i] != user.PasswordHash[i]) return Unauthorized(new { source = "login", type="password"});
            }

            return new UserDto { Username = user.UserName, Token = _tokenService.CreateToken(user), PhotoUrl = user.Photo?.Url };
        }

        private async Task<bool> UsernameExists(string username)
        {
            return await _context.Users.AnyAsync(user => user.UserName == username.ToLower());
        }

        private async Task<bool> EmailExists(string email)
        {
            return await _context.Users.AnyAsync(user => user.Email == email.ToLower());
        }
    }
}
