
import Navbar from './components/Navbar'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import SettingsPage from './pages/SettingsPage'
import ProfilePage from './pages/ProfilePage'
import { useAuthStore } from './stores/useAuthStore'
import { useEffect } from 'react'
import { Loader } from 'lucide-react'
import {Toaster} from "react-hot-toast";
import { socket } from './libs/socket'

export default function App() {
  const {authUser,checkAuth,isCheckingAuth} =useAuthStore()
  useEffect(()=>{
    checkAuth()
  },[checkAuth])

  useEffect(() => {
    if (!authUser) socket.disconnect()
  }, [authUser])

  if(isCheckingAuth && !authUser) return (
    <div className='flex justify-center items-center h-screen'>
      <Loader className='size-10 animate-spin'/>

    </div>
  )
  return (
    <div>
      <Navbar/>
      <Routes>
        <Route path='/' element={authUser ? <HomePage/> : <Navigate to="/login"/>}/>
        <Route path='/login' element={!authUser ? <LoginPage/> : <Navigate to={'/'}/>}/>
        <Route path='/register' element={!authUser ? <RegisterPage/>:<Navigate to={'/'}/>}/>
        <Route path='/settings' element={authUser ? <SettingsPage/> : <Navigate to={"/login"}/>}/>
        <Route path='/profile' element={authUser ? <ProfilePage/> : <Navigate to={"/login"}/>}/>

      </Routes>
        <Toaster position="top-center"/>
    </div>
  )
}
