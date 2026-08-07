// app/dashboard/page.tsx

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();

  // Fetch the user object to get user.id for database queries
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Satisfies TypeScript & acts as a failsafe
  if (!user) redirect("/login");

  // Fetch user-specific data from Postgres
  const { data: userRooms } = await supabase
    .from("rooms")
    .select("*")
    .eq("owner_id", user.id);

  return (
    <div>
      <h1>Welcome, {user.email}</h1>
      <p>Rooms count: {userRooms?.length ?? 0}</p>
    </div>
  );
}
