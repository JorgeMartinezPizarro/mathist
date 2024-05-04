// Node limits
export const MAX_ALLOCATABLE_ARRAY = 2 ** 31;                               // 2.1b More elements break node

// Supported limits
export const MAX_SUPPORTED_SIEVE_LENGTH = 10**12;                           // 1t 452GB primes, iteration takes 3h. 10t iterated and counted in 30h

// Excel limits
export const EXCEL_MAX_ROWS = 1048576;                                      // FIX VALUE FROM EXCEL SPEC 
export const EXCEL_MAX_COLS = 16384;                                        // FIX VALUE FROM EXCEL SPEC

// Web healthy limits
export const MAX_SUPPORTED_PARTIAL_SIEVE_LENGTH = BigInt(2)**BigInt(62)
export const MAX_HEALTHY_SEGMENTED_SIEVE_LENGTH = 10**16                    // with segmented sieve it runs up to 10q is less than a sec
export const MAX_HEALTHY_SIEVE_LENGTH = 10**8                               // with full sieve 100m run in less than a sec.
export const MAX_DIGITS_TRIPLE = 180000;                                    // Healthy computation of less than a sec
export const MAX_LENGTH_TREE = 10;                                          // Healthy computation of just few seconds
export const MAX_DIGITS_FACTORIZATION = 23;                                 // Healthy computation of less than a sec
export const MAX_COMPUTATION_FACTORS = 1 * 10**7;                           // Healthy limit to check divisibility by in a few seconds
export const MAX_SERIES_DIFFERENCES_SIZE = 20;                              // Healthy size of the displayed number square
export const MAX_DISPLAY_SIEVE = 10;                                        // Healthy amount of primes displayed
export const MAX_DIGITS_RANDOM_PRIMES = 400;                                // Healthy limit of few seconds generating the primes
export const MAX_DIGITS_PRIMALY_TEST = 3000;                                // Healthy primaly test for less than a second
export const MAX_CLASSIC_SIEVE_LENGTH = 2**32                               // From that, it worths to use segmented sieve. Array max length is a problem so it requires a complex data structure.

export const KNOWN_MERSENNE_PRIMES = [
    2, 3, 5, 7, 13, 17, 19, 31, 61, 89, 107, 127, 521, 607, 1279,
    2203, 2281, 3217, 4253, 4423, 9689, 9941, 11213, 19937, 21701, 
    23209, 44497, 86243, 110503, 132049, 216091, 756839, 859433, 1257787,
    1398269, 2976221, 3021377, 6972593, 13466917, 20996011, 24036583,
    25964951, 30402457, 32582657, 37156667, 42643801, 43112609,
    57885161, 74207281, 77232917, 82589933	
]