"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

type VerificationRecord = {
  id: string;
  user_id: string;
  notary_id_number: string;
  commission_expiry: string;
  commission_pdf_url: string;
  drivers_license_number: string;
  drivers_license_pdf_url: string;
  insurance_provider: string;
  insurance_expiry: string;
  insurance_pdf_url: string;
  status: string;
  created_at?: string;
};

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f7f8fc",
    padding: "32px 20px 60px",
    fontFamily: "Arial, sans-serif",
  } as const,
  container: {
    maxWidth: "1100px",
    margin: "0 auto",
  } as const,
  card: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "18px",
    padding: "20px",
    marginBottom: "18px",
    boxShadow: "0 8px 24px rgba(15,23,42,0.06)",
  } as const,
  title: {
    fontSize: "28px",
    fontWeight: 800,
    marginBottom: "18px",
  } as const,
  subtitle: {
    fontSize: "18px",
    fontWeight: 700,
    marginBottom: "12px",
  } as const,
  row: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap" as const,
    marginTop: "14px",
  },
  buttonPrimary: {
    padding: "10px 14px",
    borderRadius: "12px",
    border: "none",
    background: "#111827",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 700,
  } as const,
  buttonSuccess: {
    padding: "10px 14px",
    borderRadius: "12px",
    border: "none",
    background: "#16a34a",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 700,
  } as const,
  buttonDanger: {
    padding: "10px 14px",
    borderRadius: "12px",
    border: "none",
    background: "#dc2626",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 700,
  } as const,
  buttonSecondary: {
    padding: "10px 14px",
    borderRadius: "12px",
    border: "1px solid #d1d5db",
    background: "#fff",
    color: "#111827",
    cursor: "pointer",
    fontWeight: 700,
  } as const,
  muted: {
    color: "#6b7280",
  } as const,
  link: {
    color: "#2563eb",
    wordBreak: "break-all" as const,
  } as const,
};

export default function AdminPage() {
  const router = useRouter();

  const [userEmail, setUserEmail] = useState("");
  const [records, setRecords] = useState<VerificationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        router.push("/login");
        return;
      }

      setUserEmail(user.email || "");
      await loadVerifications();
    };

    init();
  }, [router]);

  const loadVerifications = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("notary_verifications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      alert(`Error loading verifications: ${error.message}`);
      setLoading(false);
      return;
    }

    setRecords((data || []) as VerificationRecord[]);
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id);

    const { error } = await supabase
      .from("notary_verifications")
      .update({ status })
      .eq("id", id);

    if (error) {
      alert(`Error updating status: ${error.message}`);
      setUpdatingId(null);
      return;
    }

    setUpdatingId(null);
    await loadVerifications();
  };

  const pending = records.filter((r) => r.status === "pending");
  const approved = records.filter((r) => r.status === "approved");
  const rejected = records.filter((r) => r.status === "rejected");
  const expired = records.filter((r) => r.status === "expired");

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>STAMPLE Admin Approval</h1>
        <p style={styles.muted}>Signed in as: {userEmail}</p>

        <div style={styles.card}>
          <p><strong>Pending:</strong> {pending.length}</p>
          <p><strong>Approved:</strong> {approved.length}</p>
          <p><strong>Rejected:</strong> {rejected.length}</p>
          <p><strong>Expired:</strong> {expired.length}</p>
        </div>

        <div style={styles.card}>
          <div style={styles.row}>
            <button onClick={loadVerifications} style={styles.buttonPrimary}>
              {loading ? "Loading..." : "Refresh"}
            </button>
            disabled={booking.payment_status === "paid"}
          </div>
        </div>

        {records.length === 0 ? (
          <div style={styles.card}>
            <p style={styles.muted}>No verification records found.</p>
          </div>
        ) : (
          records.map((record) => (
            <div key={record.id} style={styles.card}>
              <h2 style={styles.subtitle}>Verification Record</h2>
              <p><strong>User ID:</strong> {record.user_id}</p>
              <p><strong>Status:</strong> {record.status}</p>
              <p><strong>Notary ID:</strong> {record.notary_id_number}</p>
              <p><strong>Commission Expiry:</strong> {record.commission_expiry}</p>
              <p><strong>Driver's License #:</strong> {record.drivers_license_number}</p>
              <p><strong>Insurance Provider:</strong> {record.insurance_provider}</p>
              <p><strong>Insurance Expiry:</strong> {record.insurance_expiry}</p>

              <p>
                <strong>Commission PDF:</strong>{" "}
                <a href={record.commission_pdf_url} target="_blank" rel="noreferrer" style={styles.link}>
                  Open document
                </a>
              </p>

              <p>
                <strong>License PDF:</strong>{" "}
                <a href={record.drivers_license_pdf_url} target="_blank" rel="noreferrer" style={styles.link}>
                  Open document
                </a>
              </p>

              <p>
                <strong>Insurance PDF:</strong>{" "}
                <a href={record.insurance_pdf_url} target="_blank" rel="noreferrer" style={styles.link}>
                  Open document
                </a>
              </p>

              <div style={styles.row}>
                <button
                  onClick={() => updateStatus(record.id, "approved")}
                  style={styles.buttonSuccess}
                  disabled={updatingId === record.id}
                >
                  Approve
                </button>

                <button
                  onClick={() => updateStatus(record.id, "rejected")}
                  style={styles.buttonDanger}
                  disabled={updatingId === record.id}
                >
                  Reject
                </button>

                <button
                  onClick={() => updateStatus(record.id, "expired")}
                  style={styles.buttonSecondary}
                  disabled={updatingId === record.id}
                >
                  Mark Expired
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}