"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CURRENCIES } from "@/lib/money";
import { parseTransactionForm } from "@/lib/transactions";

export type FormState = { error?: string; message?: string } | undefined;

export async function signIn(_prev: FormState, form: FormData): Promise<FormState> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: String(form.get("email") ?? ""),
    password: String(form.get("password") ?? ""),
  });
  if (error) return { error: "Wrong email or password." };
  redirect("/");
}

export async function signUp(_prev: FormState, form: FormData): Promise<FormState> {
  const password = String(form.get("password") ?? "");
  if (password.length < 8) return { error: "Password must be at least 8 characters." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: String(form.get("email") ?? ""),
    password,
  });
  if (error) return { error: error.message };
  redirect("/");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function addTransaction(_prev: FormState, form: FormData): Promise<FormState> {
  const parsed = parseTransactionForm(form);
  if (!parsed.ok) return { error: parsed.error };

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/login");

  const { error } = await supabase.from("transactions").insert({ ...parsed.value, user_id: auth.user.id });
  if (error) return { error: "Could not save. Try again." };

  revalidatePath("/");
  revalidatePath("/history");
  return { message: "Saved." };
}

export async function deleteTransaction(id: string) {
  const supabase = await createClient();
  await supabase.from("transactions").delete().eq("id", id);
  revalidatePath("/");
  revalidatePath("/history");
}

export async function updateCurrency(_prev: FormState, form: FormData): Promise<FormState> {
  const currency = String(form.get("currency") ?? "");
  if (!(CURRENCIES as readonly string[]).includes(currency)) return { error: "Unsupported currency." };

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/login");

  const { error } = await supabase.from("profiles").update({ currency }).eq("id", auth.user.id);
  if (error) return { error: "Could not save currency." };

  revalidatePath("/", "layout");
  return { message: "Currency updated." };
}

export async function addCategory(_prev: FormState, form: FormData): Promise<FormState> {
  const name = String(form.get("name") ?? "").trim();
  if (!name || name.length > 60) return { error: "Name must be 1–60 characters." };

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/login");

  const { error } = await supabase.from("categories").insert({ name, user_id: auth.user.id });
  if (error) return { error: "That category already exists." };

  revalidatePath("/settings");
  revalidatePath("/");
  return { message: "Category added." };
}
