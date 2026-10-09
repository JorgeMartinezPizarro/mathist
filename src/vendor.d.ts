// Types for the packages that do not ship their own

declare module "s-bpsw" {
    // Strengthened Baillie-PSW probable prime test
    export function isProbablePrime(n: bigint): boolean
}

declare module "bigint-gcd" {
    export default function gcd(a: bigint, b: bigint): bigint
}
