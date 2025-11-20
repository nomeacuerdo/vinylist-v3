"use client"
import Link from 'next/link';
import { useMediaQuery } from '@chakra-ui/react';
import React, { useEffect, useState, FC } from 'react';
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
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDownIcon,
} from "@radix-ui/react-icons";
import './styles.css';
import { Release } from '@/lib/types';

interface TableProps {
  data: Release[];
  wantlist?: boolean;
}

// @ts-ignore
const defaultColumns: ColumnDef<Release>[] = [
  {
    id: "cover",
    accessorKey: "cover",
    // @ts-ignore
    title: "Cover",
    header: "",
    filter: false,
    isPlaceholder: true,
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
    filterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId);

      if (filterValue === 'LP') {
        return String(value).includes("LP");
      } else if (filterValue === "10\"") {
        return String(value).includes("10\"");
      } else if (filterValue === "7\"") {
        return String(value).includes("7\"");
      } else if (filterValue === "Not 7\"") {
        return !String(value).includes("7\"");
      } else if (filterValue === "Other") {
        return !String(value).includes("LP");
      } else {
        return true;
      }
    },
  },
  {
    id: "year",
    accessorKey: "year",
    // @ts-ignore
    title: "Released in",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Released in
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    filter: true,
  },
  {
    id: "dealer",
    accessorKey: "dealer.name",
    // @ts-ignore
    title: "Dealer",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Dealer
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
          href={`/folders/${item.dealer?.id}`}
        >
          {item.dealer?.name}
        </Link>
      );
    },
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
  {
    id: "pending",
    accessorKey: "pending",
    // @ts-ignore
    title: "Pending?",
    header: ({ column }) => {
      return (
        <Button
          variant={
            column.getFilterValue() === undefined
            ? "ghost"
            :  column.getFilterValue() === "Yes"
            ? "secondary"
            : "default"
          }
          onClick={() => {
            if (column.getFilterValue() === undefined) {
              column.setFilterValue("Yes");
            } else if (column.getFilterValue() === "Yes") {
              column.setFilterValue("No");
            } else {
              column.setFilterValue(undefined);
            }
          }}
        >
          Pending?
        </Button>
      )
    },
    filter: false,
    filterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId);
      if (filterValue === 'Yes') {
        return String(value).includes("Yes");
      }
      if (filterValue === 'No') {
        return !String(value).includes("Yes");
      }
      return value === filterValue;
    },
  },
];
// @ts-ignore
const wantlistColumns: ColumnDef<Release>[] = [
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

const DataTable: FC<TableProps> = ({ data, wantlist }) => {
  const columns = wantlist ? wantlistColumns : defaultColumns;
  const [sorting, setSorting] = useState<SortingState>([{ id: "artist", desc: false }]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [isMobile] = useMediaQuery('(max-width: 768px)');

  const [columnVisibility, setColumnVisibility] = useState({
    cover: true,
    title: true,
    artist: true,
    format: true,
    year: true,
    dealer: true,
    acquired: true,
    pending: true,
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
      dealer: !isMobile,
      acquired: !isMobile,
      pending: !isMobile,
    });
  }, [isMobile]);

  return (
    <>
      <div className="rounded-md border w-full">
        <Table className="table-bullshit w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className='table-header'>
                {headerGroup.headers.map((header) => {
                  const isSorted = header.column.getIsSorted() && 'text-indigo-600';
                  return (
                    <TableHead
                      className={`text-center align-top ${isSorted}`}
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
                        (
                          // Show 3 buttons for Format column, otherwise show default filter
                          header.column.columnDef.id === "format" ? (
                            <Select
                              value={String(table.getColumn(header.column.id)?.getFilterValue())}
                              onValueChange={(e) => {
                                table.getColumn(header.column.id)?.setFilterValue(e);
                              }}
                            >
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder={String(table.getColumn(header.column.id)?.getFilterValue())} />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  {["All", "LP", "10\"", "7\"", "Not 7\"", "Other"].map((label) => (
                                    <SelectItem key={label} value={String(label)}>{label}</SelectItem>
                                    // <Button
                                    //   key={label}
                                    //   variant={
                                    //     label === "All"
                                    //       ? table.getColumn(header.column.id)?.getFilterValue() === undefined
                                    //         ? "default"
                                    //         : "outline"
                                    //       : label === "LP"
                                    //         ? table.getColumn(header.column.id)?.getFilterValue() === "LP"
                                    //           ? "default"
                                    //           : "outline"
                                    //         : table.getColumn(header.column.id)?.getFilterValue() === 'notLP'
                                    //           ? "default"
                                    //           : "outline"
                                    //   }
                                    //   size="sm"
                                    //   onClick={() => {
                                    //     if (label === "All") {
                                    //       table.getColumn(header.column.id)?.setFilterValue(undefined);
                                    //     } else if (label === "LP") {
                                    //       table.getColumn(header.column.id)?.setFilterValue("LP");
                                    //     } else if (label === "Other") {
                                    //       table.getColumn(header.column.id)?.setFilterValue('notLP');
                                    //     }
                                    //   }}
                                    // >
                                    //   {label}
                                    // </Button>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          ) : getFilter(
                            table,
                            header.column.id,
                            // @ts-ignore
                            header.column.columnDef.title
                          )
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
                    <TableCell
                      key={cell.id}
                      className={`align-top ${
                        // @ts-ignore
                        cell.column.columnDef.title === 'Name' ? 'text-left' : 'justify-center text-center'
                      }`}
                    >
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
      <div className="flex flex-wrap-reverse md:flex-wrap w-full">
        <div className='flex items-start justify-start py-4 order-1 md:order-1'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => 
                        setColumnVisibility({
                          ...columnVisibility,
                          [column.id]: value,
                        })
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center justify-center md:justify-center grow py-4 order-3 md:order-2">
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
        <div className="flex-none pl-4 md:pl-0 py-4 order-2 md:order-3">
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
