import { DatabaseService } from "@/services/database";
import { useAuthStore } from "@/store/auth";
import { Profile, ProfileUpdate } from "@/types/STT";
import { useCallback, useEffect, useState } from "react";

// Profile hook
export function useProfile() {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const profileData = await DatabaseService.getProfile(user.id);
      setProfile(profileData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const updateProfile = useCallback(
    async (updates: ProfileUpdate) => {
      if (!user?.id) return null;

      const updatedProfile = await DatabaseService.updateProfile(
        user.id,
        updates
      );
      if (updatedProfile) {
        setProfile(updatedProfile);
      }
      return updatedProfile;
    },
    [user?.id]
  );

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    error,
    refetch: fetchProfile,
    updateProfile,
  };
}
