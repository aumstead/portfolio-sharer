using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DotnetApi.DTOs
{
    public class AppUserUpdateDto
    {
        public string City { get; set; }
        public string Country { get; set; }
        public DateTime DateOfBirth { get; set; }

        public string InvestingStrategySummary { get; set; }
        //public Styles Style { get; set; }
    }
}
