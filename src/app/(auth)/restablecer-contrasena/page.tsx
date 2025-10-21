import React from 'react'
import Auth from '../../../core/components/Auth'
import { resetPassword } from '../const/Auth'

export default function ResetPassword() {
  return (
    <Auth data={resetPassword}/>
  )
}
