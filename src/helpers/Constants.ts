// Node limits
export const MAX_ALLOCATABLE_ARRAY = 2 ** 31;                       // 2.1b More elements break node

// Server limits
export const MAX_ALLOCATABLE_MATRIX_30GB = (2 ** 32) * (5 ** 3);    // 535b which takes 31GB RAM and generates 240GB primes

// Excel limits
export const EXCEL_MAX_ROWS = 1048576;                              // FIX VALUE FROM EXCEL SPEC 
export const EXCEL_MAX_COLS = 16384;                                // FIX VALUE FROM EXCEL SPEC

// Web healthy limits
export const MAX_LENGTH_FOR_SIEVE_HEALTY = 2 ** 30;                 // Healthy sieve of 1b in 20 seconds and 515MB
export const MAX_DIGITS_TRIPLE = 180000;                            // Healthy computation of less than a sec
export const MAX_LENGTH_TREE = 10;                                  // Healthy computation of just few seconds
export const MAX_DIGITS_SIEVE = 12;                                 // Healthy computation of less than a minute
export const MAX_DIGITS_FACTORIZATION = 50;                         // Healthy computation of less than a minute
export const MAX_COMPUTATION_FACTORS = 2 ** 30;                     // Healthy limit to check divisibility by in a few seconds
export const MAX_SERIES_DIFFERENCES_SIZE = 20;                      // Healthy size of the displayed number square
export const MAX_DISPLAY_SIEVE = 10;                                // Healthy amount of primes displayed
export const MAX_DIGITS_RANDOM_PRIMES = 1000;                        // Healthy limit of few seconds generating the primes

export const FALSE_BIG_PRIME = BigInt("762277911839245857571439872966261072724992374634405732667579879722236306956479862970529743741074873375041552386276788361986600264666074877103897745604012674559035892302045882280336144371365036092571676871059944369462664319303503956542422172036248738757281919969669475386380834591579054179194093601545233155835891291461950209880940150705126828856395890652042294058159613362774320620027936017531769598449760412987483995595563238352114912621159709211323265695111673460293174419548209222546649248437686751052865483686736889576573425229030926289358813385096243686337081590403598282833254461885519488126687996358059861739720960768510377325814556316543563771443536159085676630024482928277501895233659243127306813135795888253266682427103936942383567179383071371820294246489751634175814243428800468181170464453351095732070244027271027202491093996151624853450704314416816710578100837411729281253203052372042049")

/*
    console.log(isPrime(bignumber(FALSE_BIG_PRIME.toString())))
    
    returns false in few seconds but https://bigprimes.org/primality-test and in general the primality tests say it is a prime number. Hard to reproduce how i found it, it was a coincidence. Let's comment it!

    NOTE: sometimes it takes years to run isPrime with a 100 digits number, just be careful when using it.
*/