import { createFormType } from "@/core/types/commonType";
import { BiCog, BiCube } from "react-icons/bi";

const createProductForm: createFormType = {
    formTitle: "Crear Producto",
    formTitleEdit: "Editar Producto",
    mainRoute:"/products",
    tableKey: 'products',
    cards:[
        {
            createTitle: "Crear Producto",
            editTitle: "Editar Producto",
            icon: BiCube,
            inputs: [
                {
                    id: 'productName',
                    label: 'Nombre del producto',
                    type: 'text',
                    placeholder: 'Ingresa nombre del producto',
                    name: 'name',
                    required: true,
                    validation: {
                      minLength: 6,
                      maxLength: 30,
                      message: 'El nombre debe tener al menos 6 caracteres'
                    },
                    size: '8'               
                },
                {
                    id: 'productCode',
                    label: 'Código del producto',
                    type: 'cleave',
                    accept: '',
                    placeholder: 'Ingresa el código del producto',
                    name: 'code',
                    error: 'El código del producto requerido',
                    required: true,
                    validation: {
                      minLength: 1,
                      maxLength: 11,
                      message: 'El código del producto debe tener entre 1 y 11 caracteres'
                    },
                    options: {
                        numeral: true,
                        numeralDecimalMark: ',',
                        delimiter: ''
                    },
                    size: '4'   
                },
        
        
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
                    id: 'activeProduct',
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
        save: "/products",
        cancel: "/productos",
        create: "/productos/crear",
        mainRoute: "/products",
        update: "/productos/editar",
    }
}

export default createProductForm;
