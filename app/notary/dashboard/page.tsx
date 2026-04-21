"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Profile = {
  id: string;
  role: string;
  phone?: string | null;
};

type NotaryProfile = {
  id: string;
  business_name: string;
  commission_number: string;
  state: string;
  service_area: string;
  travel_radius_miles: number;
  bio?: string | null;
  is_verified: boolean;
  is_active: boolean;
  created_at?: string;
};

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
    maxWidth: "900px",
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
  badge: {
    display: "inline-block",
    padding: "8px 12px",
    borderRadius: "999px",
    fontWeight: 700,
    fontSize: "14px",
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
  buttonSecondary: {
    padding: "10px 14px",
    borderRadius: "12px",
    border: "1px solid #d1d5db",
    background: "#fff",
    color: "#111827",
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
};

export default function NotaryDashboardPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [updatingBookingId, setUpdatingBookingId] = useState<string | null>(null);

  const [userEmail, setUserEmail] = useState("");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [notaryProfile, setNotaryProfile] = useState<NotaryProfile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState("");

  const loadBookings = async (notaryId: string) => {
    setLoadingBookings(true);

    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("notary_id", notaryId)
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
      setLoadingBookings(false);
      return;
    }

    setBookings((data || []) as Booking[]);
    setLoadingBookings(false);
  };

  const loadDashboard = async () => {
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

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError) {
        throw new Error(profileError.message);
      }

      setProfile(profileData);

      const { data: notaryData, error: notaryError } = await supabase
        .from("notary_profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (notaryError) {
        throw new Error(
          "No notary profile found yet. Please submit your notary application first."
        );
      }

      setNotaryProfile(notaryData);
      await loadBookings(user.id);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const toggleActiveStatus = async () => {
    if (!notaryProfile) return;

    setSaving(true);
    setError("");

    try {
      const nextValue = !notaryProfile.is_active;

      const { error } = await supabase
        .from("notary_profiles")
        .update({
          is_active: nextValue,
        })
        .eq("id", notaryProfile.id);

      if (error) {
        throw new Error(error.message);
      }

      setNotaryProfile({
        ...notaryProfile,
        is_active: nextValue,
      });
    } catch (err: any) {
      setError(err.message || "Failed to update active status.");
    } finally {
      setSaving(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, status: string) => {
    setUpdatingBookingId(bookingId);
    setError("");

    try {
      const { error } = await supabase
        .from("bookings")
        .update({ status })
        .eq("id", bookingId);

      if (error) {
        throw new Error(error.message);
      }

      if (notaryProfile) {
        await loadBookings(notaryProfile.id);
      }
    } catch (err: any) {
      setError(err.message || "Failed to update booking.");
    } finally {
      setUpdatingBookingId(null);
    }
  };

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

  if (error && !notaryProfile) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.card}>
            <h1 style={styles.title}>Notary Dashboard</h1>
            <p style={{ color: "red", marginBottom: "12px" }}>{error}</p>
            <button onClick={loadDashboard} style={styles.buttonPrimary}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isVerified = !!notaryProfile?.is_verified;
  const isActive = !!notaryProfile?.is_active;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Notary Dashboard</h1>
        <p style={styles.muted}>Signed in as: {userEmail}</p>

        {error && (
          <div style={styles.card}>
            <p style={{ color: "red" }}>{error}</p>
          </div>
        )}

        <div style={styles.card}>
          <h2 style={styles.subtitle}>Account Status</h2>

          <div style={styles.row}>
            <span
              style={{
                ...styles.badge,
                background: isVerified ? "#dcfce7" : "#fef3c7",
                color: isVerified ? "#166534" : "#92400e",
              }}
            >
              {isVerified ? "Verified" : "Pending Approval"}
            </span>

            <span
              style={{
                ...styles.badge,
                background: isActive ? "#dbeafe" : "#f3f4f6",
                color: isActive ? "#1d4ed8" : "#374151",
              }}
            >
              {isActive ? "Active" : "Inactive"}
            </span>

            <span
              style={{
                ...styles.badge,
                background: profile?.role === "notary" ? "#ede9fe" : "#f3f4f6",
                color: profile?.role === "notary" ? "#5b21b6" : "#374151",
              }}
            >
              Role: {profile?.role || "unknown"}
            </span>
          </div>

          <div style={styles.row}>
            <button
              onClick={toggleActiveStatus}
              style={styles.buttonPrimary}
              disabled={saving || !isVerified}
            >
              {saving
                ? "Saving..."
                : isActive
                ? "Set as Inactive"
                : "Set as Active"}
            </button>

            <button onClick={loadDashboard} style={styles.buttonSecondary}>
              Refresh
            </button>
          </div>

          {!isVerified && (
            <p style={{ ...styles.muted, marginTop: "12px" }}>
              Your application has not been approved yet. You can’t go active until admin approval is complete.
            </p>
          )}
        </div>

        <div style={styles.card}>
          <h2 style={styles.subtitle}>Business Information</h2>
          <p><strong>Business Name:</strong> {notaryProfile?.business_name || "—"}</p>
          <p><strong>Commission Number:</strong> {notaryProfile?.commission_number || "—"}</p>
          <p><strong>State:</strong> {notaryProfile?.state || "—"}</p>
          <p><strong>Service Area:</strong> {notaryProfile?.service_area || "—"}</p>
          <p><strong>Travel Radius:</strong> {notaryProfile?.travel_radius_miles ?? 0} miles</p>
          <p><strong>Phone:</strong> {profile?.phone || "—"}</p>
          <p><strong>Bio:</strong> {notaryProfile?.bio || "—"}</p>
        </div>

        <div style={styles.card}>
          <h2 style={styles.subtitle}>Jobs</h2>

          {loadingBookings ? (
            <p style={styles.muted}>Loading bookings...</p>
          ) : bookings.length === 0 ? (
            <p style={styles.muted}>No assigned bookings yet.</p>
          ) : (
            bookings.map((booking) => (
              <div
                key={booking.id}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: "14px",
                  padding: "16px",
                  marginBottom: "14px",
                }}
              >
                <p><strong>Service:</strong> {booking.service_type}</p>
                <p><strong>Status:</strong> {booking.status}</p>
                <p>
                  <strong>Appointment:</strong>{" "}
                  {new Date(booking.appointment_time).toLocaleString()}
                </p>
                <p>
                  <strong>Address:</strong> {booking.address}, {booking.city}, {booking.state} {booking.zip}
                </p>
                <p><strong>Notes:</strong> {booking.notes || "—"}</p>

                <div style={styles.row}>
                  <button
                    onClick={() => updateBookingStatus(booking.id, "accepted")}
                    style={styles.buttonPrimary}
                    disabled={updatingBookingId === booking.id}
                  >
                    {updatingBookingId === booking.id ? "Saving..." : "Accept"}
                  </button>

                  <button
                    onClick={() => updateBookingStatus(booking.id, "rejected")}
                    style={styles.buttonDanger}
                    disabled={updatingBookingId === booking.id}
                  >
                    {updatingBookingId === booking.id ? "Saving..." : "Reject"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}