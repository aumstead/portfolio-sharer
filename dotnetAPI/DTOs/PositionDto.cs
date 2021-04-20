using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace DotnetApi.DTOs
{
    public class PositionDto
    {
        public int Id { get; set; }

        [Required]
        [StringLength(maximumLength: 10, ErrorMessage = "Ticker symbol is too long")]
        public string Ticker { get; set; }

        [Required]
        [RegularExpression(@"((\d+)((\.\d{1,2})?))$", ErrorMessage = "Only 2 decimal places allowed.")]
        [Range(0, 9999999999.99, ErrorMessage = "12 digit maximum")]
        public decimal Shares { get; set; }

        [Required]
        [RegularExpression(@"((\d+)((\.\d{1,2})?))$", ErrorMessage = "Only 2 decimal places allowed.")]
        [Range(0, 9999999999.99, ErrorMessage = "12 digit maximum")]
        public decimal PricePerShare { get; set; }

        [RegularExpression(@"((\d+)((\.\d{1,2})?))$", ErrorMessage = "Only 2 decimal places allowed.")]
        [Range(0, 9999999999.99, ErrorMessage = "12 digit maximum")]
        public decimal? CommissionFee { get; set; }        
    }

    public class CreatePositionDto {
        [Required]
        [StringLength(maximumLength: 10, ErrorMessage = "Ticker symbol is too long")]
        public string Ticker { get; set; }

        [Required]
        [RegularExpression(@"((\d+)((\.\d{1,2})?))$", ErrorMessage = "Only 2 decimal places allowed.")]
        [Range(0, 9999999999.99, ErrorMessage = "12 digit maximum")]
        public decimal Shares { get; set; }

        [Required]
        [RegularExpression(@"((\d+)((\.\d{1,2})?))$", ErrorMessage = "Only 2 decimal places allowed.")]
        [Range(0, 9999999999.99, ErrorMessage = "12 digit maximum")]
        public decimal PricePerShare { get; set; }

        [RegularExpression(@"((\d+)((\.\d{1,2})?))$", ErrorMessage = "Only 2 decimal places allowed.")]
        [Range(0, 9999999999.99, ErrorMessage = "12 digit maximum")]
        public decimal? CommissionFee { get; set; }

        [Required]
        public int PortfolioId { get; set; }
    }

    public class UpdatePositionDto : PositionDto
    {
    }
}
