"use client";

import React, { useState } from 'react';
import styles from '@styles/components/InputText.module.scss';
import { GoEye, GoEyeClosed } from 'react-icons/go';
import { Form } from 'react-bootstrap';
import { InputData } from '@core/types/auth';
import { TbCapture } from "react-icons/tb";

interface InputTextProps {
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  inputData: InputData;
  isEditable?: boolean;
  className?: string;
  style?: React.CSSProperties;
  // Props para auto-focus en códigos de verificación
  autoFocus?: boolean;
  inputIndex?: number;
  totalInputs?: number;
  onButtonClick?: () => void;
}

export default function InputText({ 
  value ,
  isEditable,
  onChange,
  onKeyDown,
  inputData,
  className,
  style,
  autoFocus = false,
  inputIndex = 1,
  totalInputs = 6,
  onButtonClick,
}: InputTextProps) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Manejo de auto-focus para códigos de verificación
  const handleAutoFocusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!autoFocus) {
      onChange?.(e);
      return;
    }

    const { name, value } = e.target;
    
    // Solo permitir números y 1 carácter
    const numericValue = value.replace(/[^0-9]/g, '').slice(0, 1);
    
    // Crear evento sintético con el valor limpio
    const syntheticEvent = {
      ...e,
      target: { ...e.target, value: numericValue, name }
    } as React.ChangeEvent<HTMLInputElement>;
    
    onChange?.(syntheticEvent);

    // Si se escribió un dígito, mover al siguiente input
    if (numericValue && inputIndex < totalInputs) {
      const nextInput = document.querySelector(`input[name="code${inputIndex + 1}"]`) as HTMLInputElement;
      if (nextInput) {
        setTimeout(() => {
          nextInput.focus();
          nextInput.select();
        }, 0);
      }
    }
  };

  const handleAutoFocusKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Llamar al onKeyDown original si existe
    onKeyDown?.(e);

    if (!autoFocus) return;

    // Si presiona backspace y el input está vacío, ir al anterior
    if (e.key === 'Backspace' && !value && inputIndex > 1) {
      const prevInput = document.querySelector(`input[name="code${inputIndex - 1}"]`) as HTMLInputElement;
      if (prevInput) {
        setTimeout(() => {
          prevInput.focus();
          prevInput.select();
        }, 0);
      }
    }
  };

  // Manejo de pegado de código completo
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    if (!autoFocus) return;

    e.preventDefault();
    
    // Obtener el texto pegado y limpiar (solo números)
    const pastedText = e.clipboardData.getData('text');
    const numbers = pastedText.replace(/[^0-9]/g, '').slice(0, totalInputs);
    
    if (!numbers) return;

    // Distribuir cada dígito en su input correspondiente
    numbers.split('').forEach((digit, index) => {
      const targetIndex = index + 1;
      const targetInput = document.querySelector(`input[name="code${targetIndex}"]`) as HTMLInputElement;
      
      if (targetInput) {
        // Crear evento sintético para cada input
        const syntheticEvent = {
          target: { name: `code${targetIndex}`, value: digit }
        } as React.ChangeEvent<HTMLInputElement>;
        
        onChange?.(syntheticEvent);
      }
    });

    // Enfocar el último input con contenido o el último disponible
    const lastFilledIndex = Math.min(numbers.length, totalInputs);
    const lastInput = document.querySelector(`input[name="code${lastFilledIndex}"]`) as HTMLInputElement;
    
    if (lastInput) {
      setTimeout(() => {
        lastInput.focus();
      }, 0);
    }
  };


  
  return (
    <Form.Group key={inputData.id} className={styles.inputGroup} style={style}>
      <Form.Label htmlFor={inputData.id}>{inputData.label}</Form.Label>
      <div className={styles.inputWrapper}>
        <Form.Control
          required={inputData.type === 'password'  && isEditable ? false : inputData.required}
          id={inputData.id}
          type={inputData.type === 'password' ? (showPassword ? 'text' : 'password') : inputData.type}
          placeholder={inputData.placeholder}
          name={inputData.name}
          defaultValue={value || ''}
          onChange={autoFocus ? handleAutoFocusChange : onChange}
          onKeyDown={autoFocus ? handleAutoFocusKeyDown : onKeyDown}
          onPaste={autoFocus ? handlePaste : undefined}
          autoComplete={inputData.type === 'password' ? 'new-password' : 'nope'}
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          as={inputData.type === 'textarea' ? 'textarea' : 'input'}
          readOnly={inputData.readonly}
        />
        {inputData.buttonText && (
          <button 
            type="button" 
            className="btn btn-primary mt-3 w-100"
            onClick={onButtonClick}
          >
            <TbCapture  size={20}  className="me-2" />
            {inputData.buttonText}
          </button>
        )}
         {inputData.type === 'password' && (
           <button 
             type="button" 
             className={styles.togglePassword}
             onClick={togglePasswordVisibility}
             style={{ color: 'var(--text-primary)' }}
           >
             {showPassword ? <GoEyeClosed size={20} /> : <GoEye size={20} />}
           </button>
         )}
        <Form.Control.Feedback type="invalid">
          {inputData.error || inputData.validation?.message}
        </Form.Control.Feedback>
      </div>
    </Form.Group>
  );
}