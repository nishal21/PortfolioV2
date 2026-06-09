import Skeleton from '@/components/ui/Skeleton';

function SectionSkeleton({ blocks = 3 }: { blocks?: number }) {
  return (
    <section className="studio-skeleton-section page-container">
      <Skeleton className="h-3 w-20" rounded="sm" />
      <Skeleton className="mt-4 h-9 w-48 max-w-[70%]" rounded="lg" />
      <Skeleton className="mt-3 h-4 w-full max-w-md" rounded="sm" />
      <div className="mt-8 space-y-3">
        {Array.from({ length: blocks }, (_, i) => (
          <Skeleton
            key={i}
            className={`h-4 ${i === blocks - 1 ? 'w-2/3' : 'w-full'}`}
            rounded="sm"
          />
        ))}
      </div>
    </section>
  );
}

export default function MainContentSkeleton() {
  return (
    <div className="studio-skeleton" aria-busy="true" aria-label="Loading content">
      <SectionSkeleton blocks={4} />
      <SectionSkeleton blocks={3} />
      <section className="studio-skeleton-section page-container">
        <Skeleton className="h-3 w-24" rounded="sm" />
        <Skeleton className="mt-4 h-9 w-40 max-w-[60%]" rounded="lg" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="aspect-[16/10] w-full" rounded="lg" />
          ))}
        </div>
      </section>
    </div>
  );
}
