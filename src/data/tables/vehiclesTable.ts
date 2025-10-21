import { createTableType } from "@/core/types/commonType";

const vehiclesTable: createTableType = {
    tableTitle: 'Vehiculos',
    tableKey: 'vehicles', //key para el store de las tablas
    routes:{
        mainRoute:"/vehicles",
        create:"/vehiculos/crear",
        update:"/vehiculos/editar",
    },
    tableColumns: [
        {
            header: "Nombre y Apellido",
            accessorKey: "name",
        },
        {
            header: "Paten Chasis",
            accessorKey: "chassisPatent",
        },
        {
            header: "Patente Acoplado",
            accessorKey: "coupledPatent",
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

export default vehiclesTable;
