'use client'

const About = () => {

    return <>
        <p>This website is a personal project related to integer numbers created by a mathematician. It started just as an attempt to explore the limits of the ancient Eratosthenes Sieve. There is plenty more done since that. Currently I am trying to understand the general number field sieve (GNFS), which will come in future iterations.</p>
        <hr/>
        <p>This website code can be found <a href="https://github.com/JorgeMartinezPizarro/mathist">in github</a>.</p>
        <hr/>
        <p>The primes page is inspired by <a href="https://bigprimes.org/">https://bigprimes.org/</a>. As they do, we test primes and generate them using the <a href="https://github.com/Harxxki/strengthened-baillie-psw">Strengthened Baillie-PSW</a> and the <a href="https://gist.github.com/JeffML/424a448f1c10d85e10de000420fa1b8d">Miller-Rabin</a> primaly tests.</p>
        <hr/>
        <p>The Tree and Series page are inspired by <a href="https://www.youtube.com/c/Mathologer">the Mathologer</a>.</p>
        <hr/>
        <p>2**82589933 - 1 is the biggest known prime, a prime with 24862048 digits. Read more about it <a href="https://www.mersenne.org/primes/?press=M82589933">https://www.mersenne.org/primes/?press=M82589933</a>.</p>
        <hr/>
        <p>Mome results and experiments regarding Mersenne Primes and the GMPS project are planed.</p>
    </>
}

export default About;