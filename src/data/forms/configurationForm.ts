import { createFormType } from "@/core/types/commonType";
import { BiBuilding, BiCog, BiCube, BiEnvelope } from "react-icons/bi";

const configurationForm: createFormType = {
    formTitle: "Configuración",
    formTitleEdit: "Editar Configuración",
    mainRoute:"/company",
    cards:[
        {
            createTitle: "Compañia",
            editTitle: "Editar Compañia",
            icon: BiBuilding,
            inputs: [
                {
                    id: 'companyLogo',
                    label: 'Logo de la compañia',
                    type: 'file',
                    accept: 'image/*',
                    placeholder: 'Ingresa el logo de la compañia',
                    name: 'imgCompany',
                    error: 'El logo de la compañia es requerido',
                    required: false,
                    validation: {
                      minLength: 1,
                      message: 'La imagen de perfil es requerida'
                    },
                    size: '12'               
                },
                {
                    id: 'productName',
                    label: 'Nombre de la compañia',
                    type: 'text',
                    placeholder: 'Ingresa nombre de la compañia',
                    name: 'name',
                    required: true,
                    validation: {
                      minLength: 6,
                      maxLength: 30,
                      message: 'El nombre debe tener al menos 6 caracteres'
                    },
                    size: '6'               
                },
                {
                    id: 'companyAddress',
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
                    id: 'companyLocation',
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
                    id: 'companyPostalCode',
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
                    id: 'companyProvince',
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
                {
                    id: 'companyIva',
                    label: 'IVA',
                    type: 'select',
                    placeholder: 'Ingresa su tipo de IVA',
                    name: 'taxName',
                    error: 'El IVA es requerido',
                    required: true,
                    multiple: false,
                    options: [
                        { label: 'Responsable no inscripto', value: 'Responsable no inscripto' },
                        { label: 'Monotributista', value: 'Monotributista' },
                        { label: 'Responsable Inscripto', value: 'Responsable Inscripto' },
                        { label: 'Exento', value: 'Exento' },
                        { label: 'Consumidor Final', value: 'Consumidor Final' },
                    ],
                    size: '6'
                },         
                {
                    id: 'companyCuit',
                    label: 'CUIT',
                    type: 'cleave',
                    accept: '',
                    placeholder: 'Ingresa su CUIT',
                    name: 'cuit',
                    options: {
                        blocks: [2, 8, 1],
                        delimiter: '-',
                        numericOnly: true
                    },
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
            createTitle: "Datos de servidor SMTP",
            editTitle: "Editar Datos de servidor SMTP",
            icon: BiEnvelope,
            inputs: [
                {
                    id: 'smtpServer',
                    label: 'Host del servidor SMTP',
                    type: 'text',
                    placeholder: 'Ingresa el servidor SMTP',
                    name: 'hostEmail',
                    error: 'El host del servidor SMTP es requerido',
                    required: false,
                    validation: {
                      minLength: 1,
                      message: 'El servidor SMTP es requerido'
                    },
                    size: '6'               
                },
                {
                    id: 'portEmail',
                    label: 'Puerto del servidor SMTP',
                    type: 'text',
                    placeholder: 'Ingresa el puerto del servidor SMTP',
                    name: 'portEmail',
                    error: 'El puerto del servidor SMTP es requerido',
                    required: false,
                    validation: {
                      minLength: 6,
                      maxLength: 30,
                      message: 'El nombre debe tener al menos 6 caracteres'
                    },
                    size: '6'               
                },
                {
                    id: 'emailUser',
                    label: 'Usuario del servidor SMTP',
                    type: 'text',
                    placeholder: 'Ingresa el usuario del servidor SMTP',
                    name: 'usernameEmail',
                    error: 'El usuario del servidor SMTP es requerido',
                    required: false,
                    validation: {
                      minLength: 1,
                      message: 'El usuario del servidor SMTP es requerido'
                    },
                    size: '6'
                },                      
                {
                    id: 'emailPassword',
                    label: 'Contraseña del servidor SMTP',
                    type: 'text',
                    placeholder: 'Ingresa la contraseña del servidor SMTP',
                    name: 'passwordEmail',
                    error: 'La contraseña del servidor SMTP es requerida',
                    required: false,
                    validation: {
                      minLength: 1,
                      message: 'La contraseña del servidor SMTP es requerida'
                    },
                    size: '6'
                },         
            ],
        },
    ],
    routes: {
        save: "/company",
        cancel: "/configuracion",
        create: "/company/crear",
        mainRoute: "/company",
        update: "/company/editar",
    }
}

export default configurationForm;
