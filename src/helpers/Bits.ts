import { MAX_ALLOCATABLE_ARRAY, MAX_ALLOCATABLE_MATRIX } from "./Constants";
import string from "./string";
import toHuman from "./toHuman";

// Up to 54b, posible sieve for up to 107b, not bad at all
// Tested with 100b, it works in 75m. 
export const MAX_COLUMNS = MAX_ALLOCATABLE_ARRAY                        // 2.1b values
export const MAX_ROWS = MAX_ALLOCATABLE_MATRIX / MAX_ALLOCATABLE_ARRAY; // 50
// 107374182400
export default class Bits {
  private value: BitView[] = new Array(0)
  public length: number = 0
  private row: number = 0
  constructor(length: number) {
    this.length = length
    const array = new Array(0)
    let count = 0
    try {
      for (var i = MAX_ROWS - 1; i >= 0; i--) {
        if (length > i * MAX_COLUMNS) {
          count++
          array.push(new BitView(MAX_COLUMNS))
        }
      }
    } catch (e) {
      // use toHuman to show up what this sizes means
      throw new Error("Bits(" + length+ ") too big " + toHuman(length/8) + ", max allowed Bits(" + MAX_ALLOCATABLE_MATRIX / 2 + "), " + toHuman(MAX_ALLOCATABLE_MATRIX/16) + ", " + e.toString().replaceAll("Error: ", ""))
    }
    this.value = array
    this.row = this.value.length
  }
  get(n: number){
    if (n >= this.length) {
      throw new Error("Out of founds Bits.get(" + n + ")")
    }
    for (var i = this.row; i >= 0; i--){
      if (n > i * MAX_COLUMNS) {
        return this.value[i].getBit(n - i * MAX_COLUMNS);
      }
    }
  }
  set(n: number, j: number){
    // TODO: GENERALIZE SET
      if (n >= this.length) {
        throw new Error("Out of founds Bits.set(" + n + ", " + j + " )")
      }
      for (var i = this.row; i >= 0; i--){ 
        if (n > i * MAX_COLUMNS) {
          this.value[i].setBit(n - i * MAX_COLUMNS, j)
          break;
        }
      }
  }
  toString() {
    return this.value.toString()
  }
}

const BitView = function(length: number) {
  try {
    this.buffer = new ArrayBuffer(length);
  } catch(e) {
    throw new Error("Invalid length for ArrayBuffer(" + length + ")")
  }
  try {
    this.u8 = new Uint8Array(this.buffer);
  } catch(e) {
    throw new Error("Invalid length for Uint8Array(" + length + ")")
  }
};
  
BitView.prototype.getBit = function(idx) {
  var v = this.u8[idx >> 3];
  var off = idx & 0x7;
  return (v >> (7-off)) & 1;
};

BitView.prototype.setBit = function(idx, val) {
  var off = idx & 0x7;
  if (val) {
    this.u8[idx >> 3] |= (0x80 >> off);
  } else {
    this.u8[idx >> 3] &= ~(0x80 >> off);
  }
}