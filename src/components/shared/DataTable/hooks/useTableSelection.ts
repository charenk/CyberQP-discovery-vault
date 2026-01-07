import { useState, useCallback, useMemo, useEffect } from 'react'

export interface UseTableSelectionOptions<T = any> {
  data: T[]
  getRowId: (row: T) => string | number
  selectedRowIds?: (string | number)[]
  onSelectionChange?: (selectedRows: T[]) => void
}

export function useTableSelection<T = any>({
  data,
  getRowId,
  selectedRowIds: controlledSelectedIds,
  onSelectionChange,
}: UseTableSelectionOptions<T>) {
  const [internalSelectedIds, setInternalSelectedIds] = useState<Set<string | number>>(new Set())

  const isControlled = controlledSelectedIds !== undefined
  const selectedIds = isControlled
    ? new Set(controlledSelectedIds)
    : internalSelectedIds

  const toggleRow = useCallback(
    (rowId: string | number) => {
      const newSelectedIds = new Set(selectedIds)
      if (newSelectedIds.has(rowId)) {
        newSelectedIds.delete(rowId)
      } else {
        newSelectedIds.add(rowId)
      }

      if (!isControlled) {
        setInternalSelectedIds(newSelectedIds)
      }

      const selectedRows = data.filter((row) => newSelectedIds.has(getRowId(row)))
      onSelectionChange?.(selectedRows)
    },
    [selectedIds, data, getRowId, isControlled, onSelectionChange]
  )

  const toggleAll = useCallback(() => {
    const allRowIds = data.map((row) => getRowId(row))
    const allSelected = allRowIds.every((id) => selectedIds.has(id))

    const newSelectedIds = allSelected ? new Set<string | number>() : new Set(allRowIds)

    if (!isControlled) {
      setInternalSelectedIds(newSelectedIds)
    }

    const selectedRows = data.filter((row) => newSelectedIds.has(getRowId(row)))
    onSelectionChange?.(selectedRows)
  }, [data, selectedIds, getRowId, isControlled, onSelectionChange])

  const clearSelection = useCallback(() => {
    if (!isControlled) {
      setInternalSelectedIds(new Set())
    }
    onSelectionChange?.([])
  }, [isControlled, onSelectionChange])

  const isRowSelected = useCallback(
    (rowId: string | number) => {
      return selectedIds.has(rowId)
    },
    [selectedIds]
  )

  const selectionState = useMemo(() => {
    const allRowIds = data.map((row) => getRowId(row))
    const selectedCount = selectedIds.size
    const isAllSelected = allRowIds.length > 0 && allRowIds.every((id) => selectedIds.has(id))
    const isIndeterminate = selectedCount > 0 && selectedCount < allRowIds.length

    return {
      selectedRowIds: selectedIds,
      isAllSelected,
      isIndeterminate,
      selectedCount,
    }
  }, [data, selectedIds, getRowId])

  return {
    ...selectionState,
    toggleRow,
    toggleAll,
    clearSelection,
    isRowSelected,
  }
}

