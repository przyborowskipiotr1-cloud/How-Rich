"use client";

import { useActionState, useState } from "react";
import { signIn, signUp, type FormState } from "@/app/actions";

const field =
  "w-full rounded-lg border border-[color:var(--hairline)] bg-[color:var(--page)] px-3 py-2.5 text-sm outline-none focus:border-[color:var(--accent)]";

export function AuthForm() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [state, action, pending] = useActionState<FormState, FormData>(
    mode === "login" ? signIn : signUp,
    undefined,
  );

  return (
    <div className="w-full max-w-sm rounded-2xl bg-[color:var(--surface-1)] p-6">
      <h1 className="text-xl font-semibold tracking-tight">How Rich</h1>
      <p className="mb-6 text-sm text-[color:var(--muted)]">
        {mode === "login" ? "Log in to your money flow." : "Create an account."}
      </p>
      <form key={mode} action={action} className="space-y-3">
        <input name="email" type="email" autoComplete="email" placeholder="Email" required className={field} />
        <input
          name="password"
          type="password"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          placeholder="Password (min. 8 characters)"
          required
          minLength={mode === "signup" ? 8 : undefined}
          className={field}
        />
        {state?.error && (
          <p className="text-sm" role="alert" style={{ color: "var(--danger)" }}>
            {state.error}
          </p>
        )}
        <button
          disabled={pending}
          className="w-full rounded-lg bg-[color:var(--accent)] py-2.5 text-sm font-medium text-white disabled:opacity-50"
        >
          {pending ? "Please wait…" : mode === "login" ? "Log in" : "Sign up"}
        </button>
      </form>
      <button
        type="button"
        onClick={() => setMode(mode === "login" ? "signup" : "login")}
        className="mt-4 w-full text-sm text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]"
      >
        {mode === "login" ? "No account? Sign up" : "Have an account? Log in"}
      </button>
    </div>
  );
}
