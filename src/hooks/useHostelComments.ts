import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export interface HostelComment {
  id: string;
  hostel_id: string;
  user_id: string;
  content: string;
  created_at: string;
}

export const useHostelComments = (hostelId?: string) => {
  return useQuery({
    queryKey: ["hostel-comments", hostelId],
    enabled: !!hostelId,
    queryFn: async (): Promise<HostelComment[]> => {
      const { data, error } = await supabase
        .from("hostel_comments")
        .select("*")
        .eq("hostel_id", hostelId)
        .order("created_at", { ascending: false });

      if (error) return [];
      return (data as HostelComment[]) || [];
    },
  });
};

export const useCreateComment = (hostelId?: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (content: string) => {
      if (!hostelId) throw new Error("Hostel missing");

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Sign in required");

      const { error } = await supabase.from("hostel_comments").insert({
        hostel_id: hostelId,
        user_id: user.id,
        content,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hostel-comments", hostelId] });
    },
  });
};
