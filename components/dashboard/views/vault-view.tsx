"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Lock,
  Unlock,
  Search,
  UploadCloud,
  FileCode,
  Image,
  Database,
  ArrowRight,
  ShieldAlert,
  Download,
  Info,
  Calendar,
  Layers,
  X,
} from "lucide-react";

type VaultItem = {
  id: string;
  name: string;
  size: string;
  type: string;
  locked: boolean;
  owner: string;
  date: string;
  icon: any;
  hash: string;
};

export default function VaultView() {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | "code" | "images" | "data">("all");
  const [selectedFile, setSelectedFile] = useState<VaultItem | null>(null);
  const [files, setFiles] = useState<VaultItem[]>([
    { id: "1", name: "redis_cluster_config.yaml", size: "14.2 KB", type: "code", locked: true, owner: "Alex B.", date: "Jun 01, 2026", icon: FileCode, hash: "ae34e...89f1b" },
    { id: "2", name: "mistic_hero_mockup.png", size: "2.4 MB", type: "images", locked: false, owner: "Chloe D.", date: "May 28, 2026", icon: Image, hash: "cb881...df012" },
    { id: "3", name: "q3_financial_projection.csv", size: "389 KB", type: "data", locked: true, owner: "Devon P.", date: "May 26, 2026", icon: Database, hash: "fa09e...99c43" },
    { id: "4", name: "nginx_reverse_proxy.conf", size: "4.8 KB", type: "code", locked: false, owner: "Alex B.", date: "May 20, 2026", icon: FileCode, hash: "11de8...bcde4" },
    { id: "5", name: "multiplayer_state_spec.md", size: "8.1 KB", type: "code", locked: true, owner: "Chloe D.", date: "May 18, 2026", icon: FileText, hash: "de887...78fe1" },
  ]);

  const [dragActive, setDragActive] = useState(false);

  // Toggle file locking state
  const handleToggleLock = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid selecting the file
    setFiles((prev) =>
      prev.map((f) => {
        if (f.id === id) {
          const nextLock = !f.locked;
          // If the selected file is currently being modified, sync it
          if (selectedFile?.id === id) {
            setSelectedFile({ ...selectedFile, locked: nextLock });
          }
          return { ...f, locked: nextLock };
        }
        return f;
      })
    );
  };

  const filteredFiles = files.filter((f) => {
    const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterType === "all" || f.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="h-full flex bg-[#0B0B0C] text-foreground font-sans relative overflow-hidden">
      {/* Primary Files Section */}
      <div className="flex-1 flex flex-col justify-between overflow-hidden p-6 gap-6">
        
        {/* Upper Search & Drag Deck */}
        <div className="flex flex-col gap-4 select-none">
          {/* Header & Upload Title */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-extrabold text-white font-mono tracking-tight uppercase flex items-center gap-2">
                <Database className="size-4.5 text-primary" /> Security Shared Vault
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Central repository for sensitive team files and infrastructure nodes.
              </p>
            </div>
          </div>

          {/* Search bar & filter pills */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1 bg-[#121214] border border-border rounded-lg flex items-center pl-3 pr-2.5 h-9 group focus-within:border-primary/50 transition-all duration-300">
              <Search className="size-4 text-muted-foreground mr-2 group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search secure hashes or file names..."
                className="flex-1 bg-transparent border-none text-xs text-white placeholder-muted-foreground outline-none w-full"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex bg-[#121214] border border-border p-0.5 rounded-lg select-none gap-0.5 font-mono">
              {[
                { id: "all", label: "All Items" },
                { id: "code", label: "Code" },
                { id: "images", label: "Images" },
                { id: "data", label: "Data" },
              ].map((pill) => {
                const active = filterType === pill.id;
                return (
                  <button
                    key={pill.id}
                    onClick={() => setFilterType(pill.id as any)}
                    className={`relative px-3 py-1 rounded-md text-[10px] font-bold transition-all duration-200 ${
                      active ? "text-white" : "text-muted-foreground hover:text-white"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="active-vault-filter"
                        className="absolute inset-0 bg-[#1E1E22] rounded border border-white/5"
                        transition={{ type: "spring", stiffness: 450, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{pill.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Files Database Table - Industrial Layout */}
        <div className="flex-1 border border-border rounded-xl bg-[#121214] overflow-hidden shadow-lg flex flex-col justify-between">
          <div className="overflow-y-auto flex-1">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border bg-[#18181c]/60 text-muted-foreground font-mono font-bold tracking-wider text-[10px] select-none sticky top-0 z-10">
                  <th className="p-3 uppercase pl-4">Filename</th>
                  <th className="p-3 uppercase">Modified</th>
                  <th className="p-3 uppercase">Owner</th>
                  <th className="p-3 uppercase">Weight</th>
                  <th className="p-3 uppercase text-right pr-4">Security Node</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredFiles.map((file) => {
                  const FileIcon = file.icon;
                  const isSelected = selectedFile?.id === file.id;
                  return (
                    <tr
                      key={file.id}
                      onClick={() => setSelectedFile(file)}
                      className={`hover:bg-[#161619]/40 transition-colors cursor-pointer select-none ${
                        isSelected ? "bg-[#18181c]" : ""
                      }`}
                    >
                      {/* Name */}
                      <td className="p-3.5 pl-4 font-medium text-white flex items-center gap-2.5">
                        <FileIcon className="size-4 text-primary shrink-0" />
                        <span className="truncate max-w-44 font-mono font-bold">{file.name}</span>
                      </td>

                      {/* Date */}
                      <td className="p-3.5 text-muted-foreground font-mono text-[11px]">
                        {file.date}
                      </td>

                      {/* Owner */}
                      <td className="p-3.5 text-muted-foreground font-mono text-[11px]">
                        {file.owner}
                      </td>

                      {/* Weight */}
                      <td className="p-3.5 text-muted-foreground font-mono text-[11px]">
                        {file.size}
                      </td>

                      {/* Security toggler */}
                      <td className="p-3.5 text-right pr-4">
                        <button
                          onClick={(e) => handleToggleLock(file.id, e)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[9px] font-bold font-mono uppercase tracking-wider transition-all duration-300 border ${
                            file.locked
                              ? "bg-red-500/10 border-red-500/20 text-red-400 shadow-[0_0_8px_rgba(239,68,68,0.05)]"
                              : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                          }`}
                        >
                          <AnimatePresence mode="wait">
                            {file.locked ? (
                              <motion.span
                                key="locked"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="flex items-center gap-1"
                              >
                                <Lock className="size-2.5 shrink-0" />
                                <span>Locked</span>
                              </motion.span>
                            ) : (
                              <motion.span
                                key="unlocked"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="flex items-center gap-1"
                              >
                                <Unlock className="size-2.5 shrink-0" />
                                <span>Unlocked</span>
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filteredFiles.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground select-none">
                <ShieldAlert className="size-8 text-primary/40 animate-pulse mb-3" />
                <p className="text-xs font-mono">No matching secure blocks found.</p>
              </div>
            )}
          </div>
        </div>

        {/* Drag & Drop simulated upload zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => { e.preventDefault(); setDragActive(false); alert("File registered! Encrypting payload..."); }}
          className={`border border-dashed rounded-xl p-5 flex flex-col items-center justify-center text-center transition-all duration-300 select-none ${
            dragActive
              ? "border-primary bg-primary/5 scale-[0.99] shadow-inner"
              : "border-border bg-[#121214]/50 hover:border-white/20"
          }`}
        >
          <UploadCloud className={`size-6 mb-2 ${dragActive ? "text-primary animate-bounce" : "text-muted-foreground"}`} />
          <span className="text-[11px] font-bold font-mono text-white uppercase tracking-wider">
            Drag files to secure vault
          </span>
          <span className="text-[9px] text-muted-foreground font-mono mt-0.5">
            Auto-parses and logs node metadata locally. Max payload: 50MB.
          </span>
        </div>
      </div>

      {/* File Inspector Detail Panel (Framer Motion Drawer) */}
      <AnimatePresence>
        {selectedFile && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 310, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className="border-l border-border bg-[#0C0C0E]/95 flex flex-col justify-between overflow-hidden shadow-2xl h-full select-none"
          >
            {/* Header */}
            <div className="p-4.5 border-b border-border bg-[#18181c]/60 flex justify-between items-center">
              <span className="text-[10px] font-extrabold font-mono text-white tracking-wider uppercase flex items-center gap-1.5">
                <Info className="size-3.5 text-primary" /> Block Inspector
              </span>
              <button
                onClick={() => setSelectedFile(null)}
                className="text-muted-foreground hover:text-white p-1 rounded hover:bg-[#18181c]"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Details body */}
            <div className="flex-1 p-5 flex flex-col gap-5 overflow-y-auto scrollbar-thin">
              {/* Block Icon */}
              <div className="bg-[#121214] border border-border p-4 rounded-xl flex flex-col items-center justify-center text-center">
                {(() => {
                  const FileIcon = selectedFile.icon;
                  return <FileIcon className="size-8 text-primary mb-3" />;
                })()}
                <h3 className="text-xs font-extrabold font-mono text-white truncate max-w-56 uppercase">
                  {selectedFile.name}
                </h3>
                <span className="text-[9px] text-primary/80 font-mono mt-1 uppercase bg-primary/10 px-2 py-0.5 rounded">
                  {selectedFile.type} element
                </span>
              </div>

              {/* Specs Metadata */}
              <div className="flex flex-col gap-2.5 font-mono text-[10px] text-muted-foreground">
                <div className="flex justify-between py-1.5 border-b border-border/40">
                  <span>Owner:</span>
                  <span className="text-white font-bold">{selectedFile.owner}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border/40">
                  <span>Weight:</span>
                  <span className="text-white font-bold">{selectedFile.size}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border/40">
                  <span>Security:</span>
                  <span className={`font-bold ${selectedFile.locked ? "text-red-400" : "text-emerald-400"}`}>
                    {selectedFile.locked ? "Locked Node" : "Public Sync"}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border/40">
                  <span>SHA-256 Hash:</span>
                  <span className="text-white font-bold truncate max-w-28" title={selectedFile.hash}>
                    {selectedFile.hash}
                  </span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="flex items-center gap-1"><Calendar className="size-3 text-primary" /> Registered:</span>
                  <span className="text-white font-bold">{selectedFile.date}</span>
                </div>
              </div>

              {/* Compliance Banner */}
              <div className="p-3 border border-border bg-[#121214] rounded-lg flex items-start gap-2 text-[10px] leading-relaxed text-muted-foreground">
                <ShieldAlert className="size-4.5 text-primary shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block uppercase mb-0.5">COMPLIANCE CODE: SYNC</span>
                  All changes to this block are logged to the global telemetry audit log.
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="p-4 border-t border-border bg-[#18181c]/60 flex flex-col gap-2">
              <button
                onClick={(e) => handleToggleLock(selectedFile.id, e)}
                className={`w-full flex h-9 items-center justify-center gap-1.5 rounded text-xs font-bold font-mono uppercase tracking-wider transition-colors border ${
                  selectedFile.locked
                    ? "bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20"
                    : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20"
                }`}
              >
                {selectedFile.locked ? (
                  <>
                    <Unlock className="size-3.5" /> <span>Unlock Access</span>
                  </>
                ) : (
                  <>
                    <Lock className="size-3.5" /> <span>Lock Content</span>
                  </>
                )}
              </button>

              <button
                onClick={() => alert(`Downloading ${selectedFile.name}...`)}
                className="w-full flex h-9 items-center justify-center gap-1.5 rounded border border-border bg-[#121214] text-xs font-bold font-mono text-white hover:bg-[#1c1c20] hover:border-white/20 transition-all"
              >
                <Download className="size-3.5" /> <span>Download Blob</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
