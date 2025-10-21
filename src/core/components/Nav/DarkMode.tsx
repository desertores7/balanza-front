'use client'

import { useEffect } from 'react'
import styles from '@styles/components/DarkMode.module.scss'
import { BiSolidMoon, BiSolidSun } from 'react-icons/bi'
import { useThemeStore } from '@/core/store/theme'


export default function DarkMode() {
  const { theme, toggleTheme } = useThemeStore()

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])

  return (
    <label htmlFor="switch" className={styles.toggle}>
      <input
        type="checkbox"
        className={styles.input}
        id="switch"
        checked={theme === 'dark'}
        onChange={toggleTheme}
      />
      <div
        className={`${styles.iconCustom} ${styles.iconMoon} ${
          theme === 'dark' ? styles.hidden : ''
        }`}
      >
        <BiSolidMoon color='black' fontSize={20} />
      </div>
      <div
        className={`${styles.iconCustom} ${styles.iconSun} ${
          theme === 'dark' ? styles.visible : ''
        }`}
      >
        <BiSolidSun fontSize={20} />
      </div>
    </label>
  )
}
