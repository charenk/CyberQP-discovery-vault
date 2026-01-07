'use client'

import { Box, Flex } from '@chakra-ui/react'
import { TopNav, TopNavProps } from '../TopNav'
import { LeftNav, LeftNavProps } from '../LeftNav'

export interface PageSkeletonProps {
  topNavProps?: TopNavProps
  leftNavProps?: LeftNavProps
  children?: React.ReactNode
}

export function PageSkeleton({
  topNavProps,
  leftNavProps,
  children,
}: PageSkeletonProps) {
  return (
    <Box
      w="100vw"
      h="100vh"
      display="flex"
      flexDirection="column"
      overflow="hidden"
      bg="white"
      _dark={{
        bg: 'gray.900',
      }}
    >
      {/* Top Navigation */}
      <TopNav {...topNavProps} />

      {/* Main Layout: Left Nav + Content */}
      <Flex flex={1} overflow="hidden">
        {/* Left Navigation */}
        {leftNavProps && <LeftNav {...leftNavProps} />}

        {/* Main Content Area */}
        <Box
          flex={1}
          overflow="auto"
          bg="white"
          _dark={{
            bg: 'gray.900',
          }}
        >
          {children}
        </Box>
      </Flex>
    </Box>
  )
}

