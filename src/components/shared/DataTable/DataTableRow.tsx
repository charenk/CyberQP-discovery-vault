'use client'

import {
  Tr,
  Td,
  Checkbox,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Icon,
  Box,
} from '@chakra-ui/react'
import { FiMoreVertical } from 'react-icons/fi'
import { ColumnDef, RowAction } from './types'
import { getCellValue } from '@/utils/tableUtils'

interface DataTableRowProps<T = any> {
  row: T
  columns: ColumnDef<T>[]
  visibleColumns: string[]
  isSelected: boolean
  isExpanded: boolean
  isFocused?: boolean
  onSelect: () => void
  onExpand?: () => void
  onRowClick?: (row: T) => void
  rowActions?: RowAction<T>[]
  getRowId: (row: T) => string | number
  enableSelection?: boolean
  enableRowExpansion?: boolean
  expandedRowRender?: (row: T) => React.ReactNode
}

export function DataTableRow<T = any>({
  row,
  columns,
  visibleColumns,
  isSelected,
  isExpanded,
  isFocused = false,
  onSelect,
  onExpand,
  onRowClick,
  rowActions,
  getRowId,
  enableSelection,
  enableRowExpansion,
  expandedRowRender,
}: DataTableRowProps<T>) {
  const visibleColumnsList = columns.filter((col) => visibleColumns.includes(col.id))

  const handleRowClick = (e: React.MouseEvent) => {
    // Don't trigger row click if clicking on checkbox, action menu, or expand button
    const target = e.target as HTMLElement
    if (
      target.closest('input[type="checkbox"]') ||
      target.closest('[role="menu"]') ||
      target.closest('button')
    ) {
      return
    }

    if (enableRowExpansion && onExpand) {
      onExpand()
    } else if (onRowClick) {
      onRowClick(row)
    }
  }

  const visibleActions = rowActions?.filter((action) => {
    if (action.visible === undefined) return true
    return action.visible(row)
  })

  return (
    <>
      <Tr
        cursor={onRowClick || enableRowExpansion ? 'pointer' : 'default'}
        onClick={handleRowClick}
        bg={isSelected ? 'green.50' : isFocused ? 'blue.50' : 'white'}
        _hover={{ bg: isSelected ? 'green.100' : isFocused ? 'blue.100' : 'gray.50' }}
        borderBottom="1px solid"
        borderColor="gray.200"
        outline={isFocused ? '2px solid' : 'none'}
        outlineColor={isFocused ? 'blue.500' : 'transparent'}
        outlineOffset={isFocused ? '-2px' : '0'}
        tabIndex={0}
      >
        {enableSelection && (
          <Td px={4} py={3}>
            <Checkbox isChecked={isSelected} onChange={onSelect} />
          </Td>
        )}

        {visibleColumnsList.map((column) => {
          const value = getCellValue(row, column)
          const cellContent = column.cell
            ? column.cell({ row, value, column })
            : value != null
              ? String(value)
              : '—'

          return (
            <Td
              key={column.id}
              px={4}
              py={3}
              maxW={column.maxWidth}
              w={column.width}
              position={column.sticky ? 'sticky' : 'relative'}
              left={column.sticky === 'left' ? 0 : undefined}
              right={column.sticky === 'right' ? 0 : undefined}
              zIndex={column.sticky ? 5 : 1}
              bg={isSelected ? 'green.50' : 'white'}
            >
              {cellContent}
            </Td>
          )
        })}

        {visibleActions && visibleActions.length > 0 && (
          <Td px={4} py={3} textAlign="right">
            <Menu>
              <MenuButton
                as={IconButton}
                icon={<FiMoreVertical />}
                variant="ghost"
                size="sm"
                onClick={(e) => e.stopPropagation()}
              />
              <MenuList>
                {visibleActions.map((action) => {
                  const isDisabled = action.disabled ? action.disabled(row) : false
                  return (
                    <MenuItem
                      key={action.id}
                      onClick={(e) => {
                        e.stopPropagation()
                        action.onClick(row)
                      }}
                      isDisabled={isDisabled}
                      color={action.variant === 'danger' ? 'red.500' : undefined}
                    >
                      {action.icon && <Icon as={action.icon} mr={2} />}
                      {action.label}
                    </MenuItem>
                  )
                })}
              </MenuList>
            </Menu>
          </Td>
        )}
      </Tr>

      {enableRowExpansion && isExpanded && expandedRowRender && (
        <Tr>
          <Td colSpan={visibleColumnsList.length + (enableSelection ? 1 : 0) + (visibleActions ? 1 : 0)} p={0}>
            <Box p={4} bg="gray.50" borderBottom="1px solid" borderColor="gray.200">
              {expandedRowRender(row)}
            </Box>
          </Td>
        </Tr>
      )}
    </>
  )
}

