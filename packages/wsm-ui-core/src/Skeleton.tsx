import { CSSProperties } from 'react';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'circular' | 'rectangular';
  className?: string;
  style?: CSSProperties;
}

export function Skeleton({ 
  width = '100%', 
  height = '1rem', 
  variant = 'rectangular',
  className = '',
  style = {}
}: SkeletonProps) {
  const baseClasses = 'animate-pulse bg-[var(--bg-secondary)] relative overflow-hidden';
  
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        ...style,
      }}
    >
      <div 
        className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent"
        style={{
          animation: 'shimmer 1.5s infinite',
        }}
      />
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-[var(--bg-secondary)] rounded-2xl overflow-hidden border border-[var(--border-color)]">
      {/* Image area */}
      <Skeleton height={240} variant="rectangular" className="rounded-none" />
      
      {/* Content area */}
      <div className="p-4 space-y-3">
        {/* Badge */}
        <Skeleton width={60} height={20} variant="text" />
        
        {/* Title */}
        <Skeleton width="80%" height={24} variant="text" />
        
        {/* Description */}
        <Skeleton width="100%" height={16} variant="text" />
        <Skeleton width="70%" height={16} variant="text" />
        
        {/* Effects tags */}
        <div className="flex gap-2 pt-2">
          <Skeleton width={80} height={24} variant="text" />
          <Skeleton width={100} height={24} variant="text" />
        </div>
        
        {/* Price and button */}
        <div className="flex items-center justify-between pt-4">
          <Skeleton width={80} height={28} variant="text" />
          <Skeleton width={120} height={40} variant="rectangular" />
        </div>
      </div>
    </div>
  );
}

export function BlogCardSkeleton() {
  return (
    <div className="bg-[var(--bg-secondary)] rounded-2xl overflow-hidden border border-[var(--border-color)]">
      {/* Image area */}
      <Skeleton height={200} variant="rectangular" className="rounded-none" />
      
      {/* Content area */}
      <div className="p-5 space-y-3">
        {/* Category and date */}
        <div className="flex items-center gap-3">
          <Skeleton width={70} height={20} variant="text" />
          <Skeleton width={90} height={16} variant="text" />
        </div>
        
        {/* Title */}
        <Skeleton width="100%" height={24} variant="text" />
        <Skeleton width="60%" height={24} variant="text" />
        
        {/* Description */}
        <Skeleton width="100%" height={16} variant="text" />
        <Skeleton width="90%" height={16} variant="text" />
        
        {/* Read more link */}
        <div className="pt-2">
          <Skeleton width={100} height={20} variant="text" />
        </div>
      </div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Header placeholder */}
      <div className="h-16 bg-[var(--bg-secondary)] border-b border-[var(--border-color)]" />
      
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page title */}
        <div className="mb-8">
          <Skeleton width={200} height={40} variant="text" />
          <Skeleton width={400} height={20} variant="text" className="mt-2" />
        </div>
        
        {/* Grid of cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="flex gap-2 mb-6">
          <Skeleton width={60} height={16} variant="text" />
          <Skeleton width={80} height={16} variant="text" />
          <Skeleton width={120} height={16} variant="text" />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product image */}
          <div>
            <Skeleton height={500} variant="rectangular" />
            <div className="flex gap-3 mt-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} width={80} height={80} variant="rectangular" />
              ))}
            </div>
          </div>
          
          {/* Product info */}
          <div className="space-y-6">
            <Skeleton width={100} height={24} variant="text" />
            <Skeleton width="80%" height={40} variant="text" />
            <Skeleton width="100%" height={20} variant="text" />
            <Skeleton width="90%" height={20} variant="text" />
            <Skeleton width="70%" height={20} variant="text" />
            
            {/* Price */}
            <div className="pt-4">
              <Skeleton width={150} height={48} variant="text" />
            </div>
            
            {/* Volume selector */}
            <div className="flex gap-3">
              <Skeleton width={100} height={48} variant="rectangular" />
              <Skeleton width={100} height={48} variant="rectangular" />
              <Skeleton width={100} height={48} variant="rectangular" />
            </div>
            
            {/* Add to cart button */}
            <Skeleton width="100%" height={56} variant="rectangular" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Skeleton;
