using BitcoinAnalyzer.CustomDataStructures;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Linq;

namespace BitcoinAnalyzerTests.DataStructureTests
{
    [TestClass]
    public class LoopingListTests
    {
        [TestMethod]
        public void LoopingArray1()
        {
            var list = new LoopingList<int>(5);

            for (var i = 1; i <= 5; i++)
            {
                list.Add(i);
            }

            Assert.AreEqual(1, list.Head);
            Assert.AreEqual(5, list.Tail);
        }

        [TestMethod]
        public void LoopingArray2()
        {
            var list = new LoopingList<int>(5);

            for (var i = 1; i <= 8; i++)
            {
                list.Add(i);
            }

            Assert.AreEqual(4, list.Head);
            Assert.AreEqual(8, list.Tail);
        }

        [TestMethod]
        public void LoopingArrayBig()
        {
            var list = new LoopingList<int>(2036);

            for (var i = 1; i <= 9684; i++)
            {
                list.Add(i);
            }

            Assert.AreEqual(2048, list.CurrentArraySize);
            Assert.AreEqual(7649, list.Head);
            Assert.AreEqual(9684, list.Tail);
        }

        [TestMethod]
        public void SizeOfOneTest()
        {
            var list = new LoopingList<int>(1);

            for (var i = 1; i <= 8; i++)
            {
                list.Add(i);
            }

            Assert.AreEqual(8, list.Head);
            Assert.AreEqual(8, list.Tail);
        }

        [TestMethod]
        public void SizeOfZeroTest()
        {
            Assert.ThrowsException<ArgumentOutOfRangeException>(() =>
            {
                var list = new LoopingList<int>(0);
            });
        }

        [TestMethod]
        public void SmallerThanMaxTest()
        {
            var queue = new LoopingList<int>(5);

            for (var i = 1; i <= 4; i++)
            {
                queue.Add(i);
            }

            Assert.AreEqual(1, queue.Head);
            Assert.AreEqual(4, queue.Tail);
        }

        [TestMethod]
        public void EnumerableTest()
        {
            var queue = new LoopingList<int>(3);

            Assert.AreEqual(0, queue.CurrentLength);
            for (var i = 1; i <= 6; i++)
            {
                queue.Add(i);
            }

            var list = queue.Where(x => true).ToList();

            Assert.AreEqual(4, list[0]);
            Assert.AreEqual(5, list[1]);
            Assert.AreEqual(6, list[2]);
            Assert.AreEqual(3, queue.CurrentLength);
        }

        [TestMethod]
        public void SmallEnumerableTest()
        {
            var queue = new LoopingList<int>(3);

            var list = queue.Where(x => true).ToList();
            Assert.AreEqual(0, queue.CurrentLength);
            Assert.AreEqual(0, list.Count);



            Assert.AreEqual(0, queue.CurrentLength);
            for (var i = 1; i <= 1; i++)
            {
                queue.Add(i);
            }

            list = queue.Where(x => true).ToList();

            Assert.AreEqual(1, list[0]);
            Assert.AreEqual(1, queue.CurrentLength);
        }
    }
}