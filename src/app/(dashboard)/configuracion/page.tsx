
"use client";

import React from 'react'
import CustomForm from '@/core/components/CustomForm'
import { configurationForm } from '@/data'
import { useAuthStore } from '@/core/store'

export default function Page() {
  const { user } = useAuthStore()

  return (
    <CustomForm data={configurationForm} id={user?.companyUuid || undefined} />
  )
}
