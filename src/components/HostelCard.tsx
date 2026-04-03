import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import type  {Hostel} from "@/data/hostels";

interface HostelCardProps {
  hostel: Hostel;
  index: number;
}

const HostelCard = ({ hostel, index }: HostelCardProps) => {
  
  return (
    <Link
      to={`/hostel/${hostel.id}`}
      className="block rounded-lg overflow-hidden gradient-card shadow-card hover:shadow-glow transition-all duration-300 group"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={hostel.images[0]}
          alt={hostel.name}
          loading="lazy"
          width={800}
          height={500}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-transparent p-3">
          <span className="font-heading font-bold text-primary text-sm">
            {hostel.price}
          </span>
        </div>
      </div>
      <div className="p-3 sm:p-4 space-y-1.5">
        <h3 className="font-heading font-semibold text-foreground text-sm sm:text-base leading-tight">
          {hostel.name}
        </h3>
        <div className="flex items-center gap-1.5 text-muted-foreground text-xs sm:text-sm">
          <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
          <span className="truncate">{hostel.location}</span>
        </div>
      </div>
    </Link>
  );
};

export default HostelCard;
