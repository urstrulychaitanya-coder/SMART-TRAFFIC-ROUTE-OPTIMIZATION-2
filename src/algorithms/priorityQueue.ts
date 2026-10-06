/**
 * Binary Min-Heap Priority Queue for Dijkstra and A* algorithms.
 * Guarantees O(log V) insertion and extraction.
 */

export interface PQNode<T> {
  item: T;
  priority: number;
  data?: any;
}

export class PriorityQueue<T> {
  private heap: PQNode<T>[] = [];
  private indexMap: Map<string, number> = new Map();
  private keyFn: (item: T) => string;

  constructor(keyFn: (item: T) => string = (item) => String(item)) {
    this.keyFn = keyFn;
  }

  public size(): number {
    return this.heap.length;
  }

  public isEmpty(): boolean {
    return this.heap.length === 0;
  }

  public peek(): PQNode<T> | undefined {
    return this.heap[0];
  }

  public insert(item: T, priority: number, data?: any): void {
    const node: PQNode<T> = { item, priority, data };
    this.heap.push(node);
    const index = this.heap.length - 1;
    this.indexMap.set(this.keyFn(item), index);
    this.bubbleUp(index);
  }

  public pop(): PQNode<T> | undefined {
    if (this.isEmpty()) return undefined;
    const min = this.heap[0];
    const end = this.heap.pop()!;
    this.indexMap.delete(this.keyFn(min.item));

    if (this.heap.length > 0) {
      this.heap[0] = end;
      this.indexMap.set(this.keyFn(end.item), 0);
      this.bubbleDown(0);
    }

    return min;
  }

  public decreasePriority(item: T, newPriority: number, data?: any): boolean {
    const key = this.keyFn(item);
    const index = this.indexMap.get(key);
    if (index === undefined) {
      this.insert(item, newPriority, data);
      return true;
    }

    if (newPriority >= this.heap[index].priority) {
      return false;
    }

    this.heap[index].priority = newPriority;
    if (data !== undefined) {
      this.heap[index].data = data;
    }
    this.bubbleUp(index);
    return true;
  }

  public toArray(): PQNode<T>[] {
    return [...this.heap];
  }

  private bubbleUp(index: number): void {
    const element = this.heap[index];
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      const parent = this.heap[parentIndex];
      if (element.priority >= parent.priority) break;

      this.heap[index] = parent;
      this.indexMap.set(this.keyFn(parent.item), index);

      index = parentIndex;
    }
    this.heap[index] = element;
    this.indexMap.set(this.keyFn(element.item), index);
  }

  private bubbleDown(index: number): void {
    const length = this.heap.length;
    const element = this.heap[index];

    while (true) {
      const leftChildIndex = 2 * index + 1;
      const rightChildIndex = 2 * index + 2;
      let swapIndex = -1;

      if (leftChildIndex < length) {
        if (this.heap[leftChildIndex].priority < element.priority) {
          swapIndex = leftChildIndex;
        }
      }

      if (rightChildIndex < length) {
        const comparePriority = swapIndex === -1 ? element.priority : this.heap[leftChildIndex].priority;
        if (this.heap[rightChildIndex].priority < comparePriority) {
          swapIndex = rightChildIndex;
        }
      }

      if (swapIndex === -1) break;

      this.heap[index] = this.heap[swapIndex];
      this.indexMap.set(this.keyFn(this.heap[swapIndex].item), index);

      index = swapIndex;
    }

    this.heap[index] = element;
    this.indexMap.set(this.keyFn(element.item), index);
  }
}
