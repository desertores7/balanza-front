import { createFormType } from "@/core/types/commonType";
import { BiPlusCircle, BiCog } from "react-icons/bi";

const createUserForm: createFormType = {
    formTitle: "Crear Usuario",
    formTitleAditionals: "Configuración",
    formTitleEdit: "Editar Usuario",
    mainRoute:"/users",
    tableKey: 'users',
    cards:[
        {
            createTitle: "Crear Usuario",
            editTitle: "Editar Usuario",
            icon: BiPlusCircle,
            inputs: [
                {
                    id: 'imgProfile',
                    label: 'Imagen de perfil',
                    type: 'file',
                    accept: '',
                    placeholder: 'Ingresa tu imagen de perfil',
                    name: 'imgProfile',
                    error: 'La imagen de perfil es requerida',
                    required: false,
                    validation: {
                      minLength: 1,
                      message: 'La imagen de perfil es requerida'
                    },
                    size: '12'               
                },
                {
                    id: 'firstName',
                    label: 'Nombre',
                    type: 'text',
                    placeholder: 'Ingresa tu nombre',
                    name: 'firstName',
                    required: true,
                    validation: {
                      minLength: 6,
                      maxLength: 20,
                      message: 'El nombre debe tener al menos 6 caracteres'
                    },
                    size: '6'               
                },
                {
                    id: 'lastName',
                    label: 'Apellido',
                    type: 'text',
                    placeholder: 'Ingresa tu apellido',
                    name: 'lastName',
                    error: 'El apellido es requerido',
                    required: true,
                    validation: {
                      minLength: 6,
                      maxLength: 20,
                      message: 'El apellido debe tener al menos 6 caracteres'
                    },
                    size: '6'
                },
                {
                    id: 'email',
                    label: 'Email',
                    type: 'email',
                    placeholder: 'Ingresa tu email',
                    name: 'email',
                    error: 'El email es requerido',
                    required: true,
                    validation: {
                      maxLength: 30,
                      pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
                      message: 'Por favor, ingresa un email válido'
                    },
                    size: '6'
                },
                {
                    id: 'password',
                    label: 'Contraseña',
                    type: 'password',
                    placeholder: 'Ingresa tu contraseña',
                    name: 'password',
                    error: 'La contraseña es requerida',
                    required: true,
                    validation: {
                      pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
                      message: 'Por favor, ingresa una contraseña válida'
                    },
                    size: '6'
                },
            ],
        }
    ],
    cardsAditioonals:[
        {
            aditionalCreateTitle: "Configuración",
            aditionalEditTitle: "Editar Configuración",
            icon: BiCog,
            inputs: [
                {
                    id: 'roleUuid',
                    label: 'Rol',
                    type: 'select',
                    placeholder: 'Ingresa tu rol',
                    name: 'roleUuid',
                    error: 'El rol es requerido',
                    required: true,
                    multiple: false,
                    filterKey: 'roles',
                    route: '/roles',
                    options: [],
                    size: '12'
                },
                {
                    id: 'activeUser',
                    label: 'Estado',
                    type: 'select',
                    placeholder: 'Ingresa tu estado',
                    name: 'active',
                    error: 'El estado es requerido',
                    required: true,
                    multiple: false,
                    options: [
                        {  label: 'Inactivo', value: "0", },
                        {  label: 'Activo', value: 1, selected: true },
                    ],
                    size: '12'
                },
            ]
        }
    ],
    routes: {
        save: "/users",
        cancel: "/usuarios",
        create: "/usuarios/crear",
        mainRoute: "/users",
        update: "/usuarios/editar",
    }
}

export default createUserForm;
