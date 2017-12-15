using BitcoinAnalyzer.Tools;
using System;
using System.Collections.Generic;
using System.Collections;

namespace BitcoinAnalyzer.CustomDataStructures
{
    public class LoopingList<T> : IHeadAndTailList<T>, IEnumerable<T>
    {
        private const int DefaultArrayStartSize = 2;

        private readonly int _arrayStartSize;

        private T[] _array;
        private int _headIndex;
        private int _currentLength;

        public T Head => _array[HeadIndex];
        public T Tail => _array[TailIndex];
        public int HeadIndex => _headIndex % _currentLength;
        public int TailIndex => (_headIndex - 1).Mod(MaxLength);
        public int CurrentLength => _currentLength;
        public int MaxLength { get; }
        public int CurrentArraySize => _array.Length;

        public LoopingList(int maxLength, int arrayStartSize = DefaultArrayStartSize)
        {
            if (maxLength <= 0) throw new ArgumentOutOfRangeException(nameof(maxLength), "value must be greater than zero");
            MaxLength = maxLength;
            _arrayStartSize = arrayStartSize <= DefaultArrayStartSize ? DefaultArrayStartSize : arrayStartSize;
            _array = new T[_arrayStartSize];
        }

        public void Add(T data)
        {
            TryResizeArray();

            _array[_headIndex++] = data;
            if (_currentLength < MaxLength) _currentLength++;
            if (_headIndex == MaxLength) _headIndex = 0;
        }

        private void TryResizeArray()
        {
            if (_currentLength == _array.Length && _currentLength < MaxLength)
            {
                var newSize = _array.Length * 2;
                var newArray = new T[newSize];
                Array.Copy(_array, newArray, _array.Length);
                _array = newArray;
            }
        }

        private IEnumerable<T> DeferredEnumerable()
        {
            for (var i = 0; i < _currentLength; i++)
            {
                var currentIndex = (_headIndex + i).Mod(_currentLength);
                yield return _array[currentIndex];
            }
        }

        public IEnumerator<T> GetEnumerator() => DeferredEnumerable().GetEnumerator();
        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        //public static LoopingList<T> CreateList(ICollection<T> collection)
        //{
        //    var loopingList = new LoopingList<T>(collection.Count);
        //    foreach (var item in collection)
        //    {
        //        loopingList.Add(item);
        //    }
        //    return loopingList;
        //}
    }
}