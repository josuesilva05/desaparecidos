import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function PersonDetailsLoading() {
  return (
    <div className="min-h-screen w-full bg-[#faf9f6] dark:bg-gray-900 relative">
      {/* Paper Texture */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.12) 1px, transparent 0)`,
          backgroundSize: "8px 8px",
        }}
      />
      {/* Dark mode texture overlay */}
      <div
        className="absolute inset-0 z-0 dark:block hidden"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)`,
          backgroundSize: "8px 8px",
        }}
      />
      
      <div className="relative z-10 container mx-auto p-6">
        <div className="space-y-6">
          {/* Header skeleton */}
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-24 rounded-md" />
            <Skeleton variant="shimmer" className="h-8 w-48" />
          </div>

          {/* Main content skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column - Main info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image and basic info card */}
              <Card className="bg-white dark:bg-[#0c0d18] border border-gray-200 dark:border-gray-700">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Image skeleton */}
                    <div className="md:w-64 md:h-64 w-full h-48 rounded-lg overflow-hidden">
                      <Skeleton variant="shimmer" className="w-full h-full" />
                    </div>
                    
                    {/* Info skeleton */}
                    <div className="flex-1 space-y-4">
                      <div className="space-y-2">
                        <Skeleton variant="shimmer" className="h-8 w-3/4" />
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-6 w-20 rounded-full" />
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        {Array.from({ length: 4 }).map((_, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <Skeleton className="h-4 w-4 rounded" />
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-4 w-24" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Description card skeleton */}
              <Card className="bg-white dark:bg-[#0c0d18] border border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <Skeleton className="h-6 w-40" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-4/5" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right column - Additional info */}
            <div className="space-y-6">
              {/* Location card skeleton */}
              <Card className="bg-white dark:bg-[#0c0d18] border border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <Skeleton className="h-4 w-4 mt-0.5" />
                      <div className="flex-1 space-y-1">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Skeleton className="h-4 w-4 mt-0.5" />
                      <Skeleton className="h-4 w-28" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact card skeleton */}
              <Card className="bg-white dark:bg-[#0c0d18] border border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <Skeleton className="h-6 w-36" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Skeleton className="h-10 w-full rounded-md" />
                    <div className="text-center">
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-3/4 mx-auto" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Information list skeleton */}
              <Card className="bg-white dark:bg-[#0c0d18] border border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-8 w-20 rounded" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-20" />
                          </div>
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-5/6" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
