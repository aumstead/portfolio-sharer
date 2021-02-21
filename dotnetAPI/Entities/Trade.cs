using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    public class Trade
    {
        public int Id { get; set; }

        [Required]
        public string Ticker { get; set; }
        public TransactionType TradeType { get; set; }

        [Column(TypeName = "decimal(12, 2)")]
        [Required]
        public decimal Shares { get; set; }

        [Column(TypeName = "money")]
        public decimal PricePerShare { get; set; }

        [Column(TypeName = "money")]
        public decimal? CommissionFee { get; set; }

        public DateTime? TransactionDate { get; set; }

        public AppUser AppUser { get; set; }
        public int AppUserId { get; set; }
        public Position Position { get; set; }
        public int? PositionId { get; set; }

    }
}