import { InputData } from "./auth";
import React from "react";

export interface createTableType {
  tableTitle: string;
  tableKey: string; //key para el store de las tablas
  filters?: filtersType[];
  tableColumns: tableColumns[];
  routes: routesType;
  }

  export interface filtersType {
    name: string;
    placeholder: string;
    route?: string;
    options?: {label: string; value: string | number}[];
    type?: "select" | "dateRange";
    filterKey?: string;
  }

  export interface tableColumns {
    header: string;
    accessorKey: string;
    type?: string;
  }

  export interface formCard {
    icon: React.ComponentType<{ fontSize?: number; color?: string }>;
    createTitle?: string;
    editTitle?: string;
    aditionalCreateTitle?: string;
    aditionalEditTitle?: string;
    inputs: InputData[];
  }

  export interface createFormType {
    finalModal?: boolean;
    tableKey?: string;
    formTitle?: string;
    formTitleEdit?: string;
    formTitleAditionals?: string;
    mainRoute: string;
    routes: routesType;
    cards: formCard[];
    cardsAditioonals?: formCard[];
  }

  export interface routesType {
    save?: string;
    cancel?: string;
    create?: string;
    mainRoute?: string;
    update?: string;
  }
