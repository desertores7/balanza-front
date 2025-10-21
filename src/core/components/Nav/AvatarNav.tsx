'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import styles from '@styles/components/Avatar.module.scss'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/core/store'

interface User {
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
  activeUser: number;
  imgProfile?: { url: string; type?: string };
}

export default function AvatarNav({ user }: { user: User | null }) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { logout } = useAuth()
  const router = useRouter()

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const handleBackdropClick = () => {
    setIsOpen(false)
  }

  const handleLogout = async () => {
    logout()
    // El DashboardLayout se encargará de la redirección automáticamente
  }

  return (
    <>
      {isOpen && (
        <div 
          className={styles.backdrop}
          onClick={handleBackdropClick}
        />
      )}
      
      <div className={styles.avatarContainer}>
        <button 
          className={styles.avatarButton}
          onClick={toggleDropdown}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          {user!==null && (
          <div className={styles.avatarBorder}>
            {user?.imgProfile?.type==="image/jpeg" || user?.imgProfile?.type==="image/png" || user?.imgProfile?.type==="image/jpg" ? (
            <Image 
              src={user?.imgProfile?.url} 
              alt="Avatar del usuario" 
              width={30}
              height={30}
              style={{ objectFit: 'cover' }}
            />
            ) : user?.imgProfile && user?.imgProfile?.url !== "" ? (
              <video 
                src={user?.imgProfile?.url} 
                autoPlay 
                muted 
                playsInline 
                loop 
                width={30}
                height={30}
                style={{ objectFit: 'cover' }}
              />
            ) : (
              <div className="d-flex align-items-center gap-2">
                <div className={styles.emptyAvatar} style={{backgroundColor:"var(--secondary)" }}>
                  <span>{user?.firstName?.charAt(0)} {user?.lastName?.charAt(0)}</span>                               
                </div>
              </div>
            )}
          </div>
          )}
          <div className={styles.avatarStatusDot}></div>
        </button>
        {isOpen && (
          <div className={styles.dropdownMenu}>
          <div className={styles.dropdownItem}  onClick={handleLogout}>
              <span>Cerrar Sesión</span>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
