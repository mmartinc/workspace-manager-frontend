import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import styles from './Table.module.scss'
import Link from 'next/link'
import type { LinkProps } from 'next/link'
import type { PropsWithChildren } from 'react'

export interface ITableProps {
  columns: ColumnDef<any, any>[]
  data: any[]
}

export const Table = (props: ITableProps) => {
  const table = useReactTable({
    getCoreRowModel: getCoreRowModel(),
    ...props,
  })

  return (
    <div>
      <table className={styles.tableWrapper}>
        <thead className={styles.tableHeader}>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className={styles.headerText}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className={styles.rowHover}>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className={styles.tableRow}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className={styles.rowText}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const RowLink = (props: PropsWithChildren<LinkProps>) => {
  return (
    <Link {...props} className={styles.link}>
      <span>{props.children}</span>
    </Link>
  )
}

const RowTitle = (props: PropsWithChildren) => {
  return <span className={styles.title}>{props.children}</span>
}

Table.Title = RowTitle
Table.Link = RowLink
