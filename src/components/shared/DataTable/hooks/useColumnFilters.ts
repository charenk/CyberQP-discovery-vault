import { useState, useCallback, useMemo } from 'react'
import { ColumnFilter, FilterState } from '../types'

export interface UseColumnFiltersOptions {
  initialFilters?: Partial<FilterState>
  onFilterChange?: (filters: FilterState) => void
}

export function useColumnFilters({ initialFilters, onFilterChange }: UseColumnFiltersOptions = {}) {
  const [filterState, setFilterState] = useState<FilterState>({
    columnFilters: {},
    globalSearch: '',
    appliedFilters: initialFilters?.appliedFilters || {},
    pendingFilters: {},
  })

  const updateFilter = useCallback((columnId: string, value: any, operator: ColumnFilter['operator'] = 'contains') => {
    setFilterState((prev) => {
      const newPendingFilters = {
        ...prev.pendingFilters,
        [columnId]: { columnId, value, operator },
      }

      return {
        ...prev,
        pendingFilters: newPendingFilters,
      }
    })
  }, [])

  const applyFilters = useCallback(() => {
    setFilterState((prev) => {
      const newState = {
        ...prev,
        appliedFilters: { ...prev.pendingFilters },
        pendingFilters: {},
      }

      onFilterChange?.(newState)
      return newState
    })
  }, [onFilterChange])

  const clearFilter = useCallback((columnId: string) => {
    setFilterState((prev) => {
      const newPendingFilters = { ...prev.pendingFilters }
      const newAppliedFilters = { ...prev.appliedFilters }
      delete newPendingFilters[columnId]
      delete newAppliedFilters[columnId]

      const newState = {
        ...prev,
        pendingFilters: newPendingFilters,
        appliedFilters: newAppliedFilters,
      }

      onFilterChange?.(newState)
      return newState
    })
  }, [onFilterChange])

  const clearAllFilters = useCallback(() => {
    setFilterState((prev) => {
      const newState = {
        ...prev,
        pendingFilters: {},
        appliedFilters: {},
        columnFilters: {},
      }

      onFilterChange?.(newState)
      return newState
    })
  }, [onFilterChange])

  const updateGlobalSearch = useCallback((search: string) => {
    setFilterState((prev) => {
      const newState = {
        ...prev,
        globalSearch: search,
      }

      onFilterChange?.(newState)
      return newState
    })
  }, [onFilterChange])

  const hasPendingFilters = useMemo(() => {
    return Object.keys(filterState.pendingFilters).length > 0
  }, [filterState.pendingFilters])

  const hasAppliedFilters = useMemo(() => {
    return Object.keys(filterState.appliedFilters).length > 0 || filterState.globalSearch.length > 0
  }, [filterState.appliedFilters, filterState.globalSearch])

  return {
    filterState,
    updateFilter,
    applyFilters,
    clearFilter,
    clearAllFilters,
    updateGlobalSearch,
    hasPendingFilters,
    hasAppliedFilters,
  }
}

