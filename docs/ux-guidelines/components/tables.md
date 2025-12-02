# Table Component Guidelines

## Overview
Tables are used to display structured data like user lists, session logs, and access requests.

## Use Cases
- Display user lists with permissions
- Show active sessions
- Audit logs and activity history
- Access request queues

## Error States
- Empty state with helpful message
- Loading skeleton while fetching data
- Error message if data fetch fails
- Pagination for large datasets

## Examples
```tsx
// Basic table structure
<Table>
  <Thead>
    <Tr>
      <Th>User</Th>
      <Th>Status</Th>
      <Th>Actions</Th>
    </Tr>
  </Thead>
  <Tbody>
    {/* Table rows */}
  </Tbody>
</Table>
```

