import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUser } from '@clerk/clerk-expo';
import { DatabaseService } from '@/src/services/database';
import { ProfileUpdate } from '@/src/types/STT';

/**
 * React Query mutation hook for updating user profile
 */
export function useUpdateProfile() {
  const { user } = useUser();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (updates: ProfileUpdate) => 
      DatabaseService.updateProfile(user!.id, updates),
    onSuccess: (data) => {
      // Update profile in cache
      queryClient.setQueryData(['profile', user!.id], data);
    },
  });
}
