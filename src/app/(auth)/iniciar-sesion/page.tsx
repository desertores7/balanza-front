import React from 'react'
import Auth from '../../../core/components/Auth'
import { login } from '../const/Auth'

export default function Login() {
  return (
    <Auth data={login}/>
  )
}
