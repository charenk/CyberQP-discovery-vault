'use client'

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  Button,
  VStack,
  Box,
  Input,
  Select,
  Checkbox,
  CheckboxGroup,
  Stack,
  HStack,
  Text,
  InputGroup,
  InputLeftElement,
  Icon,
} from '@chakra-ui/react'
import { FiSearch } from 'react-icons/fi'
import { ColumnDef, ColumnFilter, ColumnDataType } from './types'
import { useState, useEffect, useMemo } from 'react'

interface ColumnFilterPopoverProps {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
  column: ColumnDef
  currentFilter?: ColumnFilter
  onApply: (filter: ColumnFilter) => void
  onClear: () => void
  trigger: React.ReactElement
}

export function ColumnFilterPopover({
  isOpen,
  onOpen,
  onClose,
  column,
  currentFilter,
  onApply,
  onClear,
  trigger,
}: ColumnFilterPopoverProps) {
  const [filterValue, setFilterValue] = useState<any>(currentFilter?.value || '')
  const [searchTerm, setSearchTerm] = useState('')
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    setFilterValue(currentFilter?.value || '')
    setHasChanges(false)
    setSearchTerm('')
  }, [currentFilter, isOpen])

  const handleValueChange = (value: any) => {
    setFilterValue(value)
    setHasChanges(true)
  }

  const handleApply = () => {
    if (filterValue !== '' && filterValue !== null && filterValue !== undefined) {
      const filter: ColumnFilter = {
        columnId: column.id,
        value: filterValue,
        operator: getDefaultOperator(column.dataType),
      }
      onApply(filter)
    } else {
      onClear()
    }
    setHasChanges(false)
    onClose()
  }

  const handleCancel = () => {
    setFilterValue(currentFilter?.value || '')
    setHasChanges(false)
    setSearchTerm('')
    onClose()
  }

  const handleClear = () => {
    setFilterValue('')
    setHasChanges(false)
    onClear()
    onClose()
  }

  // Determine if search should be shown (7-20 options)
  const shouldShowSearch = useMemo(() => {
    if (column.dataType === 'enum' && column.filterOptions) {
      return column.filterOptions.length >= 7 && column.filterOptions.length <= 20
    }
    return false
  }, [column.dataType, column.filterOptions])

  // Filter options based on search term
  const filteredOptions = useMemo(() => {
    if (!column.filterOptions) return []
    if (!shouldShowSearch || !searchTerm) return column.filterOptions
    
    return column.filterOptions.filter((option) =>
      option.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [column.filterOptions, searchTerm, shouldShowSearch])

  const renderFilterInput = () => {
    const dataType = column.dataType || 'string'

    switch (dataType) {
      case 'enum':
        if (column.filterOptions) {
          const optionsToShow = shouldShowSearch ? filteredOptions : column.filterOptions
          const hasActiveFilter = currentFilter && (Array.isArray(currentFilter.value) ? currentFilter.value.length > 0 : currentFilter.value)

          return (
            <VStack spacing={3} align="stretch" maxH="300px" overflowY="auto">
              {shouldShowSearch && (
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FiSearch} color="gray.400" />
                  </InputLeftElement>
                  <Input
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    size="sm"
                  />
                </InputGroup>
              )}
              
              {optionsToShow.length === 0 && shouldShowSearch ? (
                <Text fontSize="sm" color="gray.500" py={2}>
                  No options found
                </Text>
              ) : (
                <CheckboxGroup
                  value={Array.isArray(filterValue) ? filterValue : (filterValue ? [filterValue] : [])}
                  onChange={(values) => handleValueChange(values)}
                >
                  <Stack spacing={2}>
                    {optionsToShow.map((option) => (
                      <Checkbox key={option} value={option} size="sm">
                        <Text fontSize="sm">{option}</Text>
                      </Checkbox>
                    ))}
                  </Stack>
                </CheckboxGroup>
              )}
            </VStack>
          )
        }
        return (
          <Select
            value={filterValue}
            onChange={(e) => handleValueChange(e.target.value)}
            placeholder="Select value"
            size="sm"
          >
            {(column.filterOptions || []).map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        )

      case 'date':
        return (
          <VStack spacing={2} align="stretch">
            <Box>
              <Text fontSize="sm" fontWeight="medium" mb={2}>
                Start Date
              </Text>
              <Input
                type="date"
                value={Array.isArray(filterValue) ? filterValue[0] : ''}
                onChange={(e) =>
                  handleValueChange([e.target.value, Array.isArray(filterValue) ? filterValue[1] : ''])
                }
                size="sm"
              />
            </Box>
            <Box>
              <Text fontSize="sm" fontWeight="medium" mb={2}>
                End Date
              </Text>
              <Input
                type="date"
                value={Array.isArray(filterValue) ? filterValue[1] : ''}
                onChange={(e) =>
                  handleValueChange([Array.isArray(filterValue) ? filterValue[0] : '', e.target.value])
                }
                size="sm"
              />
            </Box>
          </VStack>
        )

      case 'number':
        return (
          <VStack spacing={2} align="stretch">
            <Box>
              <Text fontSize="sm" fontWeight="medium" mb={2}>
                Min
              </Text>
              <Input
                type="number"
                value={Array.isArray(filterValue) ? filterValue[0] : ''}
                onChange={(e) =>
                  handleValueChange([e.target.value, Array.isArray(filterValue) ? filterValue[1] : ''])
                }
                size="sm"
              />
            </Box>
            <Box>
              <Text fontSize="sm" fontWeight="medium" mb={2}>
                Max
              </Text>
              <Input
                type="number"
                value={Array.isArray(filterValue) ? filterValue[1] : ''}
                onChange={(e) =>
                  handleValueChange([Array.isArray(filterValue) ? filterValue[0] : '', e.target.value])
                }
                size="sm"
              />
            </Box>
          </VStack>
        )

      case 'boolean':
        return (
          <Select
            value={String(filterValue)}
            onChange={(e) => handleValueChange(e.target.value === 'true')}
            size="sm"
          >
            <option value="">All</option>
            <option value="true">True</option>
            <option value="false">False</option>
          </Select>
        )

      default:
        return (
          <Input
            value={filterValue}
            onChange={(e) => handleValueChange(e.target.value)}
            placeholder="Enter filter value"
            size="sm"
          />
        )
    }
  }

  const needsApplyCancel = useMemo(() => {
    // Apply/Cancel buttons are relevant when:
    // 1. There are pending changes, OR
    // 2. There's an active filter that can be cleared
    const hasActiveFilter = currentFilter && (
      Array.isArray(currentFilter.value) 
        ? currentFilter.value.length > 0 
        : currentFilter.value !== '' && currentFilter.value !== null && currentFilter.value !== undefined
    )
    return hasChanges || hasActiveFilter
  }, [hasChanges, currentFilter])

  const columnLabel = typeof column.header === 'string' ? column.header : column.id

  return (
    <Popover isOpen={isOpen} onOpen={onOpen} onClose={handleCancel} placement="bottom-start" closeOnBlur={false}>
      <PopoverTrigger>{trigger}</PopoverTrigger>
      <PopoverContent w="300px" boxShadow="lg" borderRadius="md">
        <PopoverHeader borderBottom="1px solid" borderColor="gray.200" py={3} px={4}>
          <Text fontSize="sm" fontWeight="semibold">
            Filter by {columnLabel}
          </Text>
        </PopoverHeader>
        <PopoverBody py={4} px={4} maxH="400px" overflowY="auto">
          {renderFilterInput()}
        </PopoverBody>
        {needsApplyCancel && (
          <PopoverFooter borderTop="1px solid" borderColor="gray.200" py={3} px={4}>
            <HStack spacing={2} w="full">
              <Button
                variant="outline"
                size="sm"
                onClick={handleClear}
                flex={1}
                isDisabled={!currentFilter || (Array.isArray(currentFilter.value) ? currentFilter.value.length === 0 : !currentFilter.value)}
              >
                Clear
              </Button>
              <Button variant="ghost" size="sm" onClick={handleCancel} flex={1}>
                Cancel
              </Button>
              <Button colorScheme="green" size="sm" onClick={handleApply} flex={1} isDisabled={!hasChanges && !currentFilter}>
                Apply
              </Button>
            </HStack>
          </PopoverFooter>
        )}
      </PopoverContent>
    </Popover>
  )
}

function getDefaultOperator(dataType?: ColumnDataType): ColumnFilter['operator'] {
  switch (dataType) {
    case 'date':
    case 'number':
      return 'between'
    case 'enum':
      return 'in'
    default:
      return 'contains'
  }
}

