using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace API.Entities
{
    public class Portfolio
    {
        public int Id { get; set; }

        [Required, MaxLength(40, ErrorMessage = "Please use a name with fewer than 40 characters.")]
        public string Name { get; set; }

        [JsonIgnore]
        public DateTime LastUpdated { get; set; } = DateTime.Now;

        [JsonIgnore]
        public AppUser AppUser { get; set; }
        public int AppUserId { get; set; }
        public ICollection<Position> Positions { get; set; }
    }
}