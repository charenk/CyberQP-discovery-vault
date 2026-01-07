import type { Meta, StoryObj } from '@storybook/react'
import { LeftNav } from './LeftNav'
import {
  FiFileText,
  FiBriefcase,
  FiStar,
  FiUsers,
  FiSettings,
  FiCheckCircle,
} from 'react-icons/fi'

const meta: Meta<typeof LeftNav> = {
  title: 'Navigation/LeftNav',
  component: LeftNav,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Left navigation sidebar with icon buttons for CyberQP application.',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof LeftNav>

const defaultItems = [
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
    items: defaultItems,
  },
  decorators: [
    (Story) => (
      <div style={{ display: 'flex', height: '100vh' }}>
        <Story />
        <div style={{ flex: 1, padding: '20px' }}>
          <p>Main content area</p>
        </div>
      </div>
    ),
  ],
}

export const WithActiveItem: Story = {
  args: {
    items: defaultItems,
    activeItemId: 'settings',
  },
  decorators: [
    (Story) => (
      <div style={{ display: 'flex', height: '100vh' }}>
        <Story />
        <div style={{ flex: 1, padding: '20px' }}>
          <p>Main content area - Settings is active</p>
        </div>
      </div>
    ),
  ],
}

export const CustomItems: Story = {
  args: {
    items: [
      {
        id: 'home',
        icon: FiFileText,
        label: 'Home',
        onClick: () => console.log('Home clicked'),
      },
      {
        id: 'dashboard',
        icon: FiBriefcase,
        label: 'Dashboard',
        onClick: () => console.log('Dashboard clicked'),
      },
      {
        id: 'reports',
        icon: FiStar,
        label: 'Reports',
        onClick: () => console.log('Reports clicked'),
      },
    ],
    activeItemId: 'dashboard',
  },
  decorators: [
    (Story) => (
      <div style={{ display: 'flex', height: '100vh' }}>
        <Story />
        <div style={{ flex: 1, padding: '20px' }}>
          <p>Main content area</p>
        </div>
      </div>
    ),
  ],
}


