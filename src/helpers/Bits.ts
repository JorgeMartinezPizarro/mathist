import { MAX_ALLOCATABLE_ARRAY, MAX_ALLOCATABLE_MATRIX_58GB } from "./Constants";
import errorMessage from "./errorMessage";
import toHuman from "./toHuman";

// Up to 500b, posible sieve for up to 1t, requires 58GB RAM
export const MAX_COLUMNS = MAX_ALLOCATABLE_ARRAY            // 2b columns
export const MAX_ROWS = 250;                                // 250 rows

export default class Bits {
  private array: BitView[] = new Array(0)
  public length: number = 0
  private row: number = 0
  constructor(length: number) {
    this.length = length
    const array = new Array(0)
    let count = 0
    if (length > MAX_ALLOCATABLE_MATRIX_58GB) {
      throw new Error("Value for Bits " + MAX_ALLOCATABLE_MATRIX_58GB)
    }
    try {
      for (var i = MAX_ROWS - 1; i >= 0; i--) {
        if (length > i * MAX_COLUMNS) {
          count++
          array.push(new BitView(MAX_COLUMNS))
        }
      }
    } catch (error) {
      // use toHuman to show up what this sizes means
      throw new Error("Bits(" + length + ") fails allocating " + toHuman(count * MAX_COLUMNS / 8) + " of "  + toHuman(length / 8) + " RAM, " + errorMessage(error))
    }
    console.log("Allocated Bits(" + length + ") of size " + (length < 8 ? length + " bits" : toHuman(length / 8)))
    this.array = array
    this.row = this.array.length
  }
  get(n: number): boolean {
    if (n >= this.length) {
      throw new Error("Out of founds Bits.get(" + n + ")")
    }
    for (var i = this.row; i >= 0; i--){
      if (n > i * MAX_COLUMNS) {
        return this.array[i].getBit(n - i * MAX_COLUMNS) === 1;
      }
    }
    return false;
  }
  set(n: number, j: boolean){
    if (n >= this.length) {
      throw new Error("Out of founds Bits.set(" + n + ", " + j + " )")
    }
    for (var i = this.row; i >= 0; i--){ 
      if (n > i * MAX_COLUMNS) {
        this.array[i].setBit(n - i * MAX_COLUMNS, j)
        break;
      }
    }
  }
  toString() {
    return this.array.toString()
  }
}

class BitView {
  buffer: ArrayBuffer
  u8: Uint8Array
  constructor(length: number) {
    try {
      this.buffer = new ArrayBuffer(length);
    } catch(e) {
      throw new Error("ArrayBuffer(" + length + ")")
    }
    try {
      this.u8 = new Uint8Array(this.buffer);
    } catch(e) {
      throw new Error("Uint8Array(" + length + ")")
    }
  }
  getBit(idx: number) {
    var v = this.u8[idx >> 3];
    var off = idx & 0x7;
    return (v >> (7-off)) & 1;
  }

  setBit(idx: number, val: boolean) {
    var off = idx & 0x7;
    if (val) {
      this.u8[idx >> 3] |= (0x80 >> off);
    } else {
      this.u8[idx >> 3] &= ~(0x80 >> off);
    }
  }
}