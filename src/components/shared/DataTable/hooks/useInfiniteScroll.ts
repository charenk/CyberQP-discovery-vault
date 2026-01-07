import { useEffect, useRef, useState, useCallback } from 'react'
import { useInView } from 'react-intersection-observer'

export interface UseInfiniteScrollOptions {
  hasMore: boolean
  isLoading: boolean
  onLoadMore: () => Promise<any>
  threshold?: number
  rootMargin?: string
}

export function useInfiniteScroll({
  hasMore,
  isLoading,
  onLoadMore,
  threshold = 0.1,
  rootMargin = '100px',
}: UseInfiniteScrollOptions) {
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const { ref, inView } = useInView({
    threshold,
    rootMargin,
  })

  const loadMore = useCallback(async () => {
    if (isLoadingMore || isLoading || !hasMore) return

    setIsLoadingMore(true)
    try {
      await onLoadMore()
    } catch (error) {
      console.error('Error loading more data:', error)
    } finally {
      setIsLoadingMore(false)
    }
  }, [isLoadingMore, isLoading, hasMore, onLoadMore])

  useEffect(() => {
    if (inView && hasMore && !isLoading && !isLoadingMore) {
      loadMore()
    }
  }, [inView, hasMore, isLoading, isLoadingMore, loadMore])

  return {
    ref,
    isLoadingMore,
  }
}

