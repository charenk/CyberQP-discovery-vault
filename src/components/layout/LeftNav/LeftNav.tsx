'use client'

import {
  Box,
  VStack,
  IconButton,
  Tooltip,
  Icon,
} from '@chakra-ui/react'
import { IconType } from 'react-icons'

export interface LeftNavItem {
  id: string
  icon: IconType
  label: string
  onClick: () => void
  isActive?: boolean
}

export interface LeftNavProps {
  items: LeftNavItem[]
  activeItemId?: string
}

export function LeftNav({ items, activeItemId }: LeftNavProps) {
  return (
    <Box
      as="nav"
      bg="gray.50"
      borderRight="1px solid"
      borderColor="gray.200"
      w="48px"
      maxW="48px"
      h="full"
      py={4}
      display="flex"
      flexDirection="column"
      alignItems="center"
      _dark={{
        bg: 'gray.800',
        borderColor: 'gray.700',
      }}
    >
      <VStack spacing={2} align="center" w="full">
        {items.map((item) => {
          const isActive = activeItemId === item.id || item.isActive
          
          return (
            <Tooltip
              key={item.id}
              label={item.label}
              placement="right"
              hasArrow
            >
              <IconButton
                aria-label={item.label}
                icon={<Icon as={item.icon} />}
                onClick={item.onClick}
                variant="ghost"
                size="sm"
                w="36px"
                h="36px"
                borderRadius="md"
                // Default state (inactive)
                bg="transparent"
                color="gray.700"
                border="1px solid"
                borderColor="transparent"
                _dark={{
                  color: 'gray.300',
                }}
                // Hover state: Light green background with green icon
                _hover={{
                  bg: 'green.50',
                  color: 'green.600',
                  borderColor: 'green.200',
                  _dark: {
                    bg: 'green.900',
                    color: 'green.300',
                    borderColor: 'green.700',
                  },
                }}
                // Active/Pressed state
                _active={{
                  bg: 'green.100',
                  color: 'green.700',
                  borderColor: 'green.300',
                  transform: 'scale(0.95)',
                  _dark: {
                    bg: 'green.800',
                    color: 'green.200',
                    borderColor: 'green.600',
                  },
                }}
                // Focus state (keyboard navigation)
                _focus={{
                  bg: 'green.50',
                  color: 'green.600',
                  borderColor: 'green.300',
                  boxShadow: '0 0 0 2px var(--chakra-colors-green-200)',
                  outline: 'none',
                  _dark: {
                    bg: 'green.900',
                    color: 'green.300',
                    borderColor: 'green.700',
                    boxShadow: '0 0 0 2px var(--chakra-colors-green-700)',
                  },
                }}
                // Active/Selected state: Solid green background with white icon
                {...(isActive && {
                  bg: 'green.500',
                  color: 'white',
                  borderColor: 'green.500',
                  _hover: {
                    bg: 'green.600',
                    color: 'white',
                    borderColor: 'green.600',
                  },
                  _active: {
                    bg: 'green.700',
                    color: 'white',
                    borderColor: 'green.700',
                    transform: 'scale(0.95)',
                  },
                  _focus: {
                    bg: 'green.500',
                    color: 'white',
                    borderColor: 'green.500',
                    boxShadow: '0 0 0 2px var(--chakra-colors-green-300)',
                    outline: 'none',
                  },
                })}
                // Disabled state
                _disabled={{
                  opacity: 0.4,
                  cursor: 'not-allowed',
                  bg: 'transparent',
                  color: 'gray.400',
                  _dark: {
                    color: 'gray.600',
                  },
                }}
                transition="all 0.2s ease-in-out"
              />
            </Tooltip>
          )
        })}
      </VStack>
    </Box>
  )
}

