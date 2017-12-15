using BitcoinAnalyzer.Models;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;

namespace BitcoinAnalyzer
{
    public class CoinbaseService : ICoinbaseService
    {
        public async Task<IEnumerable<SpotEntry>> GetHourlyDataAsync(CoinType coinType)
        {
            var url = $"https://api.coinbase.com/v2/prices/{coinType}-USD/historic?period=hour";
            var json = await GetAsync(url);
            var hourlyData = JObject.Parse(json).SelectToken("data.prices")
             .Select(token => new SpotEntry
             {
                 CoinType = coinType,
                 Value = (float)token["price"],
                 TimeStampUtc = (DateTime)token["time"]
             });

            return hourlyData;
        }

        public async Task<SpotEntry> GetSpotDataAsync(CoinType coinType)
        {
            var url = $"https://api.coinbase.com/v2/prices/{coinType}-USD/spot";
            var json = await GetAsync(url);
            var jObject = JObject.Parse(json)["data"];
            var spotEntry = new SpotEntry
            {
                CoinType = (CoinType)Enum.Parse(typeof(CoinType), (string)jObject["base"]),
                Value = (float)jObject["amount"]
            };
            return spotEntry;
        }

        private async Task<string> GetAsync(string url)
        {
            var client = new HttpClient(new HttpClientHandler { AutomaticDecompression = DecompressionMethods.GZip });
            var request = new HttpRequestMessage(HttpMethod.Get, url);
            request.Headers.Add("Pragma", "no-cache");
            request.Headers.Add("Cache-Control", "no-cache");
            request.Headers.Add("accept", "application/json");
            request.Headers.Add("Accept-Encoding", "gzip");
            var response = await client.SendAsync(request);
            var content = await response.Content.ReadAsStringAsync();
            return content;
        }
    }
}
