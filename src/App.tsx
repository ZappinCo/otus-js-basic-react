import './App.css'
import Today from './components/Today'
import TodayRedirect from './components/TodayRedirect';
import AboutPage from './components/AboutPage';
import { BrowserRouter, Route, Routes } from "react-router";

function App() {
  return (
    <>
      <BrowserRouter basename="/otus-js-basic-react">
        <Routes>
          <Route path=":city" element={<Today />} />
          <Route path="/" element={<TodayRedirect />} />
          <Route path='/about' element={<AboutPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
