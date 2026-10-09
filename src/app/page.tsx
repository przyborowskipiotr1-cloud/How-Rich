import { Nav } from "@/components/Nav";
import { FlowBars } from "@/components/FlowBars";
import { TransactionForm } from "@/components/TransactionForm";
import { DeleteButton } from "@/components/DeleteButton";
import { createClient } from "@/lib/supabase/server";
import { DEFAULT_CURRENCY, formatMoney } from "@/lib/money";
import { summarize, type FlowRow } from "@/lib/flow";

export default async function Dashboard() {
  const supabase = await createClient();
  const now = new Date();
  const monthKey = now.toISOString().slice(0, 7);
  const monthStart = `${monthKey}-01`;

  const [{ data: profile }, { data: accounts }, { data: categories }, { data: transactions }] = await Promise.all([
    supabase.from("profiles").select("currency").single(),
    supabase.from("accounts").select("id, name").order("created_at"),
    supabase.from("categories").select("id, name").order("name"),
    supabase
      .from("transactions")
      .select("id, kind, amount, occurred_on, note, categories(name)")
      .gte("occurred_on", monthStart)
      .order("occurred_on", { ascending: false })
      .order("created_at", { ascending: false }),
  ]);

  const currency = profile?.currency ?? DEFAULT_CURRENCY;
  const rows = transactions ?? [];
  const flow: FlowRow[] = rows.map((t) => ({
    kind: t.kind,
    amount: Number(t.amount), // numeric columns arrive as strings
    occurred_on: t.occurred_on,
    category: (t.categories as unknown as { name: string } | null)?.name ?? null,
  }));
  const s = summarize(flow);
  const monthLabel = now.toLocaleDateString("en-GB", { month: "long", year: "numeric" });

  const tiles = [
    { label: "Income", value: s.income, color: "var(--series-3)" },
    { label: "Spent", value: s.expense, color: "var(--series-2)" },
    { label: "Saved", value: s.saved, color: "var(--series-1)" },
    { label: "Net", value: s.net, color: s.net >= 0 ? "var(--good)" : "var(--danger)" },
  ];

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-5xl space-y-6 px-4 pb-16">
        <div>
          <p className="text-sm text-[color:var(--muted)]">{monthLabel}</p>
          <h1 className="text-2xl font-semibold tracking-tight">Money flow</h1>
        </div>

        <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {tiles.map((tile) => (
            <div key={tile.label} className="rounded-2xl bg-[color:var(--surface-1)] p-4">
              <p className="flex items-center gap-2 text-xs text-[color:var(--text-secondary)]">
                <span style={{ color: tile.color }}>●</span>
                {tile.label}
              </p>
              <p className="mt-2 text-xl font-semibold tabular-nums">{formatMoney(tile.value, currency)}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-[color:var(--surface-1)] p-5">
            <h2 className="mb-4 text-sm font-medium text-[color:var(--text-secondary)]">Spending by category</h2>
            <FlowBars rows={s.byCategory} currency={currency} />
          </div>

          <div className="rounded-2xl bg-[color:var(--surface-1)] p-5">
            <h2 className="mb-4 text-sm font-medium text-[color:var(--text-secondary)]">Add entry</h2>
            <TransactionForm accounts={accounts ?? []} categories={categories ?? []} />
          </div>
        </section>

        <section className="rounded-2xl bg-[color:var(--surface-1)] p-5">
          <h2 className="mb-3 text-sm font-medium text-[color:var(--text-secondary)]">Recent this month</h2>
          {rows.length === 0 ? (
            <p className="text-sm text-[color:var(--muted)]">Nothing yet. Add your first entry above.</p>
          ) : (
            <ul className="divide-y divide-[color:var(--hairline)]">
              {rows.slice(0, 6).map((t) => (
                <li key={t.id} className="flex items-center justify-between py-2.5 text-sm">
                  <span className="text-[color:var(--text-secondary)]">
                    {t.occurred_on} · {t.kind}
                    {t.note ? ` · ${t.note}` : ""}
                  </span>
                  <span className="flex items-center gap-4 tabular-nums">
                    {formatMoney(Number(t.amount), currency)}
                    <DeleteButton id={t.id} />
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </>
  );
}
