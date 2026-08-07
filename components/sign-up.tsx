"use client";

import { Eye, EyeOff } from "lucide-react";
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
import { createClient } from "@/lib/supabase/client";
import { Separator } from "./ui/separator";

export function SignUpComponent() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // 2. Email/Password Sign Up Handler
  const handleSignUp = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const supabase = createClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username, // Stores custom username in user_metadata
        },
      },
    });

    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    if (data.session) {
      // User is signed up and automatically logged in
      router.push("/dashboard");
    } else {
      // Email confirmation is required
      alert("Please check your email to confirm your account!");
    }

    // Redirect to home/app page on success
    router.push("/");
    router.refresh();
  };

  // 3. Google OAuth Handler
  const handleGoogleSignUp = async () => {
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
        Sign Up
      </h2>
      <Separator />
      <CardHeader>
        <CardTitle className="text-lg font-bold">Create New Account</CardTitle>
        <CardDescription>Fill out the fields down below</CardDescription>
        <CardAction>
          <Button variant="link" asChild>
            <Link href="/login">Login</Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {/* Form triggers handleSignUp when submitted */}
        <form id="signup-form" onSubmit={handleSignUp}>
          <div className="flex flex-col gap-4">
            {errorMsg && (
              <p className="text-sm font-medium text-destructive">{errorMsg}</p>
            )}

            <div className="grid gap-1">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

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
              <Label htmlFor="password">Password</Label>

              <div className="relative">
                <Input
                  id="password"
                  // Toggle dynamic type here:
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button" // Prevents triggering form submission on click!
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1} // Prevents tabbing into the eye icon before other inputs
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {showPassword ? "Hide password" : "Show password"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2 mt-auto">
        <Button
          type="submit"
          form="signup-form"
          className="w-full"
          disabled={loading}
        >
          {loading ? "Creating account..." : "Sign Up"}
        </Button>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleGoogleSignUp}
        >
          Sign Up with Google
        </Button>
      </CardFooter>
    </Card>
  );
}
