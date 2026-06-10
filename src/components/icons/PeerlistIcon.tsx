interface PeerlistIconProps {
  className?: string;
}

/** Peerlist mark (monochrome for footer/social row). */
export default function PeerlistIcon({ className = 'h-5 w-5' }: PeerlistIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm1 4v8h2.1c2.35 0 3.9-1.45 3.9-4s-1.55-4-3.9-4H7Zm2 1.75h.85c1.35 0 2.15.75 2.15 2.25s-.8 2.25-2.15 2.25H9V9.75Z" />
    </svg>
  );
}
