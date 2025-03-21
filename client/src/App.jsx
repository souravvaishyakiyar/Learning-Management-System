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
import Sidebar from './pages/admin/Sidebar'
import Dashboard from './pages/admin/Dashboard'
import CourseTable from './pages/admin/course/CourseTable'
import AddCourse from './pages/admin/course/AddCourse'
import EditCourse from './pages/admin/course/EditCourse'
import CreateLecture from './pages/admin/lecture/createLecture'
import EditLecture from './pages/admin/lecture/EditLecture'
import CourseDetail from './pages/student/CourseDetail'
import CourseProgress from './pages/student/CourseProgress'
import SearchPage from './pages/student/SearchPage'

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
      },
      {
        path:'course/search',
        element:<SearchPage/>
      },
      {
        path:"course-detail/:courseId",
        element:<CourseDetail/>
      },
      {
        path:"course-progress/:courseId",
        element:<CourseProgress/>

      },

      //admin route start from here
      {
        path:'admin',
        element:<Sidebar/>,
        children:[
          {
            path:'dashboard',
            element:<Dashboard/>
          },
          {
            path:'course',
            element:<CourseTable/> 
          },
          {
            path:"course/create",
            element:<AddCourse/>
          },
          {
            path:"course/:courseId",
            element:<EditCourse/>
          },
          {
            path:"course/:courseId/lecture",
            element:<CreateLecture/>
          },
          {
            path:"course/:courseId/lecture/:lectureId",
            element:<EditLecture/>
          }
        ]
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
