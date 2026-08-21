"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();

    // Update password for the currently authenticated user session
    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      alert("Password updated successfully!");
      router.push("/dashboard");
    }
  };

  return (
    <form
      onSubmit={handlePasswordUpdate}
      className="max-w-md mx-auto p-6 space-y-4"
    >
      <h1 className="text-xl font-bold">Set New Password</h1>
      <input
        type="password"
        placeholder="Enter new password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={6}
        className="w-full p-2 border rounded-md"
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-white py-2 rounded-md hover:opacity-90"
      >
        {loading ? "Updating..." : "Update Password"}
      </button>
      {error && <p className="text-sm text-destructive mt-2">{error}</p>}
    </form>
  );
}
