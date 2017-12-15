using System;

namespace BitcoinAnalyzer.Models
{
    public class SpotEntry
    {
        public CoinType CoinType { get; set; }
        public float Value { get; set; }
        public DateTime TimeStampUtc { get; set; } = DateTime.UtcNow;
    }

    public enum CoinType
    {
        NONE,
        BTC,
        ETH,
        LTC
    }
}