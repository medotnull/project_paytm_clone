import { useState } from 'react'
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import SignUp from "./pages/SignUp"
import Signin from "./pages/SignIn"
import Dashboard from "./pages/Dashboard"
import SendMoney from "./pages/SendMoney"


function App() {
  //const [count, setCount] = useState(0)

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path="/signup" element={<SignUp/>} />
      <Route path="/signin" element={<Signin/>} />
      <Route path="/dashboard" element={<Dashboard/>} />
      <Route path="/send" element={<SendMoney/>} />
    </Routes>
    </BrowserRouter>
      
    </>
  )
}

export default App
