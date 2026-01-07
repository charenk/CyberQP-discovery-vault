'use client'

import {
  Box,
  Table,
  Thead,
  Tbody,
  TableContainer,
  Checkbox,
  HStack,
  VStack,
  Button,
  IconButton,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { FiSettings, FiX } from 'react-icons/fi'
import { useMemo, useState, useCallback, useEffect, useRef } from 'react'
import { DataTableProps, ColumnDef, ColumnFilter } from './types'
import { useColumnFilters } from './hooks/useColumnFilters'
import { useColumnSorting } from './hooks/useColumnSorting'
import { useTableSelection } from './hooks/useTableSelection'
import { useColumnVisibility } from './hooks/useColumnVisibility'
import { useRowExpansion } from './hooks/useRowExpansion'
import { useInfiniteScroll } from './hooks/useInfiniteScroll'
import { useUrlFilters } from './hooks/useUrlFilters'
import { sortData, filterData, getCellValue } from '@/utils/tableUtils'
import { DataTableColumnHeader } from './DataTableColumnHeader'
import { DataTableRow } from './DataTableRow'
import { DataTableSearch } from './DataTableSearch'
import { DataTableBulkActions } from './DataTableBulkActions'
import { ColumnSelector } from './ColumnSelector'
import { DataTableExport } from './DataTableExport'
import { FilterChip } from './FilterChip'
import { AppliedFiltersDisplay } from './AppliedFiltersDisplay'
import { EmptyState, ErrorState, LoadingState, LoadingMore, NoResults } from './DataTableStates'
import { exportData } from '@/utils/exportUtils'

export function DataTable<T = any>({
  data,
  columns,
  getRowId = (row: T) => String(Math.random()),
  primaryColumnId,
  onLoadMore,
  hasMore = false,
  isLoadingMore = false,
  enableGlobalSearch = true,
  enableColumnFilters = true,
  onFilterChange,
  initialFilters,
  enableSorting = true,
  onSortChange,
  initialSort,
  enableSelection = false,
  enableBulkSelection = false,
  onSelectionChange,
  selectedRowIds,
  rowActions,
  bulkActions,
  onRowClick,
  enableRowExpansion = false,
  expandedRowRender,
  enableColumnVisibility = true,
  onColumnVisibilityChange,
  defaultVisibleColumns,
  onColumnVisibilitySave,
  persistColumnVisibility = false,
  enableExport = false,
  onExport: customOnExport,
  size = 'md',
  variant = 'simple',
  stickyHeader = true,
  isLoading = false,
  isEmpty = false,
  error = null,
  emptyStateMessage,
  errorStateMessage,
  onRowExpand,
  persistFilters = false,
}: DataTableProps<T>) {
  // Hooks
  const {
    filterState,
    updateFilter,
    applyFilters,
    clearFilter,
    clearAllFilters,
    updateGlobalSearch,
    hasPendingFilters,
    hasAppliedFilters,
  } = useColumnFilters({
    initialFilters,
    onFilterChange,
  })

  const { sortState, toggleSort } = useColumnSorting({
    initialSort,
    onSortChange,
    primaryColumnId,
  })

  const {
    visibleColumns,
    visibleColumnsSet,
    toggleColumn,
    resetToDefault,
    defaultColumns,
  } = useColumnVisibility({
    columns,
    defaultVisibleColumns,
    onColumnVisibilityChange,
    onColumnVisibilitySave,
    persistColumnVisibility,
  })

  // Filter and sort data first
  const filteredData = useMemo(() => {
    if (isLoading) return []
    return filterData(data, filterState, columns)
  }, [data, filterState, columns, isLoading])

  const sortedData = useMemo(() => {
    return sortData(filteredData, sortState, columns)
  }, [filteredData, sortState, columns])

  const { expandedRows, toggleRow: toggleExpandRow, isRowExpanded } = useRowExpansion({
    onRowExpand: onRowExpand
      ? (rowId, isExpanded) => {
          const row = sortedData.find((r) => getRowId(r) === rowId)
          if (row) {
            onRowExpand(row, isExpanded)
          }
        }
      : undefined,
  })

  // URL persistence for filters (skipped in Storybook automatically)
  useUrlFilters(filterState, (filters) => onFilterChange?.(filters), persistFilters)

  const { ref: infiniteScrollRef } = useInfiniteScroll({
    hasMore,
    isLoading: isLoadingMore,
    onLoadMore: async () => {
      if (onLoadMore) {
        return await onLoadMore()
      }
      return []
    },
  })

  // Disclosures
  const { isOpen: isBulkActionsOpen, onOpen: onBulkActionsOpen, onClose: onBulkActionsClose } = useDisclosure()
  const { isOpen: isColumnSelectorOpen, onOpen: onColumnSelectorOpen, onClose: onColumnSelectorClose } = useDisclosure()

  const {
    isAllSelected,
    isIndeterminate,
    selectedCount,
    toggleRow,
    toggleAll,
    clearSelection,
    isRowSelected,
  } = useTableSelection({
    data: filteredData,
    getRowId: (row: T) => getRowId(row),
    selectedRowIds,
    onSelectionChange,
  })

  // Keyboard navigation
  const tableRef = useRef<HTMLTableElement>(null)
  const [focusedRowIndex, setFocusedRowIndex] = useState<number | null>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!tableRef.current) return

      const rows = Array.from(tableRef.current.querySelectorAll('tbody tr'))
      if (rows.length === 0) return

      let newIndex = focusedRowIndex

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          newIndex = focusedRowIndex === null ? 0 : Math.min(focusedRowIndex + 1, rows.length - 1)
          setFocusedRowIndex(newIndex)
          rows[newIndex]?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
          break

        case 'ArrowUp':
          e.preventDefault()
          newIndex = focusedRowIndex === null ? 0 : Math.max(focusedRowIndex - 1, 0)
          setFocusedRowIndex(newIndex)
          rows[newIndex]?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
          break

        case 'Enter':
          e.preventDefault()
          if (focusedRowIndex !== null && focusedRowIndex < sortedData.length) {
            const row = sortedData[focusedRowIndex]
            if (enableRowExpansion) {
              toggleExpandRow(getRowId(row))
            } else if (onRowClick) {
              onRowClick(row)
            }
          }
          break

        case 'Escape':
          setFocusedRowIndex(null)
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [focusedRowIndex, sortedData, enableRowExpansion, onRowClick, toggleExpandRow, getRowId])

  // Selected rows
  const selectedRows = useMemo(() => {
    return sortedData.filter((row) => isRowSelected(getRowId(row)))
  }, [sortedData, isRowSelected, getRowId])

  // Handle bulk actions
  const handleBulkActionClick = useCallback(() => {
    if (selectedCount > 0) {
      onBulkActionsOpen()
    }
  }, [selectedCount, onBulkActionsOpen])

  // Handle export
  const handleExport = useCallback(
    async (options: any) => {
      const exportDataToUse = options.includeSelectedOnly && selectedCount > 0 ? selectedRows : sortedData
      const exportColumns = columns
        .filter((col) => visibleColumns.includes(col.id))
        .map((col) => ({
          id: col.id,
          header: typeof col.header === 'string' ? col.header : col.id,
          accessor: (row: T) => getCellValue(row, col),
        }))

      if (customOnExport) {
        await customOnExport(options)
      } else {
        await exportData(exportDataToUse, exportColumns, options)
      }
    },
    [selectedRows, sortedData, selectedCount, columns, visibleColumns, customOnExport]
  )

  // Render
  if (error) {
    return <ErrorState message={errorStateMessage} />
  }

  if (isEmpty && !isLoading) {
    return <EmptyState message={emptyStateMessage} />
  }

  const visibleColumnsList = columns.filter((col) => visibleColumns.includes(col.id))

  return (
    <VStack spacing={4} align="stretch">
      {/* Header with search and actions */}
      <HStack spacing={4} justify="space-between" flexWrap="wrap">
        <HStack spacing={4} flex={1} minW="200px" align="flex-start">
          {enableGlobalSearch && (
            <DataTableSearch value={filterState.globalSearch} onChange={updateGlobalSearch} />
          )}

          {/* Applied Filters Display */}
          <AppliedFiltersDisplay
            appliedFilters={filterState.appliedFilters}
            globalSearch={filterState.globalSearch}
            columns={columns}
            onRemoveFilter={clearFilter}
            onClearGlobalSearch={() => updateGlobalSearch('')}
            onClearAll={clearAllFilters}
          />
        </HStack>

        <HStack spacing={2}>
          {enableExport && <DataTableExport onExport={handleExport} hasSelection={selectedCount > 0} />}
          {enableColumnVisibility && (
            <IconButton
              aria-label="Select columns"
              icon={<FiSettings />}
              onClick={onColumnSelectorOpen}
              size="sm"
              variant="outline"
            />
          )}
          {enableBulkSelection && selectedCount > 0 && (
            <Button size="sm" colorScheme="green" onClick={handleBulkActionClick}>
              Actions ({selectedCount})
            </Button>
          )}
        </HStack>
      </HStack>

      {/* Pending filters indicator */}
      {hasPendingFilters && (
        <HStack spacing={2} p={2} bg="yellow.50" borderRadius="md" border="1px solid" borderColor="yellow.200">
          <Text fontSize="sm" color="yellow.800">
            You have pending filter changes. Click Apply in the filter drawer to apply them.
          </Text>
        </HStack>
      )}

      {/* Table */}
      <TableContainer
        border="1px solid"
        borderColor="gray.200"
        borderRadius="md"
        overflowX="auto"
        maxH={stickyHeader ? 'calc(100vh - 300px)' : undefined}
        position="relative"
      >
        <Table variant={variant} size={size} ref={tableRef}>
          <Thead position={stickyHeader ? 'sticky' : 'relative'} top={0} zIndex={20} bg="gray.50">
            <tr>
              {enableSelection && (
                <th style={{ padding: '12px 16px', background: '#f5f5f5' }}>
                  <Checkbox
                    isChecked={isAllSelected}
                    isIndeterminate={isIndeterminate}
                    onChange={toggleAll}
                  />
                </th>
              )}
              {visibleColumnsList.map((column) => {
                const handleFilterApply = (filter: ColumnFilter) => {
                  // When filter is applied from drawer, add it directly to appliedFilters
                  const newAppliedFilters = { ...filterState.appliedFilters, [filter.columnId]: filter }
                  const newPendingFilters = { ...filterState.pendingFilters }
                  delete newPendingFilters[filter.columnId]
                  
                  const newState = {
                    ...filterState,
                    appliedFilters: newAppliedFilters,
                    pendingFilters: newPendingFilters,
                  }
                  
                  onFilterChange?.(newState)
                }
                
                const handleFilterClear = () => {
                  clearFilter(column.id)
                }
                
                return (
                  <DataTableColumnHeader
                    key={column.id}
                    column={column}
                    sortState={sortState}
                    onSort={toggleSort}
                    currentFilter={filterState.appliedFilters[column.id]}
                    onFilterChange={handleFilterApply}
                    onFilterClear={handleFilterClear}
                    sticky={column.sticky}
                  />
                )
              })}
              {rowActions && rowActions.length > 0 && (
                <th style={{ padding: '12px 16px', background: '#f5f5f5', textAlign: 'right' }}>
                  <Text fontSize="sm" fontWeight="medium">
                    Actions
                  </Text>
                </th>
              )}
            </tr>
          </Thead>
          <Tbody>
            {isLoading ? (
              <tr>
                <td colSpan={visibleColumnsList.length + (enableSelection ? 1 : 0) + (rowActions ? 1 : 0)}>
                  <LoadingState />
                </td>
              </tr>
            ) : sortedData.length === 0 ? (
              <tr>
                <td colSpan={visibleColumnsList.length + (enableSelection ? 1 : 0) + (rowActions ? 1 : 0)}>
                  <NoResults />
                </td>
              </tr>
            ) : (
              sortedData.map((row, index) => {
                const rowId = getRowId(row)
                const isFocused = focusedRowIndex === index
                return (
                  <DataTableRow
                    key={rowId}
                    row={row}
                    columns={columns}
                    visibleColumns={visibleColumns}
                    isSelected={isRowSelected(rowId)}
                    isExpanded={isRowExpanded(rowId)}
                    isFocused={isFocused}
                    onSelect={() => toggleRow(rowId)}
                    onExpand={() => toggleExpandRow(rowId)}
                    onRowClick={onRowClick}
                    rowActions={rowActions}
                    getRowId={(r) => getRowId(r)}
                    enableSelection={enableSelection}
                    enableRowExpansion={enableRowExpansion}
                    expandedRowRender={expandedRowRender}
                  />
                )
              })
            )}
          </Tbody>
        </Table>

        {/* Infinite scroll trigger */}
        {onLoadMore && hasMore && (
          <Box ref={infiniteScrollRef} py={4}>
            {isLoadingMore && <LoadingMore />}
          </Box>
        )}
      </TableContainer>

      {/* Bulk Actions Drawer */}
      {enableBulkSelection && bulkActions && bulkActions.length > 0 && (
        <DataTableBulkActions
          isOpen={isBulkActionsOpen}
          onClose={onBulkActionsClose}
          selectedRows={selectedRows}
          bulkActions={bulkActions}
        />
      )}

      {/* Column Selector Drawer */}
      {enableColumnVisibility && (
        <ColumnSelector
          isOpen={isColumnSelectorOpen}
          onClose={onColumnSelectorClose}
          columns={columns}
          visibleColumns={visibleColumns}
          defaultColumns={defaultColumns}
          onToggleColumn={toggleColumn}
          onResetToDefault={resetToDefault}
        />
      )}
    </VStack>
  )
}

