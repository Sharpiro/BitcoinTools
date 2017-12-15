using System.Collections.Generic;

namespace BitcoinAnalyzer.CustomDataStructures
{
    interface IHeadAndTailList<T> : IEnumerable<T>
    {
        T Head { get; }
        T Tail { get; }
        int CurrentLength { get; }

        void Add(T data);
    }
}