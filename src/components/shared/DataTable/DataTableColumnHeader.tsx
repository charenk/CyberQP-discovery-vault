'use client'

import {
  Th,
  HStack,
  IconButton,
  Text,
  Icon,
  Box,
  useDisclosure,
} from '@chakra-ui/react'
import { FiFilter, FiChevronUp, FiChevronDown } from 'react-icons/fi'
import { ColumnDef, SortState, ColumnFilter } from './types'
import { ColumnFilterPopover } from './ColumnFilterPopover'

interface DataTableColumnHeaderProps<T = any> {
  column: ColumnDef<T>
  sortState: SortState
  onSort: (columnId: string) => void
  currentFilter?: ColumnFilter
  onFilterChange: (filter: ColumnFilter) => void
  onFilterClear: () => void
  sticky?: 'left' | 'right'
}

export function DataTableColumnHeader<T = any>({
  column,
  sortState,
  onSort,
  currentFilter,
  onFilterChange,
  onFilterClear,
  sticky,
}: DataTableColumnHeaderProps<T>) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const isSorted = sortState.columnId === column.id
  const isFiltered = !!currentFilter

  const handleSort = () => {
    if (column.sortable !== false) {
      onSort(column.id)
    }
  }

  const getSortIcon = () => {
    if (!isSorted) {
      return (
        <Box as="span" display="inline-flex" flexDirection="column" lineHeight={0.8}>
          <FiChevronUp size={12} style={{ marginBottom: '-2px' }} />
          <FiChevronDown size={12} />
        </Box>
      )
    }
    if (sortState.direction === 'asc') {
      return <FiChevronUp size={16} />
    }
    return <FiChevronDown size={16} />
  }

  const headerContent =
    typeof column.header === 'string' ? (
      <Text fontWeight="medium" fontSize="sm">
        {column.header}
      </Text>
    ) : (
      column.header({ column })
    )

  return (
    <>
      <Th
        position={sticky ? 'sticky' : 'relative'}
        left={sticky === 'left' ? 0 : undefined}
        right={sticky === 'right' ? 0 : undefined}
        zIndex={sticky ? 10 : 1}
        bg="gray.50"
        borderBottom="1px solid"
        borderColor="gray.200"
        px={4}
        py={3}
        minW={column.minWidth}
        maxW={column.maxWidth}
        w={column.width}
      >
        <HStack spacing={2} justify="space-between">
          <HStack
            spacing={2}
            flex={1}
            cursor={column.sortable !== false ? 'pointer' : 'default'}
            onClick={handleSort}
            _hover={column.sortable !== false ? { opacity: 0.7 } : {}}
          >
            {headerContent}
            {column.sortable !== false && (
              <Icon color={isSorted ? 'green.500' : 'gray.400'}>{getSortIcon()}</Icon>
            )}
          </HStack>

          {column.filterable !== false && (
            <ColumnFilterPopover
              isOpen={isOpen}
              onOpen={onOpen}
              onClose={onClose}
              column={column}
              currentFilter={currentFilter}
              onApply={onFilterChange}
              onClear={onFilterClear}
              trigger={
                <IconButton
                  aria-label={`Filter ${column.id}`}
                  icon={<FiFilter />}
                  size="xs"
                  variant="ghost"
                  colorScheme={isFiltered ? 'green' : 'gray'}
                  h="auto"
                  minW="auto"
                />
              }
            />
          )}
        </HStack>
      </Th>
    </>
  )
}

