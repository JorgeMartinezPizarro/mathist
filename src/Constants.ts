// Node limits
export const MAX_ALLOCATABLE_ARRAY = 2 ** 31;                               // 2.1b More elements break node

// Supported limits
export const MAX_SUPPORTED_SIEVE_LENGTH = 10**12;                           // 1t 452GB primes, iteration takes 3h. 10t iterated and counted in 30h

// Excel limits
export const EXCEL_MAX_ROWS = 1048576;                                      // FIX VALUE FROM EXCEL SPEC 
export const EXCEL_MAX_COLS = 16384;                                        // FIX VALUE FROM EXCEL SPEC

// Web healthy limits
export const MAX_SUPPORTED_PARTIAL_SIEVE_LENGTH = BigInt(2)**BigInt(62)
export const MAX_HEALTHY_SEGMENTED_SIEVE_LENGTH = 10**16                    // with segmented sieve it runs up to 10q in less than a sec
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

interface MersennePrimeRow {
    position: number;
    prime: number;
    discoveryDate: string;
    discoveredBy: string;
}

export const MERSENNE_TABLE: MersennePrimeRow[] = `
1	2	3	1	antigüedad	Euclides
2	3	7	1	antigüedad	Euclides
3	5	31	2	antigüedad	Euclides
4	7	127	3	antigüedad	Euclides
5	13	8191	4	1456	anónimo
6	17	131 071	6	1588	Cataldi
7	19	524 287	6	1588	Cataldi
8	31	2147 483 647	10	1772	Euler
9	61	2305843009213693951	19	1883	Pervushin
10	89	618970019…449562111	27	1911	Powers
11	107	162259276…010288127	33	1914	Powers
12	127	170141183…884105727	39	1876	Lucas
13	521	686479766…115057151	157	30-01-1952	Robinson (SWAC)
14	607	531137992…031728127	183	30-01-1952	Robinson (SWAC)
15	1279	104079321…168729087	386	25-06-1952	Robinson (SWAC)
16	2203	147597991…697771007	664	07-10-1952	Robinson (SWAC)
17	2281	446087557…132836351	687	09-10-1952	Robinson (SWAC)
18	3217	259117086…909315071	969	08-09-1957	Riesel
19	4253	190797007…350484991	1281	03-11-1961	Hurwitz
20	4423	285542542…608580607	1332	03-11-1961	Hurwitz
21	9689	478220278…225754111	2917	11-05-1963	Gillies
22	9941	346088282…789463551	2993	16-05-1963	Gillies
23	11 213	281411201…696392191	3376	02-06-1963	Gillies
24	19 937	431542479…968041471	6002	04-03-1971	Tuckerman
25	21 701	448679166…511882751	6533	30-10-1978	Noll y Nickel
26	23 209	402874115…779264511	6987	09-02-1979	Noll
27	44 497	854509824…011228671	13 395	08-04-1979	Nelson y Slowinski
28	86 243	536927995…433438207	25 962	25-09-1982	Slowinski
29	110 503	521928313…465515007	33 265	28-01-1988	Colquitt y Welsh
30	132 049	512740276…730061311	39 751	20-09-1983	Slowinski
31	216 091	746093103…815528447	65 050	06-09-1985	Slowinski
32	756 839	174135906…544677887	227 832	19-02-1992	Slowinski y Gage
33	859 433	129498125…500142591	258 716	10-01-1994	Slowinski y Gage
34	1257 787	412245773…089366527	378 632	03-09-1996	Slowinski y Gage
35	1398 269	814717564…451315711	420 921	13-11-1996	GIMPS / Joel Armengaud
36	2976 221	623340076…729201151	895 932	24-08-1997	GIMPS / Gordon Spence
37	3021 377	127411683…024694271	909 526	27-01-1998	GIMPS / Roland Clarkson
38	6972 593	437075744…924193791	2098 960	01-06-1999	GIMPS /
39	13 466 917	924947738…256259071	4053 946	14-11-2001	GIMPS / Michael Cameron
40	20 996 011	125976895…855682047	6320 430	17-11-2003	GIMPS / Michael Shafer
41	24 036 583	299410429…733969407	7235 733	15-05-2004	GIMPS / Josh Findley
42	25 964 951	122164630…577077247	7816 230	18-02-2005	GIMPS / Martin Nowak
43	30 402 457	315416475…652943871	9152 052	15-12-2005	GIMPS / Curtis Cooper y Steven Boone
44	32 582 657	124575026…053967871	9808 358	04-09-2006	GIMPS / Curtis Cooper y Steven Boone
45	37 156 667	202254406…308220927	11 185 272	06-09-2008	GIMPS / Hans-Michael Elvenich
46	42 643 801	169873516…562314751	12 837 064	12-04-2009	GIMPS / Odd M. Strindmo
47	43 112 609	316470269…697152511	12 978 189	23-08-2008	GIMPS / Edson Smith
48	57 885 161	581887266…724285951	17 425 170	25-01-2013	GIMPS / Curtis Cooper
49	74 207 281	300376418…086436351	22 338 618	07-01-2016	GIMPS / Curtis Cooper
50	77 232 917	467333183…762179071	23 249 425	26-12-2017	GIMPS / Jonathan Pace
51	82 589 933	148894445…217902591	24 862 048	07-12-2018	GIMPS / Patrick Laroche
`.split("\n").filter(s => s !== "").map((line: string) => {
    const [position, prime, , , discoveryDate, discoveredBy] = line.split("\t")
    return {
        position: Number(position),
        prime: Number(prime.replaceAll(" ", "")),
        discoveryDate,
        discoveredBy
    }
})