'use client'

import {
  HStack,
  Text,
  Button,
  Box,
} from '@chakra-ui/react'
import { FilterChip } from './FilterChip'
import { ColumnFilter, ColumnDef } from './types'
import { useRef, useState, useEffect } from 'react'

interface AppliedFiltersDisplayProps<T = any> {
  appliedFilters: Record<string, ColumnFilter>
  globalSearch?: string
  columns: ColumnDef<T>[]
  onRemoveFilter: (columnId: string) => void
  onClearGlobalSearch: () => void
  onClearAll: () => void
}

export function AppliedFiltersDisplay<T = any>({
  appliedFilters,
  globalSearch,
  columns,
  onRemoveFilter,
  onClearGlobalSearch,
  onClearAll,
}: AppliedFiltersDisplayProps<T>) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [visibleCount, setVisibleCount] = useState(0)
  const [hiddenCount, setHiddenCount] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const chipsRef = useRef<HTMLDivElement>(null)

  // Get all filter chips
  const allChips = [
    ...Object.values(appliedFilters).map((filter) => {
      const column = columns.find((col) => col.id === filter.columnId)
      const columnName = column ? (typeof column.header === 'string' ? column.header : column.id) : filter.columnId
      const count = Array.isArray(filter.value) ? filter.value.length : 1
      return {
        filter,
        columnName,
        count,
        key: filter.columnId,
      }
    }),
    ...(globalSearch
      ? [
          {
            filter: { columnId: 'search', value: globalSearch } as ColumnFilter,
            columnName: 'Search',
            count: 1,
            key: 'search',
          },
        ]
      : []),
  ]

  const totalCount = allChips.length

  // Calculate visible and hidden counts based on container width
  useEffect(() => {
    if (isExpanded || allChips.length === 0) {
      setVisibleCount(allChips.length)
      setHiddenCount(0)
      return
    }

    // Use a more reliable method: measure after render
    const calculateVisible = () => {
      if (!containerRef.current || !chipsRef.current) {
        return
      }

      const containerWidth = containerRef.current.offsetWidth
      const chips = Array.from(chipsRef.current.children) as HTMLElement[]
      if (chips.length === 0) return

      let visible = 0
      let totalWidth = 0
      const seeMoreButtonWidth = 130 // Approximate width of "See more (#)" button
      const clearAllButtonWidth = 140 // Approximate width of "Clear all filters" button
      const spacing = 8 // Gap between chips
      const labelWidth = 150 // "Applied Filters: X" label width

      // Available width for chips (container - label - spacing)
      const availableWidth = containerWidth - labelWidth - spacing * 2

      // First, render all chips invisibly to measure them
      // Then calculate how many fit
      // We need to measure actual chip widths
      const chipWidths: number[] = []
      chips.forEach((chip) => {
        const width = chip.offsetWidth || chip.getBoundingClientRect().width
        chipWidths.push(width)
      })

      // Calculate how many chips fit
      for (let i = 0; i < chipWidths.length; i++) {
        const chipWidth = chipWidths[i]
        const neededWidth = totalWidth + chipWidth + (i > 0 ? spacing : 0)

        // Check if we need space for "See more" and "Clear all" buttons
        const hasMoreChips = i < chipWidths.length - 1
        const buttonSpace = hasMoreChips
          ? seeMoreButtonWidth + clearAllButtonWidth + spacing * 2
          : clearAllButtonWidth + spacing

        if (neededWidth + buttonSpace <= availableWidth) {
          totalWidth = neededWidth
          visible++
        } else {
          break
        }
      }

      setVisibleCount(visible)
      setHiddenCount(allChips.length - visible)
    }

    // Calculate after a brief delay to ensure DOM is rendered
    const timeoutId = setTimeout(calculateVisible, 0)
    
    // Also recalculate on window resize
    window.addEventListener('resize', calculateVisible)

    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('resize', calculateVisible)
    }
  }, [allChips.length, isExpanded, appliedFilters, globalSearch])

  const visibleChips = isExpanded ? allChips : allChips.slice(0, visibleCount)
  const hasMore = hiddenCount > 0 && !isExpanded

  if (totalCount === 0) {
    return (
      <HStack spacing={4}>
        <Text fontSize="sm" fontWeight="medium" color="gray.600" whiteSpace="nowrap">
          Applied Filters: 0
        </Text>
      </HStack>
    )
  }

  return (
    <HStack spacing={4} align="flex-start" w="full" ref={containerRef}>
      <Text fontSize="sm" fontWeight="medium" color="gray.600" whiteSpace="nowrap" flexShrink={0}>
        Applied Filters: {totalCount}
      </Text>
      <Box flex={1} minW={0} overflow="hidden">
        <HStack
          ref={chipsRef}
          spacing={2}
          flexWrap={isExpanded ? 'wrap' : 'nowrap'}
          align="flex-start"
        >
          {/* Render all chips for measurement, but hide overflow when collapsed */}
          {allChips.map((chip, index) => {
            const isVisible = isExpanded || index < visibleCount
            return (
              <Box
                key={chip.key}
                display={isVisible ? 'block' : 'none'}
              >
                <FilterChip
                  filter={chip.filter}
                  columnName={chip.columnName}
                  count={chip.count}
                  onRemove={() => {
                    if (chip.key === 'search') {
                      onClearGlobalSearch()
                    } else {
                      onRemoveFilter(chip.key)
                    }
                  }}
                />
              </Box>
            )
          })}
          {hasMore && (
            <Button
              size="sm"
              variant="ghost"
              colorScheme="green"
              onClick={() => setIsExpanded(true)}
              whiteSpace="nowrap"
              flexShrink={0}
            >
              See more ({hiddenCount})
            </Button>
          )}
          {isExpanded && (
            <Button
              size="sm"
              variant="ghost"
              colorScheme="green"
              onClick={() => setIsExpanded(false)}
              whiteSpace="nowrap"
              flexShrink={0}
            >
              See less
            </Button>
          )}
          {totalCount > 0 && (
            <Button
              size="sm"
              variant="link"
              colorScheme="green"
              onClick={onClearAll}
              whiteSpace="nowrap"
              flexShrink={0}
              ml={isExpanded ? 0 : 'auto'}
            >
              Clear all filters
            </Button>
          )}
        </HStack>
      </Box>
    </HStack>
  )
}

