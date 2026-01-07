'use client'

import { Badge, HStack, IconButton, Text } from '@chakra-ui/react'
import { FiX } from 'react-icons/fi'
import { ColumnFilter } from './types'

interface FilterChipProps {
  filter: ColumnFilter
  columnName: string
  count?: number
  onRemove: () => void
}

export function FilterChip({ filter, columnName, count, onRemove }: FilterChipProps) {
  // Calculate count if not provided
  const displayCount = count !== undefined 
    ? count 
    : Array.isArray(filter.value) 
      ? filter.value.length 
      : 1

  return (
    <Badge
      colorScheme="green"
      variant="subtle"
      px={2}
      py={1}
      borderRadius="md"
      display="flex"
      alignItems="center"
      gap={1}
      whiteSpace="nowrap"
    >
      <Text fontSize="xs" fontWeight="medium">
        {columnName}: {displayCount}
      </Text>
      <IconButton
        aria-label="Remove filter"
        icon={<FiX />}
        size="xs"
        variant="ghost"
        onClick={onRemove}
        h="auto"
        minW="auto"
        p={0}
        color="gray.600"
        _hover={{ color: 'gray.800' }}
      />
    </Badge>
  )
}

