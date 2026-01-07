import { ReactNode } from 'react'

// Column definition types
export type ColumnDataType = 'string' | 'number' | 'date' | 'boolean' | 'enum' | 'custom'

export type SortDirection = 'asc' | 'desc' | null

export interface ColumnDef<T = any> {
  id: string
  header: string | ((props: { column: ColumnDef<T> }) => ReactNode)
  accessorKey?: keyof T
  accessorFn?: (row: T) => any
  cell?: (props: { row: T; value: any; column: ColumnDef<T> }) => ReactNode
  sortable?: boolean
  filterable?: boolean
  dataType?: ColumnDataType
  filterOptions?: string[] // For enum type columns
  width?: string | number
  minWidth?: string | number
  maxWidth?: string | number
  defaultVisible?: boolean
  sticky?: 'left' | 'right'
}

// Filter types
export interface ColumnFilter {
  columnId: string
  value: any
  operator?: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'between' | 'in'
}

export interface FilterState {
  columnFilters: Record<string, ColumnFilter>
  globalSearch: string
  appliedFilters: Record<string, ColumnFilter>
  pendingFilters: Record<string, ColumnFilter>
}

// Sort types
export interface SortState {
  columnId: string | null
  direction: SortDirection
}

// Selection types
export interface SelectionState {
  selectedRowIds: Set<string | number>
  isAllSelected: boolean
  isIndeterminate: boolean
}

// Row action types
export interface RowAction<T = any> {
  id: string
  label: string
  icon?: ReactNode
  onClick: (row: T) => void | Promise<void>
  variant?: 'default' | 'danger' | 'warning'
  disabled?: (row: T) => boolean
  visible?: (row: T) => boolean
}

// Bulk action types
export interface BulkAction<T = any> {
  id: string
  label: string
  icon?: ReactNode
  onClick: (selectedRows: T[]) => void | Promise<void>
  variant?: 'default' | 'danger' | 'warning'
  disabled?: (selectedRows: T[]) => boolean
  visible?: (selectedRows: T[]) => boolean
  requiresConfirmation?: boolean
  confirmationMessage?: string | ((selectedRows: T[]) => string)
}

// Infinite scroll types
export interface InfiniteScrollState {
  hasMore: boolean
  isLoading: boolean
  page: number
  error: Error | null
}

// Column visibility types
export interface ColumnVisibilityState {
  visibleColumns: Set<string>
  defaultColumns: Set<string>
}

// Export types
export type ExportFormat = 'csv' | 'xlsx' | 'json'

export interface ExportOptions {
  format: ExportFormat
  includeSelectedOnly?: boolean
  includeFilters?: boolean
  filename?: string
}

// Main DataTable props
export interface DataTableProps<T = any> {
  data: T[]
  columns: ColumnDef<T>[]
  getRowId?: (row: T) => string | number
  primaryColumnId?: string // For initial sorting
  
  // Infinite scroll
  onLoadMore?: () => Promise<T[]>
  hasMore?: boolean
  isLoadingMore?: boolean
  
  // Filtering
  enableGlobalSearch?: boolean
  enableColumnFilters?: boolean
  onFilterChange?: (filters: FilterState) => void
  initialFilters?: Partial<FilterState>
  
  // Sorting
  enableSorting?: boolean
  onSortChange?: (sort: SortState) => void
  initialSort?: SortState
  
  // Selection
  enableSelection?: boolean
  enableBulkSelection?: boolean
  onSelectionChange?: (selectedRows: T[]) => void
  selectedRowIds?: (string | number)[]
  
  // Actions
  rowActions?: RowAction<T>[]
  bulkActions?: BulkAction<T>[]
  onRowClick?: (row: T) => void
  enableRowExpansion?: boolean
  expandedRowRender?: (row: T) => ReactNode
  
  // Column visibility
  enableColumnVisibility?: boolean
  onColumnVisibilityChange?: (visibleColumns: string[]) => void
  defaultVisibleColumns?: string[]
  
  // Export
  enableExport?: boolean
  onExport?: (options: ExportOptions) => Promise<void>
  
  // Styling
  size?: 'sm' | 'md' | 'lg'
  variant?: 'simple' | 'striped' | 'unstyled'
  stickyHeader?: boolean
  
  // States
  isLoading?: boolean
  isEmpty?: boolean
  error?: Error | null
  
  // Empty/Error states
  emptyStateMessage?: string
  errorStateMessage?: string
  
  // Callbacks
  onRowExpand?: (row: T, isExpanded: boolean) => void
  
  // View state persistence
  persistFilters?: boolean // Temporary - session based
  persistColumnVisibility?: boolean // Persistent - database
  onColumnVisibilitySave?: (visibleColumns: string[]) => Promise<void>
}

// Internal state types
export interface DataTableState<T = any> {
  data: T[]
  filteredData: T[]
  sortState: SortState
  filterState: FilterState
  selectionState: SelectionState
  columnVisibility: ColumnVisibilityState
  infiniteScroll: InfiniteScrollState
  expandedRows: Set<string | number>
}

