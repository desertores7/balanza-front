import { createFormType } from "@/core/types/commonType";
import { BiClipboard, BiInfoCircle, BiCog } from "react-icons/bi";
import { PiTruck  } from "react-icons/pi";
import { LiaWeightSolid } from "react-icons/lia";
import { MdOutlineBalance } from "react-icons/md";

const createWeighingForm: createFormType = {
    formTitle: "Crear Pesaje",
    formTitleEdit: "Editar Pesaje",
    mainRoute:"/weighings",
    tableKey: 'weighings',
    finalModal: true,
    cards:[
        {
            createTitle: "Balanza",
            editTitle: "Editar balanza",
            icon: MdOutlineBalance,
            inputs: [
                {
                    id: 'WeighingWeight',
                    label: 'Peso',
                    type: 'digitalCounter',
                    placeholder: 'Ingresar peso',
                    name: 'weight',
                    required: false,
                    size: '12',
                    enableSerialScale: true               
                },   
            ]
        },
        {
            createTitle: "Pesaje",
            editTitle: "Editar pesaje",
            icon: LiaWeightSolid,
            inputs: [
                {
                    id: 'WeighingOutputWeight',
                    label: 'Peso de entrada (Tara)',
                    type: 'text',
                    placeholder: 'Toca el botón para ingresar peso',
                    name: 'inputWeight',
                    error: 'El cliente es requerido',
                    required: true,
                    readonly: true,
                    buttonText:"Capturar tara",
                    size: '4'
                },
                {
                    id: 'WeighingOutputWeight',
                    label: 'Peso de salida (Bruto)',
                    type: 'text',
                    placeholder: 'Toca el botón para ingresar peso',
                    name: 'outputWeight',
                    required: false,
                    readonly: true, 
                    buttonText:"Capturar bruto",
                    size: '4'               
                },
                {
                    id: 'WeighingNetWeight',
                    label: 'Peso Neto',
                    type: 'text',
                    placeholder: 'Esperando peso neto',
                    name: 'netWeight',
                    error: 'El producto es requerido',
                    required: true,
                    readonly: true,
                    size: '4'
                },       
            ],
        },
        {
            createTitle: "Gestión Comercial",
            editTitle: "Editar gestión comercial",
            icon: BiClipboard,
            inputs: [
                {
                    id: 'WeighingOperator',
                    label: 'Operador',
                    type: 'text',
                    placeholder: 'Ingresar operador',
                    error: 'El operador es requerido',
                    name: 'operator',
                    required: true,
                    size: '4'               
                },
                {
                    id: 'WeighingClient',
                    label: 'Cliente',
                    type: 'select',
                    placeholder: 'Ingresar cliente',
                    name: 'clientUuid',
                    error: 'El cliente es requerido',
                    required: true,
                    multiple: false,
                    route: '/clients',
                    filterKey: 'clients',
                    options: [],    
                    size: '4'
                },
                {
                    id: 'WeighingProduct',
                    label: 'Producto',
                    type: 'select',
                    placeholder: 'Ingresar producto',
                    name: 'productUuid',
                    error: 'El producto es requerido',
                    required: true,
                    multiple: false,
                    route: '/products',
                    filterKey: 'products',
                    options: [],    
                    size: '4'
                },       
            ],
        },
        {
            createTitle: "Transporte",
            editTitle: "Editar transporte",
            icon: PiTruck,
            inputs: [
                {
                    id: 'WeighingTransport',
                    label: 'Transporte',
                    type: 'select',
                    placeholder: 'Ingresar transporte',
                    name: 'transporterUuid',
                    error: 'El transporte es requerido',
                    required: true,
                    multiple: false,
                    isCreate: true,
                    route: '/transporters',
                    filterKey: 'transporters',
                    options: [],    
                    size: '4'
                },  
                {
                    id: 'WeighingOrigin',
                    label: 'Origen',
                    type: 'text',
                    placeholder: 'Ingresar ubicación de origen',
                    name: 'origin',
                    required: true,
                    size: '4'               
                },
                {
                    id: 'WeighingDestination',
                    label: 'Destino',
                    type: 'text',
                    placeholder: 'Ingresar ubicación de destino',
                    name: 'destination',
                    required: true,
                    size: '4'               
                },   
                {
                    id: 'WeighingVehicle',
                    label: 'Nombre del conductor',
                    type: 'select',
                    placeholder: 'Ingresar vehiculo',
                    name: 'vehicleUuid',
                    error: 'El vehiculo es requerido',
                    required: true,
                    validation: {
                        maxLength: 30,
                        message: 'El nombre del conductor debe tener entre 1 y 30 caracteres'
                    },
                    multiple: false,
                    route: '/vehicles',
                    filterKey: 'vehicles',
                    options: [],    
                    size: '4',
                    dependentFields: ['WeighingChassisPatent', 'WeighingCoupledPatent']
                },  
                {
                    id: 'WeighingChassisPatent',
                    label: 'Patente Chasis',
                    type: 'text',
                    placeholder: 'Ingresar patente del chasis',
                    name: 'chassisPatent',
                    required: true,
                    validation: {
                        maxLength: 17,
                        minLength: 1,
                        message: 'La patente del chasis debe tener entre 1 y 17 caracteres'
                    },
                    size: '4'               
                },   
                {
                    id: 'WeighingCoupledPatent',
                    label: 'Patente Acoplado',
                    type: 'text',
                    placeholder: 'Ingresar patente del acoplado',
                    name: 'coupledPatent',
                    required: false,
                    validation: {
                        maxLength: 7,
                        minLength: 6,
                        message: 'La patente del acoplado debe tener entre 6 y 7 caracteres'
                    },
                    size: '4'               
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
    routes: {
        save: "/weighings",
        cancel: "/pesaje",
        create: "/pesaje/crear",
        mainRoute: "/weighings",
        update: "/pesaje/editar",
    },
}

export default createWeighingForm;
