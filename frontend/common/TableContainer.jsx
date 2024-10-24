import React, { Fragment, useEffect, useState } from "react";
import { Row, Table, Button } from "react-bootstrap";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender
} from "@tanstack/react-table";
import { rankItem } from "@tanstack/match-sorter-utils";

// Global Filter Input
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
        placeholder="Buscar..."
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
  SearchPlaceholder = "Buscar miembros..."
}) => {
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");

  // Función de filtro personalizada que busca en múltiples campos
  const fuzzyFilter = (row, columnId, value, addMeta) => {
    // Concatenar los campos relevantes para la búsqueda
    const searchContent = `${row.original.first_name} ${row.original.last_name} ${row.original.available_days} ${row.original.available_times} ${row.original.country} ${row.original.topics}`.toLowerCase();

    // Comparar el valor ingresado con el contenido
    const isMatch = searchContent.includes(value.toLowerCase());
    addMeta({
      itemRank: isMatch ? 0 : 1 // 0 para coincidencia, 1 para no coincidencia
    });

    return isMatch;
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

  return (
    <Fragment>
      {isGlobalFilter && (
        <div className="col-md-3 mb-3 search-box-mt">
          <DebouncedInput
            value={globalFilter ?? ""}
            onChange={(value) => setGlobalFilter(value)}
            placeholder={SearchPlaceholder}
            className="form-control"
          />
        </div>
      )}
      <div className={divClassName ? divClassName : "table-responsive react-table"}>
        <Table className={tableClass} bordered={isBordered}>
          <thead className={theadClass}>
            {getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const headerClass = `sort cursor-pointer ${thColumn ? thColumn : ""}`;
                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      {...{
                        className: header.column.getCanSort() ? headerClass : "",
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
              Página {getState().pagination.pageIndex + 1} de {getPageOptions().length}
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
                  Anterior
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
                  Siguiente
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
