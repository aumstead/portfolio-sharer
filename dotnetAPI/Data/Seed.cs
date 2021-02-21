using API.Data;
using API.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace DotnetApi.Data
{
    public class Seed
    {
        public static async Task SeedUsers(DataContext context)
        {
            if (await context.Users.AnyAsync()) return;

            var usersData = await System.IO.File.ReadAllTextAsync("Data/UserSeedData.json");

            var users = JsonSerializer.Deserialize<List<AppUser>>(usersData);

            foreach (var user in users)
            {
                using var hmac = new HMACSHA512();

                user.UserName = user.UserName.ToLower();
                user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes("Gandalf1"));
                user.PasswordSalt = hmac.Key;

                context.Users.Add(user);

            }

            await context.SaveChangesAsync();
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
                context.Positions.Add(position);
            }

            await context.SaveChangesAsync();
        }

    }
}
