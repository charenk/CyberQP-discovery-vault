import { useState, useCallback } from 'react'

export interface UseRowExpansionOptions {
  onRowExpand?: (rowId: string | number, isExpanded: boolean) => void
}

export function useRowExpansion({ onRowExpand }: UseRowExpansionOptions = {}) {
  const [expandedRows, setExpandedRows] = useState<Set<string | number>>(new Set())

  const toggleRow = useCallback(
    (rowId: string | number) => {
      setExpandedRows((prev) => {
        const newExpanded = new Set(prev)
        const isExpanded = newExpanded.has(rowId)

        if (isExpanded) {
          newExpanded.delete(rowId)
        } else {
          newExpanded.add(rowId)
        }

        onRowExpand?.(rowId, !isExpanded)
        return newExpanded
      })
    },
    [onRowExpand]
  )

  const isRowExpanded = useCallback(
    (rowId: string | number) => {
      return expandedRows.has(rowId)
    },
    [expandedRows]
  )

  const collapseAll = useCallback(() => {
    setExpandedRows(new Set())
  }, [])

  const expandAll = useCallback((rowIds: (string | number)[]) => {
    setExpandedRows(new Set(rowIds))
  }, [])

  return {
    expandedRows,
    toggleRow,
    isRowExpanded,
    collapseAll,
    expandAll,
  }
}

