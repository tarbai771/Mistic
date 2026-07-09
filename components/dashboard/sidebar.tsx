"use client";

import { motion } from "framer-motion";
import {
	ChevronLeft,
	ChevronRight,
	FileText,
	Lock,
	LogOut,
	PenTool,
	Phone,
} from "lucide-react";
import Link from "next/link";

export type SidebarTab = "Calls" | "Sketch" | "Editor" | "Vault";

interface SidebarProps {
	activeTab: SidebarTab;
	setActiveTab: (tab: SidebarTab) => void;
	collapsed: boolean;
	setCollapsed: (collapsed: boolean) => void;
}

export default function Sidebar({
	activeTab,
	setActiveTab,
	collapsed,
	setCollapsed,
}: SidebarProps) {
	const navItems = [
		{ id: "Calls", label: "Calls", icon: Phone, badge: "LIVE" },
		{ id: "Sketch", label: "Sketch", icon: PenTool, badge: "NEW" },
		{ id: "Editor", label: "Editor", icon: FileText, badge: "2" },
		{ id: "Vault", label: "Vault", icon: Lock, badge: "SECURE" },
	];

	return (
		<>
			{/* 1. Desktop Left Sidebar (remains visible on medium widths and up) */}
			<motion.aside
				animate={{ width: collapsed ? 68 : 240 }}
				transition={{ type: "spring", stiffness: 380, damping: 30 }}
				className="hidden md:flex flex-col justify-between border-r border-border bg-[#0C0C0E]/90 h-screen select-none shrink-0"
			>
				{/* Upper Brand & Nav Items */}
				<div className="flex flex-col pt-5 px-3">
					{/* Logo Section */}
					<div className="flex items-center justify-between px-3 mb-8 h-8 overflow-hidden">
						<Link href="/" className="flex items-center gap-2 shrink-0 group">
							<span className="text-lg font-bold tracking-tight text-white transition-colors duration-300 group-hover:text-primary">
								{!collapsed ? "Mistic" : "M"}
							</span>
							<span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
						</Link>

						{!collapsed && (
							<span className="text-[8px] bg-primary/10 text-primary border border-primary/20 px-1.5 py-0.5 rounded font-mono font-bold tracking-widest uppercase">
								v1.0
							</span>
						)}
					</div>

					{/* Navigation Items list */}
					<nav className="flex flex-col gap-1.5">
						{navItems.map((item) => {
							const IconComponent = item.icon;
							const isActive = activeTab === item.id;
							return (
								<button
									type="button"
									key={item.id}
									onClick={() => setActiveTab(item.id as SidebarTab)}
									className={`w-full flex items-center justify-between p-3 rounded-lg text-xs transition-colors font-mono relative ${
										isActive
											? "text-white font-extrabold"
											: "text-muted-foreground hover:text-white hover:bg-[#121214]/60"
									}`}
								>
									{/* Sliding Background active indicator using layoutId */}
									{isActive && (
										<motion.span
											layoutId="sidebar-active-pill"
											className="absolute inset-0 bg-[#121214] rounded-lg border border-white/5 shadow-md"
											transition={{
												type: "spring",
												stiffness: 380,
												damping: 30,
											}}
										/>
									)}

									{/* Tab Icon and Label */}
									<span className="flex items-center gap-3 relative z-10">
										<IconComponent
											className={`size-4 shrink-0 ${isActive ? "text-primary" : "text-muted-foreground"}`}
										/>
										{!collapsed && <span>{item.label}</span>}
									</span>

									{/* Badge */}
									{!collapsed && item.badge && (
										<span
											className={`text-[8px] font-bold px-1.5 py-0.2 rounded font-mono relative z-10 shrink-0 select-none ${
												isActive
													? "bg-primary/20 text-white"
													: "bg-[#18181c] text-muted-foreground/60 border border-border"
											}`}
										>
											{item.badge}
										</span>
									)}
								</button>
							);
						})}
					</nav>
				</div>

				{/* Lower Account & Settings Deck */}
				<div className="p-3 flex flex-col gap-2 border-t border-border bg-[#0C0C0E]/50">
					{/* Collapse/Expand trigger toggler */}
					<button
						type="button"
						onClick={() => setCollapsed(!collapsed)}
						className="w-full flex items-center justify-center p-2 rounded-lg border border-border bg-[#121214] hover:bg-[#1c1c20] hover:border-white/20 text-muted-foreground hover:text-white transition-all cursor-pointer h-9 shrink-0"
					>
						{collapsed ? (
							<ChevronRight className="size-4" />
						) : (
							<ChevronLeft className="size-4" />
						)}
					</button>

					{/* User Account block */}
					<div className="flex items-center justify-between p-2.5 rounded-lg bg-[#121214]/50 border border-border/40 select-none h-11 overflow-hidden shrink-0">
						<div className="flex items-center gap-2.5 min-w-0">
							<span className="size-6 rounded-full bg-primary/20 text-primary border border-primary/20 flex items-center justify-center text-[10px] font-bold font-mono shrink-0">
								LC
							</span>
							{!collapsed && (
								<div className="flex flex-col min-w-0 text-left">
									<span className="text-[11px] font-bold text-white truncate font-mono">
										Lily Chou
									</span>
									<span className="text-[9px] text-muted-foreground/75 truncate font-mono">
										Lead Designer
									</span>
								</div>
							)}
						</div>

						{!collapsed && (
							<button
								type="button"
								onClick={() => alert("Logging out of SaaS session...")}
								className="text-muted-foreground hover:text-red-400 p-1 shrink-0 transition-colors"
								title="Disconnect"
							>
								<LogOut className="size-3.5" />
							</button>
						)}
					</div>
				</div>
			</motion.aside>

			{/* 2. Mobile Responsive Bottom Navigation Dock (strictly active below md) */}
			<nav className="md:hidden fixed bottom-0 inset-x-0 h-16 border-t border-border bg-[#0C0C0E]/95 backdrop-blur-lg flex items-center justify-around px-4 pb-safe-bottom z-40 select-none shadow-[0_-8px_32px_rgba(0,0,0,0.4)]">
				{navItems.map((item) => {
					const IconComponent = item.icon;
					const isActive = activeTab === item.id;
					return (
						<button
							type="button"
							key={item.id}
							onClick={() => setActiveTab(item.id as SidebarTab)}
							className="flex flex-col items-center justify-center w-16 h-12 relative select-none font-mono"
						>
							{/* Sliding indicator underneath active button on mobile */}
							{isActive && (
								<motion.span
									layoutId="mobile-sidebar-active"
									className="absolute inset-x-2 inset-y-1 bg-[#121214] rounded-lg border border-white/5 shadow-inner"
									transition={{ type: "spring", stiffness: 380, damping: 30 }}
								/>
							)}

							<IconComponent
								className={`size-4.5 mb-1 relative z-10 ${isActive ? "text-primary animate-pulse" : "text-muted-foreground"}`}
							/>
							<span
								className={`text-[8px] tracking-wider relative z-10 ${isActive ? "text-white font-bold" : "text-muted-foreground"}`}
							>
								{item.label}
							</span>

							{item.badge === "LIVE" && (
								<span className="absolute top-1 right-2 w-1.5 h-1.5 rounded-full bg-primary" />
							)}
						</button>
					);
				})}
			</nav>
		</>
	);
}
