import { createTableType } from "@/core/types/commonType";

const clientsTable: createTableType = {
    tableTitle: 'Clientes',
    tableKey: 'clients', //key para el store de las tablas
    routes:{
        mainRoute:"/clients",
        create:"/clientes/crear",
        update:"/clientes/editar",
    },
    tableColumns: [
        {
            header: "Nombre",
            accessorKey: "name",
        },
        {
            header: "Empresa",
            accessorKey: "company",
        },
        {
            header: "Teléfono",
            accessorKey: "phone",
        },
        {
            header: "Email",
            accessorKey: "email",
        },
        {
            header: "Documento/ CUIT",
            accessorKey: "docNumber",
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

export default clientsTable;
