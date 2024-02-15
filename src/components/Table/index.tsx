'use client'
import { useState } from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import { Release } from '@/app/types';

interface TableProps {
  data: Release[];
}

const columns: ColumnDef<Release>[] = [
  {
    accessorKey: "cover",
    title: "Cover",
    header: "Cover",
    filter: false,
  },
  {
    accessorKey: "basic_information.title",
    title: "Name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    filter: true,
  },
  {
    accessorKey: "artist",
    title: "Artist",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Artist
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    filter: true,
  },
  {
    accessorKey: "format",
    title: "Format",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Format
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    filter: true,
  },
  {
    accessorKey: "year",
    title: "Year",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Year
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    filter: true,
  },
  {
    accessorKey: "acquired",
    title: "Acquired",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Acquired
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    filter: true,
  },
];

const getFilter = (table: any, column: string, title: string) => (
  <Input
    placeholder={`Filter ${title}...`}
    value={(table.getColumn(column)?.getFilterValue() as string) ?? ""}
    onChange={(event) =>
      table.getColumn(column)?.setFilterValue(event.target.value)
    }
    className="max-w-sm mb-2"
  />
);

const DataTable: FC<TableProps> = ({ data }) => {
  const [sorting, setSorting] = useState<SortingState>([{ id: "artist", desc: false }]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const isSorted = header.column.getIsSorted() && 'text-neutral-50';
                  return (
                    <TableHead
                      className={`content-start ${isSorted}`}
                      key={header.id}
                    >
                      {
                        header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )
                      }
                      {
                        header.column.columnDef.filter &&
                        getFilter(
                          table,
                          header.column.id,
                          header.column.columnDef.title
                        )
                      }
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {
                        cell.column.columnDef.title === 'Cover'
                        ? (cell.getValue())
                        : flexRender(cell.column.columnDef.cell, cell.getContext())
                      }
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex w-full py-4">
        <div className="flex items-center justify-center grow">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="mr-2"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
        <div className="flex-none">
          <Select
            value={table.getState().pagination.pageSize}
            onValueChange={e => table.setPageSize(Number(e))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={`Show ${table.getState().pagination.pageSize}`} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {[10, 20, 30, 40, 50].map(pageSize => (
                  <SelectItem key={pageSize} value={pageSize}>Show {pageSize}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
};

export default DataTable;
