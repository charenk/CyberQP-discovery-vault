import { ExportFormat, ExportOptions } from '@/components/shared/DataTable/types'

export async function exportToCSV<T>(
  data: T[],
  columns: { id: string; header: string; accessor: (row: T) => any }[],
  filename: string = 'export.csv'
) {
  // Create headers
  const headers = columns.map((col) => col.header).join(',')
  
  // Create rows
  const rows = data.map((row) =>
    columns
      .map((col) => {
        const value = col.accessor(row)
        // Escape commas and quotes in CSV
        if (value == null) return ''
        const stringValue = String(value)
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`
        }
        return stringValue
      })
      .join(',')
  )

  const csvContent = [headers, ...rows].join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  URL.revokeObjectURL(url)
}

export async function exportToJSON<T>(data: T[], filename: string = 'export.json') {
  const jsonContent = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  URL.revokeObjectURL(url)
}

export async function exportData<T>(
  data: T[],
  columns: { id: string; header: string; accessor: (row: T) => any }[],
  options: ExportOptions
) {
  const filename = options.filename || `export.${options.format}`
  
  switch (options.format) {
    case 'csv':
      await exportToCSV(data, columns, filename)
      break
    case 'json':
      await exportToJSON(data, filename)
      break
    case 'xlsx':
      // XLSX export would require a library like xlsx
      // For now, fall back to CSV
      console.warn('XLSX export not implemented, falling back to CSV')
      await exportToCSV(data, columns, filename.replace('.xlsx', '.csv'))
      break
    default:
      throw new Error(`Unsupported export format: ${options.format}`)
  }
}

