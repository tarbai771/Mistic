"use client";

import { useState } from "react";
import Sidebar, { SidebarTab } from "@/components/dashboard/sidebar";
import ViewportStage from "@/components/dashboard/viewport-stage";

export default function Application() {
  const [activeTab, setActiveTab] = useState<SidebarTab>("Calls");
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0B0B0C] text-foreground select-none relative">
      {/* Dynamic tab/sidebar navigation drawer */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* Main Viewport stage swap space */}
      <ViewportStage activeTab={activeTab} />
    </div>
  );
}
