import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface StudySession {
    subject: string;
    durationMinutes: bigint;
    startEmotion: Emotion;
    timestamp: bigint;
}
export interface MoodLog {
    emotion: Emotion;
    timestamp: bigint;
}
export interface UserProfile {
    name: string;
}
export enum Emotion {
    sad = "sad",
    tired = "tired",
    anxious = "anxious",
    happy = "happy",
    focused = "focused",
    calm = "calm",
    stressed = "stressed",
    motivated = "motivated"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createStudySession(subject: string, startEmotion: Emotion, durationMinutes: bigint): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMoodHistory(): Promise<Array<MoodLog>>;
    getStudyHistory(): Promise<Array<StudySession>>;
    getStudyRecommendations(emotion: Emotion): Promise<Array<string>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    initializeRecommendations(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    logMood(emotion: Emotion): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
