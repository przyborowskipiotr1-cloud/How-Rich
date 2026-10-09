import { Nav } from "@/components/Nav";
import { DeleteButton } from "@/components/DeleteButton";
import { createClient } from "@/lib/supabase/server";
import { DEFAULT_CURRENCY, formatMoney } from "@/lib/money";

export default async function History() {
  const supabase = await createClient();
  const [{ data: profile }, { data: transactions }] = await Promise.all([
    supabase.from("profiles").select("currency").single(),
    supabase
      .from("transactions")
      .select("id, kind, amount, occurred_on, note, categories(name)")
      .order("occurred_on", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(200),
  ]);
  const currency = profile?.currency ?? DEFAULT_CURRENCY;
  const rows = transactions ?? [];

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-5xl px-4 pb-16">
        <h1 className="mb-6 text-2xl font-semibold tracking-tight">History</h1>
        <div className="overflow-x-auto rounded-2xl bg-[color:var(--surface-1)]">
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-[color:var(--muted)]">
              <tr className="border-b border-[color:var(--hairline)]">
                <th className="px-4 py-3 font-normal">Date</th>
                <th className="px-4 py-3 font-normal">Type</th>
                <th className="px-4 py-3 font-normal">Category</th>
                <th className="px-4 py-3 font-normal">Note</th>
                <th className="px-4 py-3 text-right font-normal">Amount</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {rows.map((t) => (
                <tr key={t.id} className="border-b border-[color:var(--hairline)] last:border-0">
                  <td className="px-4 py-3 tabular-nums">{t.occurred_on}</td>
                  <td className="px-4 py-3 capitalize">{t.kind}</td>
                  <td className="px-4 py-3 text-[color:var(--text-secondary)]">
                    {(t.categories as unknown as { name: string } | null)?.name ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-[color:var(--text-secondary)]">{t.note ?? ""}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{formatMoney(Number(t.amount), currency)}</td>
                  <td className="px-4 py-3 text-right">
                    <DeleteButton id={t.id} />
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-[color:var(--muted)]">
                    No entries yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}
