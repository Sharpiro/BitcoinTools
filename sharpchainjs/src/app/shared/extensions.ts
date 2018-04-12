declare global {
    interface Array<T> {
        peek(): T;
    }
}

Array.prototype.peek = function () {
    return this[this.length - 1];
}

export { }