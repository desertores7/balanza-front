import { createTableType } from "@/core/types/commonType";

const usersTable: createTableType = {
    tableTitle: 'Usuarios',
    tableKey: 'users', //key para el store de las tablas
    filters:[
        {
            name:"roleUuid",
            placeholder:"Rol",
            options:[],
            route:"/roles",
            filterKey: 'roleUuid',
        },
        {
            name:"active",
            placeholder:"Estado",
            options:[
                {label:"Activo",value:1},
                {label:"Inactivo",value:0}
            ]
        },
    ],
    routes:{
        mainRoute:"/users",
        create:"/usuarios/crear",
        update:"/usuarios/editar",
    },
    tableColumns: [
        {
            header: "Nombre y Apellido",
            accessorKey: "firstName",
            type: "image",
        },
        {
            header: "Rol",
            accessorKey: "role",
        },
        {
            header: "Ingreso",
            accessorKey: "createdAt",
            type: "fecha",
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

export default usersTable;
