import HostelCard from "./HostelCard";
import type { Hostel } from "@/data/hostels";
import type { HostelEngagement, ReactionEmoji } from "@/hooks/useHostelEngagement";

interface HostelListProps {
  hostels: Hostel[];
  getEngagement?: (id: string) => HostelEngagement;
  getPopularityScore?: (id: string) => number;
  isSaved?: (id: string) => boolean;
  onToggleSave?: (id: string) => void;
  onToggleLike?: (id: string) => void;
  onToggleLove?: (id: string) => void;
  onSetReaction?: (id: string, reaction: ReactionEmoji) => void;
}

const HostelList = ({
  hostels,
  getEngagement,
  getPopularityScore,
  isSaved,
  onToggleSave,
  onToggleLike,
  onToggleLove,
  onSetReaction,
}: HostelListProps) => {
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
          <HostelCard
            hostel={hostel}
            index={i}
            engagement={getEngagement?.(hostel.id)}
            popularityScore={getPopularityScore?.(hostel.id) ?? 0}
            isSaved={isSaved?.(hostel.id)}
            onToggleSave={onToggleSave}
            onToggleLike={onToggleLike}
            onToggleLove={onToggleLove}
            onSetReaction={onSetReaction}
          />
        </div>
      ))}
    </div>
  );
};

export default HostelList;
