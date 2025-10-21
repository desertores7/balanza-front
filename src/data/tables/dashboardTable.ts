import { createTableType } from "@/core/types/commonType";

const dashboardTable: createTableType = {
    tableTitle: 'Dashboard',
    tableKey: 'dashboard', //key para el store de las tablas
    routes:{
        mainRoute:"/metrics/weights-users",
    },
    filters:[
        {
            name:"userUuid",
            placeholder:"Usuario",
            options:[],
            route:"/users",
            filterKey: 'userUuid',
        },
        {
            name:"Date",
            placeholder:"Seleccionar rango de fechas",
            type:"dateRange",
            options:[],
        },
    ],
    tableColumns: [
        {
            header: "Nombre y Apellido",
            accessorKey: "fullName",
        },
        {
            header: "Cantidad de pesajes",
            accessorKey: "count",
        },
    ],
}

export default dashboardTable;
