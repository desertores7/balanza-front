/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand'
import apiClient from '../lib/apiClient'
import { navItems } from '@/app/Menu'


interface TablesState {
  tablesData: Record<string, any>
  filtersOptions: Record<string, any[]>
  fetchAllTablesData: () => Promise<void>
  getTableData: (pathname: string, filters?: Record<string, string | number>) => any
  fetchTableData: (pathname: string, filters?: Record<string, string | number>, tableKey?: string) => Promise<void>
  refreshTableData: (route: string, tableKey: string) => Promise<void>
  deleteTableData: (pathname: string, ids: string[]) => Promise<void>
  fetchAllFiltersData: (tableInfo: any) => Promise<void>
  refreshFilterData: (filterName: string, filterRoute: string) => Promise<void>
  setFilterOptions: (filterName: string, options: any[]) => void
  getFilterOptions: (filterName: string) => any[]
  userUseFilters: boolean
  setUserUseFilters: (userUseFilters: boolean) => void
  userUsedFiltersInView: Record<string, boolean>
  setUserUsedFiltersInView: (tableKey: string, used: boolean) => void
  getUserUsedFiltersInView: (tableKey: string) => boolean
}

export const useTablesStore = create<TablesState>()((set, get) => ({
  tablesData: {},
  filtersOptions: {},
  userUseFilters: false,
  userUsedFiltersInView: {},
  //Hace las peticiones a todas las rutas del menu
  fetchAllTablesData: async () => {
    const routes = navItems
      .filter(item => item.mainRoute) //filtra las rutas que tienen mainRoute
      .map(item => ({ mainRoute: item.mainRoute!, tableKey: item.tableKey! })) //mapea las rutas a un objeto con mainRoute y tableKey

    const promises = routes.map(async ({ mainRoute, tableKey }) => {
      try {
        const response = await apiClient.get(mainRoute)
        
        // Guardar datos en cache local para uso offline
        localStorage.setItem(`cache_${tableKey}`, JSON.stringify({
          data: response.data,
          timestamp: Date.now(),
          route: mainRoute
        }));
        
        return { tableKey, data: response.data }
      } catch (error: any) {
        console.error(`Error fetching ${mainRoute}:`, error)
        
        // Si es error de red, intentar usar datos cacheados
        if (!error.response) {
          const cachedData = localStorage.getItem(`cache_${tableKey}`);
          if (cachedData) {
            const parsed = JSON.parse(cachedData);
            console.log(`Usando datos cacheados para ${tableKey}`);
            return { tableKey, data: parsed.data }
          }
        }
        
        return { tableKey, data: null }
      }
    })

    const results = await Promise.all(promises)
    const newData: Record<string, any> = {}

    
    results.forEach(({ tableKey, data }) => {
      if (data) {
        newData[tableKey] = data
      }
    })
    set({ tablesData: newData })
  },

  //Hace las peticiones de todos los filtros dinámicos
  fetchAllFiltersData: async (filters: any) => {

    const state = get()
    const dynamicFilters = filters?.filter((filter: any) => filter.route)
    if(!dynamicFilters) {
      return
    }


    // Filtrar solo los filtros que NO están ya en el store
    const filtersToFetch = dynamicFilters?.filter((filter: any) => 
      !state.filtersOptions[filter.filterKey]
    )

    // Si no hay filtros para cargar, no hacer nada
    if (filtersToFetch?.length === 0) {
      return
    }

    
    const promises = filtersToFetch?.map(async (filter: any) => {
      try {
        const response = await apiClient.get(filter.route)
        return { 
          filterName: filter.filterKey, 
          data: response.data?.items || response.data 
        }
      } catch (error) {
        return { filterName: filter.filterKey, data: null }
      }
    })

    const results = await Promise.all(promises)
    // Procesar resultados y actualizar el store de filtros dinámicos
    results.forEach(({ filterName, data }) => {
      if (data && Array.isArray(data)) {
        const options = data.map((item: { name: string; uuid: string; firstName?: string; lastName?: string }) => ({
          label: item.name || (item?.firstName || '') + ' ' + (item?.lastName || ''),
          value: item.uuid,
        }))
        
        set((state) => ({
          filtersOptions: {
            ...state.filtersOptions,
            [filterName]: options
          }
        }))
      }
    })
  },

  //Refresca los datos de un filtro específico
  refreshFilterData: async (filterName: string, filterRoute: string) => {

    try {
      const response = await apiClient.get(filterRoute)
      const data = response.data?.items || response.data
      
      if (data && Array.isArray(data)) {
        const options = data.map((item: { name: string; uuid: string; firstName?: string; lastName?: string }) => ({
          label: item.name || item?.firstName + ' ' + item?.lastName,
          value: item.uuid,
        }))
        
        set((state) => ({
          filtersOptions: {
            ...state.filtersOptions,
            [filterName]: options
          }
        }))
      }
    } catch (error) {
      console.error(`Error refreshing filter ${filterName}:`, error)
    }
  },

//Trae todos los datos de la tabla
  getTableData: (mainRoute: string, filters = {}) => {
    const mainRouteKey = mainRoute.split('/').pop()
    const state = get()
    // Obtener el mainRoute del item activo
    if (!mainRoute) return null
    // Si no hay filtros, buscar con la clave directa del route
    if (Object.keys(filters).length === 0) {
      return state.tablesData[mainRouteKey || ''] || null
    }

    
    // Si hay filtros, buscar con la clave combinada
    const cacheKey = `${mainRouteKey}_${JSON.stringify(filters)}`
    return state.tablesData[cacheKey] || null
  },


  fetchTableData: async (mainRoute: string, filters = {}, tableKey: string | undefined) => {
    const state = get()
    try {
      const response = await apiClient.get(mainRoute, {
        params: filters,
      })
      set((state) => ({
        tablesData: {
          ...state.tablesData,
          [tableKey || '']: response.data
        }
      }))
    } catch (error) {
      console.error(`Error fetching ${mainRoute}:`, error)
    }
  },

  refreshTableData: async (route: string, tableKey: string) => {
    try {
      const response = await apiClient.get(route)
      set((state) => ({
        tablesData: {
          ...state.tablesData,
          [tableKey]: response.data
        }
      }))
    } catch (error) {
      console.error(`Error refreshing ${route}:`, error)
    }
  },

  deleteTableData: async (pathname: string, ids: string[]) => {
    // Obtener el mainRoute del item activo
    const mainRouteKey = pathname.split('/').pop()
    if (!mainRouteKey) return

    try {
      await apiClient.delete(mainRouteKey, {
        data: { arrayUuids: ids }
      })
      
      // Refrescar los datos después de eliminar
      const response = await apiClient.get(mainRouteKey)
      set((state) => ({
        tablesData: {
          ...state.tablesData,
          [mainRouteKey]: response.data
        }
      }))
    } catch (error) {
      console.error(`Error deleting from ${mainRouteKey}:`, error)
      throw error // Re-lanzar el error para que el componente lo maneje
    }
  },

  setFilterOptions: (filterName: string, options: any[]) => {
    set((state) => ({
      filtersOptions: {
        ...state.filtersOptions,
        [filterName]: options
      }
    }))
  },

  getFilterOptions: (filterName: string) => {
    const state = get()
    return state.filtersOptions[filterName] || []
  },

  setUserUseFilters: (userUseFilters: boolean) => {
    set({ userUseFilters: userUseFilters })
  },

  setUserUsedFiltersInView: (tableKey: string, used: boolean) => {
    set((state) => ({
      userUsedFiltersInView: {
        ...state.userUsedFiltersInView,
        [tableKey]: used
      }
    }))
  },

  getUserUsedFiltersInView: (tableKey: string) => {
    const state = get()
    return state.userUsedFiltersInView[tableKey] || false
  }
}))

//Exporta las funciones del store
export const useTablesData = () => {
  const store = useTablesStore()
  return {
    fetchAllTablesData: store.fetchAllTablesData,
    fetchAllFiltersData: store.fetchAllFiltersData,
    getTableData: store.getTableData,
    fetchTableData: store.fetchTableData,
    refreshTableData: store.refreshTableData,
    refreshFilterData: store.refreshFilterData,
    deleteTableData: store.deleteTableData,
    setFilterOptions: store.setFilterOptions,
    getFilterOptions: store.getFilterOptions,
    filtersOptions: store.filtersOptions,
    setUserUseFilters: store.setUserUseFilters,
    userUseFilters: store.userUseFilters,
    setUserUsedFiltersInView: store.setUserUsedFiltersInView,
    getUserUsedFiltersInView: store.getUserUsedFiltersInView
  }
}
