import type { Meta, StoryObj } from '@storybook/react'
import { TopNav } from './TopNav'
import { Box } from '@chakra-ui/react'

const meta: Meta<typeof TopNav> = {
  title: 'Navigation/TopNav',
  component: TopNav,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Top navigation bar with logo, search, and user menu for CyberQP application.',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof TopNav>

export const Default: Story = {
  args: {
    searchPlaceholder: 'Accounts, customers...',
    userInitials: 'DA',
  },
}

export const WithLogo: Story = {
  args: {
    searchPlaceholder: 'Accounts, customers...',
    userInitials: 'DA',
    logo: (
      <Box
        w={10}
        h={10}
        borderRadius="md"
        bg="green.500"
        display="flex"
        alignItems="center"
        justifyContent="center"
        color="white"
        fontWeight="bold"
        fontSize="lg"
      >
        C
      </Box>
    ),
  },
}

export const WithUserMenu: Story = {
  args: {
    searchPlaceholder: 'Accounts, customers...',
    userInitials: 'DA',
    userMenuItems: [
      {
        label: 'Profile',
        onClick: () => console.log('Profile clicked'),
      },
      {
        label: 'Settings',
        onClick: () => console.log('Settings clicked'),
      },
      {
        label: 'Logout',
        onClick: () => console.log('Logout clicked'),
      },
    ],
  },
}

export const WithSearchHandler: Story = {
  args: {
    searchPlaceholder: 'Search anything...',
    userInitials: 'JD',
    onSearch: (value) => {
      console.log('Search:', value)
    },
  },
}

export const CustomUserInitials: Story = {
  args: {
    searchPlaceholder: 'Accounts, customers...',
    userInitials: 'JD',
  },
}


