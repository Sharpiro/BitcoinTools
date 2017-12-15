using System;
using System.Threading.Tasks;
using BitcoinAnalyzer.Models;

using static System.Console;

namespace BitcoinAnalyzer
{
    internal class Program
    {
        private static async Task Main(string[] args)
        {
            try
            {
                const int delaySeconds = 60;
                var coinbaseService = new CoinbaseService();

                var bitcoinAnalyzer = await CoinAnalyzer.CreateWithHourlyData(CoinType.BTC, coinbaseService);
                var ehtereumAnalyzer = await CoinAnalyzer.CreateWithHourlyData(CoinType.ETH, coinbaseService);
                var liteCoinAnalyzer = await CoinAnalyzer.CreateWithHourlyData(CoinType.LTC, coinbaseService);
       
                bitcoinAnalyzer.SpotEntryUpdate += OnSpotEntryUpdate;
                bitcoinAnalyzer.ThresholdReached += OnAlertThreshold;

                ehtereumAnalyzer.SpotEntryUpdate += OnSpotEntryUpdate;
                ehtereumAnalyzer.ThresholdReached += OnAlertThreshold;

                liteCoinAnalyzer.SpotEntryUpdate += OnSpotEntryUpdate;
                liteCoinAnalyzer.ThresholdReached += OnAlertThreshold;
                //Func<Metric, bool> function = metric => true;
                //Action<Metric, SpotEntry> action = (metric, entry) => { };
                //_btcList = (await _coinbaseService.GetHourlyDataAsync(CoinTypeX)).Reverse().ToList().ToLoopingList(MaxListLength);

                while (true)
                {
                    await bitcoinAnalyzer.Update();
                    //await ehtereumAnalyzer.Update();
                    //await liteCoinAnalyzer.Update();
                    await Task.Delay(TimeSpan.FromSeconds(delaySeconds));
                }
            }
            catch (Exception ex)
            {
                WriteLine(ex.Message);
                WriteLine(ex);
            }
            ReadKey();
        }

        private static void OnSpotEntryUpdate(SpotEntry spotEntry, Metric oldestNewestMetric)
        {
            WriteLine($"{spotEntry.CoinType}\t{spotEntry.TimeStampUtc:MM-ddTHH:mm:ss}\t{spotEntry.Value:C}\t\t{oldestNewestMetric.Difference}\t{oldestNewestMetric.PercentDifference:P2}\t");
        }

        private static void OnAlertThreshold(SpotEntry spotEntry, Metric oldestNewestMetric)
        {
            WriteLine("-------------------------MAJOR CHANGES------------------------------");
            WriteLine($"{spotEntry.CoinType}\t{spotEntry.TimeStampUtc:MM-ddTHH:mm:ss}\t{spotEntry.Value:C}\t\t{oldestNewestMetric.Difference}\t{oldestNewestMetric.PercentDifference:P2}\t");
        }

        //var oneHourAgo = _btcList.Reverse().FirstOrDefault(i => i.TimeStampUtc <= _btcList.Tail.TimeStampUtc.Subtract(TimeSpan.FromHours(1)));
        //if (oneHourAgo != null)
        //{
        //    var lastHourMetric = Metric.Create(oneHourAgo, newest);
        //    if (lastHourMetric.PercentDifference > .05 || lastHourMetric.PercentDifference < -.05)
        //    {
        //        WriteLine("hourly");
        //        WriteLine($"{spotEntry.TimeStampUtc:MM-ddTHH:mm:ss}\t{newest.Value:C}\t{lastHourMetric.Difference}\t{lastHourMetric.PercentDifference:P2}\t");
        //    }
        //}
        //}
        //}
    }
}