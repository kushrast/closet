import logo from './logo.svg';
import 'bulma/css/bulma.min.css';
import './App.css';

import {Heading, Icon} from 'react-bulma-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloud } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import React from 'react';

import {getOutfit} from "./api/Storage.js";

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


class OutfitPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {loading: true}

    getOutfit("blank")
    .then(
      (data) => {
        this.setState({...data, loading: false});
      }
      ,(error)=>console.log(error));
  }

  render() {
  return (
    <div style={{paddingTop: "15px"}}>
      { this.state.loading ? 
        <nav class="breadcrumb" aria-label="breadcrumbs">
          Loading
        </nav>
        :
        <div>
          <div>
            <nav class="breadcrumb" aria-label="breadcrumbs">
              <ul>
                <li><a href="#">Outfits</a></li>
                <li class="is-active"><a href="#" aria-current="page">{this.state.name}</a></li>
              </ul>
            </nav>
          </div>
          <div style={{paddingTop: "25px"}}>
            { this.state.jackets.length > 0 ?
              <div>
                <span class="title is-5"> { this.state.jackets.length > 1 ? "Jackets": "Jacket"} </span>
                {this.state.jackets.map((jacket) => 
                  <div>
                    <span class="subtitle is-6">
                      {jacket}
                    </span>
                  </div>
                )}
              </div>
              :
              <div></div>
            }
          </div>
          <div style={{paddingTop: "20px"}}>
            { this.state.shirts.length > 0 ?
              <div>
                <span class="title is-5"> { this.state.shirts.length > 1 ? "Shirts": "Shirt"} </span>
                {this.state.shirts.map((shirt) => 
                  <div>
                    <span class="subtitle is-6">
                      {shirt}
                    </span>
                  </div>
                )}
              </div>
              :
              <div></div>
            }
          </div>
          <div style={{paddingTop: "20px"}}>
            <div>
              <span class="title is-5"> Bottom </span>
              { this.state.bottoms.map((bottom) => 
                <div>
                  <span class="subtitle is-6">
                    {bottom}
                  </span>
                </div>
                )
              }
            </div>
          </div>
          <div style={{paddingTop: "20px"}}>
            <div>
              <span class="title is-5"> Shoes </span>
              { this.state.shoes.map((shoe) => 
                <div>
                  <span class="subtitle is-6">
                    {shoe}
                  </span>
                </div>
                )
              }
            </div>
          </div>
          <div style={{paddingTop: "20px"}}>
            <span class="title is-5"> Weather Rating </span>
            <div>
              <FontAwesomeIcon icon={faCloud} size="xs"/>
              <span class="subtitle is-6" style={{paddingLeft: "5px"}}> {this.state.weather_rating} degrees </span>
            </div>
          </div>
          <div style={{paddingTop: "20px"}}>
            <span class="title is-5"> Notes: </span>
            <div>
              <span class="subtitle is-6">
                {this.state.notes}
              </span>
            </div>
          </div>
          <div style={{paddingTop: "20px"}}>
            <div class="tags are-small" style={{paddingTop: "10px"}}>
              {this.state.styles.map((style) => <span class="tag">{style}</span>)}
              {this.state.other_tags.map((tag) => <span class="tag">{tag}</span>)}
            </div>
          </div>
        </div>
      }
    </div>
  )}
}

function App() {
  return (
    <div className="App">
      <div className="container">
        <Header/>
        <OutfitPage/>
      </div>
    </div>
  );
}

export default App;
