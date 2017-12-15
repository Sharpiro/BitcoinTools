using BitcoinAnalyzer.Models;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Linq;

namespace BitcoinAnalyzerTests
{
    [TestClass]
    public class MetricsTests
    {
        private List<SpotEntry> _dataList = new List<SpotEntry>
        {
            new SpotEntry{ Value=5000, TimeStampUtc=DateTime.Parse("2017-01-01T05:12:13") },
            new SpotEntry{ Value=5100, TimeStampUtc=DateTime.Parse("2017-01-01T05:13:13") },
            new SpotEntry{ Value=5200, TimeStampUtc=DateTime.Parse("2017-01-01T05:14:13") },
            new SpotEntry{ Value=6100, TimeStampUtc=DateTime.Parse("2017-01-01T05:15:13") },
            new SpotEntry{ Value=7300, TimeStampUtc=DateTime.Parse("2017-01-01T05:16:13") },
            new SpotEntry{ Value=9000, TimeStampUtc=DateTime.Parse("2017-01-01T06:12:13") },
            new SpotEntry{ Value=5200, TimeStampUtc=DateTime.Parse("2017-01-01T06:13:13") },
            new SpotEntry{ Value=5200, TimeStampUtc=DateTime.Parse("2017-01-01T07:12:13") }
        };

        [TestMethod]
        public void OldestNewestTest()
        {
            var loopingList = _dataList.ToLoopingList(10);

            var oldest = loopingList.Head;
            var newest = loopingList.Tail;
            var oldestNewestMetric = Metric.Create(oldest, newest);

            Assert.AreEqual(200, oldestNewestMetric.Difference);
            Assert.AreEqual(.04, Math.Round(oldestNewestMetric.PercentDifference, 2));
        }


        [TestMethod]
        public void NewestPastHourTest()
        {
            var loopingList = _dataList.ToLoopingList(10);

            var oldest = loopingList.Reverse().FirstOrDefault(i => i.TimeStampUtc <= loopingList.Tail.TimeStampUtc.Subtract(TimeSpan.FromHours(1)));
            var newest = loopingList.Tail;
            var pastHourMetric = Metric.Create(oldest, newest);

            Assert.AreEqual(-3800, pastHourMetric.Difference);
            Assert.AreEqual(-.42, Math.Round(pastHourMetric.PercentDifference, 2));
        }
    }
}