import { Link, useLocation } from "@tanstack/react-router";
import { BookOpen, Clock, Home, Smile, User } from "lucide-react";
import { motion } from "motion/react";

interface LayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { to: "/", label: "Home", icon: Home, ocid: "nav.home.link" },
  { to: "/checkin", label: "Check In", icon: Smile, ocid: "nav.checkin.link" },
  { to: "/study", label: "Study", icon: BookOpen, ocid: "nav.study.link" },
  { to: "/history", label: "History", icon: Clock, ocid: "nav.history.link" },
  { to: "/profile", label: "Profile", icon: User, ocid: "nav.profile.link" },
];

export function Layout({ children }: LayoutProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Header (desktop) */}
      <header className="hidden md:flex items-center justify-between px-8 py-4 glass-card border-b sticky top-0 z-50">
        <Link to="/" data-ocid="nav.logo.link">
          <img
            src="/assets/generated/calmclass-logo-transparent.dim_400x150.png"
            alt="CalmClass"
            className="h-10 w-auto object-contain"
          />
        </Link>
        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                data-ocid={item.ocid}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>

      {/* Main content */}
      <main className="flex-1 pb-24 md:pb-8">{children}</main>

      {/* Bottom Nav (mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-card border-t px-2 py-3">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                data-ocid={item.ocid}
                className="flex flex-col items-center gap-1 min-w-[56px]"
              >
                <motion.div
                  whileTap={{ scale: 0.85 }}
                  className={`p-2 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                </motion.div>
                <span
                  className={`text-[10px] font-medium ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <footer className="hidden md:block text-center py-4 text-xs text-muted-foreground border-t">
        © {new Date().getFullYear()}. Built with love using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
