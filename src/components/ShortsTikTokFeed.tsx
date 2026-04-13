import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import type { HostelShort } from "@/hooks/useShorts";

interface ShortsTikTokFeedProps {
  shorts: HostelShort[];
}

const SLIDE =
  "min-h-[calc(100dvh-10.5rem)] sm:min-h-[calc(100dvh-9rem)] lg:min-h-[calc(100dvh-6rem)]";

/** TikTok-style vertical snap: scroll up/down one short at a time; active clip plays. */
const ShortsTikTokFeed = ({ shorts }: ShortsTikTokFeedProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const videoById = useRef<Map<string, HTMLVideoElement>>(new Map());
  const [searchParams] = useSearchParams();
  const startRaw = searchParams.get("start");
  const startIdx = Math.max(0, Math.min(shorts.length - 1, parseInt(startRaw || "0", 10) || 0));

  useEffect(() => {
    const root = scrollRef.current;
    if (!root || shorts.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { root, threshold: [0, 0.35, 0.5, 0.65, 1] },
    );

    shorts.forEach((s) => {
      const v = videoById.current.get(s.id);
      if (v) observer.observe(v);
    });

    return () => {
      videoById.current.forEach((v) => observer.unobserve(v));
      observer.disconnect();
    };
  }, [shorts]);

  useEffect(() => {
    if (startIdx <= 0 || !scrollRef.current) return;
    const el = scrollRef.current.querySelector(`[data-short-index="${startIdx}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [startIdx, shorts.length]);

  return (
    <div
      ref={scrollRef}
      className="h-[calc(100dvh-10.5rem)] sm:h-[calc(100dvh-9rem)] lg:h-[calc(100dvh-6rem)] overflow-y-auto snap-y snap-mandatory overscroll-y-contain scrollbar-hide [scroll-behavior:smooth]"
    >
      {shorts.map((short, i) => (
        <div
          key={short.id}
          data-short-index={i}
          className={`snap-start ${SLIDE} flex flex-col bg-black border-b border-border/40`}
        >
          <div className="relative flex-1 min-h-[52vh] w-full max-w-lg mx-auto">
            <video
              ref={(el) => {
                if (el) videoById.current.set(short.id, el);
                else videoById.current.delete(short.id);
              }}
              src={short.video_url}
              className="absolute inset-0 h-full w-full object-cover"
              playsInline
              loop
              muted
              controls
              preload="metadata"
              onClick={(e) => {
                const v = e.currentTarget;
                v.muted = !v.muted;
              }}
            />
            <p className="absolute top-2 left-0 right-0 text-center text-[10px] text-white/60 pointer-events-none px-2">
              Tap video for sound · Swipe up for next
            </p>
          </div>
          <div className="shrink-0 px-4 py-3 bg-background border-t border-border space-y-1">
            <p className="font-heading font-semibold">{short.title}</p>
            <p className="text-sm text-primary">{short.price}</p>
            <p className="text-xs text-muted-foreground">{short.location}</p>
            <p className="text-sm text-muted-foreground line-clamp-3">{short.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ShortsTikTokFeed;
