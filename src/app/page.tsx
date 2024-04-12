'use client'

import { redirect } from 'next/navigation'

const Home = () => {
    redirect("/sieve");
}

export default Home;