using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace DotnetApi.Data.Migrations
{
    public partial class AddMessageReadProperty : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "DateRead",
                table: "Messages",
                type: "datetime2",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DateRead",
                table: "Messages");
        }
    }
}
