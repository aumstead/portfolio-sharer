using API.Entities;
using DotnetApi.DTOs;
using DotnetApi.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DotnetApi.Interfaces
{
    public interface IFollowsRepository
    {
        Task<UserFollow> GetUserFollow(int sourceUserId, int followedUserId);
        Task<AppUser> GetUserWithFollowings(int userId);
        Task<IEnumerable<FollowDto>> GetUserFollows(string predicate, int userId);
        void RemoveFollow(UserFollow userFollow);
    }
}
