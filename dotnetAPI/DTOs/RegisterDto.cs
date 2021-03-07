using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace DotnetApi.DTOs
{
    public class RegisterDto
    {
        [Required(ErrorMessage = "An email address is required.")]
        [EmailAddress(ErrorMessage = "You seem to have entered an invalid email address.")]
        public string Email { get; set; }

        [Required(ErrorMessage = "A username is required.")]
        public string Username { get; set; }

        [Required(ErrorMessage = "Your account needs a password!")]
        [StringLength(8, MinimumLength = 4)]
        public string Password { get; set; }
    }
}
