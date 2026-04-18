"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

type NotaryProfile = {
  id: string;
  notary_name?: string | null;
  profile_photo_url?: string | null;
  city?: string | null;
  state?: string | null;
  county?: string | null;
  zip?: string | null;
  occupation?: string | null;
  bio?: string | null;
  average_rating?: number | null;
  review_count?: number | null;
  role?: string | null;
};

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f7f8fc",
    padding: "40px 20px 60px",
    fontFamily: "Arial, sans-serif",
  } as const,
  container: {
    maxWidth: "1100px",
    margin: "0 auto",
  } as const,
  title: {
    fontSize: "32px",
    fontWeight: 800,
    marginBottom: "10px",
  } as const,
  subtitle: {
    color: "#6b7280",
    marginBottom: "24px",
  } as const,
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "16px",
  } as const,
  card: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "18px",
    padding: "20px",
    boxShadow: "0 8px 24px rgba(15,23,42,0.06)",
  } as const,
  image: {
    width: "84px",
    height: "84px",
    borderRadius: "999px",
    objectFit: "cover" as const,
    marginBottom: "12px",
    border: "1px solid #ddd",
  },
  name: {
    margin: "0 0 8px 0",
    fontSize: "22px",
    fontWeight: 800,
  } as const,
  muted: {
    color: "#6b7280",
    margin: "4px 0",
  } as const,
  button: {
    display: "inline-block",
    marginTop: "14px",
    padding: "10px 14px",
    borderRadius: "12px",
    background: "#111827",
    color: "#fff",
    textDecoration: "none",
    fontWeight: 700,
  } as const,
};

export default function NotariesPage() {
  const [notaries, setNotaries] = useState<NotaryProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNotaries = async () => {
      const { data: approvedRows, error: approvedError } = await supabase
        .from("notary_verifications")
        .select("user_id")
        .eq("status", "approved");

      if (approvedError) {
        console.error(approvedError);
        setLoading(false);
        return;
      }

      const approvedIds = (approvedRows || []).map((row) => row.user_id);

      if (approvedIds.length === 0) {
        setNotaries([]);
        setLoading(false);
        return;
      }

      const { data: profileRows, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "notary")
        .in("id", approvedIds);

      if (profileError) {
        console.error(profileError);
        setLoading(false);
        return;
      }

      setNotaries((profileRows || []) as NotaryProfile[]);
      setLoading(false);
    };

    loadNotaries();
  }, []);

  if (loading) {
    return <div style={{ padding: "40px" }}>Loading notaries...</div>;
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Browse Approved Notaries</h1>
        <p style={styles.subtitle}>
          View verified notary profiles and choose who you want to book.
        </p>

        {notaries.length === 0 ? (
          <p>No approved notary profiles found yet.</p>
        ) : (
          <div style={styles.grid}>
            {notaries.map((notary) => (
              <div key={notary.id} style={styles.card}>
                {notary.profile_photo_url ? (
                  <img
                    src={notary.profile_photo_url}
                    alt={notary.notary_name || "Notary"}
                    style={styles.image}
                  />
                ) : null}

                <h2 style={styles.name}>
                  {notary.notary_name || "Unnamed Notary"}
                </h2>

                <p style={styles.muted}>
                  {notary.city || ""}
                  {notary.city && notary.state ? ", " : ""}
                  {notary.state || ""}
                </p>

                <p style={styles.muted}>{notary.occupation || "Notary"}</p>

                <p style={styles.muted}>
                  ⭐ {Number(notary.average_rating || 0).toFixed(1)} (
                  {notary.review_count || 0} reviews)
                </p>

                <p style={styles.muted}>{notary.bio || "No bio yet."}</p>

                <Link href={`/notaries/${notary.id}`} style={styles.button}>
                  View Profile
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}