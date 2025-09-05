import { useState, useEffect, useCallback } from 'react';

interface UseImageWithFallbackOptions {
  src: string | undefined;
  fallbackSrcs?: string[];
}

export function useImageWithFallback({ src, fallbackSrcs = [] }: UseImageWithFallbackOptions) {
  const [currentSrc, setCurrentSrc] = useState<string | undefined>(src);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [fallbackIndex, setFallbackIndex] = useState(-1);

  useEffect(() => {
    if (!src) {
      setIsLoading(false);
      setHasError(true);
      setCurrentSrc(undefined);
      return;
    }

    setCurrentSrc(src);
    setIsLoading(true);
    setHasError(false);
    setFallbackIndex(-1);
  }, [src]);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
  }, []);

  const handleError = useCallback(() => {
    setIsLoading(false);
    
    const nextFallbackIndex = fallbackIndex + 1;
    if (nextFallbackIndex < fallbackSrcs.length) {
      setFallbackIndex(nextFallbackIndex);
      setCurrentSrc(fallbackSrcs[nextFallbackIndex]);
      setIsLoading(true);
      setHasError(false);
    } else {
      setHasError(true);
      setCurrentSrc(undefined);
    }
  }, [fallbackIndex, fallbackSrcs]);

  return {
    src: currentSrc,
    isLoading,
    hasError,
    onLoad: handleLoad,
    onError: handleError,
  };
}
