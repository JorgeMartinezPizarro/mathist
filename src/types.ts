export interface RandomPrimesReport {
    primes: bigint[];
    time: number;
    length: number;
    amount: number;
}

export interface TreeElement {
    triple: bigint[];
    square: bigint[][];
}

export interface Tree {
    tree: TreeElement[][];
    time: number;
}

export interface Triple {
    triple: bigint[];
    square: bigint[][];
    time: number;
}


export interface PrimePower {
    prime: bigint;
    exponent: number;
}

export interface Factorization {

    factors: PrimePower[];
    message: string;
    time: number;
}

export interface Factor {
    factor: bigint;
    message: string;
}



