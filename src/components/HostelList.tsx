import HostelCard from "./HostelCard";
import type { Hostel } from "@/data/hostels";

interface HostelListProps {
  hostels: Hostel[];
}

const HostelList = ({ hostels }: HostelListProps) => {
  if (hostels.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <p className="font-heading text-lg">No hostels found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
      {hostels.map((hostel, i) => (
        <div key={hostel.id} className="animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
          <HostelCard hostel={hostel} index={i} />
        </div>
      ))}
    </div>
  );
};

export default HostelList;
