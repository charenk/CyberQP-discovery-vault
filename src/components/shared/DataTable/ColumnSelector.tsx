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
  Checkbox,
  CheckboxGroup,
  Stack,
  HStack,
  Text,
} from '@chakra-ui/react'
import { ColumnDef } from './types'

interface ColumnSelectorProps<T = any> {
  isOpen: boolean
  onClose: () => void
  columns: ColumnDef<T>[]
  visibleColumns: string[]
  defaultColumns: string[]
  onToggleColumn: (columnId: string) => void
  onResetToDefault: () => void
}

export function ColumnSelector<T = any>({
  isOpen,
  onClose,
  columns,
  visibleColumns,
  defaultColumns,
  onToggleColumn,
  onResetToDefault,
}: ColumnSelectorProps<T>) {
  const defaultColumnsSet = new Set(defaultColumns)
  const visibleColumnsSet = new Set(visibleColumns)

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="sm">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader borderBottom="1px solid" borderColor="gray.200">
          Select Columns
        </DrawerHeader>

        <DrawerBody py={6}>
          <VStack spacing={4} align="stretch">
            <Text fontSize="sm" color="gray.600">
              Choose which columns to display in the table
            </Text>

            <CheckboxGroup value={visibleColumns} onChange={(values) => {
              // Toggle columns that changed
              const newSet = new Set(values as string[])
              columns.forEach((col) => {
                const shouldBeVisible = newSet.has(col.id)
                const isVisible = visibleColumnsSet.has(col.id)
                if (shouldBeVisible !== isVisible) {
                  onToggleColumn(col.id)
                }
              })
            }}>
              <Stack spacing={2}>
                {columns.map((column) => {
                  const columnName = typeof column.header === 'string' ? column.header : column.id
                  const isDefault = defaultColumnsSet.has(column.id)
                  
                  return (
                    <Checkbox key={column.id} value={column.id}>
                      <HStack spacing={2}>
                        <Text fontSize="sm">{columnName}</Text>
                        {isDefault && (
                          <Text fontSize="xs" color="gray.500">
                            (default)
                          </Text>
                        )}
                      </HStack>
                    </Checkbox>
                  )
                })}
              </Stack>
            </CheckboxGroup>
          </VStack>
        </DrawerBody>

        <DrawerFooter borderTop="1px solid" borderColor="gray.200">
          <HStack spacing={2} w="full">
            <Button variant="outline" onClick={onResetToDefault} flex={1}>
              Reset to Default
            </Button>
            <Button colorScheme="green" onClick={onClose} flex={1}>
              Done
            </Button>
          </HStack>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

