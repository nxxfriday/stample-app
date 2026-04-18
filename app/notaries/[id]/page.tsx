"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../../lib/supabase";

type NotaryProfile = {
  id: string;
  notary_name?: string | null;
  notary_number?: string | null;
  profile_photo_url?: string | null;
  city?: string | null;
  state?: string | null;
  county?: string | null;
  zip?: string | null;
  occupation?: string | null;
  bio?: string | null;
  average_rating?: number | null;
  review_count?: number | null;
};

export default function NotaryProfilePage({ params }: { params: { id: string } }) {
  const [profile, setProfile] = useState<NotaryProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [approved, setApproved] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      const { data: verification, error: verificationError } = await supabase
        .from("notary_verifications")
        .select("user_id, status")
        .eq("user_id", params.id)
        .eq("status", "approved")
        .maybeSingle();

      if (verificationError) {
        console.error(verificationError);
        setLoading(false);
        return;
      }

      if (!verification) {
        setApproved(false);
        setLoading(false);
        return;
      }

      setApproved(true);

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", params.id)
        .maybeSingle();

      if (error) {
        console.error(error);
      } else {
        setProfile((data as NotaryProfile | null) || null);
      }

      setLoading(false);
    };

    loadProfile();
  }, [params.id]);

  if (loading) {
    return <div style={{ padding: "40px" }}>Loading profile...</div>;
  }

  if (!approved || !profile) {
    return <div style={{ padding: "40px" }}>Approved notary profile not found.</div>;
  }

  return (
    <div style={{ padding: "40px", background: "#f7f8fc", minHeight: "100vh", fontFamily: "Arial, sans-serif" }}>
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: "20px",
          padding: "28px",
          boxShadow: "0 8px 24px rgba(15,23,42,0.06)",
        }}
      >
        {profile.profile_photo_url ? (
          <img
            src={profile.profile_photo_url}
            alt={profile.notary_name || "Notary"}
            style={{
              width: "110px",
              height: "110px",
              borderRadius: "999px",
              objectFit: "cover",
              marginBottom: "16px",
              border: "1px solid #ddd",
            }}
          />
        ) : null}

        <h1 style={{ margin: "0 0 8px 0", fontSize: "32px" }}>
          {profile.notary_name || "Unnamed Notary"}
        </h1>

        <p><strong>Notary Number:</strong> {profile.notary_number || "Not provided"}</p>
        <p><strong>Occupation:</strong> {profile.occupation || "Notary"}</p>
        <p>
          <strong>Location:</strong> {profile.city || ""}
          {profile.city && profile.state ? ", " : ""}
          {profile.state || ""}
        </p>
        <p><strong>County:</strong> {profile.county || "Not provided"}</p>
        <p><strong>Zip:</strong> {profile.zip || "Not provided"}</p>
        <p>
          <strong>Rating:</strong> ⭐ {Number(profile.average_rating || 0).toFixed(1)} ({profile.review_count || 0} reviews)
        </p>
        <p><strong>About:</strong> {profile.bio || "No bio yet."}</p>

        <div style={{ marginTop: "20px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <Link
            href={`/dashboard?notaryId=${profile.id}`}
            style={{
              padding: "12px 16px",
              borderRadius: "12px",
              background: "#111827",
              color: "#fff",
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            Book This Notary
          </Link>

          <Link
            href="/notaries"
            style={{
              padding: "12px 16px",
              borderRadius: "12px",
              background: "#eef2ff",
              color: "#3730a3",
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            Back to Notaries
          </Link>
        </div>
      </div>
    </div>
  );
}