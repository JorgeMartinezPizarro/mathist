// Node limits
export const MAX_ALLOCATABLE_ARRAY = 2 ** 31;                       // 2.1b More elements break node

// Server limits
export const MAX_ALLOCATABLE_MATRIX_30GB = (2 ** 32) * (5 ** 3);    // 535b which takes 31GB RAM and generates 240GB primes

// Excel limits
export const EXCEL_MAX_ROWS = 1048576;                              // FIX VALUE FROM EXCEL SPEC 
export const EXCEL_MAX_COLS = 16384;                                // FIX VALUE FROM EXCEL SPEC

// Healthy limits
export const MAX_LENGTH_FOR_SIEVE_HEALTY = 2 ** 30;                 // Healthy sieve of 1b in 20 seconds and 515MB
export const MAX_DIGITS_TRIPLE = 180000;                            // Healthy computation of less than a sec
export const MAX_DIGITS_SIEVE = 12;                                 // Healthy computation of less than a minute
export const MAX_DIGITS_FACTORIZATION = 30;                         // Healthy computation of less than a minute
export const MAX_COMPUTATION_FACTORS = 10**8;                       // Max value to check divisibility by in a few seconds

// View related CONSTANTS
export const MAX_SERIES_DIFFERENCES_SIZE = 20;                      // Size of the boxes displayed
export const MAX_DISPLAY_SIEVE = 10;                                // How many primes are displayed