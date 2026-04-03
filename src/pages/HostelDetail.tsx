import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Phone, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useHostel } from "@/hooks/useHostels";

const HostelDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const { data: hostel, isLoading } = useHostel(id);
console.log("Fetched hostel:", hostel);
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!hostel) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground font-heading text-lg">Hostel not found</p>
          <Link to="/" className="inline-block gradient-primary text-primary-foreground font-heading font-semibold px-6 py-3 rounded-lg">
            Go Back
          </Link>
        </div>
      </div>
    );
  }

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hostel.location)}`;

  return (
  
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container px-4 sm:px-6 py-3 flex items-center gap-3">
          <Link to="/" className="text-foreground hover:text-primary transition-colors p-1 -ml-1">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-heading font-semibold text-foreground text-sm sm:text-base truncate">
            {hostel.name}
          </h1>
        </div>
      </header>

      <main className="pb-28">
        <div className="w-full aspect-video bg-card">
          <video
            src={hostel.video}
            controls
            playsInline
            className="w-full h-full object-cover"
            poster={hostel.images?.[0]}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto scrollbar-hide px-4 sm:px-6 py-3">
          {hostel.images?.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`${hostel.name} photo ${i + 1}`}
              loading="lazy"
              onClick={() => setLightboxIndex(i)}
              className="w-24 h-16 sm:w-28 sm:h-20 md:w-36 md:h-24 rounded-md object-cover shrink-0 border border-border cursor-pointer hover:opacity-80 transition-opacity"
            />
          ))}
        </div>

        <div className="container px-4 sm:px-6 space-y-4 sm:space-y-5 pt-2">
          <div>
            <h2 className="font-heading font-bold text-lg sm:text-xl md:text-2xl text-foreground">{hostel.name}</h2>
            <p className="text-primary font-heading font-semibold text-base sm:text-lg mt-1">{hostel.price}</p>
          </div>

          <p className="text-secondary-foreground text-sm leading-relaxed">
            {hostel.description}
          </p>

          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-foreground text-sm">{hostel.location}</p>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent text-xs font-medium hover:underline mt-0.5 inline-block"
              >
                View on Map →
              </a>
            </div>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-3 sm:p-4 bg-background/90 backdrop-blur-md border-t border-border safe-bottom">
        <a
          href={`tel:${hostel.phone}`}
          className="flex items-center justify-center gap-2 w-full max-w-lg mx-auto gradient-primary text-primary-foreground font-heading font-bold text-sm sm:text-base py-3.5 sm:py-4 rounded-xl shadow-glow transition-transform active:scale-[0.98]"
        >
          <Phone className="w-5 h-5" />
          Call Manager
        </a>
      </div>

      {lightboxIndex !== null && hostel.images && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center" onClick={() => setLightboxIndex(null)}>
          <button onClick={() => setLightboxIndex(null)} className="absolute top-4 right-4 text-foreground/80 hover:text-foreground z-10">
            <X className="w-7 h-7" />
          </button>
          {hostel.images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex - 1 + hostel.images.length) % hostel.images.length); }}
                className="absolute left-3 text-foreground/80 hover:text-foreground z-10"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex + 1) % hostel.images.length); }}
                className="absolute right-3 text-foreground/80 hover:text-foreground z-10"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}
          <img
            src={hostel.images[lightboxIndex]}
            alt={`${hostel.name} photo ${lightboxIndex + 1}`}
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default HostelDetail;
