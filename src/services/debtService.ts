import { useQuery } from "@tanstack/react-query";


// New React Query version
export function useDebts() {
    const { user } = useUser();
    
    return useQuery({
      queryKey: ['debts', user?.id],
      queryFn: () => DatabaseService.getUserDebtsWithPayments(user!.id),
      enabled: !!user?.id,
    });
  }