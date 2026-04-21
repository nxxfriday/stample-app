"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
export default function NotaryApplyPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    businessName: "",
    commissionNumber: "",
    state: "South Carolina",
    serviceArea: "",
    travelRadiusMiles: 15,
    bio: "",
  });

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setCheckingAuth(false);
    };

    checkUser();
  }, [router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "travelRadiusMiles" ? Number(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error("You must be logged in to apply.");
      }

      // Optional: update phone in profiles table
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          phone: form.phone,
        })
        .eq("id", user.id);

      if (profileError) {
        throw new Error(profileError.message);
      }

      // Insert or update notary profile
      const { error: notaryError } = await supabase
        .from("notary_profiles")
        .upsert({
          id: user.id,
          business_name: form.businessName,
          commission_number: form.commissionNumber,
          state: form.state,
          service_area: form.serviceArea,
          travel_radius_miles: form.travelRadiusMiles,
          bio: form.bio,
          is_verified: false,
          is_active: false,
        });

      if (notaryError) {
        throw new Error(notaryError.message);
      }

      setMessage("Application submitted successfully. Your notary profile is awaiting admin approval.");

      setForm({
        fullName: "",
        phone: "",
        businessName: "",
        commissionNumber: "",
        state: "South Carolina",
        serviceArea: "",
        travelRadiusMiles: 15,
        bio: "",
      });
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <main className="min-h-screen p-6">
        <p>Checking login...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white px-4 py-10">
      <div className="mx-auto max-w-2xl rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h1 className="mb-2 text-3xl font-bold">Apply to Become a Notary on STAMPLE</h1>
        <p className="mb-6 text-sm text-gray-600">
          Fill out the application below. Once approved, you’ll be able to accept appointments through the platform.
        </p>

        {message && (
          <div className="mb-4 rounded-lg bg-green-100 p-3 text-sm text-green-800">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-lg bg-red-100 p-3 text-sm text-red-800">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 p-3"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Phone Number</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 p-3"
              placeholder="803-555-1234"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Business Name</label>
            <input
              type="text"
              name="businessName"
              value={form.businessName}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 p-3"
              placeholder="Midlands After-Hours Mobile Notary LLC"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Commission Number</label>
            <input
              type="text"
              name="commissionNumber"
              value={form.commissionNumber}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 p-3"
              placeholder="Your commission number"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">State</label>
            <input
              type="text"
              name="state"
              value={form.state}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 p-3"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Service Area</label>
            <input
              type="text"
              name="serviceArea"
              value={form.serviceArea}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 p-3"
              placeholder="Columbia, SC and surrounding areas"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Travel Radius (Miles)</label>
            <input
              type="number"
              name="travelRadiusMiles"
              value={form.travelRadiusMiles}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 p-3"
              min={1}
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Short Bio</label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 p-3"
              rows={4}
              placeholder="Tell us a little about your experience and service."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-black px-4 py-3 text-white disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </div>
    </main>
  );
}