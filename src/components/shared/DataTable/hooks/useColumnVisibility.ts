import { useState, useCallback, useMemo, useEffect } from 'react'
import { ColumnDef } from '../types'

export interface UseColumnVisibilityOptions {
  columns: ColumnDef[]
  defaultVisibleColumns?: string[]
  onColumnVisibilityChange?: (visibleColumns: string[]) => void
  onColumnVisibilitySave?: (visibleColumns: string[]) => Promise<void>
  persistColumnVisibility?: boolean
}

export function useColumnVisibility({
  columns,
  defaultVisibleColumns,
  onColumnVisibilityChange,
  onColumnVisibilitySave,
  persistColumnVisibility = false,
}: UseColumnVisibilityOptions) {
  // Determine default columns (max 5, or from defaultVisibleColumns)
  const defaultColumns = useMemo(() => {
    if (defaultVisibleColumns) {
      return new Set(defaultVisibleColumns)
    }

    const visibleByDefault = columns
      .filter((col) => col.defaultVisible !== false)
      .slice(0, 5)
      .map((col) => col.id)

    return new Set(visibleByDefault)
  }, [columns, defaultVisibleColumns])

  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(defaultColumns)

  const toggleColumn = useCallback(
    (columnId: string) => {
      setVisibleColumns((prev) => {
        const newVisible = new Set(prev)
        if (newVisible.has(columnId)) {
          newVisible.delete(columnId)
        } else {
          newVisible.add(columnId)
        }

        const visibleArray = Array.from(newVisible)
        onColumnVisibilityChange?.(visibleArray)

        if (persistColumnVisibility && onColumnVisibilitySave) {
          onColumnVisibilitySave(visibleArray).catch(console.error)
        }

        return newVisible
      })
    },
    [onColumnVisibilityChange, persistColumnVisibility, onColumnVisibilitySave]
  )

  const resetToDefault = useCallback(() => {
    setVisibleColumns(new Set(defaultColumns))
    const defaultArray = Array.from(defaultColumns)
    onColumnVisibilityChange?.(defaultArray)

    if (persistColumnVisibility && onColumnVisibilitySave) {
      onColumnVisibilitySave(defaultArray).catch(console.error)
    }
  }, [defaultColumns, onColumnVisibilityChange, persistColumnVisibility, onColumnVisibilitySave])

  const isColumnVisible = useCallback(
    (columnId: string) => {
      return visibleColumns.has(columnId)
    },
    [visibleColumns]
  )

  const visibleColumnsArray = useMemo(() => {
    return Array.from(visibleColumns)
  }, [visibleColumns])

  return {
    visibleColumns: visibleColumnsArray,
    visibleColumnsSet: visibleColumns,
    toggleColumn,
    resetToDefault,
    isColumnVisible,
    defaultColumns: Array.from(defaultColumns),
  }
}

