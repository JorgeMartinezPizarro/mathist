import { MAX_ALLOCATABLE_ARRAY } from "@/Constants";

// Works up to 2.1b
export default class Bits {
  buffer: ArrayBuffer
  u8: Uint8Array
  constructor(length: number) {
    try {
      this.buffer = new ArrayBuffer(length);
    } catch(e) {
      throw new Error("Max array length is " + MAX_ALLOCATABLE_ARRAY)
    }
    try {
      this.u8 = new Uint8Array(this.buffer);
    } catch(e) {
      throw new Error("Max array length is " + MAX_ALLOCATABLE_ARRAY)
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

  length() {
    return this.u8.length;
  }
}