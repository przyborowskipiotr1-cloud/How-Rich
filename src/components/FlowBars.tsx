import { formatMoney } from "@/lib/money";

type Row = { category: string; total: number };

// Horizontal bars, one per category. Hover (title) shows the exact amount; the table below is the text view.
export function FlowBars({ rows, currency }: { rows: Row[]; currency: string }) {
  if (rows.length === 0) {
    return <p className="text-sm text-[color:var(--muted)]">No spending this month yet.</p>;
  }
  const max = Math.max(...rows.map((r) => r.total));
  const total = rows.reduce((sum, r) => sum + r.total, 0);

  return (
    <ul className="space-y-3">
      {rows.map((row, i) => {
        const color = `var(--series-${(i % 6) + 1})`;
        const label = `${row.category}: ${formatMoney(row.total, currency)} (${Math.round((row.total / total) * 100)}%)`;
        return (
          <li key={row.category} title={label} className="group">
            <div className="mb-1 flex justify-between text-sm">
              <span className="text-[color:var(--text-secondary)]">{row.category}</span>
              <span className="tabular-nums text-[color:var(--text-primary)]">{formatMoney(row.total, currency)}</span>
            </div>
            <div className="h-2 rounded-full bg-[color:var(--hairline)]">
              <div
                className="h-2 rounded-full transition-opacity group-hover:opacity-80"
                style={{ width: `${(row.total / max) * 100}%`, background: color }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
