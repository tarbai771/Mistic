"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// 1. Import browser Supabase client
import { createClient } from "@/lib/supabase/client";
import { type Profile, TestSignUp } from "./testing-sign-up";
import { Separator } from "./ui/separator";

export function LoginComponent() {
  const router = useRouter();
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSelectProfile = (profile: Profile | null) => {
    setSelectedProfile(profile);
    if (profile) {
      setEmail(profile.email);
      setPassword(profile.password);
    } else {
      setEmail("");
      setPassword("");
    }
  };

  // 2. Handle Email & Password Login
  const handleLogin = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    // Redirect to home/app after logging in successfully
    router.push("/");
    router.refresh();
  };

  // 3. Handle Google OAuth Login
  const handleGoogleLogin = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <Card className="w-full max-w-sm">
      <h2 className="flex justify-center items-center font-bold text-2xl py-4">
        Log In
      </h2>
      <Separator />
      <CardHeader>
        <CardTitle className="text-lg font-bold">
          Logging just to test app?
        </CardTitle>
        <CardDescription>Select any Profile from below</CardDescription>
        <CardAction>
          <Button variant="link" asChild>
            <Link href="/sign-up">Sign Up</Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {/* Form ID links to the submit button in CardFooter */}
        <form id="login-form" onSubmit={handleLogin}>
          <div className="flex flex-col gap-6">
            {errorMsg && (
              <p className="text-sm font-medium text-destructive">{errorMsg}</p>
            )}

            <div className="grid gap-2">
              <Label htmlFor="profile">Profiles</Label>
              <TestSignUp
                selectedProfile={selectedProfile}
                onSelectProfile={handleSelectProfile}
              />
            </div>
            <Separator />
            <div className="grid gap-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-1">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <a
                  href="/placeholder"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2 mt-auto">
        <Button
          type="submit"
          form="login-form"
          className="w-full"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleGoogleLogin}
        >
          Login with Google
        </Button>
      </CardFooter>
    </Card>
  );
}
