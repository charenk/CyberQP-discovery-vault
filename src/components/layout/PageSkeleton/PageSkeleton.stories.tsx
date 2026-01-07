import type { Meta, StoryObj } from '@storybook/react'
import { PageSkeleton } from './PageSkeleton'
import {
  FiFileText,
  FiBriefcase,
  FiStar,
  FiUsers,
  FiSettings,
  FiCheckCircle,
  FiUser,
  FiRepeat,
  FiHeadphones,
} from 'react-icons/fi'
import { Box, Text, VStack } from '@chakra-ui/react'

const meta: Meta<typeof PageSkeleton> = {
  title: 'Skeleton/PageSkeleton',
  component: PageSkeleton,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Page skeleton layout combining TopNav and LeftNav components. This serves as the base layout structure for CyberQP pages.',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof PageSkeleton>

const defaultLeftNavItems = [
  {
    id: 'documents',
    icon: FiFileText,
    label: 'Documents',
    onClick: () => console.log('Documents clicked'),
  },
  {
    id: 'briefcase',
    icon: FiBriefcase,
    label: 'Briefcase',
    onClick: () => console.log('Briefcase clicked'),
  },
  {
    id: 'star',
    icon: FiStar,
    label: 'Star',
    onClick: () => console.log('Star clicked'),
  },
  {
    id: 'users',
    icon: FiUsers,
    label: 'Users',
    onClick: () => console.log('Users clicked'),
  },
  {
    id: 'settings',
    icon: FiSettings,
    label: 'Settings',
    onClick: () => console.log('Settings clicked'),
  },
  {
    id: 'check',
    icon: FiCheckCircle,
    label: 'Check',
    onClick: () => console.log('Check clicked'),
  },
]

export const Default: Story = {
  args: {
    topNavProps: {
      searchPlaceholder: 'Accounts, customers...',
      userInitials: 'JW',
      userName: 'John Wickpossible log...',
      userRole: 'Super Admin',
      userEmail: 'john@company.com',
      profileMenuItems: [
        {
          id: 'profile',
          label: 'Profile',
          icon: FiUser,
          onClick: () => console.log('Profile clicked'),
        },
        {
          id: 'tenant-settings',
          label: 'Tenant settings',
          icon: FiSettings,
          onClick: () => console.log('Tenant settings clicked'),
        },
        {
          id: 'notification-preference',
          label: 'Notification preference',
          icon: FiRepeat,
          onClick: () => console.log('Notification preference clicked'),
        },
        {
          id: 'documentation',
          label: 'Documentation',
          icon: FiFileText,
          externalLink: true,
          onClick: () => console.log('Documentation clicked'),
        },
        {
          id: 'contact-support',
          label: 'Contact support',
          icon: FiHeadphones,
          externalLink: true,
          onClick: () => console.log('Contact support clicked'),
        },
      ],
      onLogout: () => console.log('Logout clicked'),
    },
    leftNavProps: {
      items: defaultLeftNavItems,
      activeItemId: 'users',
    },
  },
}

export const Empty: Story = {
  args: {
    topNavProps: {
      searchPlaceholder: 'Accounts, customers...',
      userInitials: 'DA',
    },
    leftNavProps: {
      items: defaultLeftNavItems,
      activeItemId: 'settings',
    },
    children: (
      <Box p={8}>
        <VStack spacing={4} align="stretch">
          <Text fontSize="2xl" fontWeight="bold">
            Page Content Area
          </Text>
          <Text color="gray.600">
            This is where your page content will go. The skeleton provides the TopNav and LeftNav structure.
          </Text>
        </VStack>
      </Box>
    ),
  },
}

export const WithProfileMenu: Story = {
  args: {
    topNavProps: {
      searchPlaceholder: 'Accounts, customers...',
      userInitials: 'JW',
      userName: 'John Wickpossible log...',
      userRole: 'Super Admin',
      userEmail: 'john@company.com',
      profileMenuItems: [
        {
          id: 'profile',
          label: 'Profile',
          icon: FiUser,
          onClick: () => console.log('Profile clicked'),
        },
        {
          id: 'tenant-settings',
          label: 'Tenant settings',
          icon: FiSettings,
          onClick: () => console.log('Tenant settings clicked'),
        },
        {
          id: 'notification-preference',
          label: 'Notification preference',
          icon: FiRepeat,
          onClick: () => console.log('Notification preference clicked'),
        },
        {
          id: 'documentation',
          label: 'Documentation',
          icon: FiFileText,
          externalLink: true,
          onClick: () => console.log('Documentation clicked'),
        },
        {
          id: 'contact-support',
          label: 'Contact support',
          icon: FiHeadphones,
          externalLink: true,
          onClick: () => console.log('Contact support clicked'),
        },
      ],
      onLogout: () => console.log('Logout clicked'),
    },
    leftNavProps: {
      items: defaultLeftNavItems,
      activeItemId: 'users',
    },
  },
}

export const WithoutLeftNav: Story = {
  args: {
    topNavProps: {
      searchPlaceholder: 'Accounts, customers...',
      userInitials: 'DA',
    },
    children: (
      <Box p={8}>
        <VStack spacing={4} align="stretch">
          <Text fontSize="2xl" fontWeight="bold">
            Page Without Left Navigation
          </Text>
          <Text color="gray.600">
            This skeleton shows the layout without the left navigation sidebar.
          </Text>
        </VStack>
      </Box>
    ),
  },
}

