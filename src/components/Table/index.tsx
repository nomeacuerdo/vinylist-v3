"use client"
import Link from 'next/link';
import { useMediaQuery } from '@chakra-ui/react';
import React, { useEffect, useState, FC, isValidElement } from 'react';
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
  Cell,
} from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import Modal from "@/components/Modal";
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
import './styles.css';
import { Release } from '@/lib/types';

interface TableProps {
  data: Release[];
  columnProps?: ColumnDef<Release>[];
}

// @ts-ignore
const defaultColumns: ColumnDef<Release>[] = [
  {
    id: "cover",
    accessorKey: "cover",
    // @ts-ignore
    title: "Cover",
    header: "Cover",
    filter: false,
  },
  {
    id: "title",
    accessorKey: "basic_information.title",
    // @ts-ignore
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
    cell: ({row}) => {
      const item = row.original;
      return (
        <Link
          key={item.id}
          href={`/release/${item.id}`}
        >
          {item.basic_information.title}
        </Link>
      );
    },
  },
  {
    id: "artist",
    accessorKey: "artist",
    // @ts-ignore
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
    id: "format",
    accessorKey: "format",
    // @ts-ignore
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
    id: "year",
    accessorKey: "year",
    // @ts-ignore
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
    id: "acquired",
    accessorKey: "acquired",
    // @ts-ignore
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

const DataTable: FC<TableProps> = ({ data, columnProps }) => {
  const columns = columnProps || defaultColumns;
  const [sorting, setSorting] = useState<SortingState>([{ id: "artist", desc: false }]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [isMobile] = useMediaQuery('(max-width: 768px)');

  const [columnVisibility, setColumnVisibility] = useState({
    cover: true,
    title: true,
    artist: true,
    format: true,
    year: true,
    acquired: true,
  });

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    // onColumnVisibilityChange: setColumnVisibility,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnVisibility,
      sorting,
      columnFilters,
    },
  });

  useEffect(() => {
    setColumnVisibility({
      cover: true,
      title: true,
      artist: true,
      format: !isMobile,
      year: !isMobile,
      acquired: !isMobile,
    });
  }, [isMobile]);

  return (
    <>
      <div className="rounded-md border w-full">
        <Table className="table-bullshit w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const isSorted = header.column.getIsSorted() && 'text-indigo-600';
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
                        // @ts-ignore
                        header.column.columnDef.filter &&
                        getFilter(
                          table,
                          header.column.id,
                          // @ts-ignore
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
                  {row.getVisibleCells().map((cell: Cell<Release, string & unknown>) => (
                    <TableCell key={cell.id}>
                      {
                        // @ts-ignore
                        cell.column.columnDef.title === 'Cover'
                        ? (<Modal cell={cell} />)
                        : flexRender(cell.column.columnDef.cell, cell.getContext()) as React.ReactNode
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
      <div className="flex flex-wrap w-full">
        <div className="flex items-center justify-start md:justify-center grow py-4">
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
        <div className="flex-none py-4">
          <Select
            value={String(table.getState().pagination.pageSize)}
            onValueChange={e => table.setPageSize(Number(e))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={`Show ${table.getState().pagination.pageSize}`} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {[10, 20, 30, 40, 50].map(pageSize => (
                  <SelectItem key={pageSize} value={String(pageSize)}>Show {pageSize}</SelectItem>
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
