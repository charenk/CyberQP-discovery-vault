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
  // Always call hooks at the top level - never conditionally
  // Check conditions inside the effect instead
  useEffect(() => {
    // Early return inside effect (not a hook call)
    if (isStorybook() || !persistFilters) {
      return
    }

    // Only run in Next.js environment with persistence enabled
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

    // Update URL using browser history API
    const newUrl = `${window.location.pathname}?${params.toString()}`
    window.history.replaceState({}, '', newUrl)
  }, [filterState.appliedFilters, filterState.globalSearch, persistFilters, onFilterChange])

  return null
}
