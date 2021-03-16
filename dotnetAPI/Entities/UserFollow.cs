using API.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DotnetApi.Entities
{
    public class UserFollow
    {
        public AppUser SourceUser { get; set; }
        public int SourceUserId { get; set; }
        public AppUser FollowedUser { get; set; }
        public int FollowedUserId { get; set; }
    }
}
