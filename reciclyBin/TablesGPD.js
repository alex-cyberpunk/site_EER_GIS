import { Route, Routes, BrowserRouter } from 'react-router-dom';
 
import Reprojetado from '../data/tableGPD/Reprojetado';
import InfoProps from '../data/tableGPD/InfoProps'
 
function TableGPD() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<InfoProps />} path="/InfoProps" exact />
                <Route element={<Reprojetado />} path="/Reprojetado" />
            </Routes>
        </BrowserRouter>
    )
}
 
export default TableGPD;