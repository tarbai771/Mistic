"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
	Maximize2,
	MessageSquare,
	Mic,
	MicOff,
	Monitor,
	PhoneOff,
	Settings,
	Sparkles,
	UserCheck,
	Users,
	Video as VideoIcon,
	VideoOff,
} from "lucide-react";
import { useEffect, useState } from "react";

// Simple bouncing bar for premium voice soundwave simulation
function BouncingSoundWave({ active }: { active: boolean }) {
	const bars = Array.from({ length: 6 });
	return (
		<div className="flex items-center gap-0.5 h-4 select-none">
			{bars.map((_, i) => (
				<motion.div
					key={i.toString()}
					animate={
						active ? { height: [4, 16, 6, 14, 4][i % 5] } : { height: 3 }
					}
					transition={
						active
							? {
									duration: 0.8 + i * 0.1,
									repeat: Infinity,
									repeatType: "reverse",
									ease: "easeInOut",
								}
							: { duration: 0.2 }
					}
					className={`w-0.5 rounded-full ${active ? "bg-primary" : "bg-muted-foreground/30"}`}
				/>
			))}
		</div>
	);
}

// Magnetic wrapper for the call control buttons
function MagneticCallControl({
	children,
	onClick,
	active = false,
	danger = false,
}: {
	children: React.ReactNode;
	onClick?: () => void;
	active?: boolean;
	danger?: boolean;
}) {
	const [position, setPosition] = useState({ x: 0, y: 0 });

	const handleMouseMove = (e: React.MouseEvent) => {
		const { clientX, clientY } = e;
		const { left, top, width, height } =
			e.currentTarget.getBoundingClientRect();
		const centerX = left + width / 2;
		const centerY = top + height / 2;
		setPosition({
			x: (clientX - centerX) * 0.2,
			y: (clientY - centerY) * 0.2,
		});
	};

	const handleMouseLeave = () => {
		setPosition({ x: 0, y: 0 });
	};

	return (
		<motion.button
			onMouseMove={handleMouseMove}
			onMouseLeave={handleMouseLeave}
			animate={{ x: position.x, y: position.y }}
			transition={{ type: "spring", stiffness: 450, damping: 25 }}
			onClick={onClick}
			className={`size-11 rounded-full flex items-center justify-center border transition-all duration-300 ${
				danger
					? "bg-destructive/10 border-destructive/30 text-destructive hover:bg-destructive hover:text-white"
					: active
						? "bg-primary border-primary/20 text-white shadow-[0_0_12px_rgba(139,92,246,0.3)]"
						: "bg-[#18181c] border-border text-muted-foreground hover:text-white hover:border-white/20"
			}`}
		>
			{children}
		</motion.button>
	);
}

export default function CallsView() {
	const [micActive, setMicActive] = useState(true);
	const [videoActive, setVideoActive] = useState(true);
	const [screenActive, setScreenActive] = useState(false);
	const [chatOpen, setChatOpen] = useState(false);
	const [activeSpeaker, setActiveSpeaker] = useState<string>("Alex");
	const [messages, setMessages] = useState<
		{ user: string; text: string; time: string }[]
	>([
		{
			user: "Chloe",
			text: "Hey! Can we review the Q3 canvas?",
			time: "11:24 PM",
		},
		{
			user: "Devon",
			text: "Yep, looks like Alex is already screen sharing.",
			time: "11:25 PM",
		},
	]);
	const [newMessage, setNewMessage] = useState("");

	const participants = [
		{
			id: "self",
			name: "You (Lead Designer)",
			role: "Host",
			avatar: "TB",
			color: "bg-primary/20 text-primary border-primary/30",
			mic: micActive,
			video: videoActive,
		},
		{
			id: "Chloe",
			name: "Chloe (Designer)",
			role: "Creator",
			avatar: "CD",
			color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
			mic: true,
			video: true,
		},
		{
			id: "Alex",
			name: "Alex (Backend)",
			role: "Developer",
			avatar: "AB",
			color: "bg-amber-500/10 text-amber-400 border-amber-500/20",
			mic: true,
			video: false,
		},
		{
			id: "Devon",
			name: "Devon (Product)",
			role: "Strategist",
			avatar: "DP",
			color: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
			mic: false,
			video: false,
		},
	];

	// Randomly rotate active speaker to make dashboard feel alive
	useEffect(() => {
		const speakerIds = ["self", "Chloe", "Alex"];
		const interval = setInterval(() => {
			const randomSpeaker =
				speakerIds[Math.floor(Math.random() * speakerIds.length)];
			setActiveSpeaker(randomSpeaker);
		}, 5500);
		return () => clearInterval(interval);
	}, []);

	const handleSendMessage = (e: React.FormEvent) => {
		e.preventDefault();
		if (!newMessage.trim()) return;
		setMessages((prev) => [
			...prev,
			{
				user: "You",
				text: newMessage,
				time: new Date().toLocaleTimeString([], {
					hour: "2-digit",
					minute: "2-digit",
				}),
			},
		]);
		setNewMessage("");
	};

	return (
		<div className="h-full flex flex-col bg-[#0B0B0C] text-foreground font-sans relative overflow-hidden">
			{/* Top Header */}
			<div className="flex items-center justify-between border-b border-border bg-[#0C0C0E]/90 px-6 py-3.5 z-10 select-none">
				<div className="flex items-center gap-3">
					<div className="flex items-center gap-1.5 bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded text-[10px] font-bold text-primary font-mono uppercase tracking-wider">
						<Sparkles className="size-3" />
						<span>HQ Alignment Block</span>
					</div>
					<span className="text-xs text-muted-foreground font-mono">
						ID: mist-hq-calls
					</span>
				</div>

				<div className="flex items-center gap-4">
					<div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-[#121214] border border-border px-3 py-1 rounded-full font-mono">
						<Users className="size-3.5 text-primary animate-pulse" />
						<span>4 Connected Players</span>
					</div>
					<button
						type="button"
						className="text-muted-foreground hover:text-white p-1"
					>
						<Maximize2 className="size-4" />
					</button>
				</div>
			</div>

			{/* Main Grid Area */}
			<div className="flex-1 flex overflow-hidden p-6 gap-6 relative">
				<div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 h-full relative">
					<AnimatePresence>
						{participants.map((p) => {
							const isSpeaker = activeSpeaker === p.id;
							return (
								<motion.div
									key={p.id}
									layout
									initial={{ opacity: 0, scale: 0.98 }}
									animate={{ opacity: 1, scale: 1 }}
									exit={{ opacity: 0, scale: 0.98 }}
									transition={{ type: "spring", stiffness: 350, damping: 30 }}
									className={`rounded-xl border bg-[#121214] p-4 flex flex-col justify-between relative transition-all duration-300 overflow-hidden ${
										isSpeaker
											? "border-primary/50 shadow-[0_0_24px_rgba(139,92,246,0.06)]"
											: "border-border/80"
									}`}
								>
									{/* Subtle active speaker spotlight glow */}
									{isSpeaker && (
										<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.03)_0%,transparent_70%)] pointer-events-none" />
									)}

									{/* Top bar of user card */}
									<div className="flex justify-between items-center z-10">
										<span className="text-[10px] font-bold font-mono text-muted-foreground bg-[#18181c] border border-border px-2 py-0.5 rounded uppercase">
											{p.role}
										</span>
										<div className="flex items-center gap-2">
											<BouncingSoundWave active={isSpeaker && p.mic} />
											<div
												className={`p-1.5 rounded-full border bg-[#18181c] ${p.mic ? "text-primary/80 border-primary/20" : "text-destructive border-destructive/20"}`}
											>
												{p.mic ? (
													<Mic className="size-3.5" />
												) : (
													<MicOff className="size-3.5" />
												)}
											</div>
										</div>
									</div>

									{/* Central Avatar / Camera view placeholder */}
									<div className="flex-1 flex flex-col items-center justify-center py-6 relative select-none">
										{p.video ? (
											// High-fidelity Mock Video feed (animated waves or grids to feel alive)
											<div className="absolute inset-2 bg-gradient-to-br from-[#121214] to-[#1a1a1f] rounded-lg border border-border flex flex-col items-center justify-center overflow-hidden">
												<div className="absolute inset-0 opacity-10 bg-[radial-gradient(#8b5cf6_1px,transparent_1px)] bg-size-[16px_16px]" />

												<motion.div
													animate={isSpeaker ? { scale: [1, 1.08, 1] } : {}}
													transition={{
														duration: 2,
														repeat: Infinity,
														ease: "easeInOut",
													}}
													className={`size-16 rounded-full flex items-center justify-center border font-bold text-lg font-mono ${p.color} shadow-lg`}
												>
													{p.avatar}
												</motion.div>

												<span className="text-[10px] text-primary/80 font-mono mt-3 uppercase tracking-widest flex items-center gap-1.5">
													<UserCheck className="size-3" />
													<span>HIFI Video Feeds Active</span>
												</span>
											</div>
										) : (
											// Audio-only Avatar Card
											<motion.div
												animate={
													isSpeaker
														? {
																boxShadow: [
																	"0 0 0 0px rgba(139,92,246,0)",
																	"0 0 0 10px rgba(139,92,246,0.1)",
																	"0 0 0 0px rgba(139,92,246,0)",
																],
															}
														: {}
												}
												transition={{
													duration: 2,
													repeat: Infinity,
													ease: "easeInOut",
												}}
												className={`size-20 rounded-full flex items-center justify-center border-2 text-xl font-bold font-mono ${p.color}`}
											>
												{p.avatar}
											</motion.div>
										)}
									</div>

									{/* Bottom bar of user card */}
									<div className="flex justify-between items-center z-10">
										<span className="text-xs font-semibold text-white font-mono">
											{p.name}
										</span>
										{!p.video && (
											<span className="text-[10px] font-mono text-muted-foreground flex items-center gap-1">
												<VideoOff className="size-3" /> Audio Only
											</span>
										)}
									</div>
								</motion.div>
							);
						})}
					</AnimatePresence>
				</div>

				{/* Meeting Chat Sidebar Component */}
				<AnimatePresence>
					{chatOpen && (
						<motion.div
							initial={{ width: 0, opacity: 0 }}
							animate={{ width: 300, opacity: 1 }}
							exit={{ width: 0, opacity: 0 }}
							transition={{ type: "spring", stiffness: 350, damping: 30 }}
							className="border border-border rounded-xl bg-[#121214] flex flex-col justify-between overflow-hidden shadow-2xl h-full"
						>
							{/* Sidebar Header */}
							<div className="p-4 border-b border-border bg-[#18181c]/60 flex justify-between items-center select-none">
								<span className="text-xs font-extrabold font-mono text-white tracking-wider uppercase">
									Stage Chat
								</span>
								<span className="text-[9px] bg-primary/10 text-primary px-2 py-0.5 rounded font-mono uppercase">
									Multiplayer
								</span>
							</div>

							{/* Chat Messages */}
							<div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3.5 scrollbar-thin">
								{messages.map((m, idx) => (
									<div
										key={idx.toString()}
										className="flex flex-col gap-1 text-xs"
									>
										<div className="flex justify-between items-baseline">
											<span className="font-bold text-primary font-mono">
												{m.user}
											</span>
											<span className="text-[9px] text-muted-foreground">
												{m.time}
											</span>
										</div>
										<p className="text-muted-foreground leading-normal bg-[#18181c] border border-border/60 p-2 rounded">
											{m.text}
										</p>
									</div>
								))}
							</div>

							{/* Message Input Box */}
							<form
								onSubmit={handleSendMessage}
								className="p-3 border-t border-border flex gap-1.5 bg-[#0C0C0E]/50"
							>
								<input
									type="text"
									value={newMessage}
									onChange={(e) => setNewMessage(e.target.value)}
									placeholder="Send workspace signal..."
									className="flex-1 bg-[#18181c] border border-border rounded px-3 py-1.5 text-xs text-white placeholder-muted-foreground outline-none focus:border-primary/50 transition-colors"
								/>
								<button
									type="submit"
									className="bg-primary text-white text-xs font-bold rounded px-3 py-1.5 hover:bg-primary/95 transition-colors border border-primary/20"
								>
									Send
								</button>
							</form>
						</motion.div>
					)}
				</AnimatePresence>
			</div>

			{/* Floating Bottom Command deck */}
			<div className="p-6 border-t border-border bg-[#0C0C0E]/80 flex justify-between items-center z-10 select-none">
				<div className="flex items-center gap-1.5">
					<span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
					<span className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">
						Secure Signal Sync (AES-256)
					</span>
				</div>

				{/* Action Controls */}
				<div className="flex items-center gap-4">
					<MagneticCallControl
						onClick={() => setMicActive(!micActive)}
						active={micActive}
					>
						{micActive ? (
							<Mic className="size-4.5" />
						) : (
							<MicOff className="size-4.5" />
						)}
					</MagneticCallControl>

					<MagneticCallControl
						onClick={() => setVideoActive(!videoActive)}
						active={videoActive}
					>
						{videoActive ? (
							<VideoIcon className="size-4.5" />
						) : (
							<VideoOff className="size-4.5" />
						)}
					</MagneticCallControl>

					<MagneticCallControl
						onClick={() => setScreenActive(!screenActive)}
						active={screenActive}
					>
						<Monitor className="size-4.5" />
					</MagneticCallControl>

					<div className="w-px h-6 bg-border mx-1" />

					<MagneticCallControl
						danger
						onClick={() => alert("Call disconnected. Returning to Main Stage.")}
					>
						<PhoneOff className="size-4.5" />
					</MagneticCallControl>
				</div>

				{/* Sidebar trigger */}
				<div className="flex items-center gap-3">
					<button
						type="button"
						onClick={() => setChatOpen(!chatOpen)}
						className={`relative flex h-10 px-4 items-center justify-center gap-2 rounded-lg border text-xs font-bold font-mono transition-all duration-300 ${
							chatOpen
								? "bg-primary border-primary/20 text-white shadow-md"
								: "bg-[#18181c] border-border text-muted-foreground hover:text-white hover:border-white/20"
						}`}
					>
						<MessageSquare className="size-4" />
						<span>Chat ({messages.length})</span>
					</button>

					<button
						type="button"
						className="size-10 rounded-lg border border-border bg-[#18181c] text-muted-foreground hover:text-white hover:border-white/20 flex items-center justify-center transition-colors"
					>
						<Settings className="size-4" />
					</button>
				</div>
			</div>
		</div>
	);
}
