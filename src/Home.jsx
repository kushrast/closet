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
import EditOutfit from './EditOutfit.jsx';

function Home() {
  return (
    <div style={{"paddingTop": "50px"}}>
      <div class="columns">
        <div class="column is-3  is-centered">
          <a href="/outfit/create"><button class="button is-light is-success is-fullwidth">Add outfit</button></a>
        </div>
      </div>
      <div class="columns">
        <div class="column is-3  is-centered">
          <button class="button is-light is-success  is-fullwidth">Add Clothing</button>
        </div>
      </div>
      <div class="columns">
        <div class="column is-3  is-centered">
          <a href="/search"><button class="button is-light is-success  is-fullwidth">Search</button></a>
        </div>
      </div>
      <div class="columns">
        <div class="column is-3  is-centered">
          <button class="button is-light is-success  is-fullwidth">Refine</button>
        </div>
      </div>
    </div>
    );
}

export default Home;