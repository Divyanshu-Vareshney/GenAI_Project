import { BrowserRouter, Routes,Route } from 'react-router-dom'
import Home from './Pages/Home'
import Verify from './Pages/Verify'
import Login from './Pages/Login'
import { UserData } from './context/UserContext'
import { LoadingBig } from './Components/Loading'
function App() {
  const {isAuth,loading}=UserData()
  return (
    <>

    {loading?<LoadingBig/>:<BrowserRouter>
    <Routes>
      <Route path='/' element={isAuth?<Home/>:<Login/>}/>
      <Route path='/login' element={isAuth?<Home/>:<Login/>}/>
      <Route path='/verify' element={isAuth?<Home/>:<Verify/>}/>
    </Routes>
    </BrowserRouter>}
    </>
  )
}

export default App
