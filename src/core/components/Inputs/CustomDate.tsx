import React, { useState } from 'react'
import { Form } from 'react-bootstrap';
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import { InputData } from '@/core/types/auth';
import styles from '@styles/components/CustomDate.module.scss';
import { es } from 'date-fns/locale';



export default function CustomDate({ value, onChange, isValidated, inputData }: { value: string; onChange: (date: Date | null) => void; isValidated: boolean; inputData: InputData }) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(value ? new Date(value) : null);


  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    onChange(date);
  };

  const hasError = isValidated && inputData.required && !selectedDate;

  return (
    <Form.Group className='d-flex flex-column'>  
        <Form.Label>{inputData.label}</Form.Label>
        <DatePicker
            className={`form-control ${hasError ? 'is-invalid' : ''}`}
            calendarClassName={styles.customCalendar}
            selected={selectedDate}
            onChange={handleDateChange} 
            required={inputData.required}       
            placeholderText={inputData.placeholder}
            locale={es}
        />
         <Form.Control.Feedback type="invalid" className={hasError ? 'd-block' : ''}>
          {inputData.error || inputData.validation?.message || `${inputData.label} es requerido`}
        </Form.Control.Feedback>
    </Form.Group>
  )
}
