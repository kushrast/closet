import logo from './logo.svg';
import 'bulma/css/bulma.min.css';
import './App.css';

import {Heading, Icon} from 'react-bulma-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloud } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams,
  useRouteMatch
} from "react-router-dom";
import React from 'react';

import Home from './Home.jsx';
import GetOutfit from './GetOutfit.jsx';
import CreateOutfit from './CreateOutfit.jsx';
import EditOutfit from './EditOutfit.jsx';
import CreateClothing from './CreateClothing.jsx';
import EditClothing from './EditClothing.jsx';
import RefineClothing from './RefineClothing.jsx';
import GetClothing from './GetClothing.jsx';
import OmniSearch from './OmniSearch.jsx';

function Header() {
  return (
    <div className="header column">
      <div className="columns is-12">
        <h1 className="title is-1"><a href="/" style={{"color": "inherit"}}>Closet.</a></h1>
      </div>
    </div>
    );
}

function App() {
  return (
  <Router>
    <div className="App">
      <div className="container">
        <Header/>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/outfit/:id/edit" element={<EditOutfit/>}/>
          <Route path="/outfit/:id" element={<GetOutfit/>}/>
          <Route path="/outfit/create"  element={<CreateOutfit />}/>
          <Route path="/clothing/refine" element={<RefineClothing/>}/>
          <Route path="/clothing/:id/edit" element={<EditClothing/>}/>
          <Route path="/clothing/create"  element={<CreateClothing />}/>
          <Route path="/clothing/:id" element={<GetClothing/>}/>
          <Route path="/search"  element={<OmniSearch/>}/>
        </Routes>
      </div>
    </div>
  </Router>
  );
}

export default App;