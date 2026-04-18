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
    maxWidth: "500px",
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
  select: {
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

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role,
        },
      },
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
        <h1 style={styles.title}>Create your account</h1>
        <p style={styles.subtitle}>
          Join STAMPLE as a customer or notary and get started with bookings, verification, and job management.
        </p>

        {errorMessage ? <div style={styles.error}>{errorMessage}</div> : null}

        <form onSubmit={handleSignup} style={styles.form}>
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
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div>
            <label style={styles.label}>Account Type</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={styles.select}
            >
              <option value="customer">Customer</option>
              <option value="notary">Notary</option>
            </select>
          </div>

          <button type="submit" style={styles.button} disabled={submitting}>
            {submitting ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account?{" "}
          <Link href="/login" style={styles.link}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}