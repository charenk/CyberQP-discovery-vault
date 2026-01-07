'use client'

import {
  Menu,
  MenuButton,
  Button,
  MenuList,
  MenuItem,
  Icon,
  HStack,
} from '@chakra-ui/react'
import { FiDownload, FiFile, FiFileText } from 'react-icons/fi'
import { ExportFormat, ExportOptions } from './types'

interface DataTableExportProps {
  onExport: (options: ExportOptions) => Promise<void>
  includeSelectedOnly?: boolean
  hasSelection?: boolean
}

export function DataTableExport({ onExport, includeSelectedOnly, hasSelection }: DataTableExportProps) {
  const handleExport = async (format: ExportFormat) => {
    await onExport({
      format,
      includeSelectedOnly: includeSelectedOnly && hasSelection,
      filename: `export.${format}`,
    })
  }

  return (
    <Menu>
      <MenuButton as={Button} leftIcon={<FiDownload />} variant="outline" size="sm">
        Export
      </MenuButton>
      <MenuList>
        <MenuItem icon={<FiFileText />} onClick={() => handleExport('csv')}>
          Export as CSV
        </MenuItem>
        <MenuItem icon={<FiFile />} onClick={() => handleExport('json')}>
          Export as JSON
        </MenuItem>
        <MenuItem icon={<FiFile />} onClick={() => handleExport('xlsx')}>
          Export as Excel
        </MenuItem>
      </MenuList>
    </Menu>
  )
}

