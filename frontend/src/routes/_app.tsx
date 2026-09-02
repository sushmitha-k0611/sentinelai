import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="sticky top-0 z-30 flex h-12 items-center border-b border-border/60 bg-background/60 px-2 backdrop-blur-md md:hidden">
            <SidebarTrigger />
            <span className="ml-2 font-display font-semibold">SentinelAI</span>
          </div>
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  );
}
