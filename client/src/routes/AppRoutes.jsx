import React from 'react'
import { Route, Routes } from 'react-router-dom'
import UserManagement from '../pages/UserManagement'

function AppRoutes() {
  return (
    <Routes>
        <Route path='/' element={<UserManagement />} />
    </Routes>
  )
}

export default AppRoutes