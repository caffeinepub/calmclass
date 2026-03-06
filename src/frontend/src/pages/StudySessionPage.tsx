import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle,
  Loader2,
  Pause,
  Play,
  Square,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { EMOTION_CONFIG, EmotionCard } from "../components/EmotionCard";
import { Emotion, useCreateStudySession } from "../hooks/useQueries";

const ALL_EMOTIONS = Object.values(Emotion);

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0)
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function StudySessionPage() {
  const [subject, setSubject] = useState("");
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const createSession = useCreateStudySession();

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setElapsed((prev) => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  function handleStart() {
    if (!subject.trim()) {
      toast.error("Please enter a subject first");
      return;
    }
    if (!selectedEmotion) {
      toast.error("Please select how you're feeling");
      return;
    }
    setIsRunning(true);
  }

  function handlePause() {
    setIsRunning(false);
  }

  async function handleStop() {
    setIsRunning(false);
    if (elapsed < 60) {
      toast.error("Session must be at least 1 minute to save");
      return;
    }
    const minutes = Math.floor(elapsed / 60);
    try {
      await createSession.mutateAsync({
        subject: subject.trim(),
        emotion: selectedEmotion!,
        durationMinutes: BigInt(minutes),
      });
      setIsSaved(true);
      toast.success("Study session saved! Great work! 🎉");
    } catch {
      toast.error("Failed to save session. Please try again.");
    }
  }

  function handleReset() {
    setIsRunning(false);
    setElapsed(0);
    setSubject("");
    setSelectedEmotion(null);
    setIsSaved(false);
  }

  const progressPct = Math.min((elapsed / 3600) * 100, 100);

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
          data-ocid="study.back.link"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">
          Study Session
        </h1>
        <p className="text-muted-foreground">
          Track your focus time and log how you feel during the session.
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {isSaved ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-2xl p-10 text-center"
            data-ocid="study.success_state"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            >
              <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
            </motion.div>
            <h2 className="font-display text-2xl font-bold mb-2">
              Session Saved! 🎉
            </h2>
            <p className="text-muted-foreground mb-1">
              <strong className="text-foreground">{subject}</strong> —{" "}
              {Math.floor(elapsed / 60)} minutes
            </p>
            {selectedEmotion && (
              <p className="text-muted-foreground mb-6">
                You were feeling {EMOTION_CONFIG[selectedEmotion].label}{" "}
                {EMOTION_CONFIG[selectedEmotion].emoji}
              </p>
            )}
            <div className="flex gap-3 justify-center">
              <Button
                onClick={handleReset}
                variant="outline"
                className="rounded-xl"
                data-ocid="study.new_session.secondary_button"
              >
                New Session
              </Button>
              <Link to="/history">
                <Button
                  className="rounded-xl"
                  data-ocid="study.view_history.primary_button"
                >
                  View History
                </Button>
              </Link>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* Subject Input */}
            <Card className="rounded-2xl border-0 glass-card shadow-card mb-6">
              <CardHeader className="pb-3">
                <CardTitle className="font-display text-lg">
                  What are you studying?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Label
                  htmlFor="subject"
                  className="text-sm text-muted-foreground mb-2 block"
                >
                  Subject or topic
                </Label>
                <Input
                  id="subject"
                  data-ocid="study.subject.input"
                  placeholder="e.g. Calculus Chapter 5, Spanish vocabulary..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  disabled={isRunning}
                  className="rounded-xl border-border bg-background/50"
                />
              </CardContent>
            </Card>

            {/* Emotion Selector */}
            <Card className="rounded-2xl border-0 glass-card shadow-card mb-6">
              <CardHeader className="pb-3">
                <CardTitle className="font-display text-lg">
                  How are you feeling?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-2">
                  {ALL_EMOTIONS.map((emotion, index) => (
                    <EmotionCard
                      key={emotion}
                      emotion={emotion}
                      selected={selectedEmotion === emotion}
                      compact
                      onClick={!isRunning ? setSelectedEmotion : undefined}
                      index={index}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Timer */}
            <Card className="rounded-2xl border-0 glass-card shadow-card mb-6">
              <CardContent className="p-6">
                {/* Progress ring-like display */}
                <div className="text-center mb-6">
                  <motion.div
                    className="relative inline-flex"
                    animate={isRunning ? { scale: [1, 1.01, 1] } : { scale: 1 }}
                    transition={{
                      repeat: Number.POSITIVE_INFINITY,
                      duration: 2,
                      ease: "easeInOut",
                    }}
                  >
                    <div className="w-40 h-40 rounded-full border-4 border-muted flex items-center justify-center relative">
                      {/* Animated border segment */}
                      <svg
                        className="absolute inset-0 w-full h-full -rotate-90"
                        viewBox="0 0 144 144"
                        aria-hidden="true"
                        role="presentation"
                      >
                        <circle
                          cx="72"
                          cy="72"
                          r="68"
                          fill="none"
                          stroke="oklch(0.52 0.11 168)"
                          strokeWidth="4"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 68}`}
                          strokeDashoffset={`${2 * Math.PI * 68 * (1 - progressPct / 100)}`}
                          style={{ transition: "stroke-dashoffset 1s linear" }}
                        />
                      </svg>
                      <div>
                        <p className="font-display text-4xl font-bold text-foreground">
                          {formatTime(elapsed)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {isRunning
                            ? "Running..."
                            : elapsed > 0
                              ? "Paused"
                              : "Ready"}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-3">
                  {!isRunning && elapsed === 0 && (
                    <Button
                      data-ocid="study.timer.button"
                      onClick={handleStart}
                      className="rounded-xl px-8"
                      size="lg"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start
                    </Button>
                  )}
                  {isRunning && (
                    <Button
                      data-ocid="study.timer.button"
                      onClick={handlePause}
                      variant="outline"
                      className="rounded-xl px-8"
                      size="lg"
                    >
                      <Pause className="w-4 h-4 mr-2" />
                      Pause
                    </Button>
                  )}
                  {!isRunning && elapsed > 0 && (
                    <Button
                      data-ocid="study.timer.button"
                      onClick={handleStart}
                      variant="outline"
                      className="rounded-xl px-6"
                      size="lg"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Resume
                    </Button>
                  )}
                  {elapsed > 0 && (
                    <Button
                      data-ocid="study.save.button"
                      onClick={handleStop}
                      disabled={createSession.isPending}
                      className="rounded-xl px-8"
                      size="lg"
                    >
                      {createSession.isPending ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Square className="w-4 h-4 mr-2" />
                      )}
                      {createSession.isPending ? "Saving..." : "Stop & Save"}
                    </Button>
                  )}
                </div>
                {elapsed > 0 && (
                  <div className="text-center mt-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleReset}
                      className="text-muted-foreground text-xs rounded-lg"
                      data-ocid="study.reset.secondary_button"
                    >
                      Reset
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
