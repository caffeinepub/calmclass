import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle, Loader2, LogOut, User } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useSaveUserProfile, useUserProfile } from "../hooks/useQueries";

export function ProfilePage() {
  const { data: profile, isLoading } = useUserProfile();
  const saveProfile = useSaveUserProfile();
  const { clear, identity } = useInternetIdentity();
  const [name, setName] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile?.name) setName(profile.name);
  }, [profile]);

  async function handleSave() {
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    try {
      await saveProfile.mutateAsync({ name: name.trim() });
      setSaved(true);
      toast.success("Profile updated!");
      setTimeout(() => setSaved(false), 3000);
    } catch {
      toast.error("Failed to save profile");
    }
  }

  const principal = identity?.getPrincipal().toString();

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
          data-ocid="profile.back.link"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">
          Profile
        </h1>
        <p className="text-muted-foreground">Manage your CalmClass account.</p>
      </motion.div>

      {/* Avatar & Name Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <Card className="rounded-2xl border-0 glass-card shadow-card">
          <CardHeader className="pb-3 text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center mx-auto mb-3">
              <User className="w-10 h-10 text-primary" />
            </div>
            {isLoading ? (
              <Skeleton className="h-6 w-32 mx-auto" />
            ) : (
              <CardTitle className="font-display text-xl">
                {profile?.name || "Set your name"}
              </CardTitle>
            )}
            {principal && (
              <p className="text-xs text-muted-foreground mt-1 font-mono break-all px-4">
                {principal.slice(0, 20)}...{principal.slice(-10)}
              </p>
            )}
          </CardHeader>
        </Card>
      </motion.div>

      {/* Edit Name */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-6"
      >
        <Card className="rounded-2xl border-0 glass-card shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-lg">
              Edit Display Name
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label
                htmlFor="name"
                className="text-sm text-muted-foreground mb-2 block"
              >
                Your name
              </Label>
              {isLoading ? (
                <Skeleton
                  className="h-10 w-full rounded-xl"
                  data-ocid="profile.loading_state"
                />
              ) : (
                <Input
                  id="name"
                  data-ocid="profile.name.input"
                  placeholder="Enter your name..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-xl border-border bg-background/50"
                  onKeyDown={(e) => e.key === "Enter" && handleSave()}
                />
              )}
            </div>
            <Button
              data-ocid="profile.save.submit_button"
              onClick={handleSave}
              disabled={saveProfile.isPending || isLoading}
              className="w-full rounded-xl"
            >
              {saveProfile.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : saved ? (
                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
              ) : null}
              {saveProfile.isPending
                ? "Saving..."
                : saved
                  ? "Saved!"
                  : "Save Profile"}
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Sign Out */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="rounded-2xl border-0 glass-card shadow-card">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-foreground text-sm">
                  Sign Out
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  You'll need to log in again to access your data
                </p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={clear}
                className="rounded-xl"
                data-ocid="profile.logout.button"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
