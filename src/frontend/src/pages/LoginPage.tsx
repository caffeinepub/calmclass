import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Loader2,
  LogIn,
  Smile,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const features = [
  { icon: Smile, text: "Track your emotions before every session" },
  { icon: BookOpen, text: "Get personalized study recommendations" },
  { icon: TrendingUp, text: "See your mood & progress patterns over time" },
];

export function LoginPage() {
  const { login, isLoggingIn } = useInternetIdentity();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle, oklch(0.72 0.14 168), transparent)",
          }}
        />
        <div
          className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle, oklch(0.75 0.16 55), transparent)",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="glass-card rounded-3xl p-10 max-w-md w-full text-center relative z-10 shadow-soft"
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mb-4"
        >
          <img
            src="/assets/generated/calmclass-logo-transparent.dim_400x150.png"
            alt="CalmClass"
            className="h-16 w-auto mx-auto object-contain"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          <p className="text-muted-foreground text-base mb-8">
            Study smarter, feel better ✨
          </p>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="space-y-3 mb-8 text-left"
        >
          {features.map((feature, i) => (
            <motion.div
              key={feature.text}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-primary/5"
            >
              <feature.icon className="w-5 h-5 text-primary flex-shrink-0" />
              <p className="text-sm text-foreground">{feature.text}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Login Button */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Button
            data-ocid="login.primary_button"
            onClick={login}
            disabled={isLoggingIn}
            className="w-full rounded-xl py-6 text-base font-semibold shadow-glow"
            size="lg"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5 mr-2" />
                Sign In to Continue
              </>
            )}
          </Button>
          <p className="text-xs text-muted-foreground mt-3">
            Secure, private, and on-chain. Your data stays yours.
          </p>
        </motion.div>

        {/* Sparkle decoration */}
        <motion.div
          className="absolute -top-3 -right-3"
          animate={{ rotate: [0, 15, -15, 0] }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 4,
            ease: "easeInOut",
          }}
        >
          <Sparkles className="w-8 h-8 text-primary/40" />
        </motion.div>
      </motion.div>

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="mt-6 text-xs text-muted-foreground text-center"
      >
        © {new Date().getFullYear()}. Built with love using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          caffeine.ai
        </a>
      </motion.p>
    </div>
  );
}
