using API.Entities;
using DotnetApi.DTOs;
using DotnetApi.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DotnetApi.Interfaces
{
    public interface IUserRepository
    {
        Task<PagedList<AppUser>> GetUsersAsync(UserParams userParams);
        Task<AppUser> GetUserByIdAsync(int id);
        Task<AppUser> GetUserWithPortfoliosAsync(int id);
        Task<AppUser> GetUserByUsernameAsync(string username);
        void Update(AppUser user);
    }
}
