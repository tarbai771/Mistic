"use client";

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
import { TestSignUp } from "./testing-sign-up";
import { Separator } from "./ui/separator";

export function SignUp() {
	// Store the full profile object (or null)
	const [selectedProfile, setSelectedProfile] = useState<any | null>(null);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleSelectProfile = (profile: any | null) => {
		setSelectedProfile(profile); // Track the object
		if (profile) {
			setEmail(profile.email);
			setPassword(profile.password);
		} else {
			setEmail("");
			setPassword("");
		}
	};

	return (
		<Card className="h-125 w-full max-w-sm">
			<h2 className="flex justify-center items-center font-bold text-2xl">
				Test Log In
			</h2>
			<Separator />
			<CardHeader>
				<CardTitle className="text-lg font-bold">
					Logging just to test app?
				</CardTitle>
				<CardDescription>Select any Profile from below</CardDescription>
				<CardAction>
					<Button variant="link">Sign Up</Button>
				</CardAction>
			</CardHeader>
			<CardContent>
				<form onSubmit={(e) => e.preventDefault()}>
					<div className="flex flex-col gap-6">
						<div className="grid gap-2">
							<Label htmlFor="profile">Profiles</Label>
							{/* Pass the callback down */}
							<TestSignUp
								selectedProfile={selectedProfile}
								onSelectProfile={handleSelectProfile}
							/>
						</div>
						<Separator />
						<div className="grid gap-1">
							<Label htmlFor="email">Email</Label>
							{/* Link value and setter to state */}
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
									href="#"
									className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
								>
									Forgot your password?
								</a>
							</div>
							{/* Link value and setter to state */}
							<Input
								id="password"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</div>
					</div>
				</form>
			</CardContent>
			<CardFooter className="flex-col gap-2">
				<Button type="submit" className="w-full">
					Login
				</Button>
				<Button variant="outline" className="w-full">
					Login with Google
				</Button>
			</CardFooter>
		</Card>
	);
}
