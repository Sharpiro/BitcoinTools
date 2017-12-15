#pragma warning disable CS8602 // Possible dereference of a null reference.

using Microsoft.VisualStudio.TestTools.UnitTesting;
using BitcoinAnalyzer.CustomDataStructures;
using System.Linq;

namespace BitcoinAnalyzerTests.DataStructureTests
{
    [TestClass]
    public class LoopingLinkedListTests
    {
        [TestMethod]
        public void ListTest1()
        {
            var list = new LoopingLinkedList<int>(5);

            for (var i = 1; i <= 5; i++)
            {
                list.Add(i);
            }

            Assert.AreEqual(1, list.HeadNode.Data);
            Assert.AreEqual(2, list.HeadNode.Next.Data);
            Assert.AreEqual(3, list.HeadNode.Next.Next.Data);
            Assert.AreEqual(4, list.HeadNode.Next.Next.Next.Data);
            Assert.AreEqual(5, list.HeadNode.Next.Next.Next.Next.Data);

            list.Add(6);

            Assert.AreEqual(6, list.TailNode.Data);
            Assert.AreEqual(2, list.HeadNode.Data);
            Assert.AreEqual(5, list.CurrentLength);
        }

        [TestMethod]
        public void ListTest2()
        {
            var list = new LoopingLinkedList<int>(5);

            Assert.AreEqual(0, list.CurrentLength);
            for (var i = 1; i <= 73; i++)
            {
                list.Add(i);
            }

            Assert.AreEqual(69, list.HeadNode.Data);
            Assert.AreEqual(70, list.HeadNode.Next.Data);
            Assert.AreEqual(71, list.HeadNode.Next.Next.Data);
            Assert.AreEqual(72, list.HeadNode.Next.Next.Next.Data);
            Assert.AreEqual(73, list.HeadNode.Next.Next.Next.Next.Data);
            Assert.AreEqual(5, list.CurrentLength);
        }


        [TestMethod]
        public void EnumerableTest()
        {
            var queue = new LoopingLinkedList<int>(3);

            Assert.AreEqual(0, queue.CurrentLength);
            for (var i = 1; i <= 2; i++)
            {
                queue.Add(i);
            }

            var list = queue.Where(x => true).ToList();

            Assert.AreEqual(1, list[0]);
            Assert.AreEqual(2, list[1]);
            Assert.AreEqual(2, queue.CurrentLength);
        }

        [TestMethod]
        public void SmallEnumerableTest()
        {
            var queue = new LoopingLinkedList<int>(3);

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

        [TestMethod]
        public void EmptyNullsTest()
        {
            var queue = new LoopingLinkedList<int>(3);

            Assert.IsNull(queue.HeadNode);
            Assert.IsNull(queue.TailNode);

            Assert.AreEqual(0, queue.Head);
            Assert.AreEqual(0, queue.Tail);
        }
    }
}