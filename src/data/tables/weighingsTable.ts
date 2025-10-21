import { createTableType } from "@/core/types/commonType";

const weighingTable: createTableType = {
    tableTitle: 'Pesajes',
    tableKey: 'weighings', //key para el store de las tablas
    routes:{
        mainRoute:"/weighings",
        create:"/pesaje/crear",
        update:"/pesaje/editar",
    },
    filters:[
        {
            name:"Date",
            placeholder:"Seleccionar rango de fechas",
            type:"dateRange",
            options:[],
        },
        {
            name:"weighingStateUuid",
            placeholder:"Estado de pesaje",
            options:[
                {label:"Pendiente",value:1},
                {label:"Cerrado",value:2}
            ]
        },
    ],
    tableColumns: [
        {
            header: "Origen",
            accessorKey: "origin",
        },
        {
            header: "Destino",
            accessorKey: "destination",
        },
        {
            header: "Peso de Entrada (Tara)",
            accessorKey: "inputWeight",
        },
        {
            header: "Peso de Salida (Bruto)",
            accessorKey: "outputWeight",
        },
        {
            header: "Peso Neto",
            accessorKey: "netWeight",
        },
        {
            header: "Fecha",
            accessorKey: "createdAt",
            type: "fecha",
        },
        {
            header: "Estado",
            accessorKey: "weighingStateUuid",
            type: "badge",
        },   
        {
             header: "Acciones",
            accessorKey: "actions",
            type: "actions",
        }
    ],
}

export default weighingTable;
