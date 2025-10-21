
"use client";

import React from 'react'
import CustomForm from '@/core/components/CustomForm'
import { createClientForm } from '@/data'
import { useSearchParams } from 'next/navigation'


export default function Page() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  return (
    <CustomForm data={createClientForm} id={id || undefined} />
  )
}
