"use client";

import { animate, motion } from "framer-motion";
import {
	ArrowRight,
	Check,
	Cpu,
	Globe,
	HelpCircle,
	Shield,
	Sparkles,
	Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

// Reusable animated count-up number component
function AnimatedNumber({ value }: { value: number }) {
	const ref = useRef<HTMLSpanElement>(null);

	useEffect(() => {
		const node = ref.current;
		if (!node) return;

		const startVal = parseFloat(node.textContent || "0");
		const controls = animate(startVal, value, {
			duration: 0.5,
			ease: [0.16, 1, 0.3, 1], // spring-like custom bezier curve
			onUpdate(current) {
				node.textContent = Math.round(current).toString();
			},
		});

		return () => controls.stop();
	}, [value]);

	return <span ref={ref}>{value}</span>;
}

// Magnetic wrapper for the primary actions
function MagneticButton({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	const ref = useRef<HTMLDivElement>(null);
	const [position, setPosition] = useState({ x: 0, y: 0 });

	const handleMouseMove = (e: React.MouseEvent) => {
		if (!ref.current) return;
		const { clientX, clientY } = e;
		const { left, top, width, height } = ref.current.getBoundingClientRect();
		const centerX = left + width / 2;
		const centerY = top + height / 2;

		// Smooth magnetic pull
		setPosition({
			x: (clientX - centerX) * 0.25,
			y: (clientY - centerY) * 0.25,
		});
	};

	const handleMouseLeave = () => {
		setPosition({ x: 0, y: 0 });
	};

	return (
		<motion.div
			ref={ref}
			onMouseMove={handleMouseMove}
			onMouseLeave={handleMouseLeave}
			animate={{ x: position.x, y: position.y }}
			transition={{ type: "spring", stiffness: 350, damping: 25, mass: 0.5 }}
			className={className}
		>
			{children}
		</motion.div>
	);
}

export default function PricingPage() {
	const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">(
		"yearly",
	);

	const plans = [
		{
			name: "Core",
			description: "Collaborative sandbox essentials for high-velocity teams.",
			price: { monthly: 0, yearly: 0 },
			cta: "Start Free Now",
			features: [
				"Real-time Collaborative Editor",
				"Interactive Whiteboard (Sketch)",
				"Standard Audio Calls (Up to 3 participants)",
				"1 GB Shared Storage Vault",
				"Community Discord Support",
			],
			highlight: false,
			tag: "Essentials",
			icon: Zap,
		},
		{
			name: "Pro",
			description:
				"Infinite collaborative workspace for professional builders.",
			price: { monthly: 24, yearly: 19 },
			cta: "Upgrade to Pro",
			features: [
				"Everything in Core, plus:",
				"High-Fidelity Video & Screen Sharing",
				"Unlimited Audio/Video Calls (up to 50 players)",
				"50 GB Secure Shared Storage Vault",
				"Custom Whiteboard Canvas Export (SVG/PDF)",
				"Priority Slack & Email Support (under 3h)",
			],
			highlight: true,
			tag: "Most Popular",
			icon: Cpu,
		},
		{
			name: "Enterprise",
			description: "Bespoke compliance, scale, and custom integrations.",
			price: { monthly: 99, yearly: 79 },
			cta: "Schedule Alignment",
			features: [
				"Everything in Pro, plus:",
				"Infinite Storage & File Vaults",
				"SSO, SAML & Advanced Audit Logs",
				"Dedicated Multi-Region Server Installs",
				"Bespoke Drawing Canvas integrations",
				"Dedicated Engineering Account Manager",
			],
			highlight: false,
			tag: "Scale",
			icon: Globe,
		},
	];

	// Feature matrix comparing core modules
	const featuresMatrix = [
		{
			category: "COLLABORATION & CANVAS",
			name: "Real-time Collaborative Editor",
			core: true,
			pro: true,
			enterprise: true,
		},
		{
			category: "COLLABORATION & CANVAS",
			name: "Interactive Drawing Whiteboard",
			core: "Basic SVG drawing",
			pro: "Advanced tools + Custom exports",
			enterprise: "Tailored canvas APIs + Integrations",
		},
		{
			category: "COLLABORATION & CANVAS",
			name: "Active multiplayer cursors",
			core: true,
			pro: true,
			enterprise: true,
		},
		{
			category: "COMMUNICATION",
			name: "High-definition Audio Calls",
			core: "Up to 3 players",
			pro: "Up to 50 players",
			enterprise: "Unlimited",
		},
		{
			category: "COMMUNICATION",
			name: "Video & Screen Sharing",
			core: false,
			pro: true,
			enterprise: true,
		},
		{
			category: "SECURITY & DATA",
			name: "Vault Shared Storage",
			core: "1 GB",
			pro: "50 GB",
			enterprise: "Infinite",
		},
		{
			category: "SECURITY & DATA",
			name: "File Locking & Access controls",
			core: false,
			pro: true,
			enterprise: true,
		},
		{
			category: "SECURITY & DATA",
			name: "SSO / SAML Integrations",
			core: false,
			pro: false,
			enterprise: true,
		},
	];

	return (
		<main className="flex-1 bg-[#0B0B0C] text-foreground py-20 px-6 md:px-8 border-b border-border/60 relative overflow-hidden">
			{/* Title Tag for SEO in React 19 */}
			<title>Pricing Plans &mdash; Mistic</title>
			<meta
				name="description"
				content="Transparent, industrial-clean pricing for product teams seeking high-fidelity collaborative work suites."
			/>

			{/* Grid Backdrop */}
			<div className="absolute inset-0 bg-[radial-gradient(#1e1e24_1px,transparent_1px)] bg-size-[32px_32px] opacity-15 pointer-events-none" />

			{/* Hero Header */}
			<div className="mx-auto max-w-7xl flex flex-col items-center text-center mb-16 relative z-10">
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
					className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary mb-4"
				>
					<Sparkles className="size-3" />
					<span>Industrial Simplicity. Transparent Pricing.</span>
				</motion.div>

				<motion.h1
					initial={{ opacity: 0, y: 15 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
					className="text-4xl md:text-5xl font-extrabold tracking-tight text-white max-w-3xl leading-none"
				>
					An honest model for{" "}
					<span className="font-mono text-primary font-bold">real-time</span>{" "}
					teams.
				</motion.h1>
				<motion.p
					initial={{ opacity: 0, y: 15 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
					className="mt-4 text-sm md:text-base text-muted-foreground max-w-xl leading-relaxed"
				>
					Zero limits on ideas. Select the scale that empowers your engineers,
					designers, and writers to collaborate with high-performance tools.
				</motion.p>

				{/* Physics-based Billing Toggle */}
				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.5, delay: 0.3 }}
					className="mt-8 flex items-center justify-center gap-3 bg-[#121214] p-1 rounded-full border border-border"
				>
					<button
						onClick={() => setBillingPeriod("monthly")}
						className={`relative rounded-full px-4 py-1.5 text-xs font-semibold transition-colors z-10 font-mono ${
							billingPeriod === "monthly"
								? "text-white"
								: "text-muted-foreground hover:text-white"
						}`}
					>
						{billingPeriod === "monthly" && (
							<motion.span
								layoutId="active-billing"
								className="absolute inset-0 bg-[#1E1E22] rounded-full -z-10 border border-white/5"
								transition={{ type: "spring", stiffness: 400, damping: 40 }}
							/>
						)}
						Monthly
					</button>
					<button
						onClick={() => setBillingPeriod("yearly")}
						className={`relative rounded-full px-4 py-1.5 text-xs font-semibold transition-colors z-10 font-mono flex items-center gap-1.5 ${
							billingPeriod === "yearly"
								? "text-white"
								: "text-muted-foreground hover:text-white"
						}`}
					>
						{billingPeriod === "yearly" && (
							<motion.span
								layoutId="active-billing"
								className="absolute inset-0 bg-[#1E1E22] rounded-full -z-10 border border-white/5"
								transition={{ type: "spring", stiffness: 400, damping: 40 }}
							/>
						)}
						Yearly
						<span className="bg-primary/20 text-primary text-[9px] px-1.5 py-0.2 rounded-full font-bold">
							Save 20%
						</span>
					</button>
				</motion.div>
			</div>

			{/* Pricing Cards Grid */}
			<div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6 mb-24 relative z-10">
				{plans.map((plan, index) => {
					const PlanIcon = plan.icon;
					return (
						<motion.div
							key={plan.name}
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{
								duration: 0.8,
								delay: index * 0.1,
								ease: [0.16, 1, 0.3, 1],
							}}
							whileHover={{
								scale: 1.015,
								borderColor: plan.highlight
									? "rgba(139, 92, 246, 0.4)"
									: "rgba(255, 255, 255, 0.15)",
							}}
							className={`rounded-xl p-6.5 flex flex-col justify-between border bg-[#121214] transition-all duration-300 ${
								plan.highlight
									? "border-primary/40 shadow-[0_12px_40px_rgba(139,92,246,0.06)] relative overflow-hidden"
									: "border-border"
							}`}
						>
							{plan.highlight && (
								<div className="absolute -top-12 -right-12 w-24 h-24 bg-primary/10 rounded-full filter blur-xl pointer-events-none" />
							)}

							{/* Upper Section */}
							<div>
								<div className="flex justify-between items-center mb-4">
									<span className="text-[10px] font-extrabold font-mono text-muted-foreground/80 tracking-widest uppercase bg-[#18181c] border border-border px-2.5 py-0.5 rounded">
										{plan.tag}
									</span>
									{plan.highlight && (
										<span className="text-[10px] font-bold text-primary font-mono bg-primary/10 px-2 py-0.5 rounded-full">
											Highly Recommended
										</span>
									)}
								</div>

								<div className="flex items-center gap-2 mb-2">
									<PlanIcon className="size-4 text-primary" />
									<h3 className="text-xl font-extrabold text-white font-mono">
										{plan.name}
									</h3>
								</div>
								<p className="text-xs text-muted-foreground leading-relaxed min-h-10 mb-6 border-b border-border/60 pb-4">
									{plan.description}
								</p>

								{/* Pricing Number with Animated count-up */}
								<div className="flex items-baseline gap-1.5 mb-6.5 font-mono">
									<span className="text-4xl md:text-5xl font-black text-white tracking-tight">
										$
										<AnimatedNumber
											value={
												billingPeriod === "monthly"
													? plan.price.monthly
													: plan.price.yearly
											}
										/>
									</span>
									<span className="text-xs text-muted-foreground">
										/user/
										{billingPeriod === "monthly" ? "mo" : "mo billed annually"}
									</span>
								</div>

								{/* Features List */}
								<ul className="flex flex-col gap-3 mb-8">
									{plan.features.map((feature, idx) => (
										<li
											key={idx}
											className="flex items-start gap-2.5 text-xs text-muted-foreground leading-normal"
										>
											<Check className="size-4 text-primary shrink-0 mt-0.5" />
											<span>{feature}</span>
										</li>
									))}
								</ul>
							</div>

							{/* Action Button (Magnetic effect on primary CTAs) */}
							{plan.highlight ? (
								<MagneticButton className="w-full">
									<a
										href="/app"
										className="flex h-11 items-center justify-center gap-1.5 rounded-lg bg-primary w-full text-xs font-bold text-white shadow-md hover:bg-primary/95 transition-colors border border-primary/20"
									>
										<span>{plan.cta}</span>
										<ArrowRight className="size-3.5" />
									</a>
								</MagneticButton>
							) : (
								<a
									href="/app"
									className="flex h-11 items-center justify-center gap-1.5 rounded-lg border border-border bg-[#18181c] w-full text-xs font-semibold text-white hover:bg-[#202024] hover:border-white/20 transition-all duration-200"
								>
									<span>{plan.cta}</span>
									<ArrowRight className="size-3 text-muted-foreground" />
								</a>
							)}
						</motion.div>
					);
				})}
			</div>

			{/* Feature Breakdown Table - Industrial-Clean styling */}
			<div className="mx-auto max-w-5xl relative z-10 mt-12">
				<div className="flex flex-col items-center mb-10">
					<h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight text-center font-mono">
						COMPREHENSIVE SPECS
					</h2>
					<div className="h-0.5 w-12 bg-primary mt-2" />
				</div>

				<div className="border border-border rounded-xl bg-[#121214] overflow-hidden shadow-lg font-sans">
					{/* Mobile responsive message */}
					<div className="block md:hidden bg-primary/5 text-primary text-[10px] text-center font-semibold py-2.5 border-b border-border font-mono">
						Scroll horizontally to compare all features &rarr;
					</div>

					<div className="overflow-x-auto">
						<table className="w-full text-left text-xs border-collapse">
							<thead>
								<tr className="border-b border-border bg-[#18181c]/60 text-muted-foreground font-mono font-bold tracking-wider text-[10px]">
									<th className="p-4 uppercase">Feature Matrix</th>
									<th className="p-4 w-1/4 uppercase">Core</th>
									<th className="p-4 w-1/4 uppercase">Pro</th>
									<th className="p-4 w-1/4 uppercase">Enterprise</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-border/60">
								{featuresMatrix.map((feat, idx) => {
									const isHeader =
										idx === 0 ||
										feat.category !== featuresMatrix[idx - 1]?.category;
									return (
										<tr
											key={feat.name}
											className="hover:bg-[#161619]/40 transition-colors"
										>
											<td className="p-4">
												{isHeader && (
													<div className="text-[9px] font-extrabold font-mono text-primary tracking-widest uppercase mb-1">
														{feat.category}
													</div>
												)}
												<span className="font-medium text-white">
													{feat.name}
												</span>
											</td>
											<td className="p-4 text-muted-foreground font-mono">
												{typeof feat.core === "boolean" ? (
													feat.core ? (
														<Check className="size-4 text-emerald-400" />
													) : (
														<span className="text-[10px] text-muted-foreground/30">
															&mdash;
														</span>
													)
												) : (
													feat.core
												)}
											</td>
											<td className="p-4 text-white font-mono">
												{typeof feat.pro === "boolean" ? (
													feat.pro ? (
														<Check className="size-4 text-primary" />
													) : (
														<span className="text-[10px] text-muted-foreground/30">
															&mdash;
														</span>
													)
												) : (
													feat.pro
												)}
											</td>
											<td className="p-4 text-white font-mono font-semibold">
												{typeof feat.enterprise === "boolean" ? (
													feat.enterprise ? (
														<Check className="size-4 text-indigo-400" />
													) : (
														<span className="text-[10px] text-muted-foreground/30">
															&mdash;
														</span>
													)
												) : (
													feat.enterprise
												)}
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				</div>
			</div>

			{/* Frequently Asked Questions */}
			<div className="mx-auto max-w-4xl relative z-10 mt-28">
				<div className="text-center mb-12">
					<span className="text-[10px] font-extrabold font-mono text-primary tracking-widest uppercase">
						FAQ
					</span>
					<h2 className="text-2xl font-extrabold text-white mt-1">
						Frequently Asked Alignment
					</h2>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					{[
						{
							q: "Can I swap between Monthly and Yearly subscriptions?",
							a: "Absolutely. Swapping occurs dynamically in your billing terminal. Any annual conversion triggers a 20% discount on the remaining billing periods.",
						},
						{
							q: "What defines a 'Player' or participant in a canvas?",
							a: "Players are authenticated members who connect to your live rooms. In Core mode, up to 3 players can simultaneously manipulate Whiteboards or editors.",
						},
						{
							q: "How secure is the File Vault sharing system?",
							a: "Extremely secure. All Vault files are stored with AES-256 encryption at rest. In Pro and Enterprise mode, you can customize locking rules and assign view-only tokens.",
						},
						{
							q: "Do you offer a self-hosted Enterprise option?",
							a: "Yes. Our Enterprise tier supports full Docker / multi-region server installations with custom SAML setup to comply with strict B2B privacy codes.",
						},
					].map((faq, idx) => (
						<div
							key={idx}
							className="flex flex-col gap-2 p-5 rounded-lg border border-border bg-[#121214]"
						>
							<div className="flex gap-2 items-start">
								<HelpCircle className="size-4 text-primary shrink-0 mt-0.5" />
								<h4 className="text-xs font-extrabold font-mono text-white uppercase">
									{faq.q}
								</h4>
							</div>
							<p className="text-xs text-muted-foreground leading-relaxed pl-6">
								{faq.a}
							</p>
						</div>
					))}
				</div>
			</div>
		</main>
	);
}
