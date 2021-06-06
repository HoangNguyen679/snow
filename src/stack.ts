export class Node<T> {
  private _value: T
  private _prev: Node<T> | null

  constructor(data: T) {
    this._value = data
    this._prev = null
  }

  get value(): T {
    return this._value
  }

  set value(value: T) {
    this._value = value
  }

  get prev(): Node<T> | null {
    return this._prev
  }

  set prev(value: Node<T> | null) {
    this._prev = value
  }
}

export class Stack<T> {
  private _size: number
  private _top: Node<T> | null

  constructor() {
    this._size = 0
    this._top = null
  }

  get size(): number {
    return this._size
  }

  set size(value: number) {
    this._size = value
  }

  get top(): Node<T> | null {
    return this._top
  }

  set top(value: Node<T> | null) {
    this._top = value
  }

  push(node: Node<T>) {
    this.size++
    node.prev = this.top
    this.top = node
  }

  pop() {
    if (this.size === 0) return null

    const _top = this.top
    this.top = this.top!.prev
    this.size--
    return _top
  }

  empty() {
    return this.size === 0
  }
}
