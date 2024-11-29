import React from 'react';
import {Route,Routes} from "react-router-dom";
import Participant from "./components/Participant";
import Home from "./components/Home";
import Admin from "./components/Admin";
import Lotos from "./components/Lotos";



const App = () => {
    return (
        <div>

                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/participant" element={<Participant />} />
                    <Route path="/participant/:id" element={<Lotos />} />

                </Routes>

        </div>
    );
};

export default App;
