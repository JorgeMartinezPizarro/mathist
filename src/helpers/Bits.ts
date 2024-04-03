import { MAX_NODE_ARRAY_LENGTH } from "./Constants";
import string from "./string";

// Up to 68b MAX, posible sieve for up to 136b, not bad at all!
export const MAX_COLUMNS = MAX_NODE_ARRAY_LENGTH // 2.1b values
export const MAX_ROWS = 2 ** 5

export default class Bits {
  private value: BitView[] = new Array(0)
  public length: number = 0
  private row: number = 0
  constructor(length: number) {
    this.length = length
    const array = new Array(0)
    if (length > MAX_ROWS * MAX_COLUMNS) {
      throw new Error("Max value Bits(" + string(BigInt(MAX_ROWS * MAX_COLUMNS))+ ")")
    }
    for (var i = MAX_ROWS - 1; i >= 0; i--) {
      if (length > i * MAX_COLUMNS) {
        array.push(new BitView(MAX_COLUMNS))
      }
    }
    this.value = array
    this.row = this.value.length
  }
  get(n: number){
    // TODO: GENERALIZE GET
    if (n >= this.length) {
      throw new Error("Error max value for get.")
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
        throw new Error("Error max value for set.")
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
  let buffer = new ArrayBuffer(0)
  try {
    buffer = new ArrayBuffer(length)
    this.buffer = buffer;
  } catch(e) {
    throw new Error("Invalid length for ArrayBuffer")
  }
  try {
    this.u8 = new Uint8Array(buffer);
  } catch(e) {
    throw new Error("Invalid length for Uint8Array")
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