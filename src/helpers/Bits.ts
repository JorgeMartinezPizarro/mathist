export default class Bits {
    constructor(length: number) {
        var buffer = new ArrayBuffer(length);
        this.value = new BitView(buffer, 0, length);
    }
    get(n){
        return this.value.getBit(n)
    }
    set(n, j){
        this.value.setBit(n,j)
    }
    toString() {
        return this.value.toString();
    }
  }

const BitView = function(buf) {
    this.buffer = buf;
    this.u8 = new Uint8Array(buf);
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
  };