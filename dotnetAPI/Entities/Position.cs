using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace API.Entities
{
    public class Position
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(10, ErrorMessage = "Cannot exceed 10 characters")]
        public string Ticker { get; set; }

        [Column(TypeName = "decimal(12, 2)")]
        [Required]
        public decimal Shares { get; set; }

        [Column(TypeName = "money")]
        public decimal PricePerShare { get; set; }

        [Column(TypeName = "money")]
        public decimal? CommissionFee { get; set; }

        [JsonIgnore]
        public Portfolio Portfolio { get; set; }
        public int PortfolioId { get; set; }

    }
}