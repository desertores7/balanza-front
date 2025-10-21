import React from 'react'
import DataTable from '@/core/components/DataTable'
import { clientsTable } from '@/data'

export default function DashboardPage() {
  return (
     <DataTable tableInfo={clientsTable}/>
  )
}
