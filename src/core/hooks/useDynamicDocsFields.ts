// src/core/hooks/useDynamicDocsFields.ts
import { useState } from 'react';
import apiClient from '@/core/lib/apiClient';
import { InputData } from '@/core/types/auth';

interface CleaveConfig {
  blocks: number[];
  delimiter: string;
  numericOnly: boolean;
}

export const useDynamicDocsFields = () => {
  const [cleaveOptions, setCleaveOptions] = useState<{[key: string]: CleaveConfig}>({});
  const [dynamicFields, setDynamicFields] = useState<{[key: string]: boolean}>({});

  const cleaveConfigs = {
    'DNI': {
      blocks: [2, 3, 3],
      delimiter: '.',
      numericOnly: true
    },
    'CUIT': {
      blocks: [2, 8, 1],
      delimiter: '-',
      numericOnly: true
    },
    'L.E':{
      blocks: [1, 3, 3],
      delimiter: '.',
      numericOnly: false
    },
    'L.C':{
      blocks: [1, 3, 3],
      delimiter: '.',
      numericOnly: false
    }
  };
  
  const handleDynamicFieldChange = (
    fieldName: string, 
    value: string | File | Date | null | { value: string; label: string }, 
    allInputs: InputData[], 
    setFormData: React.Dispatch<React.SetStateAction<{ [key: string]: string | File | Date | null }>>
  ) => {
    const fieldValue = (value && typeof value === 'object' && 'value' in value) ? value.value : value;
    const fieldLabel = (value && typeof value === 'object' && 'label' in value) ? value.label : undefined;
  
    // Lógica para campos con hiddenTarget
    const currentField = allInputs.find(input => input.name === fieldName);
    
    if (currentField?.hiddenTarget) {
      const hiddenTarget = currentField.hiddenTarget;
      setDynamicFields(prev => ({
        ...prev,
        [hiddenTarget]: !!fieldValue
      }));
  
      const targetField = allInputs.find(input => input.id === currentField.hiddenTarget);
      
      if (targetField && fieldValue && fieldLabel) {
        // Modificar el campo objetivo
        targetField.label = `Número de ${fieldLabel}`;
        targetField.placeholder = `Ingresa tu número de ${fieldLabel}`;
        
        // Actualizar opciones de cleave
        const cleaveConfig = cleaveConfigs[fieldLabel as keyof typeof cleaveConfigs];
        if (cleaveConfig) {
          setCleaveOptions((prev) => ({
            ...prev,
            [targetField.name]: cleaveConfig
          }));
        }
        
        // NUEVO: Resetear el valor del campo objetivo
        setFormData((prev) => ({
          ...prev,
          [targetField.name]: ''
        }));
      }
    }
    
    // NUEVA LÓGICA: Manejar campos dependientes
    if (currentField?.dependentFields && fieldValue && typeof fieldValue === 'string') {
      handleDependentFields(fieldValue, currentField.dependentFields, allInputs, setFormData);
    }
  };

  // Nueva función para manejar campos dependientes
  const handleDependentFields = async (
    sourceValue: string, 
    dependentFields: string[], 
    allInputs: InputData[], 
    setFormData: React.Dispatch<React.SetStateAction<{ [key: string]: string | File | Date | null }>>
  ) => {
    try {
      // Obtener la ruta del campo fuente para hacer la llamada a la API
      const sourceField = allInputs.find(input => input.name === 'vehicleUuid');
      const apiRoute = sourceField?.route;
      
      if (apiRoute) {
        // Hacer llamada a la API
        const response = await apiClient.get(`${apiRoute}/${sourceValue}`);
        const sourceData = response.data;
        
        // Crear objeto con los datos a poblar
        const fieldsToUpdate: {[key: string]: string} = {};
        
        // Mapear dinámicamente los campos dependientes
        dependentFields.forEach(fieldId => {
          const field = allInputs.find(input => input.id === fieldId);
          if (field && sourceData.hasOwnProperty(field.name)) {
            fieldsToUpdate[field.name] = sourceData[field.name] || '';
          }
        });
        
        // Actualizar el estado del formulario
        setFormData((prev) => ({
          ...prev,
          ...fieldsToUpdate
        }));
      }
    } catch (error) {
      console.error('Error fetching dependent data:', error);
    }
  };

  return {
    cleaveOptions,
    dynamicFields,
    handleDynamicFieldChange
  };
};