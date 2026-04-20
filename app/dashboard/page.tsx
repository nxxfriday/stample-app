"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabase";

type Booking = {
  id: string;
  user_id: string;
  notary_id?: string | null;
  address: string;
  date: string;
  time: string;
  status: string;
  created_at?: string;
  price?: number | string | null;
  pricing_type?: string | null;
  custom_note?: string | null;
  payment_status?: string | null;
  total_price?: number | string | null;
};

type VerificationRecord = {
  id?: string;
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

type ProfileRecord = {
  id: string;
  role?: string | null;
  city?: string | null;
  state?: string | null;
  notary_name?: string | null;
  notary_number?: string | null;
  profile_photo_url?: string | null;
  county?: string | null;
  zip?: string | null;
  occupation?: string | null;
  bio?: string | null;
  average_rating?: number | null;
  review_count?: number | null;
  updated_at?: string | null;
};

type Transaction = {
  id: string;
  booking_id: string;
  notary_id: string;
  customer_id: string;
  service_date: string;
  transaction_date: string;
  address: string;
  document_type?: string | null;
  payment_method?: string | null;
  payment_status: string;
  notary_price: number | string;
  platform_fee: number | string;
  total_price: number | string;
  stripe_payment_intent_id?: string | null;
  receipt_number?: string | null;
  notes?: string | null;
  created_at?: string;
};
type DirectoryNotary = {
  id: string;
  role?: string | null;
  city?: string | null;
  state?: string | null;
  county?: string | null;
  zip?: string | null;
  notary_name?: string | null;
  notary_number?: string | null;
  profile_photo_url?: string | null;
  occupation?: string | null;
  bio?: string | null;
  average_rating?: number | null;
  review_count?: number | null;
};
const styles = {
  page: {
    minHeight: "100vh",
    background: "#f7f8fc",
    padding: "32px 20px 60px",
    color: "#111827",
    fontFamily: "Arial, sans-serif",
  } as const,
  container: {
    maxWidth: "1100px",
    margin: "0 auto",
  } as const,
  hero: {
    background: "linear-gradient(135deg, #111827, #1f2937)",
    color: "white",
    borderRadius: "20px",
    padding: "28px",
    boxShadow: "0 18px 40px rgba(0,0,0,0.18)",
    marginBottom: "24px",
  } as const,
  heroTitle: {
    fontSize: "32px",
    fontWeight: 700,
    margin: "0 0 10px 0",
  } as const,
  heroText: {
    margin: "4px 0",
    fontSize: "16px",
    opacity: 0.95,
  } as const,
  sectionCard: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "18px",
    padding: "20px",
    boxShadow: "0 8px 24px rgba(15,23,42,0.06)",
    marginBottom: "22px",
  } as const,
  sectionTitle: {
    fontSize: "22px",
    fontWeight: 700,
    margin: "0 0 16px 0",
  } as const,
  sectionSubtitle: {
    fontSize: "18px",
    fontWeight: 700,
    margin: "0 0 14px 0",
  } as const,
  mutedText: {
    color: "#6b7280",
    margin: 0,
  } as const,
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "12px",
  } as const,
  fullWidth: {
    gridColumn: "1 / -1",
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
  buttonPrimary: {
    padding: "12px 16px",
    borderRadius: "12px",
    border: "none",
    background: "#111827",
    color: "white",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: "14px",
  } as const,
  buttonSecondary: {
    padding: "10px 14px",
    borderRadius: "12px",
    border: "1px solid #d1d5db",
    background: "#fff",
    color: "#111827",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: "14px",
  } as const,
  buttonSuccess: {
    padding: "10px 14px",
    borderRadius: "12px",
    border: "none",
    background: "#16a34a",
    color: "white",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: "14px",
  } as const,
  buttonWarning: {
    padding: "10px 14px",
    borderRadius: "12px",
    border: "none",
    background: "#2563eb",
    color: "white",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: "14px",
  } as const,
  buttonDanger: {
    padding: "12px 16px",
    borderRadius: "12px",
    border: "none",
    background: "#dc2626",
    color: "white",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: "14px",
  } as const,
  bookingGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "14px",
  } as const,
  bookingCard: {
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    padding: "16px",
    background: "#fbfdff",
  } as const,
  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: 700,
    fontSize: "14px",
  } as const,
  row: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap" as const,
    alignItems: "center",
  },
  statusPill: {
    display: "inline-block",
    padding: "6px 10px",
    borderRadius: "999px",
    background: "#eef2ff",
    color: "#3730a3",
    fontWeight: 700,
    fontSize: "12px",
    marginLeft: "8px",
  } as const,
};

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedNotaryId = searchParams.get("notaryId") || "";

  const [userId, setUserId] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState("");
  const [loadingUser, setLoadingUser] = useState(true);

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [submittingBooking, setSubmittingBooking] = useState(false);
  const [acceptingBookingId, setAcceptingBookingId] = useState<string | null>(null);
  const [completingBookingId, setCompletingBookingId] = useState<string | null>(null);
  const [savingPriceId, setSavingPriceId] = useState<string | null>(null);
const [payingBookingId, setPayingBookingId] = useState<string | null>(null);
  const [verification, setVerification] = useState<VerificationRecord | null>(null);
  const [loadingVerification, setLoadingVerification] = useState(false);
  const [submittingVerification, setSubmittingVerification] = useState(false);

  const [profile, setProfile] = useState<ProfileRecord | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
const getBookingDisplayStatus = (booking: Booking) => {
  if (booking.status === "completed") {
    return "Completed";
  }

  if (booking.status === "confirmed" && booking.payment_status === "paid") {
    return "Confirmed & Paid";
  }

  if (booking.status === "accepted" && booking.payment_status === "paid") {
    return "Confirmed & Paid";
  }

  if (booking.status === "accepted") {
    return "Accepted - Awaiting Payment";
  }

  return booking.status;
};
  const [selectedNotaryProfile, setSelectedNotaryProfile] = useState<ProfileRecord | null>(null);
  const [loadingSelectedNotary, setLoadingSelectedNotary] = useState(false);

  const [pricingModeByBooking, setPricingModeByBooking] = useState<Record<string, string>>({});
  const [customPriceByBooking, setCustomPriceByBooking] = useState<Record<string, string>>({});
  const [customNoteByBooking, setCustomNoteByBooking] = useState<Record<string, string>>({});

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);

  const currentMonthValue = new Date().toISOString().slice(0, 7);
  const [selectedAuditMonth, setSelectedAuditMonth] = useState(currentMonthValue);
const [reviews, setReviews] = useState<any[]>([]);  
const [loadingReviews, setLoadingReviews] = useState(false);
const [reviewingBookingId, setReviewingBookingId] = useState<string | null>(null);
const [reviewRatingByBooking, setReviewRatingByBooking] = useState<Record<string, number>>({});
const [reviewCommentByBooking, setReviewCommentByBooking] = useState<Record<string, string>>({});
const [savingReview, setSavingReview] = useState(false);
const [directoryNotaries, setDirectoryNotaries] = useState<DirectoryNotary[]>([]);
const [loadingDirectory, setLoadingDirectory] = useState(false);

const [directoryZip, setDirectoryZip] = useState("");
const [directoryCity, setDirectoryCity] = useState("");
const [directoryCounty, setDirectoryCounty] = useState("");
const [directoryState, setDirectoryState] = useState("");
  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        alert(error.message);
        router.push("/login");
        return;
      }

      if (!user) {
        router.push("/login");
        return;
      }

      setUserId(user.id);
      setUserEmail(user.email || "");
      setUserRole(user.user_metadata?.role || "customer");
      setLoadingUser(false);
    };

    void checkUser();
  }, [router]);

 useEffect(() => {
  if (!userId) return;

  void loadBookings();

  if (userRole === "notary") {
    void loadVerification();
    void loadProfile();
    void loadTransactions(selectedAuditMonth);
  }

  if (userRole === "customer") {
    if (typeof loadMyReviews === "function") {
      void loadMyReviews();
    }
    void loadDirectoryNotaries();
  }
}, [userId, userRole, selectedAuditMonth]);
useEffect(() => {
  if (userRole === "customer" && userId) {
    void loadDirectoryNotaries();
  }
}, [directoryZip, directoryCity, directoryCounty, directoryState, userRole, userId]);
  useEffect(() => {
    if (selectedNotaryId) {
      void loadSelectedNotaryProfile(selectedNotaryId);
    } else {
      setSelectedNotaryProfile(null);
    }
  }, [selectedNotaryId]);
const hasReviewForBooking = (bookingId: string) => {
  return reviews.some((review) => review.booking_id === bookingId);
};
const handleReviewSubmit = async (booking: Booking) => {
  if (!booking.notary_id) {
    alert("No notary is assigned to this booking.");
    return;
  }

  if (hasReviewForBooking(booking.id)) {
    alert("You already reviewed this booking.");
    return;
  }

  const rating = reviewRatingByBooking[booking.id];
  const comment = (reviewCommentByBooking[booking.id] || "").trim();

  if (!rating || rating < 1 || rating > 5) {
    alert("Please choose a rating from 1 to 5.");
    return;
  }

  setSavingReview(true);

  const { error } = await supabase.from("reviews").insert([
    {
      notary_id: booking.notary_id,
      customer_id: userId,
      booking_id: booking.id,
      rating,
      comment,
    },
  ]);

  if (error) {
    alert(`Error saving review: ${error.message}`);
    setSavingReview(false);
    return;
  }

  const { data: allReviews, error: reviewsError } = await supabase
    .from("reviews")
    .select("rating")
    .eq("notary_id", booking.notary_id);

  if (!reviewsError && allReviews) {
    const reviewCount = allReviews.length;
    const averageRating =
      reviewCount === 0
        ? 0
        : allReviews.reduce((sum, row) => sum + Number(row.rating || 0), 0) / reviewCount;

    const { error: profileUpdateError } = await supabase
      .from("profiles")
      .update({
        average_rating: averageRating,
        review_count: reviewCount,
        updated_at: new Date().toISOString(),
      })
      .eq("id", booking.notary_id);

    if (profileUpdateError) {
      console.error("Profile rating update error:", profileUpdateError);
    }
  }

  alert("Review submitted successfully!");
  setSavingReview(false);
  setReviewingBookingId(null);

  setReviewRatingByBooking((prev) => ({ ...prev, [booking.id]: 0 }));
  setReviewCommentByBooking((prev) => ({ ...prev, [booking.id]: "" }));

  await loadMyReviews();
};
  const loadSelectedNotaryProfile = async (notaryId: string) => {
    if (!notaryId) {
      setSelectedNotaryProfile(null);
      return;
    }

    setLoadingSelectedNotary(true);

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", notaryId)
      .maybeSingle();

    if (error) {
      console.error("Error loading selected notary profile:", error);
      setSelectedNotaryProfile(null);
      setLoadingSelectedNotary(false);
      return;
    }

    setSelectedNotaryProfile((data as ProfileRecord | null) || null);
    setLoadingSelectedNotary(false);
  };

  const loadBookings = async () => {
    setLoadingBookings(true);

    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      alert(`Error fetching bookings: ${error.message}`);
      setLoadingBookings(false);
      return;
    }

    const rows = (data || []) as Booking[];
    setBookings(rows);

    const modes: Record<string, string> = {};
    const prices: Record<string, string> = {};
    const notes: Record<string, string> = {};

    rows.forEach((booking) => {
      modes[booking.id] = booking.pricing_type || "standard";
      prices[booking.id] =
        booking.price !== null && booking.price !== undefined ? String(booking.price) : "";
      notes[booking.id] = booking.custom_note || "";
    });

    setPricingModeByBooking(modes);
    setCustomPriceByBooking(prices);
    setCustomNoteByBooking(notes);
    setLoadingBookings(false);
  };

  const loadVerification = async () => {
    setLoadingVerification(true);

    const { data, error } = await supabase
      .from("notary_verifications")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      alert(`Error loading verification: ${error.message}`);
      setLoadingVerification(false);
      return;
    }

    setVerification((data as VerificationRecord | null) || null);
    setLoadingVerification(false);
  };

  const loadProfile = async () => {
    setLoadingProfile(true);

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      alert(`Error loading profile: ${error.message}`);
      setLoadingProfile(false);
      return;
    }

    setProfile((data as ProfileRecord | null) || null);
    setLoadingProfile(false);
  };

  const loadTransactions = async (monthValue?: string) => {
    const targetMonth = monthValue || selectedAuditMonth;
    setLoadingTransactions(true);

    const [year, month] = targetMonth.split("-").map(Number);
    const startDate = `${targetMonth}-01`;
    const nextMonthDate = new Date(year, month, 1);
    const endDate = nextMonthDate.toISOString().slice(0, 10);

    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("notary_id", userId)
      .gte("transaction_date", startDate)
      .lt("transaction_date", endDate)
      .order("transaction_date", { ascending: false });

    if (error) {
      alert(`Error loading transactions: ${error.message}`);
      setLoadingTransactions(false);
      return;
    }
    setTransactions((data || []) as Transaction[]);
    setLoadingTransactions(false);
  };
  const loadDirectoryNotaries = async () => {
  setLoadingDirectory(true);

  const { data: approvedRows, error: approvedError } = await supabase
    .from("notary_verifications")
    .select("user_id")
    .eq("status", "approved");

  if (approvedError) {
    console.error("Approved notaries load error:", approvedError);
    setLoadingDirectory(false);
    return;
  }

  const approvedIds = (approvedRows || []).map((row) => row.user_id);

  if (approvedIds.length === 0) {
    setDirectoryNotaries([]);
    setLoadingDirectory(false);
    return;
  }

  let query = supabase
    .from("profiles")
    .select("*")
    .eq("role", "notary")
    .in("id", approvedIds);

  if (directoryZip.trim()) {
    query = query.eq("zip", directoryZip.trim());
  }

  if (directoryCity.trim()) {
    query = query.ilike("city", directoryCity.trim());
  }

  if (directoryCounty.trim()) {
    query = query.ilike("county", directoryCounty.trim());
  }

  if (directoryState.trim()) {
    query = query.ilike("state", directoryState.trim());
  }

  const { data, error } = await query;

  if (error) {
    console.error("Directory profile load error:", error);
    setLoadingDirectory(false);
    return;
  }

  setDirectoryNotaries((data || []) as DirectoryNotary[]);
  setLoadingDirectory(false);
};
const loadMyReviews = async () => {
  if (!userId) return;

  setLoadingReviews(true);

  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("customer_id", userId);

  if (error) {
    console.error("Error loading reviews:", error);
    setLoadingReviews(false);
    return;
  }

  setReviews((data || []) as any[]);
  setLoadingReviews(false);
};

  const uploadProfilePhoto = async (file: File) => {
    const fileExt = file.name.split(".").pop() || "jpg";
    const fileName = `${userId}-profile-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    const { error } = await supabase.storage
      .from("profile-photos")
      .upload(filePath, file, { upsert: true });

    if (error) throw error;

    const {
      data: { publicUrl },
    } = supabase.storage.from("profile-photos").getPublicUrl(filePath);

    return publicUrl;
  };

  const uploadFile = async (file: File, folder: string) => {
    const fileExt = file.name.split(".").pop() || "pdf";
    const fileName = `${userId}-${folder}-${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error } = await supabase.storage
      .from("notary-docs")
      .upload(filePath, file, { upsert: true });

    if (error) throw error;

    const {
      data: { publicUrl },
    } = supabase.storage.from("notary-docs").getPublicUrl(filePath);

    return publicUrl;
  };

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSavingProfile(true);

    const formData = new FormData(e.currentTarget);

    const notaryName = String(formData.get("notary_name") || "").trim();
    const notaryNumber = String(formData.get("notary_number") || "").trim();
    const city = String(formData.get("city") || "").trim();
    const state = String(formData.get("state") || "").trim();
    const county = String(formData.get("county") || "").trim();
    const zip = String(formData.get("zip") || "").trim();
    const occupation = String(formData.get("occupation") || "").trim();
    const bio = String(formData.get("bio") || "").trim();
    const profilePhotoFile = formData.get("profile_photo") as File;

    let profilePhotoUrl = profile?.profile_photo_url || "";

    try {
      if (profilePhotoFile?.name) {
        profilePhotoUrl = await uploadProfilePhoto(profilePhotoFile);
      }

      const payload = {
        id: userId,
        role: userRole,
        notary_name: notaryName,
        notary_number: notaryNumber,
        city,
        state,
        county,
        zip,
        occupation,
        bio,
        profile_photo_url: profilePhotoUrl || null,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("profiles")
        .upsert(payload, { onConflict: "id" });

      if (error) {
        alert(`Error saving profile: ${error.message}`);
        setSavingProfile(false);
        return;
      }

      alert("Profile saved successfully!");
      setSavingProfile(false);
      await loadProfile();
    } catch (err: any) {
      alert(`Profile upload error: ${err.message}`);
      setSavingProfile(false);
    }
  };

  const handleVerificationSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmittingVerification(true);

    const formData = new FormData(e.currentTarget);

    const notaryIdNumber = String(formData.get("notary_id_number") || "").trim();
    const commissionExpiry = String(formData.get("commission_expiry") || "").trim();
    const driversLicenseNumber = String(formData.get("drivers_license_number") || "").trim();
    const insuranceProvider = String(formData.get("insurance_provider") || "").trim();
    const insuranceExpiry = String(formData.get("insurance_expiry") || "").trim();

    const commissionFile = formData.get("commission_pdf") as File;
    const licenseFile = formData.get("drivers_license_pdf") as File;
    const insuranceFile = formData.get("insurance_pdf") as File;

    if (
      !notaryIdNumber ||
      !commissionExpiry ||
      !driversLicenseNumber ||
      !insuranceProvider ||
      !insuranceExpiry
    ) {
      alert("Please fill out all verification fields.");
      setSubmittingVerification(false);
      return;
    }

    if (!verification && (!commissionFile?.name || !licenseFile?.name || !insuranceFile?.name)) {
      alert("Please upload all required PDF files.");
      setSubmittingVerification(false);
      return;
    }

    try {
      const commissionPdfUrl = commissionFile?.name
        ? await uploadFile(commissionFile, "commission")
        : verification?.commission_pdf_url || "";

      const driversLicensePdfUrl = licenseFile?.name
        ? await uploadFile(licenseFile, "license")
        : verification?.drivers_license_pdf_url || "";

      const insurancePdfUrl = insuranceFile?.name
        ? await uploadFile(insuranceFile, "insurance")
        : verification?.insurance_pdf_url || "";

      const payload: VerificationRecord = {
        user_id: userId,
        notary_id_number: notaryIdNumber,
        commission_expiry: commissionExpiry,
        commission_pdf_url: commissionPdfUrl,
        drivers_license_number: driversLicenseNumber,
        drivers_license_pdf_url: driversLicensePdfUrl,
        insurance_provider: insuranceProvider,
        insurance_expiry: insuranceExpiry,
        insurance_pdf_url: insurancePdfUrl,
        status: "pending",
      };

      if (verification) {
        const { error } = await supabase
          .from("notary_verifications")
          .update(payload)
          .eq("user_id", userId);

        if (error) {
          alert(`Error saving verification: ${error.message}`);
          setSubmittingVerification(false);
          return;
        }
      } else {
        const { error } = await supabase
          .from("notary_verifications")
          .insert([payload]);

        if (error) {
          alert(`Error saving verification: ${error.message}`);
          setSubmittingVerification(false);
          return;
        }
      }

      alert("Verification submitted successfully!");
      setSubmittingVerification(false);
      await loadVerification();
    } catch (err: any) {
      alert(`Upload error: ${err.message}`);
      setSubmittingVerification(false);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/login");
  };
const clearSelectedNotary = () => {
  router.push("/dashboard");
};
  const handleBookingSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmittingBooking(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const address = String(formData.get("address") || "").trim();
    const date = String(formData.get("date") || "").trim();
    const time = String(formData.get("time") || "").trim();

    if (!address || !date || !time) {
      alert("Please fill out address, date, and time.");
      setSubmittingBooking(false);
      return;
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      alert(userError.message);
      setSubmittingBooking(false);
      return;
    }

    if (!user) {
      alert("You must be logged in.");
      setSubmittingBooking(false);
      return;
    }

    const { error } = await supabase.from("bookings").insert([
      {
        user_id: user.id,
        notary_id: selectedNotaryId || null,
        address,
        date,
        time,
        status: selectedNotaryId ? "requested_direct" : "pending",
        payment_status: "unpaid",
      },
    ]);

    if (error) {
      alert(`Error creating booking: ${error.message}`);
      setSubmittingBooking(false);
      return;
    }

    alert("Booking request sent!");
form.reset();
setSubmittingBooking(false);
await loadBookings();

if (selectedNotaryId) {
  router.push("/dashboard");
}
  };
const handlePayNow = async (booking: Booking) => {
  const total = Number(booking.total_price || booking.price || 0);

  if (!total || total <= 0) {
    alert("This booking does not have a payable amount yet.");
    return;
  }

  setPayingBookingId(booking.id);

  try {
    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bookingId: booking.id,
        amount: total,
        address: booking.address,
        customerEmail: userEmail,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Unable to start payment.");
      setPayingBookingId(null);
      return;
    }

    if (data.url) {
      window.location.href = data.url;
      return;
    }

    alert("Stripe checkout URL was not returned.");
    setPayingBookingId(null);
  } catch (error) {
    console.error("Pay now error:", error);
    alert("Something went wrong starting payment.");
    setPayingBookingId(null);
  }
};
  const acceptBooking = async (bookingId: string) => {
    setAcceptingBookingId(bookingId);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      alert(userError.message);
      setAcceptingBookingId(null);
      return;
    }

    if (!user) {
      alert("Not logged in.");
      setAcceptingBookingId(null);
      return;
    }

    if (verification?.status !== "approved") {
      alert("You must be approved before accepting jobs.");
      setAcceptingBookingId(null);
      return;
    }

    const { data, error } = await supabase
      .from("bookings")
      .update({
        status: "accepted",
        notary_id: user.id,
      })
      .eq("id", bookingId)
      .select();

    if (error) {
      alert(`Error accepting job: ${error.message}`);
      setAcceptingBookingId(null);
      return;
    }

    if (!data || data.length === 0) {
      alert("No booking was updated.");
      setAcceptingBookingId(null);
      return;
    }

    alert("Job accepted!");
    setAcceptingBookingId(null);
    await loadBookings();
  };

  const savePricing = async (bookingId: string) => {
    setSavingPriceId(bookingId);

    const pricingType = pricingModeByBooking[bookingId] || "standard";
    const rawPrice = customPriceByBooking[bookingId] || "";
    const note = (customNoteByBooking[bookingId] || "").trim();

    let finalPrice = Number(rawPrice);
    if (pricingType === "standard") finalPrice = 5;

    if (Number.isNaN(finalPrice) || finalPrice < 0) {
      alert("Please enter a valid price.");
      setSavingPriceId(null);
      return;
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      alert(userError.message);
      setSavingPriceId(null);
      return;
    }

    if (!user) {
      alert("Not logged in.");
      setSavingPriceId(null);
      return;
    }

    const { data, error } = await supabase
      .from("bookings")
      .update({
        price: finalPrice,
        pricing_type: pricingType,
        custom_note: note || null,
      })
      .eq("id", bookingId)
      .eq("notary_id", user.id)
      .select();

    if (error) {
      alert(`Error saving pricing: ${error.message}`);
      setSavingPriceId(null);
      return;
    }

    if (!data || data.length === 0) {
      alert("No pricing was updated.");
      setSavingPriceId(null);
      return;
    }

    alert("Pricing saved!");
    setSavingPriceId(null);
    await loadBookings();
  };

  const completeBooking = async (bookingId: string) => {
    setCompletingBookingId(bookingId);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      alert(userError.message);
      setCompletingBookingId(null);
      return;
    }

    if (!user) {
      alert("Not logged in.");
      setCompletingBookingId(null);
      return;
    }

    const { data, error } = await supabase
      .from("bookings")
      .update({
        status: "completed",
      })
      .eq("id", bookingId)
      .eq("notary_id", user.id)
      .select();

    if (error) {
      alert(`Error completing job: ${error.message}`);
      setCompletingBookingId(null);
      return;
    }

    if (!data || data.length === 0) {
      alert("No booking was completed.");
      setCompletingBookingId(null);
      return;
    }

    alert("Job marked as completed!");
    setCompletingBookingId(null);
    await loadBookings();
  };

  const isDateExpired = (dateValue?: string) => {
    if (!dateValue) return false;

    const today = new Date();
    const target = new Date(dateValue);

    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);

    return target < today;
  };

  const currentVerificationExpired =
    !!verification &&
    (isDateExpired(verification.commission_expiry) ||
      isDateExpired(verification.insurance_expiry));

  const canAcceptJobs =
    verification?.status === "approved" && !currentVerificationExpired;

  const auditGrossTotal = transactions.reduce(
    (sum, transaction) => sum + Number(transaction.total_price || 0),
    0
  );

  const auditPlatformFees = transactions.reduce(
    (sum, transaction) => sum + Number(transaction.platform_fee || 0),
    0
  );

  const auditNetToNotary = transactions.reduce(
    (sum, transaction) => sum + Number(transaction.notary_price || 0),
    0
  );

  const availableJobs = useMemo(
    () =>
      bookings.filter(
        (booking) =>
          booking.status === "pending" ||
          (booking.status === "requested_direct" && booking.notary_id === userId)
      ),
    [bookings, userId]
  );

  const myAcceptedJobs = useMemo(
    () =>
      bookings.filter(
        (booking) => booking.status === "accepted" && booking.notary_id === userId
      ),
    [bookings, userId]
  );

  const myCompletedJobs = useMemo(
    () =>
      bookings.filter(
        (booking) => booking.status === "completed" && booking.notary_id === userId
      ),
    [bookings, userId]
  );

  const myCustomerBookings = useMemo(
    () => bookings.filter((booking) => booking.user_id === userId),
    [bookings, userId]
  );

  const myActiveCustomerBookings = useMemo(
    () => myCustomerBookings.filter((booking) => booking.status !== "completed"),
    [myCustomerBookings]
  );

  const myCompletedCustomerBookings = useMemo(
    () => myCustomerBookings.filter((booking) => booking.status === "completed"),
    [myCustomerBookings]
  );

  if (loadingUser) {
    return <div style={{ padding: "40px" }}>Loading dashboard...</div>;
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.hero}>
          <h1 style={styles.heroTitle}>STAMPLE Dashboard</h1>
          <p style={styles.heroText}>Welcome: {userEmail}</p>
          <p style={styles.heroText}>Account Type: {userRole}</p>
        </div>

        {userRole === "notary" ? (
          <>
            <div style={styles.sectionCard}>
              <h2 style={styles.sectionTitle}>Notary Panel</h2>

              <div style={styles.sectionCard}>
                <h3 style={styles.sectionSubtitle}>Verification Status</h3>

                {loadingVerification ? (
                  <p style={styles.mutedText}>Loading verification...</p>
                ) : verification ? (
                  <div style={{ lineHeight: 1.8 }}>
                    <p>
                      <strong>Status:</strong>
                      <span style={styles.statusPill}>
                        {currentVerificationExpired ? "expired" : verification.status}
                      </span>
                    </p>
                    <p><strong>Notary ID:</strong> {verification.notary_id_number}</p>
                    <p><strong>Commission Expiry:</strong> {verification.commission_expiry}</p>
                    <p><strong>Insurance Provider:</strong> {verification.insurance_provider}</p>
                    <p><strong>Insurance Expiry:</strong> {verification.insurance_expiry}</p>
                  </div>
                ) : (
                  <p style={styles.mutedText}>No verification submitted yet.</p>
                )}

                <form onSubmit={handleVerificationSubmit} style={{ marginTop: "20px" }}>
                  <div style={styles.formGrid}>
                    <input
                      name="notary_id_number"
                      placeholder="Notary ID Number"
                      required
                      defaultValue={verification?.notary_id_number || ""}
                      style={styles.input}
                    />
                    <input
                      name="commission_expiry"
                      type="date"
                      required
                      defaultValue={verification?.commission_expiry || ""}
                      style={styles.input}
                    />
                    <input
                      name="drivers_license_number"
                      placeholder="Driver's License Number"
                      required
                      defaultValue={verification?.drivers_license_number || ""}
                      style={styles.input}
                    />
                    <input
                      name="insurance_provider"
                      placeholder="E&O Insurance Provider"
                      required
                      defaultValue={verification?.insurance_provider || ""}
                      style={styles.input}
                    />
                    <input
                      name="insurance_expiry"
                      type="date"
                      required
                      defaultValue={verification?.insurance_expiry || ""}
                      style={styles.input}
                    />
                    <div />
                    <input
                      name="commission_pdf"
                      type="file"
                      accept=".pdf"
                      style={{ ...styles.input, ...styles.fullWidth }}
                    />
                    <input
                      name="drivers_license_pdf"
                      type="file"
                      accept=".pdf"
                      style={{ ...styles.input, ...styles.fullWidth }}
                    />
                    <input
                      name="insurance_pdf"
                      type="file"
                      accept=".pdf"
                      style={{ ...styles.input, ...styles.fullWidth }}
                    />
                  </div>

                  <div style={{ marginTop: "16px" }}>
                    <button
                      type="submit"
                      disabled={submittingVerification}
                      style={styles.buttonPrimary}
                    >
                      {submittingVerification
                        ? "Submitting..."
                        : verification
                        ? "Update Verification"
                        : "Submit Verification"}
                    </button>
                  </div>
                </form>
              </div>

              <div style={styles.sectionCard}>
                <h3 style={styles.sectionSubtitle}>Notary Profile</h3>

                {loadingProfile ? (
                  <p style={styles.mutedText}>Loading profile...</p>
                ) : (
                  <form onSubmit={handleProfileSubmit}>
                    <div style={styles.formGrid}>
                      <input
                        name="notary_name"
                        placeholder="Notary Name"
                        defaultValue={profile?.notary_name || ""}
                        required
                        style={styles.input}
                      />
                      <input
                        name="notary_number"
                        placeholder="Notary Number"
                        defaultValue={profile?.notary_number || ""}
                        required
                        style={styles.input}
                      />
                      <input
                        name="city"
                        placeholder="City"
                        defaultValue={profile?.city || ""}
                        required
                        style={styles.input}
                      />
                      <input
                        name="state"
                        placeholder="State"
                        defaultValue={profile?.state || ""}
                        required
                        style={styles.input}
                      />
                      <input
                        name="county"
                        placeholder="County"
                        defaultValue={profile?.county || ""}
                        required
                        style={styles.input}
                      />
                      <input
                        name="zip"
                        placeholder="Zip"
                        defaultValue={profile?.zip || ""}
                        required
                        style={styles.input}
                      />
                      <input
                        name="occupation"
                        placeholder="Occupation"
                        defaultValue={profile?.occupation || ""}
                        required
                        style={styles.input}
                      />
                      <input
                        name="profile_photo"
                        type="file"
                        accept="image/*"
                        style={styles.input}
                      />
                      <textarea
                        name="bio"
                        placeholder="About / Bio / Credentials"
                        defaultValue={profile?.bio || ""}
                        style={{
                          ...styles.input,
                          minHeight: "120px",
                          gridColumn: "1 / -1",
                          resize: "vertical",
                        }}
                      />
                    </div>

                    {profile?.profile_photo_url ? (
                      <div style={{ marginTop: "16px" }}>
                        <p style={styles.mutedText}>Current profile picture:</p>
                        <img
                          src={profile.profile_photo_url}
                          alt="Profile"
                          style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
                            borderRadius: "999px",
                            border: "1px solid #ddd",
                          }}
                        />
                      </div>
                    ) : null}

                    <div style={{ marginTop: "16px" }}>
                      <button
                        type="submit"
                        disabled={savingProfile}
                        style={styles.buttonPrimary}
                      >
                        {savingProfile ? "Saving..." : "Save Profile"}
                      </button>
                    </div>
                  </form>
                )}
              </div>

              <div style={styles.row}>
                <button onClick={loadBookings} style={styles.buttonSecondary}>
                  {loadingBookings ? "Loading..." : "Refresh Jobs"}
                </button>
              </div>

              <div style={{ marginTop: "20px" }}>
                <h3 style={styles.sectionSubtitle}>Available Jobs</h3>

                {availableJobs.length === 0 ? (
                  <p style={styles.mutedText}>No available jobs right now.</p>
                ) : (
                  <div style={styles.bookingGrid}>
                    {availableJobs.map((booking) => (
                      <div key={booking.id} style={styles.bookingCard}>
                        <p><strong>Address:</strong> {booking.address}</p>
                        <p><strong>Date:</strong> {booking.date}</p>
                        <p><strong>Time:</strong> {booking.time}</p>
                        <p><strong>Status:</strong> {booking.status}</p>
                        <p><strong>Price:</strong> ${Number(booking.price || 0).toFixed(2)}</p>

                        {canAcceptJobs ? (
                          <button
                            onClick={() => acceptBooking(booking.id)}
                            disabled={acceptingBookingId === booking.id}
                            style={{ ...styles.buttonSuccess, marginTop: "10px" }}
                          >
                            {acceptingBookingId === booking.id ? "Accepting..." : "Accept Job"}
                          </button>
                        ) : (
                          <div style={{ marginTop: "10px" }}>
                            <button
                              disabled
                              style={{
                                ...styles.buttonSecondary,
                                cursor: "not-allowed",
                                opacity: 0.65,
                              }}
                            >
                              {currentVerificationExpired ? "Verification Expired" : "Verification Required"}
                            </button>
                            <p style={{ ...styles.mutedText, marginTop: "8px" }}>
                              {currentVerificationExpired
                                ? "Your verification has expired. Please update your documents."
                                : "You must be approved before you can accept jobs."}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ marginTop: "28px" }}>
                <h3 style={styles.sectionSubtitle}>My Accepted Jobs</h3>

                {myAcceptedJobs.length === 0 ? (
                  <p style={styles.mutedText}>You have not accepted any jobs yet.</p>
                ) : (
                  <div style={styles.bookingGrid}>
                    {myAcceptedJobs.map((booking) => {
                      const mode = pricingModeByBooking[booking.id] || "standard";

                      return (
                        <div key={booking.id} style={styles.bookingCard}>
                          <p><strong>Address:</strong> {booking.address}</p>
                          <p><strong>Date:</strong> {booking.date}</p>
                          <p><strong>Time:</strong> {booking.time}</p>
                          <p><strong>Status:</strong> {booking.status}</p>
                          <p><strong>Current Price:</strong> ${Number(booking.price || 0).toFixed(2)}</p>
                          <p><strong>Pricing Type:</strong> {booking.pricing_type || "standard"}</p>
                          {booking.custom_note && <p><strong>Note:</strong> {booking.custom_note}</p>}

                          <div style={{ marginTop: "12px" }}>
                            <label style={styles.label}>Pricing Option</label>

                            <select
                              value={mode}
                              onChange={(e) =>
                                setPricingModeByBooking((prev) => ({
                                  ...prev,
                                  [booking.id]: e.target.value,
                                }))
                              }
                              style={styles.select}
                            >
                              <option value="standard">Standard</option>
                              <option value="custom">Other / Custom</option>
                            </select>

                            {mode === "custom" ? (
                              <div style={{ marginTop: "10px" }}>
                                <input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  placeholder="Enter custom price"
                                  value={customPriceByBooking[booking.id] || ""}
                                  onChange={(e) =>
                                    setCustomPriceByBooking((prev) => ({
                                      ...prev,
                                      [booking.id]: e.target.value,
                                    }))
                                  }
                                  style={{ ...styles.input, marginBottom: "10px" }}
                                />
                                <input
                                  type="text"
                                  placeholder="Add a reason or note"
                                  value={customNoteByBooking[booking.id] || ""}
                                  onChange={(e) =>
                                    setCustomNoteByBooking((prev) => ({
                                      ...prev,
                                      [booking.id]: e.target.value,
                                    }))
                                  }
                                  style={styles.input}
                                />
                              </div>
                            ) : (
                              <p style={{ ...styles.mutedText, marginTop: "10px" }}>
                                Standard price will be saved as $5.00
                              </p>
                            )}

                            <div style={{ ...styles.row, marginTop: "14px" }}>
                              <button
                                onClick={() => savePricing(booking.id)}
                                disabled={savingPriceId === booking.id}
                                style={styles.buttonWarning}
                              disabled={booking.payment_status === "paid"}>
                                {savingPriceId === booking.id ? "Saving..." : "Save Pricing"}
                              </button>

                              <button
                                onClick={() => completeBooking(booking.id)}
                                disabled={completingBookingId === booking.id}
                                style={styles.buttonPrimary}
                              >
                                {completingBookingId === booking.id ? "Completing..." : "Complete Job"}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div style={{ marginTop: "28px" }}>
                <h3 style={styles.sectionSubtitle}>My Completed Jobs</h3>

                {myCompletedJobs.length === 0 ? (
                  <p style={styles.mutedText}>You have not completed any jobs yet.</p>
                ) : (
                  <div style={styles.bookingGrid}>
                    {myCompletedJobs.map((booking) => (
                      <div key={booking.id} style={styles.bookingCard}>
                        <p><strong>Address:</strong> {booking.address}</p>
                        <p><strong>Date:</strong> {booking.date}</p>
                        <p><strong>Time:</strong> {booking.time}</p>
                        <p><strong>Status:</strong> {booking.status}</p>
                        <p><strong>Final Price:</strong> ${Number(booking.price || 0).toFixed(2)}</p>
                        <p><strong>Pricing Type:</strong> {booking.pricing_type || "standard"}</p>
                        {booking.custom_note && <p><strong>Note:</strong> {booking.custom_note}</p>}
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ ...styles.sectionCard, marginTop: "28px" }}>
                  <h3 style={styles.sectionSubtitle}>Receipts & Monthly Audit</h3>
                  <p style={{ ...styles.mutedText, marginBottom: "14px" }}>
                    View a transparent monthly record of all paid transactions.
                  </p>

                  <div style={{ ...styles.row, marginBottom: "16px" }}>
                    <input
                      type="month"
                      value={selectedAuditMonth}
                      onChange={(e) => setSelectedAuditMonth(e.target.value)}
                      style={{ ...styles.input, maxWidth: "220px" }}
                    />
                    <button
                      onClick={() => loadTransactions(selectedAuditMonth)}
                      style={styles.buttonSecondary}
                    >
                      {loadingTransactions ? "Loading..." : "Load Audit"}
                    </button>
                  </div>

                  <div style={styles.bookingGrid}>
                    <div style={styles.bookingCard}>
                      <p><strong>Total Transactions:</strong> {transactions.length}</p>
                      <p><strong>Gross Total:</strong> ${auditGrossTotal.toFixed(2)}</p>
                    </div>

                    <div style={styles.bookingCard}>
                      <p><strong>Platform Fees:</strong> ${auditPlatformFees.toFixed(2)}</p>
                      <p><strong>Net to Notary:</strong> ${auditNetToNotary.toFixed(2)}</p>
                    </div>
                  </div>

                  <div style={{ marginTop: "18px" }}>
                    {transactions.length === 0 ? (
                      <p style={styles.mutedText}>No transactions found for this month.</p>
                    ) : (
                      <div style={styles.bookingGrid}>
                        {transactions.map((transaction) => (
                          <div key={transaction.id} style={styles.bookingCard}>
                            <p>
                              <strong>Receipt #:</strong>{" "}
                              {transaction.receipt_number || transaction.id.slice(0, 8)}
                            </p>
                            <p><strong>Transaction Date:</strong> {transaction.transaction_date}</p>
                            <p><strong>Service Date:</strong> {transaction.service_date}</p>
                            <p><strong>Address:</strong> {transaction.address}</p>
                            <p><strong>Document Type:</strong> {transaction.document_type || "Not provided"}</p>
                            <p><strong>Payment Method:</strong> {transaction.payment_method || "Not provided"}</p>
                            <p><strong>Payment Status:</strong> {transaction.payment_status}</p>
                            <p><strong>Notary Earnings:</strong> ${Number(transaction.notary_price || 0).toFixed(2)}</p>
                            <p><strong>Platform Fee:</strong> ${Number(transaction.platform_fee || 0).toFixed(2)}</p>
                            <p><strong>Total Charged:</strong> ${Number(transaction.total_price || 0).toFixed(2)}</p>
                            {transaction.notes && <p><strong>Notes:</strong> {transaction.notes}</p>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div style={styles.sectionCard}>
            <h2 style={styles.sectionTitle}>Customer Panel</h2>
            <p style={{ ...styles.mutedText, marginBottom: "16px" }}>
              Request a mobile notary, track your bookings, and view pricing updates in one place.
            </p>

            {selectedNotaryId ? (
  <div
    style={{
      marginBottom: "16px",
      padding: "16px",
      borderRadius: "16px",
      background: "#eef2ff",
      border: "1px solid #c7d2fe",
    }}
  >
    <p style={{ margin: 0, fontWeight: 700 }}>
      Selected Notary
    </p>

    {loadingSelectedNotary ? (
      <p style={{ margin: "8px 0 0 0" }}>Loading notary...</p>
    ) : selectedNotaryProfile ? (
      <>
        <div
          style={{
            display: "flex",
            gap: "14px",
            alignItems: "center",
            marginTop: "12px",
            flexWrap: "wrap",
          }}
        >
          {selectedNotaryProfile.profile_photo_url ? (
            <img
              src={selectedNotaryProfile.profile_photo_url}
              alt={selectedNotaryProfile.notary_name || "Notary"}
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "999px",
                objectFit: "cover",
                border: "1px solid #d1d5db",
              }}
            />
          ) : null}

          <div>
            <p style={{ margin: "0 0 6px 0", fontWeight: 700, fontSize: "18px" }}>
              {selectedNotaryProfile.notary_name || "Unnamed Notary"}
            </p>

            <p style={{ margin: "0 0 4px 0", color: "#6b7280" }}>
              {selectedNotaryProfile.city || ""}
              {selectedNotaryProfile.city && selectedNotaryProfile.state ? ", " : ""}
              {selectedNotaryProfile.state || ""}
            </p>

            <p style={{ margin: "0 0 4px 0", color: "#6b7280" }}>
              {selectedNotaryProfile.occupation || "Notary"}
            </p>

            <p style={{ margin: 0, color: "#6b7280" }}>
              ⭐ {Number(selectedNotaryProfile.average_rating || 0).toFixed(1)} ({selectedNotaryProfile.review_count || 0} reviews)
            </p>
          </div>
        </div>

        <div style={{ ...styles.row, marginTop: "14px" }}>
          <a
            href={`/notaries/${selectedNotaryProfile.id}`}
            style={{
              ...styles.buttonSecondary,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            View Full Profile
          </a>

          <button
            type="button"
            onClick={clearSelectedNotary}
            style={styles.buttonSecondary}
          >
            Clear Selection
          </button>
        </div>
      </>
    ) : (
      <div style={{ marginTop: "8px" }}>
        <p style={{ margin: "0 0 10px 0" }}>Selected notary not found.</p>
        <button
          type="button"
          onClick={clearSelectedNotary}
          style={styles.buttonSecondary}
        >
          Clear Selection
        </button>
      </div>
    )}
  </div>
) : null}

            <div style={styles.sectionCard}>
<h3 style={styles.sectionSubtitle}>
  {selectedNotaryId ? "Request This Notary" : "Request a Notary"}
</h3>
<p style={{ ...styles.mutedText, marginBottom: "14px" }}>
  {selectedNotaryId
    ? "Your request will be sent directly to the selected notary."
    : "Submit a general request and an available notary can accept it."}
</p>
              <form onSubmit={handleBookingSubmit}>
                <div style={styles.formGrid}>
                  <input
                    name="address"
                    placeholder="Enter Address"
                    required
                    style={{ ...styles.input, ...styles.fullWidth }}
                  />
                  <input name="date" type="date" required style={styles.input} />
                  <input name="time" type="time" required style={styles.input} />
                </div>

                <div style={{ marginTop: "16px" }}>
                  <button
                    type="submit"
                    disabled={submittingBooking}
                    style={styles.buttonPrimary}
                  >
                    {submittingBooking
                      ? "Sending..."
                      : selectedNotaryId
                      ? "Request This Notary"
                      : "Request Notary"}
                  </button>
                </div>
              </form>
            </div>
<div style={styles.sectionCard}>
  <h3 style={styles.sectionSubtitle}>Browse Notaries Near You</h3>
  <p style={{ ...styles.mutedText, marginBottom: "16px" }}>
    Search approved notaries by zip, city, county, or state, then view their profile or request them directly.
  </p>

  <div style={styles.formGrid}>
    <input
      placeholder="Zip Code"
      value={directoryZip}
      onChange={(e) => setDirectoryZip(e.target.value)}
      style={styles.input}
    />
    <input
      placeholder="City"
      value={directoryCity}
      onChange={(e) => setDirectoryCity(e.target.value)}
      style={styles.input}
    />
    <input
      placeholder="County"
      value={directoryCounty}
      onChange={(e) => setDirectoryCounty(e.target.value)}
      style={styles.input}
    />
    <input
      placeholder="State"
      value={directoryState}
      onChange={(e) => setDirectoryState(e.target.value)}
      style={styles.input}
    />
  </div>

  <div style={{ ...styles.row, marginTop: "14px" }}>
    <button onClick={loadDirectoryNotaries} style={styles.buttonSecondary}>
      {loadingDirectory ? "Loading..." : "Search Notaries"}
    </button>

    <button
      onClick={() => {
        setDirectoryZip("");
        setDirectoryCity("");
        setDirectoryCounty("");
        setDirectoryState("");
      }}
      style={styles.buttonSecondary}
    >
      Clear Filters
    </button>
  </div>

  <div style={{ marginTop: "18px" }}>
    {loadingDirectory ? (
      <p style={styles.mutedText}>Loading approved notaries...</p>
    ) : directoryNotaries.length === 0 ? (
      <p style={styles.mutedText}>No approved notaries matched your filters.</p>
    ) : (
      <div style={styles.bookingGrid}>
        {directoryNotaries.map((notary) => (
          <div key={notary.id} style={styles.bookingCard}>
            {notary.profile_photo_url ? (
              <img
                src={notary.profile_photo_url}
                alt={notary.notary_name || "Notary"}
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "999px",
                  objectFit: "cover",
                  marginBottom: "12px",
                  border: "1px solid #ddd",
                }}
              />
            ) : null}

            <p>
              <strong>Name:</strong> {notary.notary_name || "Unnamed Notary"}
            </p>
            <p>
              <strong>Occupation:</strong> {notary.occupation || "Notary"}
            </p>
            <p>
              <strong>Location:</strong> {notary.city || ""}
              {notary.city && notary.state ? ", " : ""}
              {notary.state || ""}
            </p>
            <p>
              <strong>County:</strong> {notary.county || "Not provided"}
            </p>
            <p>
              <strong>Zip:</strong> {notary.zip || "Not provided"}
            </p>
            <p>
              <strong>Rating:</strong> ⭐ {Number(notary.average_rating || 0).toFixed(1)} ({notary.review_count || 0} reviews)
            </p>
            <p>
              <strong>Bio:</strong> {notary.bio || "No bio yet."}
            </p>

            <div style={{ ...styles.row, marginTop: "12px" }}>
              <a
                href={`/notaries/${notary.id}`}
                style={{
                  ...styles.buttonSecondary,
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                View Profile
              </a>

              <a
                href={`/dashboard?notaryId=${notary.id}`}
                style={{
                  ...styles.buttonPrimary,
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                Request This Notary
              </a>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
</div>
            <div style={{ marginTop: "24px" }}>
              <h3 style={styles.sectionSubtitle}>My Active Bookings</h3>

              {myActiveCustomerBookings.length === 0 ? (
                <p style={styles.mutedText}>You have no active bookings right now.</p>
              ) : (
                <div style={styles.bookingGrid}>
                  {myActiveCustomerBookings.map((booking) => (
                    <div key={booking.id} style={styles.bookingCard}>
                      <p><strong>Address:</strong> {booking.address}</p>
                      <p><strong>Date:</strong> {booking.date}</p>
                      <p><strong>Time:</strong> {booking.time}</p>
                      <p><strong>Status:</strong> {getBookingDisplayStatus(booking)}</p>
                      <p>
                        <strong>Payment Status:</strong> {booking.payment_status || "unpaid"}
                      </p>
                      <p>
                        <strong>Total Price:</strong> $
                        {Number(booking.total_price || booking.price || 0).toFixed(2)}
                      </p>
                      <p>
                        <strong>Assigned Notary:</strong>{" "}
                        {booking.notary_id ? booking.notary_id : "Not assigned yet"}
                      </p>

                      {booking.pricing_type && (
                        <p><strong>Pricing Type:</strong> {booking.pricing_type}</p>
                      )}

                      {booking.custom_note && (
                        <p><strong>Note:</strong> {booking.custom_note}</p>
                      )}

{booking.status === "accepted" && booking.payment_status !== "paid" && (  <div style={{ marginTop: "12px" }}>
    <button
      style={styles.buttonWarning}
      onClick={() => handlePayNow(booking)}
      disabled={payingBookingId === booking.id}
    >
      {payingBookingId === booking.id ? "Redirecting..." : "Pay Now"}
      disabled={booking.payment_status === "paid"}
    </button>
  </div>
)}

                      {(booking.status === "pending" || booking.status === "requested_direct") && (
                        <p style={{ ...styles.mutedText, marginTop: "10px" }}>
                          Waiting for a notary to accept your request.
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ marginTop: "24px" }}>
              <h3 style={styles.sectionSubtitle}>My Completed Bookings</h3>

              {myCompletedCustomerBookings.length === 0 ? (
                <p style={styles.mutedText}>You have no completed bookings yet.</p>
              ) : (
                <div style={styles.bookingGrid}>
                  {myCompletedCustomerBookings.map((booking) => (
                    <div key={booking.id} style={styles.bookingCard}>
                      <p><strong>Address:</strong> {booking.address}</p>
                      <p><strong>Date:</strong> {booking.date}</p>
                      <p><strong>Time:</strong> {booking.time}</p>
                      <p><strong>Status:</strong> {getBookingDisplayStatus(booking)}</p>
                      <p>
                        <strong>Payment Status:</strong> {booking.payment_status || "unpaid"}
                      </p>
                      <p>
                        <strong>Total Price:</strong> $
                        {Number(booking.total_price || booking.price || 0).toFixed(2)}
                      </p>
                      <p>
                        <strong>Assigned Notary:</strong>{" "}
                        {booking.notary_id ? booking.notary_id : "Not assigned"}
                      </p>
{booking.status === "requested_direct" && (
  <p style={{ color: "#3730a3", fontWeight: 700 }}>
    Direct request sent to selected notary
  </p>
)}
                      <div style={{ ...styles.row, marginTop: "12px" }}>
  <button style={styles.buttonSecondary}>View Receipt</button>

  {hasReviewForBooking(booking.id) ? (
    <button
      style={{ ...styles.buttonSecondary, cursor: "default", opacity: 0.7 }}
      disabled
    >
      Review Submitted
    </button>
  ) : (
    <button
      style={styles.buttonSecondary}
      onClick={() =>
        setReviewingBookingId((prev) => (prev === booking.id ? null : booking.id))
      }
    >
      {reviewingBookingId === booking.id ? "Cancel Review" : "Leave Review"}
    </button>
  )}
</div>

{reviewingBookingId === booking.id && !hasReviewForBooking(booking.id) && (
  <div style={{ marginTop: "14px" }}>
    <label style={{ display: "block", marginBottom: "8px", fontWeight: 700 }}>
      Rating
    </label>

    <select
      value={reviewRatingByBooking[booking.id] || ""}
      onChange={(e) =>
        setReviewRatingByBooking((prev) => ({
          ...prev,
          [booking.id]: Number(e.target.value),
        }))
      }
      style={{ ...styles.input, maxWidth: "180px" }}
    >
      <option value="">Select rating</option>
      <option value="1">1 Star</option>
      <option value="2">2 Stars</option>
      <option value="3">3 Stars</option>
      <option value="4">4 Stars</option>
      <option value="5">5 Stars</option>
    </select>

    <label style={{ display: "block", margin: "12px 0 8px", fontWeight: 700 }}>
      Comment
    </label>

    <textarea
      value={reviewCommentByBooking[booking.id] || ""}
      onChange={(e) =>
        setReviewCommentByBooking((prev) => ({
          ...prev,
          [booking.id]: e.target.value,
        }))
      }
      placeholder="Share your experience with this notary"
      style={{
        ...styles.input,
        minHeight: "100px",
        width: "100%",
        resize: "vertical",
      }}
    />

    <div style={{ marginTop: "12px" }}>
      <button
        style={styles.buttonPrimary}
        onClick={() => handleReviewSubmit(booking)}
        disabled={savingReview}
      >
        {savingReview ? "Submitting..." : "Submit Review"}
      </button>
    </div>
  </div>
)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <div style={{ marginTop: "24px" }}>
          <button onClick={handleLogout} style={styles.buttonDanger}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
  
export default function DashboardPage() {
  return (
    <Suspense fallback={<div style={{ padding: "24px" }}>Loading dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}