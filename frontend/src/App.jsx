import "./App.css";
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Map from "./Map.jsx";
import ReportPage from "./pages/ReportPage.jsx";
function App() {
  

  return (
    <BrowserRouter>
       <Routes>
          <Route path="/" element={<Map></Map>}></Route>
          <Route path="/report/:id" element={<ReportPage/>}></Route>
       </Routes>
    </BrowserRouter>
  )
}

export default App
