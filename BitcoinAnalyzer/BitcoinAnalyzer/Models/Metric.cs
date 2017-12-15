using System;

namespace BitcoinAnalyzer.Models
{
    public class Metric
    {
        public float Difference { get; set; }
        public float PercentDifference { get; set; }

        public static Metric Create(SpotEntry oldest, SpotEntry newest)
        {
            var metric = new Metric
            {
                Difference = (float)Math.Round(newest.Value - oldest.Value, 2),
                PercentDifference = (newest.Value / oldest.Value) - 1,
            };
            return metric;
        }
    }
}