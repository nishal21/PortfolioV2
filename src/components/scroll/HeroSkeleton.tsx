import Skeleton from '@/components/ui/Skeleton';

export default function HeroSkeleton() {
  return (
    <div className="hero-skeleton page-container relative z-10" aria-busy="true" aria-label="Loading hero">
      <Skeleton className="h-3 w-36" rounded="sm" />
      <Skeleton className="mt-4 h-[clamp(2.75rem,11vw,5.75rem)] w-[min(18rem,78vw)]" rounded="lg" />
      <Skeleton className="mt-2 h-8 w-28" rounded="md" />
      <Skeleton className="mt-5 h-4 w-full max-w-xs" rounded="sm" />
      <Skeleton className="mt-2 h-4 w-4/5 max-w-[14rem]" rounded="sm" />
      <div className="mt-6 flex gap-6">
        <Skeleton className="h-4 w-16" rounded="sm" />
        <Skeleton className="h-4 w-14" rounded="sm" />
      </div>
    </div>
  );
}
