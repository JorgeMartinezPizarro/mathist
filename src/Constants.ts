// Node limits
export const MAX_ALLOCATABLE_ARRAY = 2 ** 31;                       // 2.1b More elements break node

// Supported limits
export const MAX_SUPPORTED_SIEVE_LENGTH = 10**12;                   // 1t 452GB primes, iteration takes 3h. 10t iterated and counted in 30h

// Excel limits
export const EXCEL_MAX_ROWS = 1048576;                              // FIX VALUE FROM EXCEL SPEC 
export const EXCEL_MAX_COLS = 16384;                                // FIX VALUE FROM EXCEL SPEC

// Web healthy limits
export const MAX_HEALTHY_SEGMENTED_SIEVE_LENGTH = 10**16            // with segmented sieve it runs up to 10q is less than a sec
export const MAX_HEALTHY_SIEVE_LENGTH = 10**8                       // with full sieve 100m run in less than a sec.
export const MAX_DIGITS_TRIPLE = 180000;                            // Healthy computation of less than a sec
export const MAX_LENGTH_TREE = 10;                                  // Healthy computation of just few seconds
export const MAX_DIGITS_FACTORIZATION = 21;                         // Healthy computation of just few seconds
export const MAX_COMPUTATION_FACTORS = 1 * 10**7;                   // Healthy limit to check divisibility by in a few seconds
export const MAX_SERIES_DIFFERENCES_SIZE = 20;                      // Healthy size of the displayed number square
export const MAX_DISPLAY_SIEVE = 10;                                // Healthy amount of primes displayed
export const MAX_DIGITS_RANDOM_PRIMES = 400;                        // Healthy limit of few seconds generating the primes
export const MAX_DIGITS_PRIMALY_TEST = 3000;                        // Healthy primaly test for less than a second
export const MAX_CLASSIC_SIEVE_LENGTH = 4*10**9                     // From that, it worths to use segmented sieve. Array max length is a problem so it requires a complex data structure.
