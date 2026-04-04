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

  const popularHostels = filtered.slice(0, 4);
const recentHostels = [...filtered].reverse().slice(0, 4);

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



{/* 🔥 Popular Hostels 
<div>
  <h2 className="text-lg font-bold mb-3">🔥 Popular Hostels</h2>

  <div className="flex gap-3 overflow-x-auto">
    {popularHostels.map((hostel) => (
      <Link
        key={hostel.id}
        to={`/hostel/${hostel.id}`}
        className="min-w-[200px] bg-card rounded-lg p-2 border border-border"
      >
        <img
          src={hostel.images?.[0]}
          alt={hostel.name}
          className="w-full h-28 object-cover rounded-md"
        />

        <h3 className="text-sm font-semibold mt-2 truncate">
          {hostel.name}
        </h3>

        <p className="text-xs text-primary">{hostel.price}</p>
      </Link>
    ))}
  </div>
</div>*/}
<div>
  <h2 className="text-lg font-bold mb-3">🔥 Popular Hostels</h2>

  <HostelList hostels={popularHostels} />
</div>


{/* 🕒 Recently Added */}
{/*<div>
  <h2 className="text-lg font-bold mb-3">🕒 Recently Added</h2>

  <div className="grid gap-4">
    {recentHostels.map((hostel) => (
      <Link
        key={hostel.id}
        to={`/hostel/${hostel.id}`}
        className="block border rounded-lg p-3"
      >
        <img
          src={hostel.images?.[0]}
          alt={hostel.name}
          className="w-full h-40 object-cover rounded-md"
        />

        <h3 className="font-semibold mt-2">{hostel.name}</h3>
        <p className="text-sm text-primary">{hostel.price}</p>
        <p className="text-xs text-muted-foreground">
          {hostel.location}
        </p>
      </Link>
    ))}
  </div>
</div>*/}

<div>
  <h2 className="text-lg font-bold mb-3">🕒 Recently Added</h2>

  <HostelList hostels={recentHostels} />
</div>






 <h2 className="text-lg font-bold mb-3"> Hostels</h2>

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
