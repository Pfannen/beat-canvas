export interface Cell<T> {
  next?: T;
}

export interface LinkedList<T> extends Cell<LinkedList<T>> {
  data: T;
}

export interface DoublyLinkedList<T> extends Cell<DoublyLinkedList<T>> {
  prev?: DoublyLinkedList<T>;
  data: T;
}

export type UnitMeasurement = "px" | "%";
