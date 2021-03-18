using DotnetApi.Entities;
using DotnetApi.Extensions;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities
{
    public class AppUser
    {
        public int Id { get; set; }

        [Required, EmailAddress, RegularExpression(@"^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$", ErrorMessage = "A valid email is required"), MaxLength(50, ErrorMessage = "Please use an email with fewer than 50 characters.")]
        public string Email { get; set; }

        [Required, MaxLength(25, ErrorMessage = "Please create a username with fewer than 25 characters.")]
        public string UserName { get; set; }

        public byte[] PasswordHash { get; set; }
        public byte[] PasswordSalt { get; set; }

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

        //public ICollection<Trade> TradeHistory { get; set; }
        //public InvestingInterests InvestingInterests { get; set; }
        //public ICollection<Follow> Followers { get; set; }
        //public ICollection<Follow> Following { get; set; }
        //public ICollection<Dividend> Dividends { get; set; }
        //public Vehicle VehicleTags { get; set; }
        //public Interest InterestTags { get; set; }
    }
}
