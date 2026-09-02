import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  ShieldAlert,
  MessageSquareWarning,
  FileWarning,
  Map,
  ShieldCheck,
  LogOut,
  Radar,
  Network,
  BadgeIndianRupee,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
} from "@/components/ui/sidebar";

const nav = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },

  { title: "Scam Detector", url: "/scam-detector", icon: ShieldAlert },

  { title: "Fraud Shield", url: "/fraud-shield", icon: MessageSquareWarning },

  { title: "Report Fraud", url: "/report-fraud", icon: FileWarning },

  {
    title: "Currency Detection",
    url: "/currency-detection",
    icon: BadgeIndianRupee,
  },

  { title: "Crime Intelligence", url: "/crime-intelligence", icon: Map },

  { title: "Graph Intelligence", url: "/graph-intelligence", icon: Network },

  { title: "Admin", url: "/admin", icon: ShieldCheck },
];

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border">
        <Link to="/dashboard" className="flex items-center gap-2 px-2 py-3">
          <div className="relative grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[var(--gradient-cyan)] glow-cyan">
            <Radar className="h-5 w-5 text-[oklch(0.15_0.04_255)]" />
          </div>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <div className="truncate font-display text-base font-bold tracking-tight">SentinelAI</div>
            <div className="truncate text-[10px] uppercase tracking-widest text-muted-foreground">Public Safety</div>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Operations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {nav.map((item) => {
                const active = pathname === item.url || pathname.startsWith(item.url + "/");
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
                      <Link to={item.url} className="flex items-center gap-3">
                        <item.icon className="h-4 w-4 shrink-0" />
                        <span className="truncate">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Logout">
              <Link to="/login" className="flex items-center gap-3">
                <LogOut className="h-4 w-4 shrink-0" />
                <span className="truncate">Logout</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
