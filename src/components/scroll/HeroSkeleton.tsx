import Skeleton from '@/components/ui/Skeleton';

export default function HeroSkeleton() {
  return (
    <div className="hero-skeleton-full" aria-busy="true" aria-label="Loading hero">
      <div className="hero-skeleton-full__scrim" aria-hidden="true" />
      <div className="page-container hero-skeleton-full__wrap">
        <div className="hero-skeleton-full__content">
          <Skeleton className="h-3 w-36" rounded="sm" />
          <Skeleton className="mt-4 h-[clamp(2.75rem,11vw,5.75rem)] w-[min(18rem,78vw)]" rounded="lg" />
          <Skeleton className="mt-2 h-8 w-28" rounded="md" />
          <Skeleton className="mt-5 h-4 w-full max-w-xs" rounded="sm" />
          <Skeleton className="mt-2 h-4 w-4/5 max-w-[14rem]" rounded="sm" />
          <div className="hero-skeleton-links mt-6 flex gap-6">
            <Skeleton className="h-4 w-16" rounded="sm" />
            <Skeleton className="h-4 w-14" rounded="sm" />
          </div>
        </div>
      </div>
    </div>
  );
}
