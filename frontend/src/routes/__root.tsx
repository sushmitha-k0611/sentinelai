import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet, Link, createRootRouteWithContext, useRouter,
  HeadContent, Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="glass max-w-md rounded-2xl p-8 text-center">
        <h1 className="font-display text-7xl font-bold text-gradient-cyan">404</h1>
        <h2 className="mt-2 text-lg font-semibold">Signal lost</h2>
        <p className="mt-2 text-sm text-muted-foreground">This route isn't on the SentinelAI grid.</p>
        <Link to="/dashboard" className="mt-6 inline-flex items-center justify-center rounded-md bg-[var(--gradient-cyan)] px-4 py-2 text-sm font-semibold text-[oklch(0.15_0.04_255)]">
          Go to dashboard
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => { reportLovableError(error, { boundary: "tanstack_root_error_component" }); }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="glass max-w-md rounded-2xl p-8 text-center">
        <h1 className="font-display text-xl font-semibold">System interrupted</h1>
        <p className="mt-2 text-sm text-muted-foreground">Something went wrong while loading this view.</p>
        <div className="mt-6 flex justify-center gap-2">
          <button onClick={() => { router.invalidate(); reset(); }} className="rounded-md bg-[var(--gradient-cyan)] px-4 py-2 text-sm font-semibold text-[oklch(0.15_0.04_255)]">Retry</button>
          <Link to="/dashboard" className="rounded-md border border-border px-4 py-2 text-sm">Dashboard</Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "SentinelAI — AI-Powered Digital Public Safety" },
      { name: "description", content: "AI-Powered Digital Public Safety & Fraud Intelligence Platform protecting citizens from scams, phishing, and cyber fraud." },
      { name: "author", content: "SentinelAI" },
      { property: "og:title", content: "SentinelAI — Digital Public Safety" },
      { property: "og:description", content: "AI-Powered Digital Public Safety & Fraud Intelligence Platform." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster theme="dark" position="top-right" />
    </QueryClientProvider>
  );
}
