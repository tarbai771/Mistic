"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const supabase = createClient();

    // 1. Send reset password email pointing to your update route
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    });

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage("Check your email for the password reset link!");
    }
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleResetRequest}
      className="max-w-md mx-auto p-6 space-y-4"
    >
      <h1 className="text-xl font-bold">Forgot Password</h1>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full p-2 border rounded-md"
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-white py-2 rounded-md hover:opacity-90"
      >
        {loading ? "Sending..." : "Send Reset Link"}
      </button>
      {message && <p className="text-sm mt-2">{message}</p>}
    </form>
  );
}
