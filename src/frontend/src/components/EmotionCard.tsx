import { motion } from "motion/react";
import { Emotion } from "../hooks/useQueries";

interface EmotionConfig {
  emoji: string;
  label: string;
  className: string;
  description: string;
}

export const EMOTION_CONFIG: Record<Emotion, EmotionConfig> = {
  [Emotion.calm]: {
    emoji: "😌",
    label: "Calm",
    className: "emotion-calm",
    description: "Peaceful & serene",
  },
  [Emotion.focused]: {
    emoji: "🎯",
    label: "Focused",
    className: "emotion-focused",
    description: "Sharp & attentive",
  },
  [Emotion.motivated]: {
    emoji: "💪",
    label: "Motivated",
    className: "emotion-motivated",
    description: "Energized & driven",
  },
  [Emotion.happy]: {
    emoji: "😊",
    label: "Happy",
    className: "emotion-happy",
    description: "Joyful & upbeat",
  },
  [Emotion.anxious]: {
    emoji: "😰",
    label: "Anxious",
    className: "emotion-anxious",
    description: "Worried & tense",
  },
  [Emotion.tired]: {
    emoji: "😴",
    label: "Tired",
    className: "emotion-tired",
    description: "Low energy & sleepy",
  },
  [Emotion.stressed]: {
    emoji: "😤",
    label: "Stressed",
    className: "emotion-stressed",
    description: "Overwhelmed & pressured",
  },
  [Emotion.sad]: {
    emoji: "😢",
    label: "Sad",
    className: "emotion-sad",
    description: "Down & melancholy",
  },
};

interface EmotionCardProps {
  emotion: Emotion;
  selected?: boolean;
  compact?: boolean;
  onClick?: (emotion: Emotion) => void;
  index?: number;
}

export function EmotionCard({
  emotion,
  selected = false,
  compact = false,
  onClick,
  index = 0,
}: EmotionCardProps) {
  const config = EMOTION_CONFIG[emotion];

  return (
    <motion.button
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ scale: 1.04, y: -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onClick?.(emotion)}
      data-ocid={`checkin.emotion.${emotion}.button`}
      className={`
        relative border-2 rounded-2xl cursor-pointer transition-all duration-200
        ${config.className}
        ${selected ? "ring-2 ring-offset-2 ring-primary scale-105 shadow-glow" : ""}
        ${compact ? "p-3" : "p-5"}
        ${onClick ? "hover:shadow-soft" : "cursor-default"}
        w-full text-left
      `}
    >
      <div
        className={`flex ${compact ? "flex-row items-center gap-2" : "flex-col items-center gap-2"}`}
      >
        <span className={compact ? "text-2xl" : "text-4xl"}>
          {config.emoji}
        </span>
        <div className={compact ? "" : "text-center"}>
          <p
            className={`font-semibold font-body ${compact ? "text-sm" : "text-base"}`}
          >
            {config.label}
          </p>
          {!compact && (
            <p className="text-xs opacity-70 mt-0.5">{config.description}</p>
          )}
        </div>
      </div>
      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center"
        >
          <svg
            className="w-3 h-3 text-primary-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
            role="presentation"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </motion.div>
      )}
    </motion.button>
  );
}
