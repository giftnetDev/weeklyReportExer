import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.tsx'

// import SortableLists  from "./components/SortableLists.tsx";
import Calendar  from "./report-components/Calendar.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Calendar />
  </StrictMode>,
)
