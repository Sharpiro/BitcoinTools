using BitcoinAnalyzer.CustomDataStructures;
using BitcoinAnalyzer.Models;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace BitcoinAnalyzer
{
    public class CoinAnalyzer
    {
        private const int MaxListLength = 1000;
        private const float AlertChange = .05f;

        private readonly CoinType _coinType;
        private readonly ICoinbaseService _coinbaseService;
        private static float _positiveAlertThreshold = .05f;
        private static float _negativeAlertThreshold = -.05f;

        private IHeadAndTailList<SpotEntry> _btcList = new LoopingList<SpotEntry>(MaxListLength);
        private float _lastEntry = 0;

        public event Action<SpotEntry, Metric> SpotEntryUpdate;
        public event Action<SpotEntry, Metric> ThresholdReached;

        private CoinAnalyzer(CoinType coinType, ICoinbaseService coinbaseService)
        {
            _coinType = coinType;
            _coinbaseService = coinbaseService;
        }

        private async Task InitializeHourlyData()
        {
            _btcList = (await _coinbaseService.GetHourlyDataAsync(_coinType)).OrderBy(s => s.TimeStampUtc).ToList().ToLoopingList(MaxListLength);
        }

        public async Task Update()
        {
            var spotEntry = await _coinbaseService.GetSpotDataAsync(_coinType);
            if (_btcList.CurrentLength != 0 && _lastEntry == spotEntry.Value) return;

            _btcList.Add(spotEntry);
            _lastEntry = spotEntry.Value;

            var oldest = _btcList.Head;
            var newest = _btcList.Tail;
            var oldestNewestMetric = Metric.Create(oldest, newest);
            SpotEntryUpdate?.Invoke(spotEntry, oldestNewestMetric);

            CheckAlertThreshold(spotEntry, oldestNewestMetric);
        }

        private void CheckAlertThreshold(SpotEntry spotEntry, Metric oldestNewestMetric)
        {
            if (oldestNewestMetric.PercentDifference > _positiveAlertThreshold)
            {
                ThresholdReached?.Invoke(spotEntry, oldestNewestMetric);
                _positiveAlertThreshold += AlertChange;
                _negativeAlertThreshold += AlertChange;
            }
            else if (oldestNewestMetric.PercentDifference < _negativeAlertThreshold)
            {
                ThresholdReached?.Invoke(spotEntry, oldestNewestMetric);
                _negativeAlertThreshold -= AlertChange;
                _positiveAlertThreshold -= AlertChange;
            }
        }

        public static async Task<CoinAnalyzer> CreateWithHourlyData(CoinType coinType, ICoinbaseService coinbaseService)
        {
            var coinAnalyzer = new CoinAnalyzer(coinType, coinbaseService);
            await coinAnalyzer.InitializeHourlyData();
            return coinAnalyzer;
        }
    }
}