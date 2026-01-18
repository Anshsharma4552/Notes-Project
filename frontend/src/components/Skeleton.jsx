const Skeleton = ({ className = '' }) => {
  return (
    <div className={`skeleton ${className}`}></div>
  );
};

export const NoteCardSkeleton = () => {
  return (
    <div className="card p-4">
      <Skeleton className="h-6 w-3/4 mb-3" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-5/6 mb-4" />
      <div className="flex space-x-2 mb-3">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <Skeleton className="h-3 w-24" />
    </div>
  );
};

export default Skeleton;

