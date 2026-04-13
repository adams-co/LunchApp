import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export interface HostelShort {
  id: string;
  user_id: string;
  hostel_id: string | null;
  title: string;
  video_url: string;
  price: string;
  description: string;
  location: string;
  created_at: string;
}

interface NewShortPayload {
  hostel_id?: string | null;
  title: string;
  video_url: string;
  price: string;
  description: string;
  location: string;
}

export const useShorts = () => {
  return useQuery({
    queryKey: ["shorts"],
    queryFn: async (): Promise<HostelShort[]> => {
      const { data, error } = await supabase
        .from("hostel_shorts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) return [];
      return (data as HostelShort[]) || [];
    },
  });
};

export const useCreateShort = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: NewShortPayload) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Sign in required");

      const { error } = await supabase.from("hostel_shorts").insert({
        ...payload,
        user_id: user.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shorts"] });
    },
  });
};

export const useDeleteShort = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (shortId: string) => {
      const { error } = await supabase.from("hostel_shorts").delete().eq("id", shortId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shorts"] });
    },
  });
};
