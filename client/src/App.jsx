import { useState } from 'react'


import { Button } from './components/ui/button'
import Login from './pages/Login'
import Navbar from './components/ui/Navbar'
import HeroSection from './pages/student/HeroSection'
import { createBrowserRouter } from 'react-router-dom'
import MainLayout from './layout/MainLayout'
import { Route } from 'react-router'
import { RouterProvider } from 'react-router'
import Courses from './pages/student/Courses'
import Course from './pages/student/Course'
import Mylearning from './pages/student/Mylearning'
import Profile from './pages/student/Profile'

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
          <Courses/>
         
          </>
        ),
        
      },
      {
        path:'/login',
        element:<Login/>,
      },
      {
        path:'my-learning',
        element:<Mylearning/>
      },
      {
        path:'profile',
        element:<Profile/>
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
