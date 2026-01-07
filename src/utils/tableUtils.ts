import { ColumnDef, SortState, FilterState, ColumnFilter } from '@/components/shared/DataTable/types'

export function getCellValue<T>(row: T, column: ColumnDef<T>): any {
  if (column.accessorFn) {
    return column.accessorFn(row)
  }
  if (column.accessorKey) {
    return row[column.accessorKey]
  }
  return null
}

export function sortData<T>(data: T[], sortState: SortState, columns: ColumnDef<T>[]): T[] {
  if (!sortState.columnId || !sortState.direction) {
    return data
  }

  const column = columns.find((col) => col.id === sortState.columnId)
  if (!column) {
    return data
  }

  const sorted = [...data].sort((a, b) => {
    const aValue = getCellValue(a, column)
    const bValue = getCellValue(b, column)

    // Handle null/undefined
    if (aValue == null && bValue == null) return 0
    if (aValue == null) return 1
    if (bValue == null) return -1

    // Handle different types
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortState.direction === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue)
    }

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortState.direction === 'asc' ? aValue - bValue : bValue - aValue
    }

    if (aValue instanceof Date && bValue instanceof Date) {
      return sortState.direction === 'asc'
        ? aValue.getTime() - bValue.getTime()
        : bValue.getTime() - aValue.getTime()
    }

    // Fallback to string comparison
    const aStr = String(aValue)
    const bStr = String(bValue)
    return sortState.direction === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr)
  })

  return sorted
}

export function filterData<T>(data: T[], filterState: FilterState, columns: ColumnDef<T>[]): T[] {
  let filtered = [...data]

  // Apply global search
  if (filterState.globalSearch) {
    const searchLower = filterState.globalSearch.toLowerCase()
    filtered = filtered.filter((row) => {
      return columns.some((column) => {
        const value = getCellValue(row, column)
        return value != null && String(value).toLowerCase().includes(searchLower)
      })
    })
  }

  // Apply column filters (only applied filters, not pending)
  Object.values(filterState.appliedFilters).forEach((filter) => {
    const column = columns.find((col) => col.id === filter.columnId)
    if (!column) return

    filtered = filtered.filter((row) => {
      const cellValue = getCellValue(row, column)
      const filterValue = filter.value

      if (cellValue == null) return false

      switch (filter.operator || 'contains') {
        case 'equals':
          return String(cellValue) === String(filterValue)
        case 'contains':
          return String(cellValue).toLowerCase().includes(String(filterValue).toLowerCase())
        case 'startsWith':
          return String(cellValue).toLowerCase().startsWith(String(filterValue).toLowerCase())
        case 'endsWith':
          return String(cellValue).toLowerCase().endsWith(String(filterValue).toLowerCase())
        case 'in':
          if (Array.isArray(filterValue)) {
            return filterValue.includes(cellValue)
          }
          return false
        case 'between':
          if (Array.isArray(filterValue) && filterValue.length === 2) {
            const [start, end] = filterValue
            return cellValue >= start && cellValue <= end
          }
          return false
        default:
          return true
      }
    })
  })

  return filtered
}

export function getColumnWidth(column: ColumnDef): string | number | undefined {
  if (column.width) return column.width
  if (column.minWidth) return column.minWidth
  return undefined
}

