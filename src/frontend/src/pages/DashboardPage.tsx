import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { BookOpen, Clock, Smile, Sparkles, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import { EMOTION_CONFIG } from "../components/EmotionCard";
import { useMoodHistory, useStudyHistory } from "../hooks/useQueries";
import type { Emotion } from "../hooks/useQueries";

function formatTimestamp(ts: bigint): string {
  const ms = Number(ts) / 1_000_000;
  const date = new Date(ms);
  if (Number.isNaN(date.getTime())) return "Recently";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function DashboardPage() {
  const { data: moodHistory, isLoading: moodLoading } = useMoodHistory();
  const { data: studyHistory, isLoading: studyLoading } = useStudyHistory();

  const recentMoods = (moodHistory || []).slice(-5).reverse();
  const totalSessions = (studyHistory || []).length;
  const totalMinutes = (studyHistory || []).reduce(
    (acc, s) => acc + Number(s.durationMinutes),
    0,
  );

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <img
          src="/assets/generated/calmclass-logo-transparent.dim_400x150.png"
          alt="CalmClass"
          className="h-16 w-auto mx-auto mb-3 object-contain"
        />
        <p className="text-muted-foreground font-body text-lg">
          Study smarter, feel better ✨
        </p>
      </motion.div>

      {/* Quick Check-In CTA */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="mb-8"
      >
        <div className="glass-card rounded-2xl p-6 text-center">
          <Sparkles className="w-8 h-8 text-primary mx-auto mb-3" />
          <h2 className="font-display text-xl font-semibold mb-1 text-foreground">
            How are you feeling right now?
          </h2>
          <p className="text-muted-foreground text-sm mb-4">
            Log your mood to get personalized study tips
          </p>
          <Link to="/checkin">
            <Button
              data-ocid="dashboard.checkin.primary_button"
              className="rounded-xl px-8"
              size="lg"
            >
              <Smile className="w-4 h-4 mr-2" />
              Check In Now
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 gap-4 mb-8"
      >
        <motion.div variants={itemVariants}>
          <Card className="rounded-2xl shadow-card border-0 glass-card">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <div>
                {studyLoading ? (
                  <Skeleton
                    className="h-8 w-12"
                    data-ocid="stats.loading_state"
                  />
                ) : (
                  <p className="text-2xl font-display font-bold text-foreground">
                    {totalSessions}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">Sessions</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="rounded-2xl shadow-card border-0 glass-card">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-chart-2/20 flex items-center justify-center">
                <TrendingUp
                  className="w-5 h-5"
                  style={{ color: "oklch(0.65 0.18 55)" }}
                />
              </div>
              <div>
                {studyLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-2xl font-display font-bold text-foreground">
                    {totalMinutes}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">Minutes studied</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Recent Mood History */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.3 }}
      >
        <Card className="rounded-2xl shadow-card border-0 glass-card mb-6">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="font-display text-lg">
                Recent Moods
              </CardTitle>
              <Link to="/history" data-ocid="dashboard.history.link">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary text-xs"
                >
                  View all
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {moodLoading ? (
              <div className="space-y-3" data-ocid="moods.loading_state">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentMoods.length === 0 ? (
              <div
                data-ocid="moods.empty_state"
                className="text-center py-8 text-muted-foreground"
              >
                <p className="text-3xl mb-2">🌱</p>
                <p className="text-sm">
                  No mood logs yet. Start your first check-in!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentMoods.map((log, i) => {
                  const config = EMOTION_CONFIG[log.emotion as Emotion];
                  return (
                    <motion.div
                      key={`mood-${log.timestamp.toString()}-${i}`}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      data-ocid={`moods.item.${i + 1}`}
                      className="flex items-center gap-3"
                    >
                      <div
                        className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-xl ${config?.className}`}
                      >
                        {config?.emoji}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold">{config?.label}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatTimestamp(log.timestamp)}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-2 gap-4"
      >
        <Link to="/study" className="block">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            data-ocid="dashboard.study.button"
            className="glass-card rounded-2xl p-5 text-center cursor-pointer hover:shadow-soft transition-shadow"
          >
            <BookOpen className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="font-semibold text-sm">Start Studying</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Track a session
            </p>
          </motion.div>
        </Link>
        <Link to="/history" className="block">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            data-ocid="dashboard.history.button"
            className="glass-card rounded-2xl p-5 text-center cursor-pointer hover:shadow-soft transition-shadow"
          >
            <Clock
              className="w-8 h-8 mx-auto mb-2"
              style={{ color: "oklch(0.65 0.18 55)" }}
            />
            <p className="font-semibold text-sm">View History</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Sessions & moods
            </p>
          </motion.div>
        </Link>
      </motion.div>
    </div>
  );
}
