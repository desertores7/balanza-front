"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useSerialScale } from "../hooks/useSerialScale"
import styles from "../styles/components/DigitalCounter.module.scss"
import { FaPowerOff } from "react-icons/fa6";
import { Alert } from "react-bootstrap"
import Lottie  from "lottie-react";
import Loading from "../../../public/assets/Loading.json";

interface DigitalScaleCounterProps {
  value?: number
  onChange?: (value: number) => void
  enableSerialScale?: boolean
}

export default function DigitalScaleCounter({ 
  value, 
  onChange, 
  enableSerialScale = false 
}: DigitalScaleCounterProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  
  // Hook para comunicación serial con la balanza
  const {
    isConnected,
    isConnecting,
    rawData,
    status,
    connect,
    disconnect,
    error
  } = useSerialScale()



  // El hook useSerialScale ya maneja la conexión automática
  // No necesitamos forzar la conexión aquí

  // Sincronizar datos de la balanza con el componente
  useEffect(() => {
    if (enableSerialScale && isConnected && rawData) {
      // Usar rawData directamente en lugar de serialWeight
      if (onChange) {
        // Si rawData es un número, usarlo directamente
        const numericValue = parseFloat(rawData)
        if (!isNaN(numericValue)) {
          onChange(numericValue)
        }
      } 
      
      // Animación cuando llega un nuevo dato
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 500)
    }
  }, [rawData, isConnected, enableSerialScale, onChange])


  const formatWeight = (value: number) => {
    return Math.floor(value).toString().padStart(6, "0")
  }

  const handleSerialConnect = async () => {
    try {
      await connect()
    } catch (err) {
      console.error('Error conectando balanza:', err)
    }
  }

  const handleSerialDisconnect = async () => {
    try {
      await disconnect()
    } catch (err) {
      console.error('Error desconectando balanza:', err)
    }
  }

  return (
    <div className={styles.digitalCounter}>
      {isConnected ? (
        <div className={styles.digitalScale}>
          {/* Display LED */}
          <div className={styles.displayLED}>
            <div className={`${styles.weightInput} ${
                isAnimating ? styles.animating : styles.normal
              }`}>{rawData || 
                <Lottie animationData={Loading} loop={true} style={{ width: "100%", height: "110px" }}/>}</div>
          </div>
        </div>
      ) : (
        <>
          {error ? (
            <Alert key='danger' variant='danger'>
              <p className="mb-0">Error: {error}</p>
            </Alert>
          ) : (
            <Alert key='info' variant='warning'>
              <p className="mb-0">
                Por favor, presione el botón para conectar la balanza y seleccionar el puerto correspondiente
              </p>
            </Alert>
          )}
          
          <button 
            onClick={handleSerialConnect}
            disabled={isConnecting}
            className="btn btn-primary mb-0"
          >
            <FaPowerOff size={16} className="me-1"/>
            Conectar Balanza
          </button>
        </>
      )}
    </div>
  );
}