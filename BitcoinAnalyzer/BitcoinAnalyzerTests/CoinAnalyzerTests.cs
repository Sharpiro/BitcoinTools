using BitcoinAnalyzer;
using BitcoinAnalyzer.Models;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using System;
using System.Collections.Generic;

namespace BitcoinAnalyzerTests
{
    [TestClass]
    public class CoinAnalyzerTests
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
        private List<SpotEntry> _laterList = new List<SpotEntry>
        {
            new SpotEntry { Value = 5255, TimeStampUtc = DateTime.Parse("2017-01-01T08:12:13") },
            new SpotEntry { Value = 5300, TimeStampUtc = DateTime.Parse("2017-01-01T08:13:13") },
            new SpotEntry { Value = 6500, TimeStampUtc = DateTime.Parse("2017-01-01T08:13:13") },
            new SpotEntry { Value = 5300, TimeStampUtc = DateTime.Parse("2017-01-01T08:13:13") },
        };
        int _index = 0;

        public CoinAnalyzerTests()
        {

        }

        [TestMethod]
        public void MyTestMethod()
        {
            var spotEventRan = 0;
            var thresholdEventRan = 0;
            var coinbaseServiceMock = new Mock<ICoinbaseService>();
            coinbaseServiceMock.Setup(m => m.GetHourlyDataAsync(It.IsAny<CoinType>())).ReturnsAsync(_dataList);
            coinbaseServiceMock.Setup(m => m.GetSpotDataAsync(It.IsAny<CoinType>())).ReturnsAsync(GetNext);
            var coinAnalyzer = CoinAnalyzer.CreateWithHourlyData(CoinType.BTC, coinbaseServiceMock.Object).Result;
            coinAnalyzer.SpotEntryUpdate += (x, y) => spotEventRan++;
            coinAnalyzer.ThresholdReached += (x, y) => thresholdEventRan++;

            coinAnalyzer.Update().Wait();
            Assert.AreEqual(1, spotEventRan);
            Assert.AreEqual(1, thresholdEventRan);

            coinAnalyzer.Update().Wait();
            Assert.AreEqual(2, spotEventRan);
            Assert.AreEqual(1, thresholdEventRan);

            coinAnalyzer.Update().Wait();
            Assert.AreEqual(3, spotEventRan);
            Assert.AreEqual(2, thresholdEventRan);

            coinAnalyzer.Update().Wait();
            Assert.AreEqual(4, spotEventRan);
            Assert.AreEqual(3, thresholdEventRan);
        }

        private SpotEntry GetNext()
        {
            return _laterList[_index++];
        }
    }
}