import React from 'react';
import { Route, BrowserRouter } from 'react-router-dom';

import Home from './pages/home';
import CreatePoint from './pages/CreatePoint';
import SearchPoint from './pages/SearchPages';


const Routes = () => {
    return (
        <BrowserRouter>
            <Route component={Home} path="/" exact/> 
            <Route component={CreatePoint} path="/create-point"/> 
            <Route component={SearchPoint} path="/search-point"/>   
        </BrowserRouter>

    );
}

export default Routes;