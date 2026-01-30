"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  ArrowRight,
  SkipForward,
  SkipBack,
  Loader2,
  Users,
  VideoOff,
  Globe,
  ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface VideoPlayerProps {
  src: string | null;
  title: string;
  category: string;
  year: number;
  creators: string;
  link: string | null;
  hasVideo: boolean;
}

export function VideoPlayer({ src, title, category, year, creators, link, hasVideo }: VideoPlayerProps) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isScrubbing, setIsScrubbing] = useState(false);
  
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const creatorList = creators ? creators.split(";").filter(n => n.trim() !== "") : [];

  useEffect(() => {
    if (!hasVideo) return;
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (!isScrubbing) {
        setCurrentTime(video.currentTime);
      }
    };
    const handleDurationChange = () => setDuration(video.duration);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleWaiting = () => setIsWaiting(true);
    const handlePlaying = () => setIsWaiting(false);

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("durationchange", handleDurationChange);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("playing", handlePlaying);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("durationchange", handleDurationChange);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("playing", handlePlaying);
    };
  }, [isScrubbing, hasVideo]);

  const togglePlay = async () => {
    if (videoRef.current && hasVideo) {
      try {
        if (isPlaying) {
          videoRef.current.pause();
        } else {
          await videoRef.current.play();
        }
      } catch (error) {
        console.error("Playback failed:", error);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    if (videoRef.current) {
      videoRef.current.currentTime = val;
    }
  };

  const onScrubStart = () => setIsScrubbing(true);
  const onScrubEnd = () => setIsScrubbing(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying && !isScrubbing) setShowControls(false);
    }, 3000);
  };

  const skip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 md:p-8">
      {/* Header / Back Button */}
      <div className="w-full max-w-5xl mb-6 flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={() => router.back()}
          className="text-white hover:bg-zinc-800 hover:text-white gap-2 rounded-xl transition-all active:scale-95"
        >
          <ArrowRight className="w-4 h-4" />
          العودة للمشاريع
        </Button>
        <div className="text-right">
            <span className="text-blue-500 text-xs font-bold uppercase tracking-widest">{category}</span>
            <h1 className="text-white font-bold text-xl">{title}</h1>
        </div>
      </div>

      {/* Video Player Container */}
      <div 
        ref={containerRef}
        onMouseMove={hasVideo ? handleMouseMove : undefined}
        className={cn(
          "relative w-full max-w-5xl bg-black rounded-3xl overflow-hidden shadow-2xl group border border-white/5 flex items-center justify-center",
          hasVideo ? "aspect-video" : "py-12"
        )}
      >
        {hasVideo ? (
          <>
            <video
              ref={videoRef}
              src={src || ""}
              className="w-full h-full cursor-pointer"
              onClick={togglePlay}
              playsInline
            />

            {/* Loading Spinner */}
            <AnimatePresence>
              {isWaiting && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none z-30"
                >
                  <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Big Play Overlay */}
            <AnimatePresence>
              {!isPlaying && !isWaiting && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePlay();
                  }}
                  className="absolute inset-0 flex items-center justify-center bg-black/20 cursor-pointer z-40"
                >
                  <div className="p-8 rounded-full bg-blue-600 text-white shadow-2xl shadow-blue-600/40 hover:scale-110 transition-transform duration-300">
                    <Play className="w-12 h-12 fill-current" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Controls Overlay */}
            <motion.div 
              initial={false}
              animate={{ 
                opacity: showControls || !isPlaying || isScrubbing ? 1 : 0, 
                y: showControls || !isPlaying || isScrubbing ? 0 : 20 
              }}
              className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 pt-12 z-50 transition-opacity duration-300"
            >
              {/* Progress Bar Container */}
              <div className="relative group/progress mb-4 h-6 flex items-center">
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  step="0.01"
                  value={currentTime}
                  onMouseDown={onScrubStart}
                  onMouseUp={onScrubEnd}
                  onTouchStart={onScrubStart}
                  onTouchEnd={onScrubEnd}
                  onChange={handleSeek}
                  className="absolute inset-0 w-full opacity-0 cursor-pointer z-10"
                />
                {/* Visual Rail */}
                <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden group-hover/progress:h-2 transition-all">
                  <div 
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                  />
                </div>
                {/* Thumb Indicator */}
                <div 
                  className="absolute w-4 h-4 bg-white rounded-full border-2 border-blue-600 shadow-md transform -translate-x-1/2 opacity-0 group-hover/progress:opacity-100 transition-opacity pointer-events-none"
                  style={{ left: `${(currentTime / (duration || 1)) * 100}%` }}
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 md:gap-4">
                  <button onClick={togglePlay} className="text-white hover:text-blue-500 transition-colors">
                    {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
                  </button>
                  
                  <div className="flex items-center gap-2">
                    <button onClick={() => skip(-10)} className="text-white/70 hover:text-white transition-colors">
                      <SkipBack className="w-5 h-5" />
                    </button>
                    <button onClick={() => skip(10)} className="text-white/70 hover:text-white transition-colors">
                      <SkipForward className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="text-white text-xs md:text-sm font-medium tabular-nums min-w-[100px]">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 group/volume">
                    <button onClick={toggleMute} className="text-white hover:text-blue-500 transition-colors">
                      {isMuted || volume === 0 ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-0 overflow-hidden group-hover/volume:w-24 transition-all duration-300 appearance-none bg-white/20 h-1.5 rounded-full cursor-pointer"
                    />
                  </div>

                  <button onClick={toggleFullscreen} className="text-white hover:text-blue-500 transition-colors">
                    {isFullscreen ? <Minimize className="w-6 h-6" /> : <Maximize className="w-6 h-6" />}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-white">
            <div className="p-4 rounded-3xl border-2 border-dashed border-white/10 bg-white/5">
              <VideoOff className="w-8 h-8 opacity-60" />
            </div>
            <p className="text-xs font-black uppercase tracking-[0.2em] opacity-60">Video Not Available</p>
          </div>
        )}
      </div>

      {/* Description / Info below player */}
      <div className="w-full max-w-5xl mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">عن المشروع</h2>
                  {link && (
                    <a 
                      href={link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" className="rounded-xl border-white/10 bg-white/5 text-white hover:bg-white/10 gap-2 h-10 font-bold">
                        <Globe className="w-4 h-4 text-blue-400" />
                        زيارة الموقع
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </a>
                  )}
                </div>
                <p className="text-zinc-400 leading-relaxed text-lg">
                    هذا الفيديو يستعرض تفاصيل المشروع ومراحل تطويره. يمكنكم مشاهدة العرض التوضيحي للتعرف على الابتكار وكيفية عمله والنتائج التي حققها الطلاب.
                </p>
              </div>

              {creatorList.length > 0 && (
                <div className="space-y-4 pt-8 border-t border-white/5">
                  <div className="flex items-center gap-2 text-white font-bold">
                    <Users className="w-5 h-5 text-blue-500" />
                    <h3>المبتكرون</h3>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {creatorList.map((name, i) => (
                      <span key={i} className="px-4 py-2 rounded-2xl bg-zinc-900 border border-white/5 text-zinc-300 font-medium">
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
          </div>
          <div className="p-6 rounded-3xl bg-zinc-900 border border-white/5 space-y-6 self-start">
              <div>
                  <p className="text-zinc-500 text-sm mb-1">المدرسة</p>
                  <p className="text-white font-medium">مدرسة النور الدولية</p>
              </div>
              <div>
                  <p className="text-zinc-500 text-sm mb-1">السنة</p>
                  <p className="text-white font-medium">معرض الابتكار {year}</p>
              </div>
              {year === new Date().getFullYear() && (
                <div className="pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2 text-blue-500 font-bold">
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                      عرض حي متوفر في المعرض
                    </div>
                </div>
              )}
          </div>
      </div>
    </div>
  );
}