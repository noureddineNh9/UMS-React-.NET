import './App.css';
import { BrowserRouter as Router , Route, Link, Routes, Navigate } from "react-router-dom";
import { useRoutes } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import LoginPage from './Pages/LoginPage';
import axios from "axios";
import  React, { useEffect, useState } from 'react';
import UserContext from './Context/UserContext';
import NotFound from './Pages/NotFound';
import Classes from './AdminArea/Classes';
import SecretPage from './Pages/SecretPage';
import RegisterPage from './Pages/RegisterPage';
import MainLayout from './Components/MainLayout';
import Modules from './AdminArea/Modules';
import StudentMainLayout from './StudentArea/StudentMainLayout';
import Students from './AdminArea/Students';
import Profile from './StudentArea/Profile';
import Professors from './AdminArea/Professors';
import Emails from './StudentArea/Emails';
import ProfessorMainLayout from './ProfessorArea/ProfessorMainLayout';
import ProfessorModules from './ProfessorArea/ProfessorModules';
import AdminMainLayout from './AdminArea/AdminMainLayout';
import LoadingPage from './Pages/LoadingPage';
import HomePage from './Pages/HomePage';
import LoadingPage2 from './Pages/loadingPage2';
import SingleModulePage from './StudentArea/SingleModulePage';



const mainRoutes = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: '404', element: <NotFound /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  }
]

const adminRoutes = [
  {
    path: '/AdminArea',
    element: <AdminMainLayout />,
    children: [
      { path: '/Secret', element: <SecretPage /> },
      { path: 'Classes', element: <Classes /> },
      { path: 'Professors', element: <Professors /> },
      { path: 'Students', element: <Students /> },
      { path: 'Modules', element: <Modules /> },
      { path: '404', element: <NotFound /> },
      { path: '*', element: <Navigate to="/AdminArea/404" /> }

    ]
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '404', element: <NotFound /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  }
];

const studentRoutes = [
  {
    path: '/StudentArea',
    element: <StudentMainLayout />,
    children: [
      { path: 'Profile', element: <Profile /> },
      { path: 'module/:id', element: <SingleModulePage /> },
      { path: '404', element: <NotFound /> },
      { path: 'Emails', element: <Emails /> },
      { path: '*', element: <Navigate to="/StudentArea/404" /> }

    ]
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '404', element: <NotFound /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  }
];

const professorRoutes = [
  {
    path: '/ProfessorArea',
    element: <ProfessorMainLayout />,
    children: [
      { path: 'Profile', element: <Profile /> },
      { path: 'Modules', element: <ProfessorModules /> },
      { path: 'Emails', element: <Emails /> },
      { path: '404', element: <NotFound /> },
      { path: '*', element: <Navigate to="/ProfessorArea/404" /> }

    ]
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '404', element: <NotFound /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  }
];


const routes = [
  {
    path: '/AdminArea',
    element: <AdminMainLayout />,
    children: [
      { path: '/Secret', element: <SecretPage /> },
      { path: 'Classes', element: <Classes /> },
      { path: 'Professors', element: <Professors /> },
      { path: 'Students', element: <Students /> },
      { path: 'Modules', element: <Modules /> },
      { path: '404', element: <NotFound /> },
      { path: '*', element: <Navigate to="/AdminArea/404" /> }

    ]
  },
  {
    path: '/ProfessorArea',
    element: <ProfessorMainLayout />,
    children: [
      { path: 'Profile', element: <Profile /> },
      { path: 'Modules', element: <ProfessorModules /> },
      { path: 'Emails', element: <Emails /> },
      { path: '404', element: <NotFound /> },
      { path: '*', element: <Navigate to="/ProfessorArea/404" /> }

    ]
  },
  {
    path: '/StudentArea',
    element: <StudentMainLayout />,
    children: [
      { path: '/Secret', element: <SecretPage /> },
      { path: 'Profile', element: <Profile /> },
      { path: '404', element: <NotFound /> },
      { path: 'Emails', element: <Emails /> },
      { path: '*', element: <Navigate to="/StudentArea/404" /> }

    ]
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: '404', element: <NotFound /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  }
];


function App() {
  

  const [user, setUser] = useState({id: 0})
  const [roles, setRoles] = useState([])
  const [isAuth, setisAuth] = useState(false)
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  const resetContext = () => {
    setisAuth(false)
    setUser({})
    setRoles([])
  }

  useEffect(()=>{
    axios.post("http://localhost:21260/api/Users/refresh-token")
    .then(res => {
      console.log(res.data);
      if(res.data !== "")
      {
        console.log(res.data);
        setisAuth(true)
        
        getData()
        setRoles(res.data.roles)

        if(res.data.roles.includes("Professor"))
        {
          axios.get("http://localhost:21260/api/Modules/GetModulesByProfId?id=" + res.data.id )
          .then(response => {
            setUser({
              ...res.data,
              ProfModules: response.data
            })
  
  
          })
        }else if(res.data.roles.includes("Student"))
        {
          
          axios.get("http://localhost:21260/api/Student/getStudentInfo?id=" + res.data.id )
          .then(response => {
            setUser({
              ...res.data,
              Info: response.data
            })
            console.log(response.data);

          })
          .catch(err => console.log(err))
          
        }
        
        axios.get("http://localhost:21260/api/Mails")
        .then(response => {
          const list = response.data.filter(mail => {
            if(mail.ricipientId === res.data.id || mail.senderID === res.data.id) return mail
          })
          dispatch( {type:'GET_ALL_EMAIL', data: list} )
        })




      }
      else {
        resetContext()
        console.log("zeze");
      }

      setTimeout(()=> {
        setLoading(false)
      }, 1500)
    })
    .catch(err => {
      resetContext()
      
    })

    setTimeout(()=> {
      setLoading(false)
    }, 1500)
    



  },[])

  const getData = () => {
    axios.get("http://localhost:21260/api/Professors/getAll")
    .then(res => {
      dispatch( {type:'GET_ALL_PROFESSOR', data: res.data} )
    })

    axios.get("http://localhost:21260/api/Student/getAll")
    .then(res => {
      dispatch( {type:'GET_ALL_STUDENT', data: res.data} )
    })

    axios.get("http://localhost:21260/api/Classes")
    .then(res => {
      dispatch( {type:'GET_ALL_CLASSES', data: res.data} )
    })


  }



  let elements = useRoutes(routes);
  let MainRoutes = useRoutes(mainRoutes)
  let StudentRoutes = useRoutes(studentRoutes)
  let ProfessorRoutes = useRoutes(professorRoutes)
  let AdminRoutes = useRoutes(adminRoutes)

  return (   
    <UserContext.Provider value={{
      isAuth: isAuth,
      User: user,
      'setUser': setUser,
      'setisAuth': setisAuth,
      Roles: roles
    }} >
      {
        loading ? <LoadingPage2 /> : 
        isAuth ? 
          roles.includes("Student") ? StudentRoutes :
          roles.includes("Professor") ? ProfessorRoutes :
          roles.includes("Admin") && AdminRoutes
          : MainRoutes

      }

    </UserContext.Provider>
  );
}

const AppWrapper = () => {
  return (
    <Router>
      <App />
    </Router>
  );
};

export default AppWrapper;
