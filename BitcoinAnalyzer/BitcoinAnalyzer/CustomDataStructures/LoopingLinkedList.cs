using System.Collections;
using System.Collections.Generic;

namespace BitcoinAnalyzer.CustomDataStructures
{
    public class LoopingLinkedList<T> : IHeadAndTailList<T>, IEnumerable<T>
    {
        private Node<T> _head;
        private int _maxLength;
        private int _currentLength;

        public T Head => _head == null ? default : _head.Data;
        public T Tail => _head?.Previous == null ? default : _head.Previous.Data;
        public Node<T> HeadNode => _head;
        public Node<T> TailNode => _head?.Previous;
        public int CurrentLength => _currentLength;

        public LoopingLinkedList(int maxLength)
        {
            _maxLength = maxLength;
        }

        public void Add(T data)
        {
            if (_head == null)
            {
                AddNodeEmpty(data);
                _currentLength++;
            }
            else if (_currentLength < _maxLength)
            {
                AddNodeBehind(_head, data);
                _currentLength++;
            }
            else
                UpdateAndMoveHead(data);
        }

        private void AddNodeEmpty(T data)
        {
            var newNode = new Node<T>(data);
            newNode.Next = newNode;
            newNode.Previous = newNode;
            _head = newNode;
        }

        private void AddNodeBehind(Node<T> node, T data)
        {
            var newNode = new Node<T>(data);
            node.Previous.Next = newNode;
            newNode.Previous = node.Previous;
            node.Previous = newNode;
            newNode.Next = node;
        }

        private void UpdateAndMoveHead(T data)
        {
            _head.Data = data;
            _head = _head.Next;
        }

        private IEnumerable<T> DeferredEnumerable()
        {
            //if (_head == null) yield break;
            var current = _head;
            for (var i = 0; i < _currentLength; i++)
            {
                yield return current.Data;
                current = current.Next;
                if (current == _head) yield break;
            }
        }

        public IEnumerator<T> GetEnumerator() => DeferredEnumerable().GetEnumerator();
        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();
    }
}