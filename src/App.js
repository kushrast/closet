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

import GetOutfit from './GetOutfit.jsx';
import CreateOutfit from './CreateOutfit.jsx';

function Header() {
  return (
    <div class="header column">
      <div class="columns is-12">
        <h1 class="title is-1">Closet.</h1>
      </div>
    </div>
    );
}

function MainPage() {
  return (
    <div>
      <div class="columns is-centered">
        <div  style={{paddingTop: "40px"}} class="column is-6">
          <figure class="image is-128x128 is-centered">
            <img src="https://bulma.io/images/placeholders/256x256.png"/>
          </figure>
        </div>
      </div>
      <div class="columns">
        <div class="column is-12  is-centered">
          <button class="button is-light is-fullwidth">Add outfit</button>
        </div>
      </div>
      <div class="columns">
        <div class="column is-12  is-centered">
          <button class="button is-info is-fullwidth">Browse</button>
        </div>
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
          <Route path="/outfit/id"  element={<GetOutfit />}/>
          <Route path="/outfit/create"  element={<CreateOutfit />}/>
        </Routes>
      </div>
    </div>
  </Router>
  );
}

export default App;