// Node limits
export const MAX_ALLOCATABLE_ARRAY = 2 ** 31;                       // 2.1b More elements break node

// Supported limits
export const MAX_SUPPORTED_SIEVE_LENGTH = 10**12;                   // 1t which takes 58GB RAM and generates 240GB primes. Tested on a 64GB RAM server.

// Excel limits
export const EXCEL_MAX_ROWS = 1048576;                              // FIX VALUE FROM EXCEL SPEC 
export const EXCEL_MAX_COLS = 16384;                                // FIX VALUE FROM EXCEL SPEC

// Web healthy limits
export const MAX_HEALTHY_SIEVE_LENGTH = 5 * 10**8                   // Healthy sieve of 500m in few seconds and 250MB
export const MAX_DIGITS_TRIPLE = 180000;                            // Healthy computation of less than a sec
export const MAX_LENGTH_TREE = 10;                                  // Healthy computation of just few seconds
export const MAX_DIGITS_FACTORIZATION = 25;                         // Healthy computation of less than a minute
export const MAX_COMPUTATION_FACTORS = 1 * 10**6;                   // Healthy limit to check divisibility by in a few seconds
export const MAX_SERIES_DIFFERENCES_SIZE = 20;                      // Healthy size of the displayed number square
export const MAX_DISPLAY_SIEVE = 10;                                // Healthy amount of primes displayed
export const MAX_DIGITS_RANDOM_PRIMES = 400;                        // Healthy limit of few seconds generating the primes
export const MAX_DIGITS_PRIMALY_TEST = 3000;                        // Healthy primaly test for less than a second