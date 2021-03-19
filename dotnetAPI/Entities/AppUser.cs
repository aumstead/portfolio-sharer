using DotnetApi.Entities;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace API.Entities
{
    public class AppUser : IdentityUser<int>
    {
        public DateTime DateOfBirth { get; set; }
        public DateTime Created { get; set; } = DateTime.Now;
        public DateTime LastActive { get; set; } = DateTime.Now;

        [MaxLength(50, ErrorMessage = "Cannot exceed 50 characters")]
        public string City { get; set; }

        [MaxLength(50, ErrorMessage = "Cannot exceed 50 characters")]
        public string Country { get; set; }
        public Photo Photo { get; set; }
        public ICollection<Portfolio> Portfolios { get; set; }


        [MaxLength(500, ErrorMessage = "There is a 500 character limit")]
        public string InvestingStrategySummary { get; set; }


        public ICollection<UserFollow> Followers { get; set; }
        public ICollection<UserFollow> Following { get; set; }
        public ICollection<Message> MessagesSent { get; set; }
        public ICollection<Message> MessagesReceived { get; set; }

        public ICollection<AppUserRole> UserRoles { get; set; }

        //public ICollection<Trade> TradeHistory { get; set; }
        //public InvestingInterests InvestingInterests { get; set; }
        //public ICollection<Follow> Followers { get; set; }
        //public ICollection<Follow> Following { get; set; }
        //public ICollection<Dividend> Dividends { get; set; }
        //public Vehicle VehicleTags { get; set; }
        //public Interest InterestTags { get; set; }
    }
}
