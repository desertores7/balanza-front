import { createFormType } from "@/core/types/commonType";
import { BiCar, BiCog } from "react-icons/bi";

const createVehicleForm: createFormType = {
    formTitle: "Crear Vehiculo",
    formTitleEdit: "Editar Vehiculo",
    mainRoute:"/vehicles",  
    tableKey: 'vehicles',
    cards:[       
    {
        createTitle: "Crear Vehiculo",
        editTitle: "Editar Vehiculo",
        icon: BiCar,
        inputs: [
            {
                id: 'vehicleName',
                label: 'Nombre y apellido del conductor',
                type: 'text',
                placeholder: 'Ingresa nombre y apellido',
                name: 'name',
                required: true,
                validation: {
                minLength: 6,
                maxLength: 30,
                message: 'El nombre debe tener al menos 6 caracteres'
                },
                size: '4'               
            },
            {
                id: 'vehicleChassisPatent',
                label: 'Patente Chasis',
                type: 'text',
                placeholder: 'Ingresa la patente del chasis',
                name: 'chassisPatent',
                error: 'La patente del chasis requerida',
                required: true,
                validation: {
                    maxLength: 17,
                    minLength: 1,
                    message: 'La patente del chasis debe tener entre 1 y 17 caracteres'
                },
                size: '4'
            },
            {
                id: 'vehicleCoupledPatent',
                label: 'Patente Acoplado',
                type: 'text',
                placeholder: 'Ingresa la patente del acoplado',
                name: 'coupledPatent',
                error: 'La patente del acoplado es requerida',
                required: false,
                validation: {
                    maxLength: 7,
                    minLength: 6,
                    message: 'La patente del acoplado debe tener entre 6 y 7 caracteres'
                },
                size: '4'
            },
            // {
            //     id: 'activeVehicle',
            //     label: 'Estado',
            //     type: 'select',
            //     placeholder: 'Ingresa tu estado',
            //     name: 'active',
            //     error: 'El estado es requerido',
            //     required: true,
            //     multiple: false,
            //     options: [
            //         {  label: 'Inactivo', value: "0", },
            //         {  label: 'Activo', value: 1, },
            //     ],
            //     size: '4'
            // },

        ],
    },
    ],
    cardsAditioonals:[
        {
            aditionalCreateTitle: "configuración",
            aditionalEditTitle: "Editar configuración",
            icon: BiCog,
            inputs: [
                {
                    id: 'activeVehicle',
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
        save: "/vehicles",
        cancel: "/vehiculos",
        create: "/vehiculos/crear",
        mainRoute: "/vehicles",
        update: "/vehiculos/editar",
    }
}

export default createVehicleForm;
