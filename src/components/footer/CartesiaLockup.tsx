import Image from 'next/image';

/**
 * Cartesia Startups lockup.
 * Official SVG from cartesia.ai/brand was not freely fetchable without the brand pack,
 * so this ships a clearly marked placeholder. Swap public/cartesia-startups-lockup.svg
 * with the official Startup lockup when you download it from https://www.cartesia.ai/brand
 */
export default function CartesiaLockup() {
  return (
    <a
      href="https://www.cartesia.ai"
      target="_blank"
      rel="noopener noreferrer"
      className="cartesia-lockup"
      title="Voice by Cartesia — Startups grant"
    >
      <Image
        src="/cartesia-startups-lockup.svg"
        alt="Cartesia Startups (placeholder lockup — replace with official brand SVG)"
        width={180}
        height={36}
        unoptimized
      />
      <span className="cartesia-lockup-note">Voice by Cartesia · Startups</span>
    </a>
  );
}
