import { useQuery } from '@tanstack/react-query';
import { useUser } from '@clerk/clerk-expo';
import { DatabaseService } from '@/src/services/database';
import { Profile } from '@/src/types/STT';

/**
 * React Query hook for fetching user profile
 */
export function useProfile() {
  const { user } = useUser();
  
  return useQuery({
    queryKey: ['profile', user?.id],
    queryFn: () => DatabaseService.getProfile(user!.id),
    enabled: !!user?.id,
    staleTime: 10 * 60 * 1000, // 10 minutes (profile changes rarely)
  });
}
