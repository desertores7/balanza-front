import React from 'react'
import Auth from '../../../core/components/Auth'
import { forgotPassword } from '../const/Auth'

export default function ForgotPassword() {
  return (
    <Auth data={forgotPassword}/>
  )
}
