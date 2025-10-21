"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import SidebarLayout from '@/core/components/layouts/SidebarLayout'
import { useTablesData } from '@/core/store/useTablesStore'
import { useAuthStore } from '@/core/store'
import { useOfflineSync } from '@/core/hooks/useOfflineSync'
import OfflineMonitor from '@/core/components/OfflineMonitor'
import SyncStatus from '@/core/components/SyncStatus'
import Error404 from '../error404'
import { navItems } from "../../app/Menu"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { fetchAllTablesData } = useTablesData()
  const { token, user } = useAuthStore()
  const [isReady, setIsReady] = useState(false)
  const router = useRouter()
  
  // Inicializar sincronización offline
  useOfflineSync()

  useEffect(() => {
    if (token) {
      fetchAllTablesData()
    }
  }, [token])

  useEffect(() => {
    // Esperamos a que el user esté definido (no undefined ni null)
    if (token && user) {
      setIsReady(true)
    }
  }, [token, user])

  // ✅ Si no hay token, redirigir a login (no mostrar Error404)
  useEffect(() => {
    if (!token && typeof window !== 'undefined') {
      router.replace('/iniciar-sesion')
    }
  }, [token, router])

  // 🚧 Mientras esperamos los datos o no hay token, no mostramos nada
  if (!isReady || !token) return null

  // ✅ Obtener la ruta actual solo en cliente
  const currentPath: string = typeof window !== "undefined" ? (window.location.pathname || "") : ""

  // ✅ Buscar el navItem correspondiente
  const currentNavItem = navItems.find(item => item.route && currentPath.startsWith(item.route))

  // ✅ Validar permisos
  const hasPermission =
    !currentNavItem?.onlyRole || currentNavItem.onlyRole === user?.role

  // ✅ Si no tiene permisos, mostrar Error404 (pero sí tiene token)
  if (!hasPermission) {
    return <Error404 />
  }

  return (
    <>
      <OfflineMonitor />
      <SyncStatus className="position-fixed top-0 start-0 w-100" style={{ zIndex: 1050 }} />
      <SidebarLayout>{children}</SidebarLayout>
    </>
  )
}
