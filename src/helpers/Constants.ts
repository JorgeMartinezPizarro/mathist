// Node limits
export const MAX_ALLOCATABLE_ARRAY = 2 ** 31;                   // 2.1b More elements break node
export const MAX_ALLOCATABLE_MATRIX_6GB = (2 ** 32) * (5 ** 2); // 107b which takes  6GB RAM
export const MAX_ALLOCATABLE_MATRIX_30GB = (2 ** 32) * (5 ** 3);// 535b which takes 30GB RAM 

// Excel limits
export const EXCEL_MAX_ROWS = 1048576;                          // FIX VALUE FROM EXCEL SPEC 
export const EXCEL_MAX_COLS = 16384;                            // FIX VALUE FROM EXCEL SPEC

// Healthy limits
export const MAX_LENGTH_FOR_SIEVE_HEALTY = 2 ** 30;             // Healthy sieve of 1b in 8 seconds and 516MB
export const MAX_DIGITS_TRIPLE = 60000;                         // Healthy computation of less than a sec
export const MAX_DIGITS_SIEVE = 12;                             // Healthy computation limit
export const MAX_DIGITS_FACTORIZATION = 19;                     // Healthy computation of a few seconds 

// View related CONSTANTS
export const MAX_SERIES_DIFFERENCES_SIZE = 20;                  // Size of the boxes displayed
export const MAX_DISPLAY_SIEVE = 10;                            // How many primes are displayed