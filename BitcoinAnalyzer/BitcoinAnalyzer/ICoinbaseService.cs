using System.Collections.Generic;
using System.Threading.Tasks;
using BitcoinAnalyzer.Models;

namespace BitcoinAnalyzer
{
    public interface ICoinbaseService
    {
        Task<IEnumerable<SpotEntry>> GetHourlyDataAsync(CoinType coinType);
        Task<SpotEntry> GetSpotDataAsync(CoinType coinType);
    }
}