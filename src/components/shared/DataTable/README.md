# DataTable Component

A comprehensive, feature-rich table component built with Chakra UI v3.30.0 for the CyberQP Privileged Access Management platform.

## Features

- ✅ **Column-level filtering** - Each column can be filtered with Apply button
- ✅ **Global search** - Debounced search across all columns
- ✅ **Column sorting** - Ascending/descending sort for each column
- ✅ **Infinite scroll** - Load more data as you scroll
- ✅ **Bulk selection** - Select multiple rows with checkboxes
- ✅ **Bulk actions** - Context-dependent actions for selected rows
- ✅ **Row interactions** - Click rows, expand rows, per-row actions
- ✅ **Column visibility** - Show/hide columns with persistence
- ✅ **Export** - Export data as CSV, JSON, or Excel
- ✅ **Sticky headers** - Headers remain visible while scrolling
- ✅ **Keyboard navigation** - Arrow keys, Enter, Escape
- ✅ **URL persistence** - Filters persist in URL query parameters
- ✅ **Loading states** - Skeleton loaders, empty states, error states
- ✅ **Grey/Green theme** - Styled with CyberQP color scheme

## Installation

The component is already set up in the project. Make sure you have the required dependencies:

```bash
npm install @chakra-ui/react@^3.30.0 react-intersection-observer use-debounce
```

## Basic Usage

```tsx
import { DataTable, ColumnDef } from '@/components/shared/DataTable'

interface User {
  id: string
  name: string
  email: string
  role: string
  status: 'active' | 'inactive'
}

const columns: ColumnDef<User>[] = [
  {
    id: 'name',
    header: 'Name',
    accessorKey: 'name',
    sortable: true,
    filterable: true,
  },
  {
    id: 'email',
    header: 'Email',
    accessorKey: 'email',
    sortable: true,
    filterable: true,
  },
  {
    id: 'role',
    header: 'Role',
    accessorKey: 'role',
    sortable: true,
    filterable: true,
    dataType: 'enum',
    filterOptions: ['admin', 'user', 'guest'],
  },
  {
    id: 'status',
    header: 'Status',
    accessorKey: 'status',
    sortable: true,
    filterable: true,
    dataType: 'enum',
    filterOptions: ['active', 'inactive'],
  },
]

const users: User[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'admin', status: 'active' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'user', status: 'active' },
  // ... more users
]

export function UsersTable() {
  return (
    <DataTable
      data={users}
      columns={columns}
      getRowId={(row) => row.id}
      primaryColumnId="name"
      enableGlobalSearch
      enableColumnFilters
      enableSorting
      enableSelection
      enableBulkSelection
      enableColumnVisibility
      enableExport
      stickyHeader
    />
  )
}
```

## Advanced Usage

### With Infinite Scroll

```tsx
const [data, setData] = useState<User[]>([])
const [hasMore, setHasMore] = useState(true)
const [isLoadingMore, setIsLoadingMore] = useState(false)

const loadMore = async () => {
  setIsLoadingMore(true)
  try {
    const newData = await fetchUsers({ page: currentPage + 1 })
    setData((prev) => [...prev, ...newData])
    setHasMore(newData.length > 0)
  } finally {
    setIsLoadingMore(false)
  }
}

<DataTable
  data={data}
  columns={columns}
  onLoadMore={loadMore}
  hasMore={hasMore}
  isLoadingMore={isLoadingMore}
/>
```

### With Row Actions

```tsx
const rowActions: RowAction<User>[] = [
  {
    id: 'view',
    label: 'View Details',
    onClick: (row) => {
      // Navigate to user details
    },
  },
  {
    id: 'edit',
    label: 'Edit',
    onClick: (row) => {
      // Open edit modal
    },
  },
  {
    id: 'delete',
    label: 'Delete',
    variant: 'danger',
    onClick: async (row) => {
      await deleteUser(row.id)
    },
  },
]

<DataTable
  data={users}
  columns={columns}
  rowActions={rowActions}
/>
```

### With Bulk Actions

```tsx
const bulkActions: BulkAction<User>[] = [
  {
    id: 'export',
    label: 'Export Selected',
    onClick: (selectedRows) => {
      // Export selected users
    },
  },
  {
    id: 'delete',
    label: 'Delete Selected',
    variant: 'danger',
    requiresConfirmation: true,
    confirmationMessage: `Are you sure you want to delete ${selectedRows.length} user(s)?`,
    onClick: async (selectedRows) => {
      await deleteUsers(selectedRows.map((u) => u.id))
    },
  },
]

<DataTable
  data={users}
  columns={columns}
  enableBulkSelection
  bulkActions={bulkActions}
/>
```

### With Row Expansion

```tsx
<DataTable
  data={users}
  columns={columns}
  enableRowExpansion
  expandedRowRender={(row) => (
    <Box p={4}>
      <Text>User Details: {row.name}</Text>
      {/* More details */}
    </Box>
  )}
/>
```

### With Filter Persistence

```tsx
<DataTable
  data={users}
  columns={columns}
  persistFilters // Filters persist in URL (session-based)
  persistColumnVisibility // Column visibility persists in database
  onColumnVisibilitySave={async (visibleColumns) => {
    await saveColumnPreferences(visibleColumns)
  }}
/>
```

## Column Definition

### Column Types

```tsx
interface ColumnDef<T> {
  id: string // Unique identifier
  header: string | ((props: { column: ColumnDef<T> }) => ReactNode) // Header content
  accessorKey?: keyof T // Key to access data
  accessorFn?: (row: T) => any // Function to access data
  cell?: (props: { row: T; value: any; column: ColumnDef<T> }) => ReactNode // Custom cell renderer
  sortable?: boolean // Enable sorting (default: true)
  filterable?: boolean // Enable filtering (default: true)
  dataType?: 'string' | 'number' | 'date' | 'boolean' | 'enum' | 'custom' // Filter type
  filterOptions?: string[] // Options for enum filters
  width?: string | number // Column width
  minWidth?: string | number // Minimum width
  maxWidth?: string | number // Maximum width (32 chars default)
  defaultVisible?: boolean // Show by default (default: true)
  sticky?: 'left' | 'right' // Sticky column position
}
```

### Data Types for Filtering

- **string**: Text input filter
- **number**: Number range filter (min/max)
- **date**: Date range picker
- **boolean**: True/False select
- **enum**: Multi-select or single-select based on filterOptions
- **custom**: Custom filter implementation

## Props Reference

### DataTableProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `T[]` | required | Array of data rows |
| `columns` | `ColumnDef<T>[]` | required | Column definitions |
| `getRowId` | `(row: T, index: number) => string \| number` | `(_, i) => i` | Function to get unique row ID |
| `primaryColumnId` | `string` | - | Primary column for initial sort |
| `onLoadMore` | `() => Promise<T[]>` | - | Function to load more data (infinite scroll) |
| `hasMore` | `boolean` | `false` | Whether more data is available |
| `isLoadingMore` | `boolean` | `false` | Loading state for infinite scroll |
| `enableGlobalSearch` | `boolean` | `true` | Enable global search |
| `enableColumnFilters` | `boolean` | `true` | Enable column-level filtering |
| `enableSorting` | `boolean` | `true` | Enable column sorting |
| `enableSelection` | `boolean` | `false` | Enable row selection |
| `enableBulkSelection` | `boolean` | `false` | Enable bulk selection |
| `enableColumnVisibility` | `boolean` | `true` | Enable column visibility toggle |
| `enableExport` | `boolean` | `false` | Enable export functionality |
| `enableRowExpansion` | `boolean` | `false` | Enable row expansion |
| `stickyHeader` | `boolean` | `true` | Make header sticky |
| `persistFilters` | `boolean` | `false` | Persist filters in URL |
| `persistColumnVisibility` | `boolean` | `false` | Persist column visibility |
| `rowActions` | `RowAction<T>[]` | - | Per-row actions |
| `bulkActions` | `BulkAction<T>[]` | - | Bulk actions |
| `onRowClick` | `(row: T) => void` | - | Row click handler |
| `onFilterChange` | `(filters: FilterState) => void` | - | Filter change callback |
| `onSortChange` | `(sort: SortState) => void` | - | Sort change callback |
| `onSelectionChange` | `(selectedRows: T[]) => void` | - | Selection change callback |

## Styling

The component uses CyberQP's grey/green color scheme:

- **Grey**: Used for backgrounds, borders, and neutral elements
- **Green**: Used for active states, selected rows, and primary actions

Customize the theme in `src/theme/index.ts`.

## Keyboard Navigation

- **Arrow Up/Down**: Navigate between rows
- **Enter**: Activate row (expand or click)
- **Escape**: Clear focus

## Best Practices

1. **Column Widths**: Set `maxWidth` to prevent columns from becoming too wide (default: 32 characters)
2. **Default Columns**: Limit to 5 visible columns by default for better UX
3. **Filter Types**: Use appropriate `dataType` for better filter UI
4. **Row IDs**: Always provide a stable `getRowId` function
5. **Infinite Scroll**: Implement proper loading states and error handling
6. **Bulk Actions**: Use confirmation dialogs for destructive actions

## Examples

See the examples directory for more usage examples:
- Basic table
- With infinite scroll
- With filters and sorting
- With bulk actions
- With row expansion

