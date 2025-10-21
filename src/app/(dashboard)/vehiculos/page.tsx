import React from 'react'
import DataTable from '@/core/components/DataTable'
import { vehiclesTable } from '@/data'

export default function VehiclesPage() {
  return (
     <DataTable tableInfo={vehiclesTable}/>
  )
}
