import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { Layout } from "./components/Layout";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useInitializeRecommendations } from "./hooks/useQueries";
import { CheckInPage } from "./pages/CheckInPage";
import { DashboardPage } from "./pages/DashboardPage";
import { HistoryPage } from "./pages/HistoryPage";
import { LoginPage } from "./pages/LoginPage";
import { ProfilePage } from "./pages/ProfilePage";
import { StudySessionPage } from "./pages/StudySessionPage";

// Root layout component with auth guard
function RootLayout() {
  const { isLoginSuccess, isInitializing } = useInternetIdentity();
  const initRecs = useInitializeRecommendations();
  const hasInitialized = useRef(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: initRecs.mutate is stable
  useEffect(() => {
    if (isLoginSuccess && !hasInitialized.current) {
      hasInitialized.current = true;
      initRecs.mutate();
    }
  }, [isLoginSuccess]);

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <img
            src="/assets/generated/calmclass-logo-transparent.dim_400x150.png"
            alt="CalmClass"
            className="h-12 w-auto mx-auto mb-4 opacity-70 animate-pulse object-contain"
          />
          <p className="text-muted-foreground text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isLoginSuccess) {
    return <LoginPage />;
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

// Routes
const rootRoute = createRootRoute({
  component: RootLayout,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: DashboardPage,
});

const checkInRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/checkin",
  component: CheckInPage,
});

const studyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/study",
  component: StudySessionPage,
});

const historyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/history",
  component: HistoryPage,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: ProfilePage,
});

const routeTree = rootRoute.addChildren([
  dashboardRoute,
  checkInRoute,
  studyRoute,
  historyRoute,
  profileRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster richColors position="top-right" />
    </>
  );
}
