import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { DataTable } from './DataTable'
import type { ColumnDef } from './types'

interface SimpleUser {
  id: string
  name: string
  email: string
  status?: string
  department?: string
}

const simpleColumns: ColumnDef<SimpleUser>[] = [
  {
    id: 'name',
    header: 'Name',
    accessorKey: 'name',
    sortable: true,
    filterable: true,
    dataType: 'string',
  },
  {
    id: 'email',
    header: 'Email',
    accessorKey: 'email',
    sortable: true,
    filterable: true,
    dataType: 'string',
  },
]

// Example with enum column for testing popover
const columnsWithEnum: ColumnDef<SimpleUser>[] = [
  ...simpleColumns,
  {
    id: 'status',
    header: 'Status',
    accessorKey: 'status',
    sortable: true,
    filterable: true,
    dataType: 'enum',
    filterOptions: ['Active', 'Inactive', 'Pending', 'Suspended', 'Archived'], // 5 options - no search
  },
  {
    id: 'department',
    header: 'Department',
    accessorKey: 'department',
    sortable: true,
    filterable: true,
    dataType: 'enum',
    filterOptions: [
      'IT', 'Security', 'HR', 'Finance', 'Operations', 
      'Marketing', 'Sales', 'Support', 'Engineering', 'Product', 
      'Design', 'Legal', 'Admin', 'Research', 'Development'
    ], // 15 options - with search
  },
]

const simpleData: SimpleUser[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com' },
]

const meta: Meta<typeof DataTable> = {
  title: 'Components/DataTable',
  component: DataTable,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A comprehensive table component with filtering, sorting, infinite scroll, bulk selection, and more.',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof DataTable>

export const Basic: Story = {
  args: {
    data: simpleData,
    columns: simpleColumns as any,
    getRowId: (row: SimpleUser) => row.id,
  } as any,
}

export const WithEnumFilters: Story = {
  args: {
    data: [
      ...simpleData,
      { id: '4', name: 'Alice Brown', email: 'alice@example.com', status: 'Active', department: 'IT' },
      { id: '5', name: 'Charlie Davis', email: 'charlie@example.com', status: 'Pending', department: 'Security' },
      { id: '6', name: 'Diana Wilson', email: 'diana@example.com', status: 'Inactive', department: 'HR' },
    ],
    columns: columnsWithEnum as any,
    getRowId: (row: SimpleUser) => row.id,
    enableColumnFilters: true,
  } as any,
}

