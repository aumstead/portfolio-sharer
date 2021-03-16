using DotnetApi.DTOs;
using DotnetApi.Entities;
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
    public class FollowsController : BaseApiController
    {
        private readonly IUserRepository _userRepository;
        private readonly IFollowsRepository _followsRepository;

        public FollowsController(IUserRepository userRepository, IFollowsRepository followsRepository)
        {
            _userRepository = userRepository;
            _followsRepository = followsRepository;
        }

        [HttpPost("{username}")]
        public async Task<ActionResult> AddFollow(string username)
        {
            var sourceUserId = User.GetUserId();
            var followedUser = await _userRepository.GetUserByUsernameAsync(username);
            var sourceUser = await _followsRepository.GetUserWithFollowings(sourceUserId);

            if (followedUser == null) return NotFound();
            if (sourceUser.UserName == username) return BadRequest("You cannot follow yourself.");

            var userFollow = await _followsRepository.GetUserFollow(sourceUserId, followedUser.Id);
            if (userFollow != null) return BadRequest("You already follow this user.");

            userFollow = new UserFollow
            {
                SourceUserId = sourceUserId,
                FollowedUserId = followedUser.Id
            };

            sourceUser.Following.Add(userFollow);

            if (await _userRepository.SaveAllAsync()) return Ok();

            return BadRequest("Failed to follow.");
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<FollowDto>>> GetUserFollows(string predicate)
        {
            var users = await _followsRepository.GetUserFollows(predicate, User.GetUserId());
            return Ok(users);
        }
    }
}
