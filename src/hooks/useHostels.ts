import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase.ts";
import { type Hostel , hostels as mockHostels  } from "@/data/hostels";


export const useHostels = () => {
  return useQuery({
    queryKey: ["hostels"],
    queryFn: async (): Promise<Hostel[]> => {
      const { data, error } = await supabase
        .from("hostels")
        .select("*");
       console.log(`this is the eror:${data}`)
      if (error) throw error;
      
      // Fall back to mock data if Supabase table is empty
      if (!data || data.length === 0) return mockHostels;
      
      return data as Hostel[];
      
    },
  });
};

export const useHostel = (id: string | undefined) => {
  return useQuery({
    queryKey: ["hostel", id],
    queryFn: async (): Promise<Hostel | null> => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("hostels")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      // Fall back to mock data if not found in Supabase
      if (!data) return mockHostels.find((h) => h.id === id) ?? null;
      return data as Hostel | null;
    },
    enabled: !!id,
  });
};



/*export const useHostels = () => {
  return useQuery({
    queryKey: ["hostels"],
    queryFn: async (): Promise<Hostel[]> => {
      const { data, error } = await supabase.from("hostels").select("*");
      
      if (error) throw error;
      
      return (data ?? []) as Hostel[];
    },
  });
};

export const useHostel = (id?: string) => {
  return useQuery({
    queryKey: ["hostel", id],
    queryFn: async (): Promise<Hostel | null> => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("hostels")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      
      return data as Hostel | null;
      
    },
    enabled: !!id,
  });
};
*/
