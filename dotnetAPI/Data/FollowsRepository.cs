using API.Data;
using API.Entities;
using DotnetApi.DTOs;
using DotnetApi.Entities;
using DotnetApi.Extensions;
using DotnetApi.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DotnetApi.Data
{
    public class FollowsRepository : IFollowsRepository
    {
        private readonly DataContext _context;

        public FollowsRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<UserFollow> GetUserFollow(int sourceUserId, int followedUserId)
        {
            return await _context.Follows.FindAsync(sourceUserId, followedUserId);
        }

        public async Task<IEnumerable<FollowDto>> GetUserFollows(string predicate, int userId)
        {
            var users = _context.Users.OrderBy(u => u.UserName).AsQueryable();
            var follows = _context.Follows.AsQueryable();

            if (predicate == "following")
            {
                follows = follows.Where(follow => follow.SourceUserId == userId);
                users = follows.Select(follow => follow.FollowedUser);
            }

            if (predicate == "followers")
            {
                follows = follows.Where(follow => follow.FollowedUserId == userId);
                users = follows.Select(follow => follow.SourceUser);
            }

            return await users.Select(user => new FollowDto
            {
                Username = user.UserName,
                Age = user.DateOfBirth.CalculateAge(),
                PhotoUrl = user.Photo.Url,
            }).ToListAsync();
        }

        public async Task<AppUser> GetUserWithFollowings(int userId)
        {
            return await _context.Users
                .Include(x => x.Following)
                .FirstOrDefaultAsync(u => u.Id == userId);
        }

        public void RemoveFollow(UserFollow userFollow)
        {
            _context.Follows.Remove(userFollow);
        }
    }
}
