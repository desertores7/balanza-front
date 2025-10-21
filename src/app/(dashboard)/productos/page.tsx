import React from 'react'
import DataTable from '@/core/components/DataTable'
import { productsTable } from '@/data'

export default function VehiclesPage() {
  return (
     <DataTable tableInfo={productsTable}/>
  )
}
