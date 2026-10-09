import Link from "next/link";
import { signOut } from "@/app/actions";

const LINKS = [
  { href: "/", label: "Dashboard" },
  { href: "/history", label: "History" },
  { href: "/settings", label: "Settings" },
];

export function Nav() {
  return (
    <header className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5">
      <Link href="/" className="text-lg font-semibold tracking-tight">
        How Rich
      </Link>
      <nav className="flex items-center gap-1 text-sm">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-lg px-3 py-1.5 text-[color:var(--text-secondary)] hover:bg-[color:var(--surface-1)] hover:text-[color:var(--text-primary)]"
          >
            {link.label}
          </Link>
        ))}
        <form action={signOut}>
          <button className="ml-2 rounded-lg px-3 py-1.5 text-[color:var(--muted)] hover:text-[color:var(--danger)]">
            Log out
          </button>
        </form>
      </nav>
    </header>
  );
}
