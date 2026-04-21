"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Booking = {
  id: string;
  customer_id: string;
  notary_id: string;
  service_type: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  appointment_time: string;
  status: string;
  notes?: string | null;
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
    maxWidth: "950px",
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
    fontSize: "30px",
    fontWeight: 800,
    marginBottom: "10px",
  } as const,
  subtitle: {
    fontSize: "20px",
    fontWeight: 700,
    marginBottom: "12px",
  } as const,
  muted: {
    color: "#6b7280",
  } as const,
  row: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap" as const,
    marginTop: "14px",
  } as const,
  buttonPrimary: {
    padding: "10px 14px",
    borderRadius: "12px",
    border: "none",
    background: "#111827",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 700,
  } as const,
  badge: {
    display: "inline-block",
    padding: "8px 12px",
    borderRadius: "999px",
    fontWeight: 700,
    fontSize: "14px",
  } as const,
};

function getStatusStyles(status: string) {
  switch (status) {
    case "accepted":
      return { background: "#dcfce7", color: "#166534" };
    case "rejected":
      return { background: "#fee2e2", color: "#991b1b" };
    case "pending":
      return { background: "#fef3c7", color: "#92400e" };
    default:
      return { background: "#f3f4f6", color: "#374151" };
  }
}

export default function CustomerDashboardPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState("");

  const loadBookings = async () => {
    setLoading(true);
    setError("");

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        router.push("/login");
        return;
      }

      setUserEmail(user.email || "");

      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("customer_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      setBookings((data || []) as Booking[]);
    } catch (err: any) {
      setError(err.message || "Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.card}>
            <p>Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Customer Dashboard</h1>
        <p style={styles.muted}>Signed in as: {userEmail}</p>

        {error && (
          <div style={styles.card}>
            <p style={{ color: "red" }}>{error}</p>
          </div>
        )}

        <div style={styles.card}>
          <h2 style={styles.subtitle}>Your Bookings</h2>

          <div style={styles.row}>
            <button onClick={loadBookings} style={styles.buttonPrimary}>
              Refresh
            </button>
          </div>
        </div>

        {bookings.length === 0 ? (
          <div style={styles.card}>
            <p style={styles.muted}>You have no bookings yet.</p>
          </div>
        ) : (
          bookings.map((booking) => {
            const statusStyle = getStatusStyles(booking.status);

            return (
              <div key={booking.id} style={styles.card}>
                <p><strong>Service:</strong> {booking.service_type}</p>

                <div style={{ margin: "10px 0" }}>
                  <span
                    style={{
                      ...styles.badge,
                      background: statusStyle.background,
                      color: statusStyle.color,
                    }}
                  >
                    {booking.status}
                  </span>
                </div>

                <p>
                  <strong>Appointment:</strong>{" "}
                  {new Date(booking.appointment_time).toLocaleString()}
                </p>

                <p>
                  <strong>Address:</strong> {booking.address}, {booking.city}, {booking.state} {booking.zip}
                </p>

                <p><strong>Notes:</strong> {booking.notes || "—"}</p>

                <p style={{ ...styles.muted, marginTop: "10px" }}>
                  Booking ID: {booking.id}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}