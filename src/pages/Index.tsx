import { Search } from "lucide-react";
import { useState } from "react";
import HostelList from "@/components/HostelList";
import { useHostels } from "@/hooks/useHostels";

const Index = () => {
  const [search, setSearch] = useState("");
  const { data: hostels = [], isLoading } = useHostels();

  const filtered = hostels.filter(
    (h) =>
      h.name.toLowerCase().includes(search.toLowerCase()) ||
      h.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="font-heading font-bold text-lg sm:text-xl md:text-2xl text-foreground">
            Roomio <span className="text-primary">UCC</span>
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm mt-0.5">
            Find your perfect hostel at University of Cape Coast
          </p>
        </div>
      </header>

      <main className="container px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search hostels or locations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-secondary border border-border rounded-lg pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-body"
          />
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Loading hostels...</div>
        ) : (
          <HostelList hostels={filtered} />
        )}
      </main>
    </div>
  );
};

export default Index;
