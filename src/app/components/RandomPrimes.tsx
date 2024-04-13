import { MAX_DIGITS_PRIMALY_TEST } from "@/helpers/Constants";
import duration from "@/helpers/duration";
import { RandomPrimesReport } from "@/helpers/randomPrimes";
import { Alert, Button, CircularProgress, FormGroup, TextField } from "@mui/material";
import { number } from "mathjs";
import { useState } from "react";

const initialRandomPrimes = {
    primes: [],
    length: 0,
    time: 0,
    amount: 0,
}

const RandomPrimes = () => {

    const [loading, setLoading] = useState(false)
    const [randomPrimes, setRandomPrimes] = useState<RandomPrimesReport>(initialRandomPrimes)
    const [length, setLength] = useState(60)
    const [testTime, setTestTime] = useState(0)
    const [bigNumber, setBigNumber] = useState("100")
    const [amount, setAmount] = useState(10)
    const [error, setError] = useState<string>("")
    const [errorTest, setErrorTest] = useState<string>("")
    const [isPrime, setIsPrime] = useState(false);

    const handleTestIfPrime = async () => {
        try {
            setErrorTest("")
            setTestTime(0)
            setIsPrime(false)
            setLoading(true)
            const options = {
                method: "POST",
                headers: {
                  "content-type": "application/json",
                },
                body: JSON.stringify({
                    number: bigNumber,
                }),
              }
            const promise = await fetch("/api/isPrime", options)
            const response = await promise.json();
            if (response.error) {
                throw new Error(response.error.toString())
            }
            setIsPrime(response.isPrime)
            setTestTime(response.time)
            setLoading(false)
        } catch (error) {
            setLoading(false)
            let message
            if (error instanceof Error) message = error.message
            else message = String(error)
            setErrorTest(message)
        }
    }

    const handleSend = async () => {
        try {
            setRandomPrimes(initialRandomPrimes)
            setLoading(true)
            setError("")
            const promise = await fetch("/api/randomPrimes?length="+length + "&amount=" + amount)
            const response = await promise.json()
            if (response.error) {
                throw new Error(response.error.toString())
            }
            setRandomPrimes(response)
            setLoading(false)
        } catch (error) {
            setLoading(false)
            let message
            if (error instanceof Error) message = error.message
            else message = String(error)
            setError(message)
        }
            
                
    }
    return <>
        <p>Enter a number to test if it is prime. Max value is 10**{MAX_DIGITS_PRIMALY_TEST}-1.</p>
        <hr/>
        <FormGroup row={true}>
            <TextField
                className="input"
                label="Number"
                type="string"
                value={bigNumber}
                onChange={(event => {
                    // check it is base 3
                    const regex = new RegExp("[^0123456789$]");
                    if (event.target.value.length < MAX_DIGITS_PRIMALY_TEST && !regex.test(event.target.value))
                        try {
                            setBigNumber(event.target.value)
                            setTestTime(0)
                        } catch (e) {

                        }
                })}
            />
            <Button disabled={loading} onClick={handleTestIfPrime} variant="contained">GENERATE</Button>
            {loading && <CircularProgress/>}
        </FormGroup>
        {errorTest && <><hr/><Alert severity="error">{errorTest}</Alert></>}
        <hr/>
        { testTime > 0 && <>
            <p>The number entered entered with {bigNumber.length} digits {isPrime ? "is probably prime" : "is not prime"}, it took {duration(testTime)}</p>
            <hr/>
        </>}
        <p>Write a length and amount to generate random primes:</p>
        <hr/>
        <FormGroup row={true}>
            <TextField
                className="input"
                label="Length"
                type="string"
                value={length}
                disabled={loading}
                onChange={(event => {
                    // check it is base 3
                    const regex = new RegExp("[^0123456789$]");
                    if (!regex.test(event.target.value))
                        try {
                            setLength(parseInt(event.target.value))
                            setRandomPrimes(initialRandomPrimes)
                        } catch (e) {

                        }
                })}
            />
            <TextField
                className="input"
                label="Amount"
                type="string"
                disabled={loading}
                value={amount}
                onChange={(event => {
                    // check it is base 3
                    const regex = new RegExp("[^0123456789$]");
                    if (!regex.test(event.target.value))
                        try {
                            setAmount(parseInt(event.target.value))
                            setRandomPrimes(initialRandomPrimes)
                        } catch (e) {

                        }
                })}
            />
            <Button onClick={handleSend} disabled={loading} variant="contained">GENERATE</Button>
            {loading && <CircularProgress/>}
        </FormGroup>
        {error && <><hr/><Alert severity="error">{error}</Alert></>}

        {!error && randomPrimes.primes.length > 0 && <>
            <hr key={"first-lane"}/>
            <p key={"second-lane"}>
                Generated {amount} primes with {length} digits in {duration(randomPrimes.time)}
            </p>
            {randomPrimes.primes.map(prime => 
                <div key={prime + "-container"}>
                    <hr key={prime + "-divider"}/>
                    <p className="inline-grid" key={prime+"-paragraph"}>
                        <span key={prime + "-number"}>{prime.toString()}</span>
                    </p>
                </div>
            )}
        </>}
    </>
}

export default RandomPrimes;