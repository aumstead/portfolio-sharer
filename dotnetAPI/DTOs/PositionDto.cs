using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DotnetApi.DTOs
{
    public class PositionDto
    {
        public int Id { get; set; }

        public string Ticker { get; set; }

        public decimal Shares { get; set; }

        public decimal PricePerShare { get; set; }

        public decimal? CommissionFee { get; set; }

    }
}
