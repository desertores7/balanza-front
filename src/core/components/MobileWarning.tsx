"use client";

import React from 'react';
import { BiError } from "react-icons/bi";
import styles from '../styles/components/MobileWarning.module.scss';

export default function MobileWarning() {
  return (
    <div className={styles.mobileWarning}>
      <div className={styles.warningContent}>
        <div className={styles.warningIcon}>
          <BiError />
        </div>
        <h3 className={styles.warningTitle}>Vista no disponible</h3>
        <p className={styles.warningText}>
          Esta aplicación no está optimizada para dispositivos móviles o tablets. 
          Por favor, accede desde un ordenador para una mejor experiencia.
        </p>
      </div>
    </div>
  );
}

