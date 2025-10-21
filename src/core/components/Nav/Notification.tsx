import React from 'react'
import { BiBell } from "react-icons/bi";
import styles from '@styles/components/Notification.module.scss'


export default function Notification() {
  return (
    <button className={styles.notificationButton}>
        <BiBell fontSize={20} />
        <div className={styles.notificationBadge}>9</div>
    </button>
  )
}
