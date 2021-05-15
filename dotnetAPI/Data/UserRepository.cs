using API.Data;
using API.Entities;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using DotnetApi.DTOs;
using DotnetApi.Helpers;
using DotnetApi.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DotnetApi.Controllers
{
    public class UserRepository : IUserRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public UserRepository(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<AppUser> GetUserByIdAsync(int id)
        {
            return await _context.Users.FindAsync(id);
        }

        public async Task<AppUser> GetUserPositionsAsync(string username)
        {
            return await _context.Users
                .Include(u => u.Photo)
                .Include(u => u.Portfolios)
                    .ThenInclude(p => p.Positions)
                .SingleOrDefaultAsync(u => u.UserName == username);
        }

        public async Task<AppUser> GetUserByUsernameAsync(string username)
        {
            return await _context.Users.Include(u=>u.Photo)
                .SingleOrDefaultAsync(u => u.UserName == username);
        }

        public async Task<PagedList<AppUser>> GetUsersAsync(UserParams userParams)
        {
            var query = _context.Users
            .Include(u => u.Photo)
            .Include(u => u.Portfolios)
            .ThenInclude(p => p.Positions)
            .AsNoTracking()
            .AsQueryable();

            query = query.Where(u => u.UserName != userParams.CurrentUsername);
            var minDob = DateTime.Today.AddYears(-userParams.MaxAge - 1);
            var maxDob = DateTime.Today.AddYears(-userParams.MinAge);

            if (userParams.MinAge != 13 || userParams.MaxAge != 150)
            {
                query = query.Where(u => u.DateOfBirth >= minDob && u.DateOfBirth <= maxDob);
            }

            if (userParams.Following)
            {
                var follows = _context.Follows.AsQueryable();
                follows = follows.Where(follow => follow.SourceUser.UserName == userParams.CurrentUsername);
                var followsList = await follows.Select(follow => follow.FollowedUser).ToListAsync();
                query = query.Where(u => followsList.Contains(u));
            }

            query = userParams.OrderBy switch
            {
                "created" => query.OrderByDescending(u => u.Created),
                _ => query.OrderByDescending(u => u.LastActive)
            };

            return await PagedList<AppUser>.CreateAsync(query, userParams.PageNumber, userParams.PageSize);
        }

        public async Task<AppUser> GetUserWithPortfoliosAsync(int id)
        {
            return await _context.Users.Include(u => u.Portfolios).SingleOrDefaultAsync(u => u.Id == id);
        }

        public void Update(AppUser user)
        {
            _context.Entry(user).State = EntityState.Modified;
        }

    }
}
