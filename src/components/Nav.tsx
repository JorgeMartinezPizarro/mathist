'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"

import { SECTIONS } from "@/sections"

const Nav = () => {
    const pathname = usePathname()

    return <nav className="nav">
        {SECTIONS.map(({ slug, label }) => {
            const href = "/" + slug
            return <Link key={slug} href={href} aria-current={pathname === href ? "page" : undefined}>{label}</Link>
        })}
    </nav>
}

export default Nav
