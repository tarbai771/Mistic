"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
	const pathname = usePathname();
	const currentYear = new Date().getFullYear();

	if (pathname?.startsWith("/application")) {
		return null;
	}

	const links = [
		{ name: "Privacy", href: "#privacy" },
		{ name: "Terms", href: "#terms" },
		{ name: "Status", href: "#status" },
		{ name: "Contact", href: "#contact" },
	];

	return (
		<footer className="w-full border-t border-border bg-[#0B0B0C] py-12 px-6 md:px-8">
			<div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
				{/* Left Side: Brand and Copyright */}
				<div className="flex flex-col items-center gap-2 md:items-start">
					<div className="flex items-center gap-2">
						<span className="text-sm font-semibold tracking-wider text-white">
							MISTIC
						</span>
						<span className="h-1 w-1 rounded-full bg-primary" />
					</div>
					<p className="text-xs text-muted-foreground">
						&copy; {currentYear} Mistic Technologies, Inc. All rights reserved.
					</p>
				</div>

				{/* Center: System Status Indicator */}
				<div className="flex items-center gap-2.5 rounded-full border border-border bg-[#121214] py-1.5 px-3.5 text-xs text-muted-foreground">
					<span className="relative flex h-2 w-2">
						<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
						<span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
					</span>
					<span>All systems operational</span>
				</div>

				{/* Right Side: Links */}
				<div className="flex items-center gap-6">
					{links.map((link) => (
						<Link
							key={link.name}
							href={link.href}
							className="text-xs text-muted-foreground hover:text-white transition-colors duration-200"
						>
							{link.name}
						</Link>
					))}
				</div>
			</div>
		</footer>
	);
}
