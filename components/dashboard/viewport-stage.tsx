"use client";

import { AnimatePresence, motion } from "framer-motion";
import { SidebarTab } from "./sidebar";
import CallsView from "./views/calls-view";
import SketchView from "./views/sketch-view";
import EditorView from "./views/editor-view";
import VaultView from "./views/vault-view";

interface ViewportStageProps {
  activeTab: SidebarTab;
}

export default function ViewportStage({ activeTab }: ViewportStageProps) {
  const views = {
    Calls: <CallsView />,
    Sketch: <SketchView />,
    Editor: <EditorView />,
    Vault: <VaultView />,
  };

  return (
    <div className="flex-grow h-full overflow-hidden bg-[#0B0B0C] relative pb-16 md:pb-0">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, filter: "blur(8px)", y: 8 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          exit={{ opacity: 0, filter: "blur(8px)", y: -8 }}
          transition={{
            type: "spring",
            stiffness: 350,
            damping: 32,
            mass: 0.8,
          }}
          className="h-full w-full"
        >
          {views[activeTab]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
