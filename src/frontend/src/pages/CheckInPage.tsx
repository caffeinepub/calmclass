import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Lightbulb, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { EMOTION_CONFIG, EmotionCard } from "../components/EmotionCard";
import {
  Emotion,
  useLogMood,
  useStudyRecommendations,
} from "../hooks/useQueries";

const ALL_EMOTIONS = Object.values(Emotion);

export function CheckInPage() {
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const [hasLogged, setHasLogged] = useState(false);

  const logMood = useLogMood();
  const { data: recommendations, isLoading: recsLoading } =
    useStudyRecommendations(hasLogged ? selectedEmotion : null);

  async function handleEmotionSelect(emotion: Emotion) {
    setSelectedEmotion(emotion);
    setHasLogged(false);
    try {
      await logMood.mutateAsync(emotion);
      setHasLogged(true);
      toast.success(
        `Mood logged: ${EMOTION_CONFIG[emotion].label} ${EMOTION_CONFIG[emotion].emoji}`,
      );
    } catch {
      toast.error("Failed to log mood. Please try again.");
    }
  }

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
          data-ocid="checkin.back.link"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">
          How are you feeling?
        </h1>
        <p className="text-muted-foreground">
          Select the emotion that best describes your current state. We'll
          tailor study tips just for you.
        </p>
      </motion.div>

      {/* Emotion Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {ALL_EMOTIONS.map((emotion, index) => (
          <EmotionCard
            key={emotion}
            emotion={emotion}
            selected={selectedEmotion === emotion}
            onClick={handleEmotionSelect}
            index={index}
          />
        ))}
      </div>

      {/* Loading state after click */}
      <AnimatePresence>
        {logMood.isPending && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center gap-3 py-4 text-muted-foreground"
            data-ocid="checkin.loading_state"
          >
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <span className="text-sm">Logging your mood...</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recommendations */}
      <AnimatePresence>
        {hasLogged && selectedEmotion && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-5 h-5 text-primary" />
              <h2 className="font-display text-xl font-semibold">
                Tips for when you're{" "}
                {EMOTION_CONFIG[selectedEmotion].label.toLowerCase()}{" "}
                {EMOTION_CONFIG[selectedEmotion].emoji}
              </h2>
            </div>

            {recsLoading ? (
              <div
                className="space-y-3"
                data-ocid="recommendations.loading_state"
              >
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-20 w-full rounded-2xl" />
                ))}
              </div>
            ) : !recommendations || recommendations.length === 0 ? (
              <div
                data-ocid="recommendations.empty_state"
                className="glass-card rounded-2xl p-6 text-center text-muted-foreground"
              >
                <p className="text-3xl mb-2">✨</p>
                <p>No recommendations yet. Keep checking in to unlock tips!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recommendations.map((rec, i) => (
                  <motion.div
                    key={`rec-${rec.slice(0, 20)}-${i}`}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    data-ocid={`recommendations.item.${i + 1}`}
                  >
                    <Card className="rounded-2xl border-0 glass-card shadow-card">
                      <CardContent className="p-4 flex gap-3 items-start">
                        <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-sm font-bold text-primary">
                            {i + 1}
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed text-foreground">
                          {rec}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 text-center"
            >
              <Link to="/study">
                <Button
                  data-ocid="checkin.start_study.primary_button"
                  className="rounded-xl px-8"
                  size="lg"
                >
                  Start a Study Session →
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
