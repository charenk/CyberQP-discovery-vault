'use client'

import { DataTable, ColumnDef, RowAction, BulkAction } from '@/components/shared/DataTable'
import { useState } from 'react'
import { Box, Heading, Text, VStack, Badge } from '@chakra-ui/react'

// Sample data type
interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user' | 'guest'
  department: string
  status: 'active' | 'inactive' | 'pending'
  lastLogin: Date
  createdAt: Date
}

// Sample data
const generateSampleData = (count: number): User[] => {
  const roles: User['role'][] = ['admin', 'user', 'guest']
  const departments = ['IT', 'Security', 'HR', 'Finance', 'Operations']
  const statuses: User['status'][] = ['active', 'inactive', 'pending']
  
  return Array.from({ length: count }, (_, i) => ({
    id: `user-${i + 1}`,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    role: roles[i % roles.length],
    department: departments[i % departments.length],
    status: statuses[i % statuses.length],
    lastLogin: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
  }))
}

const initialData = generateSampleData(50)

export default function TableDemoPage() {
  const [data, setData] = useState<User[]>(initialData)
  const [hasMore, setHasMore] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  // Column definitions
  const columns: ColumnDef<User>[] = [
    {
      id: 'name',
      header: 'Name',
      accessorKey: 'name',
      sortable: true,
      filterable: true,
      dataType: 'string',
      width: '200px',
    },
    {
      id: 'email',
      header: 'Email',
      accessorKey: 'email',
      sortable: true,
      filterable: true,
      dataType: 'string',
      width: '250px',
    },
    {
      id: 'role',
      header: 'Role',
      accessorKey: 'role',
      sortable: true,
      filterable: true,
      dataType: 'enum',
      filterOptions: ['admin', 'user', 'guest'],
      width: '120px',
      cell: ({ value }) => (
        <Badge
          colorScheme={
            value === 'admin' ? 'red' : value === 'user' ? 'blue' : 'gray'
          }
        >
          {value}
        </Badge>
      ),
    },
    {
      id: 'department',
      header: 'Department',
      accessorKey: 'department',
      sortable: true,
      filterable: true,
      dataType: 'enum',
      filterOptions: ['IT', 'Security', 'HR', 'Finance', 'Operations'],
      width: '150px',
    },
    {
      id: 'status',
      header: 'Status',
      accessorKey: 'status',
      sortable: true,
      filterable: true,
      dataType: 'enum',
      filterOptions: ['active', 'inactive', 'pending'],
      width: '120px',
      cell: ({ value }) => (
        <Badge
          colorScheme={
            value === 'active' ? 'green' : value === 'inactive' ? 'red' : 'yellow'
          }
        >
          {value}
        </Badge>
      ),
    },
    {
      id: 'lastLogin',
      header: 'Last Login',
      accessorKey: 'lastLogin',
      sortable: true,
      filterable: true,
      dataType: 'date',
      width: '180px',
      cell: ({ value }) => {
        const date = value instanceof Date ? value : new Date(value)
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      },
    },
    {
      id: 'createdAt',
      header: 'Created',
      accessorKey: 'createdAt',
      sortable: true,
      filterable: true,
      dataType: 'date',
      width: '180px',
      cell: ({ value }) => {
        const date = value instanceof Date ? value : new Date(value)
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      },
    },
  ]

  // Row actions
  const rowActions: RowAction<User>[] = [
    {
      id: 'view',
      label: 'View Details',
      onClick: (row) => {
        console.log('View user:', row)
        alert(`Viewing details for ${row.name}`)
      },
    },
    {
      id: 'edit',
      label: 'Edit',
      onClick: (row) => {
        console.log('Edit user:', row)
        alert(`Editing ${row.name}`)
      },
    },
    {
      id: 'delete',
      label: 'Delete',
      variant: 'danger',
      onClick: async (row) => {
        if (confirm(`Are you sure you want to delete ${row.name}?`)) {
          setData((prev) => prev.filter((u) => u.id !== row.id))
        }
      },
    },
  ]

  // Bulk actions
  const bulkActions: BulkAction<User>[] = [
    {
      id: 'export',
      label: 'Export Selected',
      onClick: (selectedRows) => {
        console.log('Exporting:', selectedRows)
        alert(`Exporting ${selectedRows.length} user(s)`)
      },
    },
    {
      id: 'activate',
      label: 'Activate Selected',
      onClick: async (selectedRows) => {
        setData((prev) =>
          prev.map((user) =>
            selectedRows.some((r) => r.id === user.id)
              ? { ...user, status: 'active' as const }
              : user
          )
        )
        alert(`Activated ${selectedRows.length} user(s)`)
      },
    },
    {
      id: 'deactivate',
      label: 'Deactivate Selected',
      onClick: async (selectedRows) => {
        setData((prev) =>
          prev.map((user) =>
            selectedRows.some((r) => r.id === user.id)
              ? { ...user, status: 'inactive' as const }
              : user
          )
        )
        alert(`Deactivated ${selectedRows.length} user(s)`)
      },
    },
    {
      id: 'delete',
      label: 'Delete Selected',
      variant: 'danger',
      requiresConfirmation: true,
      confirmationMessage: (selectedRows) =>
        `Are you sure you want to delete ${selectedRows.length} user(s)? This action cannot be undone.`,
      onClick: async (selectedRows) => {
        setData((prev) => prev.filter((user) => !selectedRows.some((r) => r.id === user.id)))
        alert(`Deleted ${selectedRows.length} user(s)`)
      },
    },
  ]

  // Infinite scroll handler
  const handleLoadMore = async (): Promise<User[]> => {
    setIsLoadingMore(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    
    const newData = generateSampleData(20)
    setData((prev) => [...prev, ...newData])
    
    // Stop loading more after 200 items
    if (data.length + newData.length >= 200) {
      setHasMore(false)
    }
    
    setIsLoadingMore(false)
    return newData
  }

  // Handle row click
  const handleRowClick = (row: User) => {
    console.log('Row clicked:', row)
  }

  // Handle row expansion
  const expandedRowRender = (row: User) => (
    <VStack align="stretch" spacing={2} p={4}>
      <Text fontWeight="bold">User Details</Text>
      <Text><strong>ID:</strong> {row.id}</Text>
      <Text><strong>Email:</strong> {row.email}</Text>
      <Text><strong>Role:</strong> {row.role}</Text>
      <Text><strong>Department:</strong> {row.department}</Text>
      <Text><strong>Status:</strong> {row.status}</Text>
      <Text><strong>Last Login:</strong> {row.lastLogin.toLocaleString()}</Text>
      <Text><strong>Created:</strong> {row.createdAt.toLocaleString()}</Text>
    </VStack>
  )

  return (
    <Box minH="100vh" bg="gray.50" p={8}>
      <VStack spacing={6} align="stretch" maxW="container.xl" mx="auto">
        <Box>
          <Heading size="lg" mb={2}>
            DataTable Component Demo
          </Heading>
          <Text color="gray.600">
            Comprehensive table component with filtering, sorting, infinite scroll, bulk actions, and more.
          </Text>
        </Box>

        <DataTable
          data={data}
          columns={columns}
          getRowId={(row) => row.id}
          primaryColumnId="name"
          onLoadMore={handleLoadMore}
          hasMore={hasMore}
          isLoadingMore={isLoadingMore}
          enableGlobalSearch
          enableColumnFilters
          enableSorting
          enableSelection
          enableBulkSelection
          enableColumnVisibility
          enableExport
          enableRowExpansion
          rowActions={rowActions}
          bulkActions={bulkActions}
          onRowClick={handleRowClick}
          expandedRowRender={expandedRowRender}
          stickyHeader
          persistFilters
          emptyStateMessage="No users found"
          errorStateMessage="Failed to load users"
        />
      </VStack>
    </Box>
  )
}

