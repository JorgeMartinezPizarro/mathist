import string from "./string";

// Up to 12b max atm
const MAX_COLUMNS = 2 ** 31 // 2b
const MAX_ROWS = 7
// Solution for up to 3 * (2**31-1) values, can be improved to (2**31-1) * (2**31-1)
// TODO: implement a generic solution by using N x N
export default class Bits {
  private value: BitView[] = new BitView(0)
  public length: number = 0
  private row: number = 0
  constructor(length: number) {
    this.length = length
    const array = new Array(0)
    try {
      if (length > MAX_ROWS * MAX_COLUMNS) {
        throw new Error("Implemented for a max value of: " + string(BigInt(MAX_ROWS * MAX_COLUMNS)))
      }
      for (var i = MAX_ROWS - 1; i >= 0; i--) {
        if (length > i * MAX_COLUMNS) {
          if (i > this.row) {
            this.row = i
            console.log((i+1) + "th Y coordinate")
          }          
          array.push(new BitView(MAX_COLUMNS))
        }
      }
      this.value = array
    } catch (e) {
      throw new Error("Error initializing the Bits class. " + e.toString().replaceAll("Error: ", ""))
    }
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