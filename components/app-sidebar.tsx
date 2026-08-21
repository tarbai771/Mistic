import type { User } from "@supabase/supabase-js";
import {
  AudioLinesIcon,
  Bookmark,
  CirclePile,
  FileBox,
  GalleryVerticalEndIcon,
  LogIn,
  MessageSquareCheck,
  Palette,
  PencilLine,
  PersonStanding,
  Plus,
  Settings,
  Settings2,
  TerminalIcon,
  TerminalSquareIcon,
  TextCursorInputIcon,
  User2,
  UserCog2,
  UserPlus2,
  UserRoundSearchIcon,
  Users2,
} from "lucide-react";
import type * as React from "react";
import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.

export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & { user: User }) {
  const data = {
    user: {
      name: user.user_metadata?.display_name ?? user.user_metadata?.username,
      username: user.user_metadata?.username ?? "",
      email: user.email ?? "",
      avatar: user.user_metadata?.avatar_url ?? "",
    },
    teams: [
      {
        name: "Acme Inc",
        logo: <GalleryVerticalEndIcon />,
        plan: "Enterprise",
      },
      {
        name: "Acme Corp.",
        logo: <AudioLinesIcon />,
        plan: "Startup",
      },
      {
        name: "Evil Corp.",
        logo: <TerminalIcon />,
        plan: "Free",
      },
    ],
    navMain: [
      {
        title: "Room",
        url: "#",
        icon: <TerminalSquareIcon />,
        isActive: true,
        items: [
          {
            title: "Create a Room",
            url: "#",
            icon: <Plus />,
          },
          {
            title: "Enter Code to Join",
            url: "#",
            icon: <TextCursorInputIcon />,
          },
        ],
      },
      {
        title: "Saved",
        url: "#",
        icon: <Bookmark />,
        items: [
          {
            title: "Canvas",
            url: "#",
            icon: <Palette />,
          },
          {
            title: "Editor",
            url: "#",
            icon: <PencilLine />,
          },
          {
            title: "Chats",
            url: "#",
            icon: <MessageSquareCheck />,
          },
          {
            title: "Shared Files",
            url: "#",
            icon: <FileBox />,
          },
        ],
      },
      {
        title: "Teams",
        url: "#",
        icon: <CirclePile />,
        items: [
          {
            title: "Create a Team",
            url: "#",
            icon: <Plus />,
          },
          {
            title: "Join Team",
            url: "#",
            icon: <LogIn />,
          },
          {
            title: "Manage Teams",
            url: "#",
            icon: <Settings2 />,
          },
        ],
      },
      {
        title: "Friends",
        url: "#",
        icon: <Users2 />,
        items: [
          {
            title: "Add a Friend",
            url: "#",
            icon: <UserPlus2 />,
          },
          {
            title: "Search Friend List",
            url: "#",
            icon: <UserRoundSearchIcon />,
          },
          {
            title: "Manage Friends",
            url: "#",
            icon: <UserCog2 />,
          },
        ],
      },
    ],
    projects: [
      {
        name: "Profile",
        url: "/dashboard/profile",
        icon: <User2 />,
      },
      {
        name: "Preferences",
        url: "#",
        icon: <PersonStanding />,
      },
      {
        name: "Setting",
        url: "/settings",
        icon: <Settings />,
      },
    ],
  };
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
