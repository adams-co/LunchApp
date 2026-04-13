import { useState, useEffect, useRef, type CSSProperties } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  MapPin,
  Maximize,
  Phone,
  PictureInPicture2,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useHostel } from "@/hooks/useHostels";
import { useHostelEngagement } from "@/hooks/useHostelEngagement";
import { useAuthUser } from "@/hooks/useAuthUser";
import { useCreateComment, useHostelComments } from "@/hooks/useHostelComments";

const HostelDetail = () => {
  const { id } = useParams<{ id: string }>();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [comment, setComment] = useState("");

  const { savedIds, toggleSaved } = useHostelEngagement();
  const { user } = useAuthUser();
  const { data: hostel, isLoading } = useHostel(id);
  const { data: comments = [] } = useHostelComments(id);
  const createComment = useCreateComment(id);

  useEffect(() => {
    if (!hostel) return;
    setIsSaved(savedIds.includes(hostel.id));
  }, [hostel, savedIds]);

  const toggleSave = () => {
    if (!hostel) return;
    toggleSaved(hostel.id);
  };

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
          <Link
            to="/"
            className="inline-block gradient-primary text-primary-foreground font-heading font-semibold px-6 py-3 rounded-lg"
          >
            Go Back
          </Link>
        </div>
      </div>
    );
  }

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hostel.location)}`;
  const mapsEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(hostel.location)}&output=embed`;

  const handleWhatsAppShare = () => {
    const currentUrl = window.location.href;
    const message = `Hostel: ${hostel.name}
Price: ${hostel.price}
Location: ${hostel.location}

View: ${currentUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  const handleFullscreen = async () => {
    const el = videoRef.current;
    if (!el) return;
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await el.requestFullscreen();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handlePictureInPicture = async () => {
    const el = videoRef.current;
    if (!el) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (document.pictureInPictureEnabled && el.requestPictureInPicture) {
        await el.requestPictureInPicture();
      }
    } catch (e) {
      console.error(e);
    }
  };

  /** Keep video inside the viewport above header + fixed Call/Share bar so it is not covered. */
  const videoShellStyle: CSSProperties = {
    height: "min(calc(100vw * 9 / 16), calc(100dvh - 11.75rem))",
    maxHeight: "min(calc(100vw * 9 / 16), calc(100dvh - 11.75rem))",
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="z-40 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="container px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-foreground hover:text-primary transition-colors p-1 -ml-1">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="font-heading font-semibold text-foreground text-sm sm:text-base truncate">{hostel.name}</h1>
          </div>
          <Link to="/saved" className="text-sm font-medium text-muted-foreground hover:text-primary">
            Saved
          </Link>
        </div>
      </header>

      <main className="pb-40 sm:pb-44">
        <div className="w-full bg-black">
          <div className="relative mx-auto w-full max-w-5xl" style={videoShellStyle}>
            <video
              ref={videoRef}
              src={hostel.video}
              controls
              playsInline
              preload="metadata"
              className="absolute inset-0 h-full w-full object-contain bg-black"
              poster={hostel.images?.[0]}
            />
          </div>
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-2 px-4 py-2">
            <button
              type="button"
              onClick={handleFullscreen}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary/80"
            >
              <Maximize className="h-3.5 w-3.5" />
              Full screen
            </button>
            <button
              type="button"
              onClick={handlePictureInPicture}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary/80"
            >
              <PictureInPicture2 className="h-3.5 w-3.5" />
              Picture in picture
            </button>
            <p className="w-full text-center text-[11px] text-muted-foreground sm:w-auto sm:text-left">
              Browser video controls still support playback, fullscreen, and PiP where available.
            </p>
          </div>
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
            <div className="flex items-center justify-between">
              <h2 className="font-heading font-bold text-lg sm:text-xl md:text-2xl text-foreground">{hostel.name}</h2>
              <button
                type="button"
                onClick={toggleSave}
                className="rounded-full p-2 text-rose-500 hover:bg-secondary"
                aria-label={isSaved ? "Unsave" : "Save"}
              >
                <Heart className={`h-7 w-7 ${isSaved ? "fill-current" : ""}`} />
              </button>
            </div>
            <p className="text-primary font-heading font-semibold text-base sm:text-lg mt-1">{hostel.price}</p>
          </div>

          <p className="text-secondary-foreground text-sm leading-relaxed">{hostel.description}</p>

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
                Open in Google Maps
              </a>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden border border-border">
            <iframe
              title={`Map of ${hostel.name}`}
              src={mapsEmbedUrl}
              className="w-full h-64 sm:h-72"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <section className="rounded-2xl border border-border bg-card/70 p-4 space-y-3">
            <h3 className="font-heading text-base font-semibold">Comments & Complaints</h3>
            {!user ? (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">You can comment when you have an account.</p>
                <Link
                  to="/login"
                  className="inline-block rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold"
                >
                  Go to sign in
                </Link>
              </div>
            ) : (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!comment.trim()) return;
                  await createComment.mutateAsync(comment.trim());
                  setComment("");
                }}
                className="space-y-2"
              >
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write your complaint, review, or recommendation..."
                  className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm min-h-20"
                />
                <button type="submit" className="rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold">
                  Post comment
                </button>
              </form>
            )}

            <div className="space-y-2">
              {comments.length === 0 ? (
                <p className="text-sm text-muted-foreground">No comments yet. Start the discussion.</p>
              ) : (
                comments.map((item) => (
                  <article key={item.id} className="rounded-lg border border-border bg-secondary/60 p-3">
                    <p className="text-sm">{item.content}</p>
                    <p className="text-[11px] text-muted-foreground mt-1">{new Date(item.created_at).toLocaleString()}</p>
                  </article>
                ))
              )}
            </div>
          </section>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-30 p-3 sm:p-4 bg-background/90 backdrop-blur-md border-t border-border safe-bottom">
        <div className="flex gap-3 max-w-lg mx-auto">
          <a
            href={`tel:${hostel.phone}`}
            className="flex items-center justify-center gap-2 w-1/2 gradient-primary text-primary-foreground font-heading font-bold text-sm sm:text-base py-3.5 sm:py-4 rounded-xl shadow-glow transition-transform active:scale-[0.98]"
          >
            <Phone className="w-5 h-5" />
            Call
          </a>
          <button
            type="button"
            onClick={handleWhatsAppShare}
            className="flex items-center justify-center gap-2 w-1/2 bg-green-500 text-white font-heading font-bold text-sm sm:text-base py-3.5 sm:py-4 rounded-xl shadow-glow transition-transform active:scale-[0.98]"
          >
            Share
          </button>
        </div>
      </div>

      {lightboxIndex !== null && hostel.images && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center"
          onClick={() => setLightboxIndex(null)}
          onKeyDown={(e) => e.key === "Escape" && setLightboxIndex(null)}
          role="presentation"
        >
          <button
            type="button"
            onClick={() => setLightboxIndex(null)}
            className="absolute top-4 right-4 text-foreground/80 hover:text-foreground z-10"
            aria-label="Close"
          >
            <X className="w-7 h-7" />
          </button>
          {hostel.images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((lightboxIndex - 1 + hostel.images.length) % hostel.images.length);
                }}
                className="absolute left-3 text-foreground/80 hover:text-foreground z-10"
                aria-label="Previous"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((lightboxIndex + 1) % hostel.images.length);
                }}
                className="absolute right-3 text-foreground/80 hover:text-foreground z-10"
                aria-label="Next"
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
