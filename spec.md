# CalmClass - Emotion-Based Study Assistant

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Emotion check-in screen: user selects their current emotional state (e.g. calm, anxious, tired, focused, stressed, motivated)
- Personalized study recommendations based on selected emotion (study tips, techniques, break reminders, breathing exercises)
- Study session tracker: start/pause/stop timer with session log
- Mood history log: records emotion + timestamp per session
- Motivational messages tailored to each emotion
- CalmClass logo (AHH CalmClass branding) displayed in header
- Dashboard showing recent mood history and study stats

### Modify
- N/A (new project)

### Remove
- N/A (new project)

## Implementation Plan
1. Backend (Motoko):
   - Store mood logs: emotion type, timestamp, session duration
   - Store study sessions: start time, duration, emotion linked
   - Query mood history for the current user
   - Get study recommendations by emotion type
   - CRUD for study sessions

2. Frontend (React):
   - Landing/home page with CalmClass logo and tagline
   - Emotion selector screen with emoji-based mood picker
   - Recommendations view based on chosen emotion
   - Pomodoro-style study timer
   - Mood history dashboard with timeline
   - Responsive, calming UI design
