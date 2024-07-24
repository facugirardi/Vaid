import React, { Fragment, useEffect, useState } from "react";
import { Row, Table, Button } from "react-bootstrap";

import {
  Column,
  Table as ReactTable,
  ColumnFiltersState,
  FilterFn,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender
} from "@tanstack/react-table";

import { rankItem } from "@tanstack/match-sorter-utils";

// Column Filter
const Filter = ({ column, table }) => {
  const columnFilterValue = column.getFilterValue();

  return (
    <>
      <DebouncedInput
        type="text"
        value={(columnFilterValue ?? "")}
        onChange={(value) => column.setFilterValue(value)}
        placeholder="Search..."
        className="w-36 border shadow rounded"
        list={column.id + "list"}
      />
      <div className="h-1"></div>
    </>
  );
};

// Global Filter
const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [debounce, onChange, value]);

  return (
    <div className="search-box">
      <input
        {...props}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search..."
      />
      <i className="ri-search-line search-icon"></i>
    </div>
  );
};

const TableContainer = ({
  columns,
  data,
  tableClass,
  theadClass,
  tdColumn,
  thColumn,
  divClassName,
  isBordered,
  isPagination,
  customPageSize,
  isGlobalFilter,
  SearchPlaceholder
}) => {
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const fuzzyFilter = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value);
    addMeta({
      itemRank
    });
    return itemRank.passed;
  };

  const table = useReactTable({
    columns,
    data,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      columnFilters,
      globalFilter
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel()
  });

  const {
    getHeaderGroups,
    getRowModel,
    getCanPreviousPage,
    getCanNextPage,
    getPageOptions,
    setPageIndex,
    nextPage,
    previousPage,
    setPageSize,
    getState
  } = table;

  useEffect(() => {
    Number(customPageSize) && setPageSize(Number(customPageSize));
  }, [customPageSize, setPageSize]);

  const onChangeInSelect = (event) => {
    setPageSize(Number(event.target.value));
  };

  return (
    <Fragment>
      {isGlobalFilter && (
        <React.Fragment>
          <div className="datatable-top">
            <div className="datatable-dropdown">
              <label>
                <select
                  onChange={onChangeInSelect}
                  className="datatable-selector"
                >
                  {[5, 10, 15, 20, 25].map((pageSize) => (
                    <option key={pageSize} value={pageSize}>
                      {pageSize}
                    </option>
                  ))}
                </select>{" "}
                entries per page
              </label>
            </div>
            <div className="datatable-search">
            </div>
          </div>
        </React.Fragment>
      )}
      <div
        className={divClassName ? divClassName : "table-responsive react-table"}
      >
        <Table className={tableClass} bordered={isBordered}>
          <thead className={theadClass}>
            {getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const headerClass = `sort cursor-pointer ${
                    thColumn ? thColumn : ""
                  }`;
                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      {...{
                        className: header.column.getCanSort()
                          ? headerClass
                          : "",
                        onClick: header.column.getToggleSortingHandler()
                      }}
                    >
                      {header.isPlaceholder ? null : (
                        <React.Fragment>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: " ",
                            desc: " "
                          }[header.column.getIsSorted()] ?? null}
                          {header.column.getCanFilter() ? (
                            <div>
                              <Filter column={header.column} table={table} />
                            </div>
                          ) : null}
                        </React.Fragment>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          <tbody>
            {getRowModel().rows.map((row) => {
              return (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    const columnKey = cell.column.columnDef?.accessorKey;
                    const tdClass = columnKey === "Action" ? tdColumn : "";
                    return (
                      <td key={cell.id} className={tdClass}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>

      {isPagination && (
        <Row className="align-items-center py-2 gy-2 text-center text-sm-start">
          <div className="col-sm">
            <div className="text-muted">
              Showing{" "}
              <span className="fw-semibold">
                {getState().pagination.pageSize}
              </span>{" "}
              of <span className="fw-semibold">{data.length}</span> Results
            </div>
          </div>
          <div className="col-sm-auto">
            <ul className="pagination mb-0">
              <li
                className={
                  !getCanPreviousPage()
                    ? "page-item rounded disabled"
                    : "page-item"
                }
                onClick={previousPage}
              >
                <Button variant="link" className="page-link me-2">
                  Previous
                </Button>
              </li>
              {getPageOptions().map((item, key) => (
                <React.Fragment key={key}>
                  <li className="page-item me-2">
                    <Button
                      variant="link"
                      className={
                        getState().pagination.pageIndex === item
                          ? "page-link active"
                          : "page-link"
                      }
                      onClick={() => setPageIndex(item)}
                    >
                      {item + 1}
                    </Button>
                  </li>
                </React.Fragment>
              ))}
              <li
                className={!getCanNextPage ? "page-item disabled" : "page-item"}
                onClick={nextPage}
              >
                <Button variant="link" className="page-link">
                  Next
                </Button>
              </li>
            </ul>
          </div>
        </Row>
      )}
    </Fragment>
  );
};

export default TableContainer;
