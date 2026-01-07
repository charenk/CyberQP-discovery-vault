'use client'

import { Box, Text, Spinner, VStack, Icon } from '@chakra-ui/react'
import { FiInbox, FiAlertCircle } from 'react-icons/fi'

interface EmptyStateProps {
  message?: string
}

export function EmptyState({ message = 'No data available' }: EmptyStateProps) {
  return (
    <Box py={12} textAlign="center">
      <VStack spacing={4}>
        <Icon as={FiInbox} boxSize={12} color="gray.400" />
        <Text color="gray.600" fontSize="md">
          {message}
        </Text>
      </VStack>
    </Box>
  )
}

interface ErrorStateProps {
  message?: string
  onRetry?: () => void
}

export function ErrorState({ message = 'An error occurred while loading data', onRetry }: ErrorStateProps) {
  return (
    <Box py={12} textAlign="center">
      <VStack spacing={4}>
        <Icon as={FiAlertCircle} boxSize={12} color="red.400" />
        <Text color="red.600" fontSize="md">
          {message}
        </Text>
        {onRetry && (
          <Text as="button" color="blue.500" onClick={onRetry} textDecoration="underline">
            Retry
          </Text>
        )}
      </VStack>
    </Box>
  )
}

interface LoadingStateProps {
  rows?: number
  columns?: number
}

export function LoadingState({ rows = 5, columns = 5 }: LoadingStateProps) {
  return (
    <Box>
      {Array.from({ length: rows }).map((_, i) => (
        <Box key={i} display="flex" gap={4} py={3} borderBottom="1px solid" borderColor="gray.200">
          {Array.from({ length: columns }).map((_, j) => (
            <Box key={j} flex={1}>
              <Box h={4} bg="gray.200" borderRadius="md" />
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  )
}

interface LoadingMoreProps {
  message?: string
}

export function LoadingMore({ message = 'Loading more...' }: LoadingMoreProps) {
  return (
    <Box py={4} textAlign="center">
      <VStack spacing={2}>
        <Spinner size="sm" color="gray.400" />
        <Text color="gray.600" fontSize="sm">
          {message}
        </Text>
      </VStack>
    </Box>
  )
}

interface NoResultsProps {
  message?: string
}

export function NoResults({ message = 'No results found' }: NoResultsProps) {
  return (
    <Box py={12} textAlign="center">
      <VStack spacing={4}>
        <Icon as={FiInbox} boxSize={12} color="gray.400" />
        <Text color="gray.600" fontSize="md">
          {message}
        </Text>
        <Text color="gray.500" fontSize="sm">
          Try adjusting your filters or search terms
        </Text>
      </VStack>
    </Box>
  )
}

