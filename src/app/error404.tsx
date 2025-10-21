import React from 'react'
import Link from 'next/link'
import styles from '@/core/styles/pages/Error404.module.scss'

export default function Error404() {
  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorContent}>
        <div className={styles.errorNumber}>404</div>
        <div className={styles.errorTitle}>Página no encontrada</div>
        <div className={styles.errorDescription}>
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </div>
        <div className={styles.errorActions}>
          <Link href="/iniciar-sesion" className={styles.homeButton}>
            Ir al inicio
          </Link>
          <button 
            onClick={() => window.history.back()} 
            className={styles.backButton}
          >
            Volver atrás
          </button>
        </div>
      </div>
      <div className={styles.errorIllustration}>
        <div className={styles.illustration404}>
          <div className={styles.zero}>0</div>
          <div className={styles.four}>4</div>
          <div className={styles.zero}>0</div>
          <div className={styles.four}>4</div>
        </div>
      </div>
    </div>
  )
}
