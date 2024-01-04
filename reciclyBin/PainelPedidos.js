import { Route, Routes, BrowserRouter } from 'react-router-dom';
 
import MapaPedidos from './MapaPedidos';
import Forms from '../formsPedidos';
 
function PainelPedidos() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<MapaPedidos />} path="/MapaPedidos" exact />
                <Route element={<Forms />} path="/forms" />/*Modificar para entradas*/ 
            </Routes>
        </BrowserRouter>
    )
}
 
export default PainelPedidos;