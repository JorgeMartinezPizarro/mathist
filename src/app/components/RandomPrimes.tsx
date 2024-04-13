import duration from "@/helpers/duration";
import { RandomPrimesReport } from "@/helpers/randomPrimes";
import { Alert, Button, CircularProgress, FormGroup, TextField } from "@mui/material";
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
    const [amount, setAmount] = useState(10)
    const [error, setError] = useState<string>("")

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
        <p>We generate primes by using the Baillie-PSW and the Miller-Rabin primaly tests.</p>
        <hr/>
        <p>Write a length and amount to generate random primes:</p>
        <hr/>
        <FormGroup row={true}>
            <TextField
                className="input"
                label="Length"
                type="string"
                value={length}
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
            <Button onClick={handleSend} variant="contained">GENERATE</Button>
            {loading && <CircularProgress/>}
        </FormGroup>
        {error && <><hr/><Alert severity="error">{error}</Alert></>}

        {!error && !loading && randomPrimes.primes.length > 0 && <>
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