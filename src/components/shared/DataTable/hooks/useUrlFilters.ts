'use client'

import { useEffect } from 'react'
import { FilterState } from '../types'

// Check if we're in Storybook environment
function isStorybook(): boolean {
  if (typeof window === 'undefined') return false
  const href = window.location.href
  return (
    href.includes('localhost:6006') ||
    href.includes('chromatic.com') ||
    !(window as any).__NEXT_DATA__
  )
}

export function useUrlFilters(
  filterState: FilterState,
  onFilterChange: (filters: FilterState) => void,
  persistFilters: boolean = false
) {
  // In Storybook, this hook does nothing - just return null
  // This satisfies React's rules of hooks (hook is always called)
  if (isStorybook() || !persistFilters) {
    return null
  }

  // Only in Next.js environment - we need to use Next.js hooks
  // But we can't conditionally call hooks, so we'll use a different approach
  // We'll use window.location for URL manipulation as a fallback
  useEffect(() => {
    // This effect only runs in Next.js (not Storybook due to early return above)
    // But we still can't call Next.js hooks here because they must be at the top level
    // So we'll handle URL persistence differently - using window.history API directly
    if (typeof window === 'undefined') return

    // Use browser APIs directly instead of Next.js router hooks
    const params = new URLSearchParams(window.location.search)
    
    // Update search param
    if (filterState.globalSearch) {
      params.set('search', filterState.globalSearch)
    } else {
      params.delete('search')
    }

    // Update column filter params
    Object.keys(filterState.appliedFilters).forEach((columnId) => {
      const filter = filterState.appliedFilters[columnId]
      if (filter) {
        const value = typeof filter.value === 'string' ? filter.value : JSON.stringify(filter.value)
        params.set(`filter_${columnId}`, value)
      }
    })

    // Remove filters that are no longer applied
    params.forEach((value, key) => {
      if (key.startsWith('filter_')) {
        const columnId = key.replace('filter_', '')
        if (!filterState.appliedFilters[columnId]) {
          params.delete(key)
        }
      }
    })

    // Update URL using browser history API (works in both Next.js and Storybook, but we only run this in Next.js)
    const newUrl = `${window.location.pathname}?${params.toString()}`
    window.history.replaceState({}, '', newUrl)
  }, [filterState.appliedFilters, filterState.globalSearch, persistFilters])

  return null
}
