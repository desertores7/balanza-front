import React from 'react'
import DataTable from '@/core/components/DataTable'
import { usersTable } from '@/data'

export default function DashboardPage() {
  return (
     <DataTable tableInfo={usersTable}/>
  )
}
