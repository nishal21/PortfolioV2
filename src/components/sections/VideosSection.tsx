'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Play, X, Youtube } from 'lucide-react';
import StudioSection from '@/components/layout/StudioSection';
import ReelShowcase from '@/components/sections/ReelShowcase';
import ImageFrame from '@/components/ui/ImageFrame';
import ModalPortal, { useModalLock } from '@/components/ui/ModalPortal';
import { videos, videoCategories } from '@/data/videos';
import type { Video } from '@/data/videos';

const modalEase = { duration: 0.18, ease: [0.22, 1, 0.36, 1] as const };

function videoCategoryLabel(id: string) {
  return videoCategories.find((c) => c.id === id)?.label ?? id;
}

function VideoModal({ video, onClose }: { video: Video; onClose: () => void }) {
  useModalLock(true);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const watchHref = `https://youtube.com/watch?v=${video.youtubeId}`;

  return (
    <ModalPortal>
      <motion.div
        className="studio-modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={modalEase}
        onClick={onClose}
        role="presentation"
      >
        <motion.div
          className="studio-modal studio-modal--video"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={modalEase}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="video-modal-title"
        >
          <div className="studio-modal-head">
            <div className="studio-modal-head-main">
              <p className="studio-meta">{videoCategoryLabel(video.category)}</p>
              <h3 id="video-modal-title" className="studio-modal-title">
                {video.title}
              </h3>
            </div>
            <button type="button" onClick={onClose} className="hit-target studio-modal-close shrink-0" aria-label="Close">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="studio-modal-body">
            <a
              href={watchHref}
              target="_blank"
              rel="noopener noreferrer"
              className="studio-modal-video-hit hit-target"
              aria-label={`Watch ${video.title} on YouTube`}
            >
              <ImageFrame
                src={video.thumbnail}
                alt=""
                aspect="wide"
                fit="cover"
                loading="eager"
                className="border-0 studio-modal-cover studio-modal-cover--video"
              />
              <span className="studio-modal-video-play" aria-hidden="true">
                <Play className="ml-0.5 h-5 w-5 fill-current" />
              </span>
              <span className="studio-modal-video-duration">{video.duration}</span>
            </a>

            <div className="studio-modal-content">
              <p className="studio-modal-meta">
                {video.views} views · {video.date}
              </p>
              <p className="studio-modal-copy">{video.description}</p>
              {video.tags.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {video.tags.slice(0, 4).map((tag) => (
                    <span key={tag} className="studio-chip studio-chip--sm">
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          <div className="studio-modal-actions" role="group" aria-label="Video links">
            <a
              href={watchHref}
              target="_blank"
              rel="noopener noreferrer"
              className="hit-target studio-modal-action studio-modal-action--primary studio-modal-action--warm"
            >
              <Youtube className="h-4 w-4 shrink-0" aria-hidden />
              <span>Watch on YouTube</span>
            </a>
          </div>
        </motion.div>
      </motion.div>
    </ModalPortal>
  );
}

export default function VideosSection() {
  const [selected, setSelected] = useState<Video | null>(null);
  const featured = videos[0] ?? null;
  const cuts = featured ? videos.filter((v) => v.id !== featured.id) : videos;

  return (
    <>
      <StudioSection id="videos" label="Reel" title="AMV edits & remixes" accent="warm" chrome={false}>
        <ReelShowcase featured={featured} cuts={cuts} onOpen={setSelected} />
      </StudioSection>

      <AnimatePresence>
        {selected ? <VideoModal key={selected.id} video={selected} onClose={() => setSelected(null)} /> : null}
      </AnimatePresence>
    </>
  );
}
