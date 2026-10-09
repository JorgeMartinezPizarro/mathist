import Link from "next/link";

import { SECTIONS } from "@/sections";

export default function NotFound() {
  return <>
    <h1>Not found</h1>
    <div className="intro">
      <p>The requested page cannot be found in this server. Try with one of these:</p>
      <p>
        {SECTIONS.map(({ slug, label }, index) => <span key={slug}>
          {index > 0 && ", "}
          <Link href={"/" + slug}>{label}</Link>
        </span>)}
      </p>
    </div>
  </>
}
