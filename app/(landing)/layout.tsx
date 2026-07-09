import "../globals.css";
import Footer from "@/components/base/footer";
import Header from "@/components/base/header";
import { cn } from "@/lib/utils";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div lang="en" className={cn("h-full", "antialiased", "dark", "font-sans")}>
			<div className="min-h-full flex flex-col bg-[#0B0B0C]">
				<Header />
				{children}
				<Footer />
			</div>
		</div>
	);
}
