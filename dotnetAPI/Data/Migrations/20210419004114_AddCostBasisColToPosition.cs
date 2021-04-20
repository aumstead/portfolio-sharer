using Microsoft.EntityFrameworkCore.Migrations;

namespace DotnetApi.Data.Migrations
{
    public partial class AddCostBasisColToPosition : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "CostBasis",
                table: "Positions",
                type: "money",
                nullable: false,
                defaultValue: 0m);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CostBasis",
                table: "Positions");
        }
    }
}
