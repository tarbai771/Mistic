import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: userRooms } = await supabase
    .from("rooms")
    .select("*")
    .eq("owner_id", user.id);

  return (
    <TooltipProvider delayDuration={0}>
      <SidebarProvider>
        <AppSidebar user={user}/>
        <main className="w-full p-4">
          <SidebarTrigger />
          {/* {children} */}
        </main>
      </SidebarProvider>
    </TooltipProvider>
  );
}
