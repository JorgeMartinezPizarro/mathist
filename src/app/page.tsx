import { redirect } from "next/navigation";

import { SECTIONS } from "@/app/sections";

export default function Home() {
    redirect("/" + SECTIONS[0].slug);
}
