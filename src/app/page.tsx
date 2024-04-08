'use client'

import { redirect } from 'next/navigation'

export default () => {
    redirect("/sieve", "push");
}