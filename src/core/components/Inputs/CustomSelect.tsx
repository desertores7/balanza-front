"use client";
import apiClient from '@core/lib/apiClient';
import { InputData } from '@core/types/auth';
import React, { useState, useEffect } from 'react';
import Select, { StylesConfig, SingleValue, MultiValue } from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { useTablesData } from '@core/store/useTablesStore';

interface OptionType {
  value: string | number;
  label: string;
  color?: string;
  selected?: boolean;
}

interface CustomSelectProps {
  input: InputData;
  defaultValue?: string | number | null;
  onChange?: (fieldName: string, newValue: OptionType | null) => void;
  isDisabled?: boolean;
  isValidated?: boolean;
  isEditable?: boolean;
}

export default function CustomSelect({
  input,
  onChange,
  defaultValue,
  isDisabled = false,
  isValidated = false,
  isEditable,
}: CustomSelectProps) {
  const options = (Array.isArray(input.options) ? input.options.map(option => ({
    value: option.value,
    label: option.label,
    color: '#8592a3'
  })) : []) as OptionType[];


  const { refreshFilterData, getFilterOptions } = useTablesData();


  const getDefaultValue = (): OptionType | null => {
    // Si hay defaultValue, usarlo (ignorar selected: true)
    if (defaultValue !== null && defaultValue !== undefined && defaultValue !== '') {
      const def = options.find(o => o.value == defaultValue);
      if (def) return def;
    }
    
    // Solo si NO hay defaultValue, buscar opción con selected: true
    const selectedOption = (input.options as OptionType[] | undefined)?.find(option => option.selected === true);

    return selectedOption ? { value: selectedOption.value, label: selectedOption.label } : null;
  };

  const isMulti = input.multiple || false;
  const closeMenuOnSelect = !isMulti;
  const [hasError, setHasError] = useState(false);
  const [selectedValue, setSelectedValue] = useState<OptionType | null>(null);

  // Inicializar selectedValue cuando cambien las dependencias
  useEffect(() => {
    const defaultValue = getDefaultValue();
    setSelectedValue(defaultValue);

    
    // Ejecutar onChange automáticamente si hay un valor por defecto
    if (defaultValue && !isEditable) {
      onChange?.(input.name, defaultValue);
    }
  }, [defaultValue]);


  useEffect(() => {
    const hasValue = defaultValue !== null && defaultValue !== undefined && defaultValue !== '';
    const shouldShowError = Boolean(isValidated && input.required && !hasValue && selectedValue === null);
    setHasError(shouldShowError);  

  }, [isValidated, input.required, defaultValue]);

  const errorMessage = input.error;

  const colourStyles: StylesConfig<OptionType, boolean> = {
    control: (styles) => ({
      ...styles,
      backgroundColor: 'var(--background-primary)',
      color: 'var(--text-primary) !important',
      '&::placeholder': {
        color: 'var(--text-primary) !important',
      },
      border: hasError ? '1px solid #dc3545' : '1px solid #ccc',
      borderRadius: '4px',
      minHeight: '38px',
    }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => ({
      ...styles,
      backgroundColor: isDisabled
        ? undefined
        : isSelected
        ? data.color || 'var(--text-primary) !important'
        : isFocused
        ? 'var(--text-primary) !important'
        : undefined,
      color: isDisabled
        ? 'var(--text-primary) !important'
        : isSelected
        ? 'var(--text-primary) !important'
        : data.color || 'var(--text-primary) !important',
      cursor: isDisabled ? 'not-allowed' : 'default',
      padding: '8px 12px',
    }),
    multiValue: (styles, { data }) => ({
      ...styles,
      backgroundColor: 'var(--text-primary) !important',
      border: `1px solid ${data.color}`,
      borderRadius: '4px',
    }),
    multiValueLabel: (styles, { data }) => ({
      ...styles,
      color: data.color || 'var(--text-primary) !important',
      fontWeight: '500',
    }),
    multiValueRemove: (styles, { data }) => ({
      ...styles,
      color: data.color || 'var(--text-primary) !important',
      ':hover': {
        backgroundColor: data.color,
        color: 'var(--text-primary) !important',
      },
    }),
    placeholder: (styles) => ({
      ...styles,
      color: 'var(--text-primary) !important',
    }),
  };



  const commonProps = {
    closeMenuOnSelect,
    onChange: (newValue: SingleValue<OptionType> | MultiValue<OptionType>) => {
      const singleValue = Array.isArray(newValue) ? newValue[0] || null : newValue;
      setSelectedValue(singleValue);
      onChange?.(input.name, singleValue);
      if (singleValue) setHasError(false);
    },
    value: selectedValue,
    isMulti,
    isDisabled,
    options: options as OptionType[],
    styles: colourStyles,
    placeholder: input.placeholder || "Selecciona una opción...",
    className: `react-select ${hasError ? 'is-invalid' : ''}`,
    instanceId: `select-${input.name}`,
    id: input.id
  };

  const handleCreate = async (inputValue: string) => {
    await apiClient['post'](`${input.route}`, {name: inputValue}, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    await refreshFilterData(input?.filterKey || '', input.route || '');

    // Obtener los datos actualizados del store
    const updatedOptions = input?.filterKey ? getFilterOptions(input.filterKey || '') : options;
    
    // Buscar el nuevo registro en los datos actualizados por el label
    const newRecord = updatedOptions.find(option => option.label === inputValue);
    const newOption: OptionType = { 
      value: newRecord?.value || inputValue, 
      label: inputValue 
    };
    
    setSelectedValue(newOption);
    onChange?.(input.name, newOption);
    setHasError(false);
  };

  return (
    <div>
      <label className="form-label">{input.label}</label>
      {input.isCreate ? (
        <CreatableSelect
          {...commonProps}
          noOptionsMessage={() => "Sin resultados"}
          formatCreateLabel={(inputValue) => `Agregar "${inputValue}"`}
          onCreateOption={handleCreate}
        />
      ) : (
        <Select {...commonProps} noOptionsMessage={() => "Sin resultados"} />
      )}

      {hasError && (
        <div id={`${input.name}-feedback`} className="invalid-feedback d-block">
          {errorMessage}
        </div>
      )}
    </div>
  );
}
