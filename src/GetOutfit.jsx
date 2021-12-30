import logo from './logo.svg';
import 'bulma/css/bulma.min.css';
import './App.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloud } from '@fortawesome/free-solid-svg-icons';
import { useParams } from "react-router";
import React from 'react';

import {getOutfit} from "./api/Storage.js";

class GetOutfit extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true
    }
    var id = this.props.params.id;
    if (id == null) {
      id = "619f517d7105e3db8b626617";
    }

    getOutfit(id)
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
          <div style={{paddingTop: "20px"}}>
            <a href={"/outfit/"+this.state.id+"/edit"}><button class="button is-link is-small">Edit</button></a>
          </div>
        </div>
      }
    </div>
  )}
}

const withRouter = WrappedComponent => props => {
  const params = useParams();
  // etc... other react-router-dom v6 hooks

  return (
    <WrappedComponent
      {...props}
      params={params}
      // etc...
    />
  );
};

export default withRouter(GetOutfit);
