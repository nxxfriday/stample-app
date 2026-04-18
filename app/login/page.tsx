"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    fontFamily: "Arial, sans-serif",
  } as const,
  card: {
    width: "100%",
    maxWidth: "460px",
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "22px",
    padding: "30px",
    boxShadow: "0 18px 50px rgba(15, 23, 42, 0.10)",
  } as const,
  brand: {
    fontSize: "14px",
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    color: "#4f46e5",
    marginBottom: "10px",
  } as const,
  title: {
    fontSize: "32px",
    fontWeight: 700,
    color: "#111827",
    margin: "0 0 8px 0",
  } as const,
  subtitle: {
    color: "#6b7280",
    margin: "0 0 24px 0",
    lineHeight: 1.5,
  } as const,
  form: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "14px",
  },
  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: 700,
    color: "#111827",
    marginBottom: "6px",
  } as const,
  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "12px",
    border: "1px solid #d1d5db",
    background: "#fff",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box" as const,
  },
  button: {
    marginTop: "6px",
    padding: "13px 16px",
    borderRadius: "12px",
    border: "none",
    background: "#111827",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: "14px",
  } as const,
  error: {
    background: "#fef2f2",
    color: "#b91c1c",
    border: "1px solid #fecaca",
    borderRadius: "12px",
    padding: "12px 14px",
    fontSize: "14px",
  } as const,
  footer: {
    marginTop: "22px",
    fontSize: "14px",
    color: "#6b7280",
  } as const,
  link: {
    color: "#4f46e5",
    fontWeight: 700,
    textDecoration: "none",
  } as const,
};

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMessage(error.message);
      setSubmitting(false);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.brand}>STAMPLE</div>
        <h1 style={styles.title}>Welcome back</h1>
        <p style={styles.subtitle}>
          Log in to manage bookings, view your dashboard, and keep your notary business moving.
        </p>

        {errorMessage ? <div style={styles.error}>{errorMessage}</div> : null}

        <form onSubmit={handleLogin} style={styles.form}>
          <div>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <button type="submit" style={styles.button} disabled={submitting}>
            {submitting ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={styles.footer}>
          Need an account?{" "}
          <Link href="/signup" style={styles.link}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}