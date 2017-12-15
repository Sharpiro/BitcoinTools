using BitcoinAnalyzer.CustomDataStructures;
using System.Collections.Generic;

namespace System.Linq
{
    public static class LinqExtensions
    {
        public static LoopingList<T> ToLoopingList<T>(this ICollection<T> collection, int maxLength = 0)
        {
            maxLength = maxLength <= 0 ? collection.Count : maxLength;
            var loopingList = new LoopingList<T>(maxLength, collection.Count);
            foreach (var item in collection)
            {
                loopingList.Add(item);
            }
            return loopingList;
        }
    }
}