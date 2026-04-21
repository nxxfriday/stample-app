"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type AllowedRole = "admin" | "notary" | "customer";

type ProtectedRouteProps = {
  children: React.ReactNode;
  allowedRoles: AllowedRole[];
};

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.user) {
        router.push("/login");
        return;
      }

      const userId = session.user.id;

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single();

      if (profileError || !profile) {
        router.push("/dashboard");
        return;
      }

      const role = profile.role as AllowedRole;

      if (!allowedRoles.includes(role)) {
        if (role === "admin") {
          router.push("/admin");
        } else if (role === "notary") {
          router.push("/notary/dashboard");
        } else {
          router.push("/dashboard");
        }
        return;
      }

      setAuthorized(true);
      setLoading(false);
    };

    checkAccess();
  }, [allowedRoles, router]);

  if (loading) {
    return (
      <div className="min-h-screen p-6">
        <p>Checking access...</p>
      </div>
    );
  }

  if (!authorized) return null;

  return <>{children}</>;
}