import { createFormType } from "@/core/types/commonType";
import { BiSolidDirectionRight, BiUserCircle, BiInfoCircle, BiCog } from "react-icons/bi";

const createClientForm: createFormType = {
    formTitle: "Crear Cliente",
    formTitleEdit: "Editar Cliente",
    mainRoute:"/clients",
    tableKey: 'clients',
    cards:[
        {
            createTitle: "Información personal",
            editTitle: "Editar Información personal",
            icon: BiUserCircle,
            inputs: [
                {
                    id: 'clientFirstName',
                    label: 'Nombre',
                    type: 'text',
                    placeholder: 'Ingresa su nombre',
                    name: 'name',
                    required: true,
                    validation: {
                      minLength: 6,
                      maxLength: 20,
                      message: 'El nombre debe tener al menos 6 caracteres'
                    },
                    size: '6'               
                },
                {
                    id: 'clientCompany',
                    label: 'Empresa',
                    type: 'text',
                    placeholder: 'Ingresa su empresa',
                    name: 'company',
                    error: 'La empresa es requerida',
                    required: true,
                    validation: {
                      maxLength: 20,
                      message: 'La empresa debe tener entre 1 y 20 caracteres'
                    },
                    size: '6'
                },               
                {
                    id: 'clientPhone',
                    label: 'Teléfono',
                    type: 'cleave',
                    accept: '',
                    placeholder: 'Ingresa su teléfono',
                    name: 'phone',
                    error: 'El teléfono es requerido',  
                    required: true,
                    validation: {
                      minLength: 1,
                      maxLength: 11,
                      message: 'El teléfono debe tener entre 1 y 11 caracteres'
                    },
                    options: {
                        numeral: true,
                        numeralDecimalMark: ',',
                        delimiter: ''
                    },
                    size: '6'   
                },
                {
                    id: 'clientEmail',
                    label: 'Email',
                    type: 'email',
                    placeholder: 'Ingresa su email',
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
                    id: 'clientIva',
                    label: 'IVA',
                    type: 'select',
                    placeholder: 'Ingresa su tipo de IVA',
                    name: 'taxUuid',
                    error: 'El IVA es requerido',
                    required: true,
                    multiple: false,
                    route: '/clients/tax',
                    options: [],
                    size: '6'
                },
                {
                    id: 'clientDoc',
                    label: 'Tipo de documento',
                    type: 'select',
                    placeholder: 'Ingresa su tipo de documento',
                    name: 'typeDocUuid',
                    error: 'El tipo de documento es requerido',
                    required: true,
                    multiple: false,
                    route: '/clients/type-doc',
                    options: [],
                    size: '6',
                    hiddenTarget: 'clientDocNumber',
                },                         
                {
                    id: 'clientDocNumber',
                    label: 'Número de documento',
                    type: 'cleave',
                    hidden: true,
                    accept: '',
                    placeholder: 'Ingresa su número de documento',
                    name: 'document',
                    error: 'Este campo es requerido',  
                    required: true,
                    validation: {
                      minLength: 1,
                      message: 'Este campo es requerido'
                    },
                    size: '6'   
                },
        
            ],
        },
        {
            createTitle: "Dirección",
            editTitle: "Editar Dirección",
            icon: BiSolidDirectionRight,
            inputs: [
                {
                    id: 'addressClient',
                    label: 'Dirección',
                    type: 'text',
                    placeholder: 'Ingresa su dirección',
                    name: 'address',
                    error: 'La dirección es requerida',
                    required: true,
                    validation: {
                      maxLength: 30,
                      message: 'La dirección debe tener entre 1 y 30 caracteres'
                    },
                    size: '6'
                },
                {
                    id: 'clientLocation',
                    label: 'Localidad',
                    type: 'text',
                    placeholder: 'Ingresa su localidad',
                    name: 'location',
                    error: 'La localidad es requerida',
                    required: true,
                    validation: {
                      maxLength: 30,
                      message: 'La localidad debe tener entre 1 y 30 caracteres'
                    },
                    size: '6'
                },
                {
                    id: 'clientPostalCode',
                    label: 'Código Postal',
                    type: 'text',
                    placeholder: 'Ingresa su código postal',
                    name: 'zipCode',
                    error: 'El código postal es requerido',
                    required: true,
                    validation: {
                      maxLength: 8,
                      message: 'El código postal debe tener entre 1 y 8 caracteres'
                    },
                    size: '6'
                },
                {
                    id: 'clientProvince',
                    label: 'Provincia',
                    type: 'select',
                    options: [
                        { label: 'Buenos Aires', value: 'Buenos Aires' },
                        { label: 'Córdoba', value: 'Córdoba' },
                        { label: 'Santa Fe', value: 'Santa Fe' },
                        { label: 'Mendoza', value: 'Mendoza' },
                        { label: 'La Pampa', value: 'La Pampa' },
                        { label: 'Chubut', value: 'Chubut' },
                        { label: 'Tierra del Fuego', value: 'Tierra del Fuego' },
                        { label: 'Neuquén', value: 'Neuquén' },
                        { label: 'Río Negro', value: 'Río Negro' },
                        { label: 'Santa Cruz', value: 'Santa Cruz' },
                        { label: 'Tucumán', value: 'Tucumán' },
                        { label: 'Salta', value: 'Salta' },
                        { label: 'Jujuy', value: 'Jujuy' },
                        { label: 'Formosa', value: 'Formosa' },
                        { label: 'Corrientes', value: 'Corrientes' },
                        { label: 'Entre Ríos', value: 'Entre Ríos' },
                        { label: 'La Rioja', value: 'La Rioja' },
                        { label: 'Catamarca', value: 'Catamarca' },
                        { label: 'Santiago del Estero', value: 'Santiago del Estero' },
                        { label: 'Chaco', value: 'Chaco' },
                        { label: 'Misiones', value: 'Misiones' },
                    ],
                    placeholder: 'Ingresa su provincia',
                    name: 'state',
                    error: 'La provincia es requerida',
                    required: true,
                    size: '6'
                },      
            ],
        },
        {
            createTitle: "Observaciones",
            editTitle: "Observaciones",
            icon: BiInfoCircle,
            inputs: [
                {
                    id: 'clientObservations',
                    label: 'Observaciones',
                    type: 'textarea',
                    placeholder: 'Ingresa tus observaciones',
                    name: 'observation',
                    required: false,
                    size: '12'               
                },  
            ]
        }
    ],
    cardsAditioonals:[
        {
            aditionalCreateTitle: "configuración",
            aditionalEditTitle: "Editar configuración",
            icon: BiCog,
            inputs: [
                {
                    id: 'activeClient',
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
        },
    ],
    routes: {
        save: "/clients",
        cancel: "/clientes",
        create: "/clientes/crear",
        mainRoute: "/clients",
        update: "/clientes/editar",
    }
}

export default createClientForm;
