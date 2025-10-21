import React from 'react'
import styles from '@styles/components/Navbar.module.scss'
import AvatarNav from '@components/Nav/AvatarNav';
import DarkMode from '@/core/components/Nav/DarkMode'
import { useAuthStore } from '@/core/store'


export default function Navbar() {
  const { user } = useAuthStore()
  return (
    <div className={styles.containerNav}>
      <h5 className={styles.titleNav}><span>Hola </span>{user?.firstName} {user?.lastName}</h5>
      <div className={styles.containerInnerNav}>
        <DarkMode />
        {/* <Notification /> */}
        <AvatarNav user={user}/>
        </div>
    </div>
  )
}
