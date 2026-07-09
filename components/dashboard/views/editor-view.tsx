"use client";

import { motion } from "framer-motion";
import {
	Bookmark,
	CheckCircle,
	FileText,
	FolderOpen,
	MessageSquare,
	Plus,
	Users,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function EditorView() {
	const [activeDoc, setActiveDoc] = useState("q3_growth_sprint.mist");
	const [docContent, setDocContent] = useState(
		"# Q3 GROWTH SPRINT & MULTIPLAYER ROADMAP\n\nThis specification details the next stages of the Mistic multiplayer canvas implementation.",
	);

	// Multiplayer simulation typing state
	const [alexText, setAlexText] = useState("");
	const [alexTypingProgress, setAlexTypingProgress] = useState(0);

	const docStructure = [
		{
			id: "q3_growth_sprint.mist",
			name: "q3_growth_sprint.mist",
			size: "4.2kb",
		},
		{
			id: "bundler_optimization.mist",
			name: "bundler_optimization.mist",
			size: "1.8kb",
		},
		{
			id: "system_design_specs.mist",
			name: "system_design_specs.mist",
			size: "12.1kb",
		},
	];

	const comments = [
		{
			user: "Chloe",
			avatar: "C",
			color: "bg-emerald-500",
			text: "Love the layout here! Make sure to mention Framer Motion layoutId.",
			date: "Just now",
		},
		{
			user: "Devon",
			avatar: "D",
			color: "bg-indigo-500",
			text: "Is the database node setup fully persistent? Check Redis configs.",
			date: "1h ago",
		},
	];

	// Multiplayer cursor typing simulation for "Alex (Backend)"
	useEffect(() => {
		const stringToType =
			"\n\n## ALEX'S REFACTOR SUGGESTIONS\n- Migrate canvas elements to lightweight WebSocket chunks.\n- Ensure secure locking state syncs in under 5ms.";
		let timer: NodeJS.Timeout;

		const typeNextChar = () => {
			if (alexTypingProgress < stringToType.length) {
				setAlexText((prev) => prev + stringToType[alexTypingProgress]);
				setAlexTypingProgress((prev) => prev + 1);
			} else {
				// Reset after some time to repeat typing loop
				timer = setTimeout(() => {
					setAlexText("");
					setAlexTypingProgress(0);
				}, 8000);
				return;
			}
		};

		timer = setTimeout(typeNextChar, 100 + Math.random() * 80);
		return () => clearTimeout(timer);
	}, [alexTypingProgress]);

	return (
		<div className="h-full flex bg-[#0B0B0C] text-foreground font-sans relative overflow-hidden">
			{/* 1. Left Tree Pane */}
			<div className="w-56 border-r border-border bg-[#0C0C0E]/90 flex flex-col justify-between select-none">
				<div>
					{/* Section Header */}
					<div className="p-4 border-b border-border/80 flex justify-between items-center">
						<span className="text-[10px] font-extrabold font-mono text-muted-foreground tracking-wider uppercase flex items-center gap-1.5">
							<FolderOpen className="size-3.5 text-primary" /> Document Tree
						</span>
						<button
							type="button"
							className="text-muted-foreground hover:text-white p-1 rounded hover:bg-[#121214]"
						>
							<Plus className="size-3.5" />
						</button>
					</div>

					{/* Doc List */}
					<div className="p-2 flex flex-col gap-1">
						{docStructure.map((doc) => {
							const active = activeDoc === doc.id;
							return (
								<button
									type="button"
									key={doc.id}
									onClick={() => setActiveDoc(doc.id)}
									className={`w-full flex items-center justify-between p-2 rounded text-xs font-mono transition-colors text-left relative ${
										active
											? "text-white"
											: "text-muted-foreground hover:text-white hover:bg-[#121214]/60"
									}`}
								>
									{active && (
										<motion.span
											layoutId="active-doc"
											className="absolute inset-0 bg-[#121214] rounded border border-white/5"
											transition={{
												type: "spring",
												stiffness: 400,
												damping: 40,
											}}
										/>
									)}
									<span className="flex items-center gap-2 relative z-10 truncate">
										<FileText className="size-3.5 text-primary/80 shrink-0" />
										<span>{doc.name}</span>
									</span>
									<span className="text-[9px] text-muted-foreground/50 relative z-10 shrink-0 font-mono">
										{doc.size}
									</span>
								</button>
							);
						})}
					</div>
				</div>

				{/* Sync Info */}
				<div className="p-4 border-t border-border/80 bg-[#121214]/30 text-[10px] text-muted-foreground font-mono flex flex-col gap-1.5">
					<div className="flex items-center gap-1.5">
						<span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
						<span>3 Collaborators Connected</span>
					</div>
					<div className="text-muted-foreground/50">Last saved: 2m ago</div>
				</div>
			</div>

			{/* 2. Main Workspace Editor */}
			<div className="flex-1 flex flex-col justify-between overflow-hidden bg-[#0A0A0B]">
				{/* Editor Utility bar */}
				<div className="flex items-center justify-between border-b border-border bg-[#0C0C0E]/90 px-6 py-3 select-none">
					<div className="flex items-center gap-2">
						<Bookmark className="size-3.5 text-primary" />
						<span className="text-xs font-mono font-semibold text-white">
							{activeDoc}
						</span>
					</div>

					<div className="flex items-center gap-4">
						{/* Avatars */}
						<div className="flex -space-x-1">
							<span className="size-5 rounded-full bg-primary border border-[#0B0B0C] flex items-center justify-center text-[9px] font-bold text-white font-mono">
								TB
							</span>
							<span className="size-5 rounded-full bg-emerald-500 border border-[#0B0B0C] flex items-center justify-center text-[9px] font-bold text-white font-mono">
								CD
							</span>
							<span className="size-5 rounded-full bg-amber-500 border border-[#0B0B0C] flex items-center justify-center text-[9px] font-bold text-white font-mono">
								AB
							</span>
						</div>
						<span className="text-[10px] text-muted-foreground font-mono">
							Live Cursor Sync
						</span>
					</div>
				</div>

				{/* Interactive Editor Window */}
				<div className="flex-1 p-8 overflow-y-auto font-mono text-xs leading-relaxed max-w-3xl mx-auto w-full select-text">
					<textarea
						value={docContent}
						onChange={(e) => setDocContent(e.target.value)}
						className="w-full min-h-60 bg-transparent text-white border-none resize-none outline-none focus:ring-0 leading-relaxed overflow-hidden font-mono"
						style={{ height: "auto" }}
					/>

					{/* Simulated Multiplayer Live Typed Text */}
					<div className="relative border-l-2 border-amber-500/30 pl-4 mt-6 bg-amber-500/5 rounded p-3 border border-border/40 select-none">
						<span className="text-[9px] font-bold text-amber-400 block mb-2 flex items-center gap-1">
							<Users className="size-3 text-amber-500" /> Alex (Backend
							Developer) is contributing
						</span>
						<pre className="font-mono text-xs text-muted-foreground whitespace-pre-wrap leading-normal inline">
							{alexText}
							<motion.span
								animate={{ opacity: [1, 0, 1] }}
								transition={{ duration: 0.8, repeat: Infinity }}
								className="w-1.5 h-4 bg-amber-500 inline-block align-middle ml-0.5"
							/>
						</pre>
					</div>
				</div>

				{/* Bottom Stats footer */}
				<div className="p-4 border-t border-border bg-[#0C0C0E]/50 flex justify-between items-center select-none">
					<span className="text-[9px] text-muted-foreground font-mono flex items-center gap-1.5">
						<CheckCircle className="size-3 text-primary" /> Clean document specs
						parsed successfully.
					</span>
					<span className="text-[9px] text-muted-foreground font-mono uppercase">
						Markdown Mode Active
					</span>
				</div>
			</div>

			{/* 3. Right Comments Sidebar */}
			<div className="w-64 border-l border-border bg-[#0C0C0E]/90 flex flex-col justify-between select-none">
				<div>
					{/* Header */}
					<div className="p-4 border-b border-border/80 flex items-center justify-between">
						<span className="text-[10px] font-extrabold font-mono text-muted-foreground tracking-wider uppercase flex items-center gap-1.5">
							<MessageSquare className="size-3.5 text-primary" /> Inline
							Comments
						</span>
						<span className="text-[9px] bg-primary/10 text-primary px-2 py-0.5 rounded font-mono font-bold uppercase">
							Specs
						</span>
					</div>

					{/* Comments List */}
					<div className="p-4 flex flex-col gap-4">
						{comments.map((comment, index) => (
							<div key={index.toString()} className="flex gap-2.5 items-start">
								<span
									className={`size-5 rounded-full ${comment.color} flex items-center justify-center text-[9px] font-bold text-white shrink-0 font-mono`}
								>
									{comment.avatar}
								</span>
								<div className="flex flex-col gap-1 text-[11px] leading-snug">
									<div className="flex justify-between items-baseline">
										<span className="font-bold text-white font-mono">
											{comment.user}
										</span>
										<span className="text-[9px] text-muted-foreground/60">
											{comment.date}
										</span>
									</div>
									<p className="text-muted-foreground bg-[#121214] border border-border/50 p-2 rounded">
										{comment.text}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Feedback box */}
				<div className="p-4 border-t border-border/80 bg-[#121214]/20 flex flex-col gap-2">
					<input
						type="text"
						placeholder="Add discussion token..."
						className="w-full bg-[#121214] border border-border rounded px-3 py-1.5 text-xs text-white placeholder-muted-foreground outline-none focus:border-primary/50 transition-colors"
					/>
					<button
						type="button"
						className="bg-primary text-white text-[10px] font-bold rounded py-1.5 hover:bg-primary/95 transition-colors border border-primary/20"
					>
						Submit Node Comment
					</button>
				</div>
			</div>
		</div>
	);
}
