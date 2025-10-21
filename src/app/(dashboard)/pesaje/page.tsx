import React from 'react'
import DataTable from '@/core/components/DataTable'
import { weighingTable } from '@/data'

export default function VehiclesPage() {
  return (
     <DataTable tableInfo={weighingTable}/>
  )
}
