"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type ProfileRow = {
  id: string;
  role: string;
};

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [role, setRole] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadRoleFromUserId = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, role")
      .eq("id", userId)
      .single();

    if (error || !data) {
      setRole("customer");
    } else {
      setRole((data as ProfileRow).role || "customer");
    }

    setIsLoggedIn(true);
    setLoading(false);
  };

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (!mounted) return;

      if (error || !data.session?.user) {
        setRole("");
        setIsLoggedIn(false);
        setLoading(false);
        return;
      }

      await loadRoleFromUserId(data.session.user.id);
    };

    init();

    return () => {
      mounted = false;
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const linkClass = (href: string) => {
    const active = pathname === href;
    return `rounded-lg px-3 py-2 text-sm font-medium transition ${
      active
        ? "bg-black text-white"
        : "border border-gray-300 bg-white text-black hover:bg-gray-100"
    }`;
  };

  if (loading) {
    return (
      <nav className="border-b bg-white px-6 py-4">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm text-gray-500">Loading navigation...</p>
        </div>
      </nav>
    );
  }

  return (
    <nav className="border-b bg-white px-6 py-4">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
        <Link href="/" className="text-xl font-bold">
          STAMPLE
        </Link>

        <div className="flex flex-wrap gap-2">
          {!isLoggedIn ? (
            <>
              <Link href="/login" className={linkClass("/login")}>
                Login
              </Link>
              <Link href="/signup" className={linkClass("/signup")}>
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <Link href="/dashboard" className={linkClass("/dashboard")}>
                Dashboard
              </Link>

              <Link href="/book" className={linkClass("/book")}>
                Book
              </Link>

              {role === "customer" && (
                <Link href="/notary/apply" className={linkClass("/notary/apply")}>
                  Become a Notary
                </Link>
              )}

              {role === "notary" && (
                <Link
                  href="/notary/dashboard"
                  className={linkClass("/notary/dashboard")}
                >
                  Notary Dashboard
                </Link>
              )}

              {role === "admin" && (
                <>
                  <Link href="/admin" className={linkClass("/admin")}>
                    Admin
                  </Link>
                  <Link
                    href="/notary/dashboard"
                    className={linkClass("/notary/dashboard")}
                  >
                    Notary Dashboard
                  </Link>
                  <Link href="/notary/apply" className={linkClass("/notary/apply")}>
                    Notary Apply
                  </Link>
                </>
              )}

              <button
                onClick={handleLogout}
                className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}