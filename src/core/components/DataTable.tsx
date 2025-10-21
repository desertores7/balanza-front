"use client";

import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useState, useEffect} from "react";
import { Table, Form, Spinner, Button } from "react-bootstrap";
import { createTableType } from "../types/commonType";
import styles from "../styles/components/Table.module.scss";
import Image from "next/image";
import Badge from 'react-bootstrap/Badge';
import { BiTrash } from "react-icons/bi";
import { BiEdit } from "react-icons/bi";
import Link from "next/link";
import { BiPlus } from "react-icons/bi";
import { BiSearch } from "react-icons/bi";
import { BiChevronLeft } from "react-icons/bi";
import { BiChevronRight } from "react-icons/bi";

// Función para formatear fechas ISO a DD/MM/YYYY
const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  } catch {
    return '';
  }
};
import { BiChevronsLeft } from "react-icons/bi";
import { BiChevronsRight } from "react-icons/bi";
import Select from 'react-select'
import { toast } from 'react-toastify';
import CustomModal from "@/core/components/CustomModal";
import { useTablesData } from "@/core/store/useTablesStore";
import Loading from "@/core/components/Loading";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import { es } from "date-fns/locale";
import { LiaFileDownloadSolid } from "react-icons/lia";
import { MdOutlineSimCardDownload } from "react-icons/md";

// Registrar el locale español
registerLocale("es", es);
setDefaultLocale("es");

// Definir tipos para los datos de la tabla
interface TableRowData {
  [key: string]: string | number | boolean | { url: string; type?: string } | undefined;
  firstName?: string;
  lastName?: string;
  email?: string;
  uuid?: string;
  active?: boolean;
  imgProfile?: string | { url: string; type?: string };
}

interface ColumnDef {
  type?: string;
  actions?: {
    onEdit?: (data: TableRowData) => void;
    onDelete?: (data: TableRowData) => void;
  };
}

interface Filters {
  page: number;
  limit: number;
  search?: string;
  activeUser?: number;
  roleUuid?: string;
  [key: string]: string | number | undefined; // Permite propiedades dinámicas como FilterDateFrom, FilterDateTo
}

interface MetaData {
  currentPage: number;
  totalPages: number;
  perPage: number;
  totalItems: number;
}

interface SelectOption {
  label: string;
  value: string | number;
}

export default function DataTable({ tableInfo }: { tableInfo: createTableType }) {
  const [filter, setFilter] = useState("");
  const [firstLoad, setFirstLoad] = useState(true);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [activeFilters, setActiveFilters] = useState<Filters>({
    page: 1,
    limit: 10,
  });
  const [showModal, setShowModal] = useState(false);
  const [meta, setMeta] = useState<MetaData>({
    currentPage: 1,
    totalPages: 1,
    perPage: 10,
    totalItems: 0,
  });
  // Estado para manejar rangos de fechas
  const [dateRanges, setDateRanges] = useState<Record<string, [Date | null, Date | null]>>({});
  const { getTableData, refreshTableData, fetchTableData, deleteTableData, fetchAllFiltersData, filtersOptions, setUserUseFilters, userUseFilters, setUserUsedFiltersInView, getUserUsedFiltersInView} = useTablesData();

  // Obtener datos automáticamente del item activo
  const tableData = getTableData(tableInfo.tableKey);
  const data = tableData?.items || [];
  const loading = !tableData;


  // Cargar filtros dinámicos cuando se monta el componente
  useEffect(() => {
    fetchAllFiltersData(tableInfo?.filters);
  }, [tableInfo, fetchAllFiltersData]);

  // Sali de la vista, use los filtros, debo volver a cargar la tabla por default
  useEffect(() => {
    if (getUserUsedFiltersInView(tableInfo.tableKey) && firstLoad) {
      fetchTableData(tableInfo.routes.mainRoute || '', activeFilters as Record<string, string | number>, tableInfo.tableKey || '');
      setUserUsedFiltersInView(tableInfo.tableKey, false);
    }
  }, []);


  const handleDelete = async (ids: string[]) => {
    try {
      await deleteTableData(tableInfo.routes.mainRoute || '', ids);
      toast.success("Elemento eliminado exitosamente");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Error al eliminar el elemento';
      toast.error(`Error al eliminar: ${errorMessage}`);
    }
  };

  // Ejecutar petición cuando cambien los filtros (solo si no es la inicialización)
  useEffect(() => {

    // Solo hacer petición si los filtros no son los valores por defecto
      const isInitialLoad = firstLoad && activeFilters.page === 1 && activeFilters.limit === 10 && 
                          Object.keys(activeFilters).length === 2
    
    if (!isInitialLoad) {
      // Filtrar valores undefined antes de enviar
      const cleanFilters = Object.entries(activeFilters).reduce((acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, string | number>);
      
      fetchTableData(tableInfo.routes.mainRoute || '', cleanFilters as Record<string, string | number>, tableInfo.tableKey || '');
      setFirstLoad(false);
    }
  }, [activeFilters, fetchTableData, tableInfo.routes.mainRoute]);



  const table = useReactTable({
    data,
    columns: tableInfo.tableColumns,
    state: {
      globalFilter: filter,
    },
    onGlobalFilterChange: setFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
    rowCount: tableData?.meta?.totalItems || 0,
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: (row, columnId, filterValue) => {
      return String(row.getValue(columnId))
        .toLowerCase()
        .includes(filterValue.toLowerCase());
    },
    
  });


// Búsqueda global
// const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//   setActiveFilters(prev => ({
//     ...prev,
//     search: e.target.value,
//     page: 1, // resetear a primera página al buscar
//   }));
// };
let searchTimer: ReturnType<typeof setTimeout>;

const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
  setUserUsedFiltersInView(tableInfo.tableKey, true);
  clearTimeout(searchTimer); // cancelar timeout anterior
  searchTimer = setTimeout(() => {
    setActiveFilters(prev => ({
      ...prev,
      search: value,
      page: 1,
    }));
  }, 500);
};

// Cambio de select (ej. roleUuid, activeUser)
const handleFilterChange = (filterName: string) => (selectedOption: SelectOption | null) => {
  setUserUsedFiltersInView(tableInfo.tableKey, true);
  setActiveFilters(prev => {
    const updated: Filters = { ...prev, page: 1 }; // reset page
    if (selectedOption) {
      updated[filterName] = selectedOption.value;
    } else {
      delete updated[filterName];
    }
    return updated;
  });
};



// Paginación
const onPaginationChange = (page: number, limit: number) => {
  setActiveFilters(prev => ({
    ...prev,
    page,
    limit,
  }));
};
  

const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.checked) {
    setSelectedRows(data.map((row: TableRowData) => row.uuid).filter((uuid: string | number | boolean | { url: string; type?: string } | undefined): uuid is string => typeof uuid === 'string'));
  } else {
    setSelectedRows([]);
  }
};

const handleSelectRow = (id: string) => () => {
  if (selectedRows.includes(id)) {
    setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
  } else {
      setSelectedRows([...selectedRows, id]);
  }
};



  return (
    <div className={styles.tableContainer}>
      <CustomModal 
        title="Eliminar" 
        show={showModal}
        onHide={() => setShowModal(false)}
        onConfirm={() => {handleDelete(selectedRows); setShowModal(false); setSelectedRows([]);}}
        hideFooter={false}
      >
        <div>¿Estás seguro de querer eliminar?</div>
      </CustomModal>
      <div>
        <h1 className={styles.titleTable}>{tableInfo.tableTitle}</h1>
      </div>
      <div className={styles.tableHeader}>
        <div className={styles.filtersContainer}>
          <div className={styles.searchContainer}>
            <span className={styles.searchIcon}>
              <BiSearch size={15} color="var(--secondary)"/>
            </span>
            <Form.Control
              type="text"
              placeholder="Buscar en la tabla por nombre o documento..."
              // value={e.target.value}
              onChange={(e) => handleSearchChange(e as React.ChangeEvent<HTMLInputElement>)}
              className={styles.searchInput}
            />
          </div>
          {tableInfo?.filters?.map((filter) => {
            // Si el filtro es de tipo dateRange, renderizar DatePicker
            if (filter.type === "dateRange") {
              const [startDate, endDate] = dateRanges[filter.name] || [null, null];
              
              return (
                <div key={filter.name} className={styles.dateRangeContainer}>
                  <DatePicker
                    selectsRange={true}
                    startDate={startDate}
                    endDate={endDate}
                    locale="es"
                    onChange={(dates) => {
                      const [start, end] = dates as [Date | null, Date | null];
                      
                      // Actualizar estado local del DatePicker
                      setDateRanges(prev => ({
                        ...prev,
                        [filter.name]: [start, end]
                      }));
                      
                      // Actualizar filtros activos solo cuando ambas fechas están seleccionadas
                      if (start && end) {
                        setUserUsedFiltersInView(tableInfo.tableKey, true);
                        setActiveFilters(prev => {
                          const updated: Filters = {
                            ...prev,
                            page: 1
                          };
                          updated[`from${filter.name}`] = start.toISOString().split('T')[0];
                          updated[`to${filter.name}`] = end.toISOString().split('T')[0];
                          return updated;
                        });
                      } else if (!start && !end) {
                        // Si se limpia el rango, eliminar los filtros
                        setActiveFilters(prev => {
                          const updated: Filters = { ...prev, page: 1 };
                          delete updated[`from${filter.name}`];
                          delete updated[`to${filter.name}`];
                          return updated;
                        });
                        setUserUsedFiltersInView(tableInfo.tableKey, true);
                      }
                    }}
                    placeholderText={filter.placeholder}
                    className="form-control"
                    isClearable={true}
                    dateFormat="dd/MM/yyyy"
                  />
                </div>
              );
            }
            
            // Si es un filtro select normal (comportamiento actual)
            const options = filtersOptions[filter.name] ? filtersOptions[filter.name] : filter.options;
            return (
              <div key={filter.name}>
                {options ? (
                  <Select
                    className={styles.selectInput}
                    placeholder={filter.placeholder}
                    options={options}
                    onChange={handleFilterChange(filter.name)}
                    isClearable={true}
                    instanceId={`select-${filter.name}`}
                    styles={{
                      control: (styles) => ({
                        ...styles,
                        backgroundColor: 'var(--background-primary)',
                        color: 'var(--text-primary) !important',
                        '&::placeholder': {
                          color: 'var(--text-primary) !important',
                        },
                      }),
                      placeholder: (styles) => ({
                        ...styles,
                        color: 'var(--text-primary) !important',
                        backgroundColor: 'var(--background-primary) !important',
                      }),
                      option: (styles) => ({
                        ...styles,
                        color: 'var(--text-primary) !important',
                        backgroundColor: 'var(--background-primary) !important',
                      }),
                    }}
                  />
                ) : (
                  <Spinner size="sm" animation="border" /> // loader opcional
                )}
              </div>
            );
          })}
        </div>

        <div className="d-flex flex-row gap-2">
          {tableInfo.routes.create && (
          <Link  className="btn btn-primary"  href={tableInfo.routes.create || '/'}><BiPlus size={20} />Agregar nuevo</Link>
          )}
          {selectedRows.length > 0 && (
            <Button variant="danger" className="d-flex align-items-center gap-1"  onClick={() => setShowModal(true)} ><BiTrash size={20} />Eliminar</Button>
          )}
        </div>

      </div>
      {loading ? (
        <div className="d-flex justify-content-center align-items-center py-5">
          <Loading width="400px" height="400px" />
        </div>
        )
        :
      <Table bordered hover responsive className={styles.table}>
        <thead className="table-light" >
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              <th>
                <Form.Check  type="checkbox" onChange={handleSelectAll} checked={selectedRows.length === data.length}/>
              </th>
              {headerGroup.headers.map((header, index) => (
                <th
                  key={header.id}
                  style={{ cursor: "pointer" }}
                  onClick={header.column.getToggleSortingHandler?.()}
                  className={index === 0 ? "text-left" : "text-center"}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {header.column.getIsSorted() === "asc" && " 🔼"}
                  {header.column.getIsSorted() === "desc" && " 🔽"}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {/* {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))} */}
                <td key={row.id}>
                  <Form.Check className="" checked={selectedRows.includes(row.original.uuid as string)} type="checkbox" onChange={handleSelectRow(row.original.uuid as string)}/>
                </td>
                {row.getVisibleCells().map((cell, cellIndex) => {
                  const columnDef = cell.column.columnDef as ColumnDef;
                  const rowData = row.original as TableRowData;
                  const alignmentClass = cellIndex === 0 ? "text-left text-capitalize" : "text-center text-capitalize";


                switch (columnDef.type) {

                  case "badge":
                    // Determinar el tipo de badge y su contenido
                    let badgeContent = "";
                    let badgeColor = "secondary";
                    
                    if (rowData.active !== undefined) {
                      // Badge para active/inactive
                      badgeContent = rowData.active ? "Activo" : "Inactivo";
                      badgeColor = rowData.active ? "primary" : "danger";
                    } else if (rowData.weighingStateUuid !== undefined) {
                      // Badge para status
                      if (rowData.weighingStateUuid == "1") {
                        badgeContent = "Pendiente";
                        badgeColor = "warning";
                      } else if (rowData.weighingStateUuid == "2") {
                        badgeContent = "Cerrado";
                        badgeColor = "primary";
                      }
                    }
                  
                    
                    return (
                      <td key={cell.id} className={alignmentClass}>
                        <Badge className="px-3 py-2 text-uppercase" bg={badgeColor} style={{ fontSize: "12px" }}>
                          {badgeContent}
                        </Badge>
                      </td>
                    );

                  case "drag":
                    return (
                      <td key={cell.id} className={alignmentClass}>
                        <span style={{ cursor: "grab" }}>⠿</span>
                      </td>
                    );

                  case "image":
                    return (
                      <td key={cell.id} className={alignmentClass}>
                        <div className="d-flex align-items-center gap-2">
                          {rowData.imgProfile && typeof rowData.imgProfile === 'object' && rowData.imgProfile.url !== "" ? (
                            rowData.imgProfile.type === "image/jpeg" || rowData.imgProfile.type === "image/png" || rowData.imgProfile.type === "image/jpg" ? (
                          <Image
                            src={rowData.imgProfile.url}
                            alt={rowData.firstName || "Usuario"}
                            width={35}
                            height={35}
                            style={{
                              borderRadius: "50%",
                              objectFit: "cover",
                            }}
                          />) : (
                            <video
                              src={rowData.imgProfile.url}
                              autoPlay
                              muted
                              playsInline
                              loop
                              width={35}
                              height={35}
                              style={{
                                borderRadius: "50%",
                                objectFit: "cover",
                              }}
                            />
                          )) : (
                            <div className={styles.emptyAvatar} style={{backgroundColor:"var(--secondary)" }}>
                              <span>{rowData.firstName?.charAt(0)} {rowData.lastName?.charAt(0)}</span>                               
                            </div>
                          
                          )}
                          <div className="d-flex flex-column">
                            <span className={styles.smallCardTitle}>{rowData.firstName || ""} {rowData.lastName || ""}</span>
                            <span className={styles.smallCardSubtitle}>{rowData.email || ""}</span>
                          </div>
                        </div>
                      </td>
                    );

                  case "actions":
                    return (
                      <td key={cell.id} className={alignmentClass}>
                        <div className="d-flex flex-row justify-content-center">
                            <Link
                              className="btn p-1"
                              href={`${tableInfo.routes.update}?id=${rowData.uuid as string}`}
                            >
                              <BiEdit size={20} color="var(--text-primary)" />
                            </Link>
                            <button 
                              className="btn p-1"
                              onClick={() => handleDelete([rowData.uuid as string])}
                              disabled={loading}
                            >
                              <BiTrash size={20} color="var(--text-primary)" />
                            </button>
                            {tableInfo.tableKey === "weighings" && (
                              <button className="btn p-1">
                                <MdOutlineSimCardDownload   size={20} color="var(--text-primary)" />
                              </button>
                            )}
                        </div>
                      </td>
                    );
                  case "fecha":
                    return (
                      <td key={cell.id} className={alignmentClass}>
                        {formatDate(cell.getValue() as string)}
                      </td>
                    );
                  default: // "default"
                    return (
                      <td key={cell.id} className={alignmentClass}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    );
                }
              })}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={tableInfo.tableColumns.length} className="text-center py-3">
                No se encontraron resultados
              </td>
            </tr>
          )}
        </tbody>
        <tfoot className={styles.tableFooter}>
          <tr>
            <td colSpan={tableInfo.tableColumns.length + 1}>          
              <div className={styles.paginationContainer}>
                <div className={styles.paginationInfo}>
                  <span>Mostrando página {tableData.meta.currentPage} de {tableData.meta.totalPages}</span>
                </div>
                <div className={styles.paginationButtons}>
                  <Button
                    onClick={() => onPaginationChange(1, tableData.meta.perPage)}                    
                    disabled={ activeFilters.page === 1 }
                  >
                    <BiChevronsLeft size={20}  />
                  </Button>
                  <Button
                    onClick={() => onPaginationChange(activeFilters.page - 1, tableData.meta.perPage)}
                    disabled={ activeFilters.page === 1 }
                  >
                    <BiChevronLeft size={20}/>
                  </Button>
                  {meta?.totalPages && (
                    <>
                      {Array.from({length: tableData.meta.totalPages}, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          onClick={() => onPaginationChange(page, tableData.meta.perPage)}
                          disabled={page  === activeFilters.page}
                          className={`${page  === activeFilters.page ? styles.activePage : ""}`}
                        >
                          {page}
                        </Button>
                      ))}
                    </>
                  )}
                  <Button
                    onClick={() => onPaginationChange(activeFilters.page + 1, tableData.meta.perPage)}
                    disabled={ activeFilters.page === tableData.meta.totalPages }
                  >
                    <BiChevronRight size={20}/>
                  </Button>
                  <Button
                    onClick={() => onPaginationChange(tableData.meta.totalPages, tableData.meta.perPage)}
                    disabled={ activeFilters.page === tableData.meta.totalPages }
                  >
                    <BiChevronsRight size={20}/>
                  </Button>
              {/* <select
                value={table.getState().pagination.pageSize}
                onChange={e => {
                  table.setPageSize(Number(e.target.value))
                }}
                className={styles.pageSizeSelect}
              >
                {[10, 20, 30, 40, 50].map(pageSize => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize}
                  </option>
                ))}
              </select> */}
                </div>
              </div>
            </td>
          </tr>
        </tfoot>
      </Table>
      }
    </div>
  );
}
