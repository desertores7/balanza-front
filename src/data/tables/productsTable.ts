import { createTableType } from "@/core/types/commonType";

const productsTable: createTableType = {
    tableTitle: 'Productos',
    tableKey: 'products', //key para el store de las tablas
    routes:{
        mainRoute:"/products",
        create:"/productos/crear",
        update:"/productos/editar",
    },
    tableColumns: [
        {
            header: "Nombre",
            accessorKey: "name",
        },
        {
            header: "Código",
            accessorKey: "code",
        },
        {
            header: "Estado",
            accessorKey: "activeUser",
            type: "badge",
        },
        {
             header: "Acciones",
            accessorKey: "actions",
            type: "actions",
        }
    ],
}

export default productsTable;
