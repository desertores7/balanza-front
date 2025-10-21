import React from 'react'
import Auth from '../../../core/components/Auth'
import { verifyEmail } from '../const/Auth'

export default function VerifyEmail() {
  return (
    <Auth data={verifyEmail}/>
  )
}
