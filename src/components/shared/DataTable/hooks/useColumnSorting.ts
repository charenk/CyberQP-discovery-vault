import { useState, useCallback } from 'react'
import { SortState, SortDirection } from '../types'

export interface UseColumnSortingOptions {
  initialSort?: SortState
  onSortChange?: (sort: SortState) => void
  primaryColumnId?: string
}

export function useColumnSorting({ initialSort, onSortChange, primaryColumnId }: UseColumnSortingOptions = {}) {
  const [sortState, setSortState] = useState<SortState>(
    initialSort || {
      columnId: primaryColumnId || null,
      direction: primaryColumnId ? 'asc' : null,
    }
  )

  const toggleSort = useCallback(
    (columnId: string) => {
      setSortState((prev) => {
        let newDirection: SortDirection = 'asc'

        if (prev.columnId === columnId) {
          if (prev.direction === 'asc') {
            newDirection = 'desc'
          } else if (prev.direction === 'desc') {
            newDirection = null
            return { columnId: null, direction: null }
          }
        }

        const newState = {
          columnId,
          direction: newDirection,
        }

        onSortChange?.(newState)
        return newState
      })
    },
    [onSortChange]
  )

  const clearSort = useCallback(() => {
    setSortState({ columnId: null, direction: null })
    onSortChange?.({ columnId: null, direction: null })
  }, [onSortChange])

  return {
    sortState,
    toggleSort,
    clearSort,
  }
}

