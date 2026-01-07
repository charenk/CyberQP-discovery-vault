'use client'

import { Input, InputGroup, InputLeftElement, IconButton, HStack } from '@chakra-ui/react'
import { FiSearch, FiX } from 'react-icons/fi'
import { useDebounce } from './hooks/useDebounce'
import { useEffect, useState } from 'react'

interface DataTableSearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  debounceMs?: number
}

export function DataTableSearch({
  value,
  onChange,
  placeholder = 'Search...',
  debounceMs = 300,
}: DataTableSearchProps) {
  const [localValue, setLocalValue] = useState(value)
  const debouncedValue = useDebounce(localValue, debounceMs)

  useEffect(() => {
    onChange(debouncedValue)
  }, [debouncedValue, onChange])

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleClear = () => {
    setLocalValue('')
    onChange('')
  }

  return (
    <InputGroup maxW="400px">
      <InputLeftElement pointerEvents="none">
        <FiSearch color="gray" />
      </InputLeftElement>
      <Input
        placeholder={placeholder}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        pr={localValue ? '2.5rem' : undefined}
      />
      {localValue && (
        <HStack position="absolute" right={2} top="50%" transform="translateY(-50%)" zIndex={1}>
          <IconButton
            aria-label="Clear search"
            icon={<FiX />}
            size="xs"
            variant="ghost"
            onClick={handleClear}
            h="auto"
            minW="auto"
          />
        </HStack>
      )}
    </InputGroup>
  )
}

