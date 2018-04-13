export class Stack {
    private data = []

    get length(): number {
        return this.data.length;
    }

    push(val: any): void {
        this.data.push(val)
    }

    pop(): any {
        return this.data.pop()
    }

    peek(): any {
        return this.data[this.data.length - 1]
    }
}