import { redirect } from "next/navigation";

import { SECTIONS } from "@/sections";

export default function Home() {
    redirect("/" + SECTIONS[0].slug);
}
