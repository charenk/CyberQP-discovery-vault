'use client'

import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
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
} from '@chakra-ui/react'
import { ColumnDef, ColumnFilter, ColumnDataType } from './types'
import { useState, useEffect } from 'react'

interface ColumnFilterDrawerProps {
  isOpen: boolean
  onClose: () => void
  column: ColumnDef
  currentFilter?: ColumnFilter
  onApply: (filter: ColumnFilter) => void
  onClear: () => void
}

export function ColumnFilterDrawer({
  isOpen,
  onClose,
  column,
  currentFilter,
  onApply,
  onClear,
}: ColumnFilterDrawerProps) {
  const [filterValue, setFilterValue] = useState<any>(currentFilter?.value || '')
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    setFilterValue(currentFilter?.value || '')
    setHasChanges(false)
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

  const handleClear = () => {
    setFilterValue('')
    setHasChanges(false)
    onClear()
    onClose()
  }

  const renderFilterInput = () => {
    const dataType = column.dataType || 'string'

    switch (dataType) {
      case 'enum':
        if (column.filterOptions) {
          return (
            <CheckboxGroup value={Array.isArray(filterValue) ? filterValue : []} onChange={handleValueChange}>
              <Stack spacing={2}>
                {column.filterOptions.map((option) => (
                  <Checkbox key={option} value={option}>
                    {option}
                  </Checkbox>
                ))}
              </Stack>
            </CheckboxGroup>
          )
        }
        return (
          <Select
            value={filterValue}
            onChange={(e) => handleValueChange(e.target.value)}
            placeholder="Select value"
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
              <Text fontSize="sm" fontWeight="medium" mb={2}>Start Date</Text>
              <Input
                type="date"
                value={Array.isArray(filterValue) ? filterValue[0] : ''}
                onChange={(e) =>
                  handleValueChange([e.target.value, Array.isArray(filterValue) ? filterValue[1] : ''])
                }
              />
            </Box>
            <Box>
              <Text fontSize="sm" fontWeight="medium" mb={2}>End Date</Text>
              <Input
                type="date"
                value={Array.isArray(filterValue) ? filterValue[1] : ''}
                onChange={(e) =>
                  handleValueChange([Array.isArray(filterValue) ? filterValue[0] : '', e.target.value])
                }
              />
            </Box>
          </VStack>
        )

      case 'number':
        return (
          <VStack spacing={2} align="stretch">
            <Box>
              <Text fontSize="sm" fontWeight="medium" mb={2}>Min</Text>
              <Input
                type="number"
                value={Array.isArray(filterValue) ? filterValue[0] : ''}
                onChange={(e) =>
                  handleValueChange([e.target.value, Array.isArray(filterValue) ? filterValue[1] : ''])
                }
              />
            </Box>
            <Box>
              <Text fontSize="sm" fontWeight="medium" mb={2}>Max</Text>
              <Input
                type="number"
                value={Array.isArray(filterValue) ? filterValue[1] : ''}
                onChange={(e) =>
                  handleValueChange([Array.isArray(filterValue) ? filterValue[0] : '', e.target.value])
                }
              />
            </Box>
          </VStack>
        )

      case 'boolean':
        return (
          <Select value={String(filterValue)} onChange={(e) => handleValueChange(e.target.value === 'true')}>
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
          />
        )
    }
  }

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="sm">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader borderBottom="1px solid" borderColor="gray.200">
          Filter: {typeof column.header === 'string' ? column.header : column.id}
        </DrawerHeader>

        <DrawerBody py={6}>
          <VStack spacing={4} align="stretch">
            <Box>
              <Text fontSize="sm" fontWeight="medium" mb={2}>Filter Value</Text>
              {renderFilterInput()}
            </Box>
            {hasChanges && (
              <Text fontSize="xs" color="gray.500" fontStyle="italic">
                Changes pending - click Apply to filter
              </Text>
            )}
          </VStack>
        </DrawerBody>

        <DrawerFooter borderTop="1px solid" borderColor="gray.200">
          <HStack spacing={2} w="full">
            <Button variant="outline" onClick={handleClear} flex={1}>
              Clear
            </Button>
            <Button colorScheme="green" onClick={handleApply} flex={1} isDisabled={!hasChanges && !currentFilter}>
              Apply
            </Button>
          </HStack>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
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

