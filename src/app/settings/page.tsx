import { Nav } from "@/components/Nav";
import { SettingsForms } from "@/components/SettingsForms";
import { createClient } from "@/lib/supabase/server";
import { DEFAULT_CURRENCY } from "@/lib/money";

export default async function Settings() {
  const supabase = await createClient();
  const [{ data: profile }, { data: categories }, { data: accounts }] = await Promise.all([
    supabase.from("profiles").select("currency").single(),
    supabase.from("categories").select("id, name").order("name"),
    supabase.from("accounts").select("id, name").order("created_at"),
  ]);

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-3xl space-y-6 px-4 pb-16">
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <SettingsForms
          currency={profile?.currency ?? DEFAULT_CURRENCY}
          categories={categories ?? []}
          accounts={accounts ?? []}
        />
      </main>
    </>
  );
}
