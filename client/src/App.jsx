import { useState } from 'react'


import { Button } from './components/ui/button'
import Login from './pages/Login'
import Navbar from './components/ui/Navbar'
import HeroSection from './pages/student/HeroSection'
import { createBrowserRouter } from 'react-router-dom'
import MainLayout from './layout/MainLayout'
import { Route } from 'react-router'
import { RouterProvider } from 'react-router'

const appRouter=createBrowserRouter([
  {
    path:'/',
    element:<MainLayout/>,
    children:[
      {
        path:'/',
        element:(
          <>
          <HeroSection/>
          </>
        ),
        
      },
      {
        path:'/login',
        element:<Login/>,
      }
    ],
  }
])

function App() {
 
  return (
    <>
    <RouterProvider router={appRouter}/>

    </>
  )
}

export default App
