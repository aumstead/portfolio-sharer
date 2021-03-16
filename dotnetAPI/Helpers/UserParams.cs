using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DotnetApi.Helpers
{
    public class UserParams : PaginationParams
    {
        public string CurrentUsername { get; set; }
        public int MinAge { get; set; } = 13;
        public int MaxAge { get; set; } = 150;
        public string OrderBy { get; set; } = "lastActive";
        public bool Following { get; set; } = false;
    }
}
