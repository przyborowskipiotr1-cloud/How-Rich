"use client";

import { deleteTransaction } from "@/app/actions";

export function DeleteButton({ id }: { id: string }) {
  return (
    <button
      onClick={() => confirm("Delete this entry?") && deleteTransaction(id)}
      className="text-xs text-[color:var(--muted)] hover:text-[color:var(--danger)]"
      aria-label="Delete entry"
    >
      Delete
    </button>
  );
}
