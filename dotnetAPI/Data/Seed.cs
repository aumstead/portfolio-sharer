using API.Data;
using API.Entities;
using DotnetApi.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Text.Json;
using System.Threading.Tasks;

namespace DotnetApi.Data
{
    public class Seed
    {
        public static async Task SeedUsers(UserManager<AppUser> userManager, RoleManager<AppRole> roleManager)
        {
            if (await userManager.Users.AnyAsync()) return;

            var usersData = await System.IO.File.ReadAllTextAsync("Data/UserSeedData.json");

            var users = JsonSerializer.Deserialize<List<AppUser>>(usersData);
            if (users == null) return;

            var roles = new List<AppRole>
            {
                new AppRole{Name = "Member"},
                new AppRole{Name = "Admin"},
                new AppRole{Name = "Moderator"},
            };

            foreach (var role in roles)
            {
                await roleManager.CreateAsync(role);
            }

            foreach (var user in users)
            {
                user.UserName = user.UserName.ToLower();

                await userManager.CreateAsync(user, "Gandalf1");
                await userManager.AddToRoleAsync(user, "Member");
            }

            var admin = new AppUser
            {
                UserName = "admin"
            };

            await userManager.CreateAsync(admin, "Gandalf1");
            await userManager.AddToRolesAsync(admin, new[] { "Admin", "Moderator" });
        }

        public static async Task SeedPortfolios(DataContext context)
        {
            if (await context.Portfolios.AnyAsync()) return;

            var portfoliosData = await System.IO.File.ReadAllTextAsync("Data/PortfolioSeedData.json");

            var portfolios = JsonSerializer.Deserialize<List<Portfolio>>(portfoliosData);

            foreach (var portfolio in portfolios)
            {
                context.Portfolios.Add(portfolio);
            }

            await context.SaveChangesAsync();
        }

        public static async Task SeedPositions(DataContext context)
        {
            if (await context.Positions.AnyAsync()) return;

            var positionsData = await System.IO.File.ReadAllTextAsync("Data/PositionSeedData.json");

            var positions = JsonSerializer.Deserialize<List<Position>>(positionsData);

            foreach (var position in positions)
            {
                position.CostBasis = position.Shares * position.PricePerShare;
                if (position.CommissionFee != null)
                {
                    position.CostBasis = (decimal)(position.CostBasis + position.CommissionFee);
                }
                context.Positions.Add(position);
            }

            await context.SaveChangesAsync();
        }

    }
}
