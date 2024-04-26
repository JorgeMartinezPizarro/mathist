import { Alert, Button, FormGroup, TextField } from "@mui/material";
import { useState } from "react";

import { MAX_DIGITS_PRIMALY_TEST } from "@/Constants";
import NumberToLocale from "@/widgets/NumberToLocale";
import NumberToString from "@/widgets/NumberToString";
import Progress from "@/widgets/Progress";
import duration from "@/helpers/duration";
import errorMessage from "@/helpers/errorMessage";
import { RandomPrimesReport } from "@/types";

const initialRandomPrimes: RandomPrimesReport = {
    primes: [],
    length: 0,
    time: 0,
    amount: 0,
    tries: 0,
}

const RandomPrimes = () => {

    const [loading, setLoading] = useState<boolean>(false)
    const [loadingTest, setLoadingTest] = useState<boolean>(false)
    const [randomPrimes, setRandomPrimes] = useState<RandomPrimesReport>(initialRandomPrimes)
    const [length, setLength] = useState<string>("40")
    const [testTime, setTestTime] = useState<number>(0)
    const [bigNumber, setBigNumber] = useState<string>("1111111111111111111")
    const [amount, setAmount] = useState<string>("10")
    const [error, setError] = useState<string>("")
    const [errorTest, setErrorTest] = useState<string>("")
    const [isPrime, setIsPrime] = useState<boolean>(false);

    const handleTestIfPrime = async () => {
        try {
            setErrorTest("")
            setTestTime(0)
            setIsPrime(false)
            setLoadingTest(true)
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
            setLoadingTest(false)
        } catch (error) {
            setLoadingTest(false)
            setErrorTest(errorMessage(error))
        }
    }

    const handleSend = async () => {
        try {
            setRandomPrimes(initialRandomPrimes)
            setLoading(true)
            setError("")
            const promise = await fetch("/api/randomPrimes?length=" + length + "&amount=" + amount)
            const response = await promise.json()
            if (response.error) {
                throw new Error(response.error.toString())
            }
            setRandomPrimes(response)
            setLoading(false)
        } catch (error) {
            setLoading(false)
            setError(errorMessage(error))
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
                disabled={loadingTest}
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
            <Button disabled={loadingTest} onClick={handleTestIfPrime} variant="contained">Test</Button>
            <Progress loading={loadingTest} />
        </FormGroup>
        {errorTest && <><hr/><Alert severity="error">{errorTest}</Alert></>}
        <hr/>
        { testTime > 0 && <>
            <p>The number entered with <NumberToLocale number={bigNumber.length} singular="digit"/>{isPrime ? " is prime" : " is not prime"}, it took {duration(testTime)}</p>
            <hr/>
        </>}
        <p>Write length and amount to generate random primes:</p>
        <hr/>
        <FormGroup row={true}>
            <TextField
                className="input"
                label="Length"
                type="string"
                value={length}
                disabled={loading}
                onChange={(event => {
                    // check it is an integer
                    const regex = new RegExp("[^0123456789$]");
                    if (!regex.test(event.target.value))
                        try {
                            setLength(event.target.value)
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
                    // check it an integer
                    const regex = new RegExp("[^0123456789$]");
                    if (!regex.test(event.target.value))
                        try {
                            setAmount(event.target.value)
                            setRandomPrimes(initialRandomPrimes)
                        } catch (e) {

                        }
                })}
            />
            <Button onClick={handleSend} disabled={loading} variant="contained">GENERATE</Button>
            <Progress loading={loading} />
        </FormGroup>
        {error && <><hr/><Alert severity="error">{error}</Alert></>}

        {!error && randomPrimes.primes.length > 0 && <>
            <hr key={"first-lane"}/>
            <p key={"second-lane"}>
                Generated <NumberToLocale number={parseInt(amount)} singular="prime"/> with <NumberToLocale number={parseInt(length)} singular="digit" /> in {duration(randomPrimes.time)}
            </p>
            {randomPrimes.primes.map(prime => 
                <div key={prime + "-container"}>
                    <hr key={prime + "-divider"}/>
                    <p className="inline-grid" key={prime+"-paragraph"}>
                        <span key={prime + "-number"}><NumberToString number={prime}/></span>
                    </p>
                </div>
            )}
        </>}
    </>
}

export default RandomPrimes;