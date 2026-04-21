"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type NotaryProfile = {
  id: string;
  business_name: string;
  service_area: string;
  state: string;
  travel_radius_miles: number;
};

export default function BookPage() {
  const router = useRouter();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingNotaries, setLoadingNotaries] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [notaries, setNotaries] = useState<NotaryProfile[]>([]);

  const [form, setForm] = useState({
    notaryId: "",
    serviceType: "",
    address: "",
    city: "",
    state: "South Carolina",
    zip: "",
    appointmentTime: "",
    notes: "",
  });

  useEffect(() => {
    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setCheckingAuth(false);
      await loadNotaries();
    };

    init();
  }, [router]);

  const loadNotaries = async () => {
    setLoadingNotaries(true);
    setError("");

    const { data, error } = await supabase
      .from("notary_profiles")
      .select("id, business_name, service_area, state, travel_radius_miles")
      .eq("is_verified", true)
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setNotaries((data || []) as NotaryProfile[]);
    }

    setLoadingNotaries(false);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
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
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error("You must be logged in to create a booking.");
      }

      if (!form.notaryId) {
        throw new Error("Please choose a notary.");
      }

      // Only create a profile if missing. Do NOT overwrite existing role.
      const { data: existingProfile, error: existingProfileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();

      if (existingProfileError) {
        throw new Error(`Profile lookup error: ${existingProfileError.message}`);
      }

      if (!existingProfile) {
        const { error: profileInsertError } = await supabase
          .from("profiles")
          .insert({
            id: user.id,
            role: "customer",
          });

        if (profileInsertError) {
          throw new Error(`Profile error: ${profileInsertError.message}`);
        }
      }

      // Create booking first
      const { data: insertedBooking, error: insertError } = await supabase
        .from("bookings")
        .insert({
          customer_id: user.id,
          notary_id: form.notaryId,
          service_type: form.serviceType,
          address: form.address,
          city: form.city,
          state: form.state,
          zip: form.zip,
          appointment_time: form.appointmentTime,
          status: "pending",
          payment_status: "unpaid",
          notes: form.notes,
        })
        .select()
        .single();

      if (insertError || !insertedBooking) {
        throw new Error(insertError?.message || "Failed to create booking.");
      }

      // Create Stripe checkout session
      const checkoutRes = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingId: insertedBooking.id,
        }),
      });

      const checkoutData = await checkoutRes.json();

      if (!checkoutRes.ok || !checkoutData.url) {
        throw new Error(checkoutData.error || "Failed to start checkout.");
      }

      // Redirect user to Stripe Checkout
      window.location.href = checkoutData.url;
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
        <h1 className="mb-2 text-3xl font-bold">Book a Notary</h1>
        <p className="mb-6 text-sm text-gray-600">
          Submit your appointment request below.
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
            <label className="mb-1 block text-sm font-medium">Choose a Notary</label>
            <select
              name="notaryId"
              value={form.notaryId}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 p-3"
              required
            >
              <option value="">
                {loadingNotaries ? "Loading notaries..." : "Select a notary"}
              </option>
              {notaries.map((notary) => (
                <option key={notary.id} value={notary.id}>
                  {notary.business_name} — {notary.service_area}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Service Type</label>
            <input
              type="text"
              name="serviceType"
              value={form.serviceType}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 p-3"
              placeholder="General Notarization"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Address</label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 p-3"
              placeholder="123 Main St"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">City</label>
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 p-3"
              placeholder="Columbia"
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
            <label className="mb-1 block text-sm font-medium">ZIP Code</label>
            <input
              type="text"
              name="zip"
              value={form.zip}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 p-3"
              placeholder="29201"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Appointment Time</label>
            <input
              type="datetime-local"
              name="appointmentTime"
              value={form.appointmentTime}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 p-3"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 p-3"
              rows={4}
              placeholder="Any details the notary should know"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-black px-4 py-3 text-white disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Booking"}
          </button>
        </form>
      </div>
    </main>
  );
}