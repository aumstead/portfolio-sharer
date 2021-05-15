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
        private readonly IUnitOfWork _unitOfWork;

        public FollowsController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        [HttpPost("{username}")]
        public async Task<ActionResult> AddFollow(string username)
        {
            var sourceUserId = User.GetUserId();
            var followedUser = await _unitOfWork.UserRepository.GetUserByUsernameAsync(username);
            var sourceUser = await _unitOfWork.FollowsRepository.GetUserWithFollowings(sourceUserId);

            if (followedUser == null) return NotFound();
            if (sourceUser.UserName == username) return BadRequest("You cannot follow yourself.");

            var userFollow = await _unitOfWork.FollowsRepository.GetUserFollow(sourceUserId, followedUser.Id);
            if (userFollow != null) return BadRequest("You already follow this user.");

            userFollow = new UserFollow
            {
                SourceUserId = sourceUserId,
                FollowedUserId = followedUser.Id
            };

            sourceUser.Following.Add(userFollow);

            if (await _unitOfWork.Complete()) return Ok();

            return BadRequest("Failed to follow.");
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<FollowDto>>> GetUserFollows(string predicate)
        {
            var users = await _unitOfWork.FollowsRepository.GetUserFollows(predicate, User.GetUserId());
            return Ok(users);
        }

        [HttpDelete("{id:int}")]
        public async Task<ActionResult> DeleteFollow(int id)
        {
            if (id < 1)
            {
                return BadRequest("Error deleting. Invalid ID.");
            }
            var userId = User.GetUserId();
            
            var followFromDb = await _unitOfWork.FollowsRepository.GetUserFollow(userId, id);
            if (followFromDb == null)
            {
                return BadRequest("Error deleting. Follow not found.");
            }
            if (userId != followFromDb.SourceUserId)
            {
                return Unauthorized("You are not authorized to delete this portfolio.");
            }
            _unitOfWork.FollowsRepository.RemoveFollow(followFromDb);
            if (await _unitOfWork.Complete()) return Ok();

            return BadRequest("Error deleting the portfolio.");
        }
    }
}
