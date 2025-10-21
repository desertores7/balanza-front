import React from 'react'
import styles from '@styles/components/Checkbox.module.scss';
import { Form } from 'react-bootstrap';

interface CheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

export default function Checkbox({ checked = false, onChange }: CheckboxProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.checked);
  };

  return (
    <Form.Check 
      type="checkbox" 
      className={styles.uiCheckbox} 
      checked={checked}
      onChange={handleChange}
    />
  )
}
