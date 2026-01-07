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
  Text,
  Icon,
  HStack,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
} from '@chakra-ui/react'
import { BulkAction } from './types'
import { useRef, useState } from 'react'

interface DataTableBulkActionsProps<T = any> {
  isOpen: boolean
  onClose: () => void
  selectedRows: T[]
  bulkActions: BulkAction<T>[]
}

export function DataTableBulkActions<T = any>({
  isOpen,
  onClose,
  selectedRows,
  bulkActions,
}: DataTableBulkActionsProps<T>) {
  const [actionToConfirm, setActionToConfirm] = useState<BulkAction<T> | null>(null)
  const { isOpen: isConfirmOpen, onOpen: onConfirmOpen, onClose: onConfirmClose } = useDisclosure()
  const cancelRef = useRef<HTMLButtonElement>(null)

  const visibleActions = bulkActions.filter((action) => {
    if (action.visible === undefined) return true
    return action.visible(selectedRows)
  })

  const handleActionClick = (action: BulkAction<T>) => {
    if (action.requiresConfirmation) {
      setActionToConfirm(action)
      onConfirmOpen()
    } else {
      action.onClick(selectedRows)
      onClose()
    }
  }

  const handleConfirm = async () => {
    if (actionToConfirm) {
      await actionToConfirm.onClick(selectedRows)
      setActionToConfirm(null)
      onConfirmClose()
      onClose()
    }
  }

  return (
    <>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="sm">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottom="1px solid" borderColor="gray.200">
            Actions ({selectedRows.length} selected)
          </DrawerHeader>

          <DrawerBody py={6}>
            <VStack spacing={2} align="stretch">
              {visibleActions.map((action) => {
                const isDisabled = action.disabled ? action.disabled(selectedRows) : false
                return (
                  <Button
                    key={action.id}
                    leftIcon={action.icon ? <Icon as={action.icon as any} /> : undefined}
                    onClick={() => handleActionClick(action)}
                    isDisabled={isDisabled}
                    variant={action.variant === 'danger' ? 'solid' : 'outline'}
                    colorScheme={action.variant === 'danger' ? 'red' : 'green'}
                    justifyContent="flex-start"
                    w="full"
                  >
                    {action.label}
                  </Button>
                )
              })}
            </VStack>
          </DrawerBody>

          <DrawerFooter borderTop="1px solid" borderColor="gray.200">
            <Text fontSize="sm" color="gray.600">
              {selectedRows.length} item{selectedRows.length !== 1 ? 's' : ''} selected
            </Text>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <AlertDialog isOpen={isConfirmOpen} leastDestructiveRef={cancelRef} onClose={onConfirmClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirm Action
            </AlertDialogHeader>

            <AlertDialogBody>
              {actionToConfirm?.confirmationMessage
                ? typeof actionToConfirm.confirmationMessage === 'function'
                  ? actionToConfirm.confirmationMessage(selectedRows)
                  : actionToConfirm.confirmationMessage
                : `Are you sure you want to perform this action on ${selectedRows.length} item(s)?`}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onConfirmClose}>
                Cancel
              </Button>
              <Button
                colorScheme={actionToConfirm?.variant === 'danger' ? 'red' : 'green'}
                onClick={handleConfirm}
                ml={3}
              >
                Confirm
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}

