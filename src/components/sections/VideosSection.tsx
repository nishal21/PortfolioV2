'use client';

import { useEffect, useState } from 'react';
import { Play, X, Youtube } from 'lucide-react';
import StudioSection from '@/components/layout/StudioSection';
import ShowcaseStage from '@/components/sections/ShowcaseStage';
import ImageFrame from '@/components/ui/ImageFrame';
import ModalPortal, { useModalLock } from '@/components/ui/ModalPortal';
import { videos, videoCategories } from '@/data/videos';
import type { Video } from '@/data/videos';

function VideoModal({ video, onClose }: { video: Video; onClose: () => void }) {
  useModalLock(true);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <ModalPortal>
      <div className="studio-modal-backdrop" onClick={onClose} role="presentation">
        <div className="studio-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
          <div className="studio-modal-head">
            <h3 className="studio-modal-title min-w-0 flex-1">{video.title}</h3>
            <button type="button" onClick={onClose} className="cursor-hover studio-modal-close shrink-0" aria-label="Close">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="studio-modal-body">
            <ImageFrame
              src={video.thumbnail}
              alt={video.title}
              aspect="wide"
              fit="cover"
              className="border-0 studio-modal-cover"
            />
            <div className="studio-modal-content">
              <p className="studio-modal-copy">{video.description}</p>
              <div className="flex flex-wrap gap-2">
                {video.tags.map((tag) => (
                  <span key={tag} className="studio-chip studio-chip--sm">
                    {tag}
                  </span>
                ))}
              </div>
              <p className="studio-modal-meta">
                {video.views} views · {video.date}
              </p>
            </div>
          </div>
          <div className="studio-modal-actions" role="group" aria-label="Video links">
            <a
              href={`https://youtube.com/watch?v=${video.youtubeId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-hover studio-modal-action studio-modal-action--primary studio-modal-action--warm"
            >
              <Youtube className="h-4 w-4 shrink-0" aria-hidden />
              <span>Watch</span>
            </a>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}

export default function VideosSection() {
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState<Video | null>(null);

  const filtered = filter === 'all' ? videos : videos.filter((v) => v.category === filter);
  const featured = filter === 'all' ? videos[0] : filtered[0];
  const reel = filter === 'all' ? filtered.slice(1) : filtered.slice(featured ? 1 : 0);

  return (
    <>
      <StudioSection
        id="videos"
        label="Reel"
        title="Moving Image"
        description="AMV edits and remixes on @DemonKing0.___"
        accent="warm"
      >
        <ShowcaseStage
          accent="warm"
          flagship={
            featured ? (
              <article
                className="studio-flagship studio-flagship--video cursor-hover group"
                onClick={() => setSelected(featured)}
                onKeyDown={(e) => e.key === 'Enter' && setSelected(featured)}
                role="button"
                tabIndex={0}
              >
                <div className="studio-flagship-media">
                  <ImageFrame src={featured.thumbnail} alt={featured.title} aspect="wide" className="border-0" />
                  <div className="studio-play">
                    <Play className="ml-0.5 h-7 w-7 text-white" />
                  </div>
                  <span className="studio-duration">{featured.duration}</span>
                </div>
                <div className="studio-flagship-copy">
                  <p className="studio-meta">Featured premiere</p>
                  <h3 className="studio-flagship-title">{featured.title}</h3>
                  <p className="studio-flagship-desc">{featured.description}</p>
                  <p className="studio-flagship-stats">
                    {featured.views} views · {featured.date}
                  </p>
                </div>
              </article>
            ) : (
              <p className="studio-empty">No videos in this category yet.</p>
            )
          }
          filters={
            <div className="studio-filter-row">
              {videoCategories.map((cat) => {
                const count =
                  cat.id === 'all' ? videos.length : videos.filter((v) => v.category === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setFilter(cat.id)}
                    className={`cursor-hover studio-filter ${filter === cat.id ? 'active' : ''}`}
                  >
                    {cat.label} ({count})
                  </button>
                );
              })}
            </div>
          }
          reel={
            <>
              {reel.map((video) => (
                <article
                  key={video.id}
                  className="studio-reel-card studio-reel-card--video cursor-hover"
                  onClick={() => setSelected(video)}
                  onKeyDown={(e) => e.key === 'Enter' && setSelected(video)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="relative">
                    <ImageFrame src={video.thumbnail} alt={video.title} className="border-0" />
                    <div className="studio-play studio-play--sm">
                      <Play className="ml-0.5 h-5 w-5 text-white" />
                    </div>
                    <span className="studio-duration">{video.duration}</span>
                  </div>
                  <div className="studio-reel-meta">
                    <h4 className="studio-reel-title">{video.title}</h4>
                    <p className="studio-reel-stats">
                      {video.views} views · {video.date}
                    </p>
                  </div>
                </article>
              ))}
            </>
          }
        />
      </StudioSection>

      {selected ? <VideoModal video={selected} onClose={() => setSelected(null)} /> : null}
    </>
  );
}
