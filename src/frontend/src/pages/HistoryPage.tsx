import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { EMOTION_CONFIG } from "../components/EmotionCard";
import {
  type Emotion,
  useMoodHistory,
  useStudyHistory,
} from "../hooks/useQueries";

function formatTimestamp(ts: bigint): string {
  const ms = Number(ts) / 1_000_000;
  const date = new Date(ms);
  if (Number.isNaN(date.getTime())) return "Recently";
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function HistoryPage() {
  const { data: moodHistory, isLoading: moodLoading } = useMoodHistory();
  const { data: studyHistory, isLoading: studyLoading } = useStudyHistory();

  const sortedMoods = [...(moodHistory || [])].reverse();
  const sortedSessions = [...(studyHistory || [])].reverse();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-muted-foreground text-sm mb-4 hover:text-foreground transition-colors"
          data-ocid="history.back.link"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">
          History
        </h1>
        <p className="text-muted-foreground">
          Track your emotional journey and study progress.
        </p>
      </motion.div>

      <Tabs defaultValue="moods" className="w-full">
        <TabsList className="w-full mb-6 rounded-2xl p-1 glass-card border-0 h-auto">
          <TabsTrigger
            value="moods"
            data-ocid="history.mood.tab"
            className="flex-1 rounded-xl py-2.5 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
          >
            😊 Mood Log
            {moodHistory && (
              <Badge variant="secondary" className="ml-2 text-xs rounded-full">
                {moodHistory.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="sessions"
            data-ocid="history.sessions.tab"
            className="flex-1 rounded-xl py-2.5 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
          >
            📚 Sessions
            {studyHistory && (
              <Badge variant="secondary" className="ml-2 text-xs rounded-full">
                {studyHistory.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Mood History Tab */}
        <TabsContent value="moods" data-ocid="history.mood.panel">
          {moodLoading ? (
            <div className="space-y-3" data-ocid="history.mood.loading_state">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-4 p-4">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-28 mb-2" />
                    <Skeleton className="h-3 w-44" />
                  </div>
                </div>
              ))}
            </div>
          ) : sortedMoods.length === 0 ? (
            <div
              data-ocid="history.mood.empty_state"
              className="glass-card rounded-2xl p-10 text-center"
            >
              <p className="text-4xl mb-3">🌱</p>
              <p className="font-display text-xl font-semibold mb-2">
                No mood logs yet
              </p>
              <p className="text-muted-foreground text-sm mb-4">
                Start tracking your emotions to see patterns here.
              </p>
              <Link to="/checkin" data-ocid="history.checkin.link">
                <span className="text-primary text-sm font-medium hover:underline">
                  Log your first mood →
                </span>
              </Link>
            </div>
          ) : (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-6 top-0 bottom-0 w-px bg-border ml-0.5" />
              <div className="space-y-3 pl-1">
                {sortedMoods.map((log, i) => {
                  const config = EMOTION_CONFIG[log.emotion as Emotion];
                  return (
                    <motion.div
                      key={`mood-${log.timestamp.toString()}-${i}`}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      data-ocid={`history.mood.item.${i + 1}`}
                      className="flex items-start gap-4"
                    >
                      {/* Timeline dot */}
                      <div
                        className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-2xl flex-shrink-0 z-10 ${config?.className}`}
                      >
                        {config?.emoji}
                      </div>
                      <Card className="flex-1 rounded-2xl border-0 glass-card shadow-card">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <p className="font-semibold text-foreground">
                              {config?.label}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatTimestamp(log.timestamp)}
                            </p>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {config?.description}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </TabsContent>

        {/* Study Sessions Tab */}
        <TabsContent value="sessions" data-ocid="history.sessions.panel">
          {studyLoading ? (
            <div
              className="space-y-3"
              data-ocid="history.sessions.loading_state"
            >
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-5">
                  <Skeleton className="h-5 w-40 mb-2" />
                  <Skeleton className="h-4 w-64" />
                </div>
              ))}
            </div>
          ) : sortedSessions.length === 0 ? (
            <div
              data-ocid="history.sessions.empty_state"
              className="glass-card rounded-2xl p-10 text-center"
            >
              <p className="text-4xl mb-3">📚</p>
              <p className="font-display text-xl font-semibold mb-2">
                No study sessions yet
              </p>
              <p className="text-muted-foreground text-sm mb-4">
                Complete your first study session to see it here.
              </p>
              <Link to="/study" data-ocid="history.study.link">
                <span className="text-primary text-sm font-medium hover:underline">
                  Start studying →
                </span>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedSessions.map((session, i) => {
                const config = EMOTION_CONFIG[session.startEmotion as Emotion];
                return (
                  <motion.div
                    key={`session-${session.timestamp.toString()}-${i}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    data-ocid={`history.sessions.item.${i + 1}`}
                  >
                    <Card className="rounded-2xl border-0 glass-card shadow-card">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-foreground truncate">
                              {session.subject}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {formatTimestamp(session.timestamp)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <Badge
                              variant="secondary"
                              className={`text-xs rounded-full border ${config?.className}`}
                            >
                              {config?.emoji} {config?.label}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="text-xs rounded-full"
                            >
                              {String(session.durationMinutes)} min
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
