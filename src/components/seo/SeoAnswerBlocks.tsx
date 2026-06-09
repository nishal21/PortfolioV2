import Link from 'next/link';
import { seoAnswerBlocks } from '@/data/seo-content';

interface SeoAnswerBlocksProps {
  className?: string;
  showHeading?: boolean;
}

export default function SeoAnswerBlocks({ className = '', showHeading = true }: SeoAnswerBlocksProps) {
  return (
    <section className={`studio-aeo ${className}`} aria-labelledby="profile-answers-heading">
      {showHeading ? (
        <h2 id="profile-answers-heading" className="studio-aeo-heading">
          Profile
        </h2>
      ) : null}
      <div className="studio-aeo-grid">
        {seoAnswerBlocks.map((block) => (
          <article key={block.id} id={block.id} className="studio-aeo-card seo-speakable">
            <h3 className="studio-aeo-question">{block.question}</h3>
            <p className="studio-aeo-answer">{block.answer}</p>
          </article>
        ))}
      </div>
      <p className="studio-aeo-footer">
        <Link href="/projects" className="text-[var(--studio-accent)] hover:underline">
          All projects
        </Link>
        {' · '}
        <Link href="/about" className="text-[var(--studio-accent)] hover:underline">
          About
        </Link>
        {' · '}
        <Link href="/" className="text-[var(--studio-accent)] hover:underline">
          Portfolio home
        </Link>
      </p>
    </section>
  );
}
