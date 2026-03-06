import Principal "mo:core/Principal";
import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type Emotion = {
    #calm;
    #anxious;
    #tired;
    #focused;
    #stressed;
    #motivated;
    #happy;
    #sad;
  };

  module Emotion {
    public func compare(emotion1 : Emotion, emotion2 : Emotion) : Order.Order {
      Text.compare(Emotion.toText(emotion1), Emotion.toText(emotion2));
    };

    public func toText(emotion : Emotion) : Text {
      switch (emotion) {
        case (#calm) { "calm" };
        case (#anxious) { "anxious" };
        case (#tired) { "tired" };
        case (#focused) { "focused" };
        case (#stressed) { "stressed" };
        case (#motivated) { "motivated" };
        case (#happy) { "happy" };
        case (#sad) { "sad" };
      };
    };
  };

  type MoodLog = {
    emotion : Emotion;
    timestamp : Int;
  };

  module MoodLog {
    public func compareByTimestampDescending(log1 : MoodLog, log2 : MoodLog) : Order.Order {
      Int.compare(log2.timestamp, log1.timestamp);
    };
  };

  type StudySession = {
    subject : Text;
    startEmotion : Emotion;
    durationMinutes : Nat;
    timestamp : Int;
  };

  module StudySession {
    public func compareByTimestampDescending(session1 : StudySession, session2 : StudySession) : Order.Order {
      Int.compare(session2.timestamp, session1.timestamp);
    };
  };

  type StudyRecommendation = {
    emotion : Emotion;
    tips : [Text];
  };

  public type UserProfile = {
    name : Text;
  };

  // Data storage
  let moodLogs = Map.empty<Principal, List.List<MoodLog>>();
  let studySessions = Map.empty<Principal, List.List<StudySession>>();
  let recommendations = Map.empty<Emotion, [Text]>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Initialize study recommendations
  public shared ({ caller }) func initializeRecommendations() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can initialize recommendations");
    };
    let recs : [(Emotion, [Text])] = [
      (
        #anxious,
        [
          "Take deep breaths before studying.",
          "Start with easier tasks to build confidence.",
          "Use calming music or background noise.",
        ],
      ),
      (
        #tired,
        [
          "Take short breaks every 25 minutes.",
          "Drink water and have a healthy snack.",
          "Study in a well-lit area.",
        ],
      ),
      (
        #focused,
        [
          "Use focus to tackle the most challenging tasks.",
          "Minimize distractions and notifications.",
          "Reward yourself for focused study sessions.",
        ],
      ),
      (
        #stressed,
        [
          "Break study tasks into smaller chunks.",
          "Practice mindfulness before studying.",
          "Talk to a friend or teacher if overwhelmed.",
        ],
      ),
      (
        #motivated,
        [
          "Set ambitious but achievable goals.",
          "Help others who may be struggling.",
          "Challenge yourself with new material.",
        ],
      ),
      (
        #calm,
        [
          "Maintain your calm state with consistent study habits.",
          "Use this time for deep learning and comprehension.",
          "Practice active recall techniques.",
        ],
      ),
      (
        #happy,
        [
          "Channel your positive energy into productive study.",
          "Share your enthusiasm with study groups.",
          "Tackle creative or challenging problems.",
        ],
      ),
      (
        #sad,
        [
          "Be gentle with yourself and start with simple tasks.",
          "Consider taking a short walk before studying.",
          "Reach out to friends or support services if needed.",
        ],
      ),
    ];
    for ((emotion, tips) in recs.values()) {
      recommendations.add(emotion, tips);
    };
  };

  // Mood Logging
  public shared ({ caller }) func logMood(emotion : Emotion) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can log moods");
    };
    let log : MoodLog = {
      emotion;
      timestamp = Time.now();
    };
    let existingLogs = switch (moodLogs.get(caller)) {
      case (null) { List.empty<MoodLog>() };
      case (?logs) { logs };
    };
    if (existingLogs.size() >= 50) {
      let array = existingLogs.toArray();
      existingLogs.clear();
      if (array.size() >= 49) {
        for (i in Int.range(0, 49)) {
          let index : Nat = Int.abs(i);
          if (index < array.size()) {
            existingLogs.add(array[index]);
          };
        };
      };
    };
    existingLogs.add(log);
    moodLogs.add(caller, existingLogs);
  };

  public query ({ caller }) func getMoodHistory() : async [MoodLog] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view mood history");
    };
    switch (moodLogs.get(caller)) {
      case (null) { [] };
      case (?logs) { logs.toArray().sort(MoodLog.compareByTimestampDescending) };
    };
  };

  // Study Session Tracking
  public shared ({ caller }) func createStudySession(subject : Text, startEmotion : Emotion, durationMinutes : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create study sessions");
    };
    let session : StudySession = {
      subject;
      startEmotion;
      durationMinutes;
      timestamp = Time.now();
    };
    let existingSessions = switch (studySessions.get(caller)) {
      case (null) { List.empty<StudySession>() };
      case (?sessions) { sessions };
    };
    if (existingSessions.size() >= 50) {
      let array = existingSessions.toArray();
      existingSessions.clear();
      if (array.size() >= 49) {
        for (i in Int.range(0, 49)) {
          let index : Nat = Int.abs(i);
          if (index < array.size()) {
            existingSessions.add(array[index]);
          };
        };
      };
    };
    existingSessions.add(session);
    studySessions.add(caller, existingSessions);
  };

  public query ({ caller }) func getStudyHistory() : async [StudySession] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view study history");
    };
    switch (studySessions.get(caller)) {
      case (null) { [] };
      case (?sessions) { sessions.toArray().sort(StudySession.compareByTimestampDescending) };
    };
  };

  public query ({ caller }) func getStudyRecommendations(emotion : Emotion) : async [Text] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view study recommendations");
    };
    switch (recommendations.get(emotion)) {
      case (null) { [] };
      case (?tips) { tips };
    };
  };
};
