import logo from './logo.svg';
import 'bulma/css/bulma.min.css';
import './App.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloud } from '@fortawesome/free-solid-svg-icons';
import { useParams } from "react-router";
import React from 'react';

import {getClothing} from "./api/Storage.js";

class GetClothing extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true
    }
    var id = this.props.params.id;

    getClothing(id)
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
                <li><a href="/clothing">Clothing</a></li>
                <li class="is-active"><a href="#" aria-current="page">{this.state.name}</a></li>
              </ul>
            </nav>
          </div>
          <div style={{paddingTop: "25px"}}>
            <div>
              <span class="title is-5"> Type </span>
              <div>
                <span class="subtitle is-6">
                  {this.state.type}
                </span>
              </div>
            </div>
          </div>
          <div style={{paddingTop: "25px"}}>
            <div>
              <span class="title is-5"> Color </span>
              <div>
                <span class="subtitle is-6">
                {this.state.color === "" ? <span style={{"fontStyle":"italic"}}> No color provided </span> : this.state.color }
                </span>
              </div>
            </div>
          </div>
          <div style={{paddingTop: "25px"}}>
            <div>
              <span class="title is-5"> TTL </span>
              <div>
                <span class="subtitle is-6">
                {this.state.TTL === "" ? <span style={{"fontStyle":"italic"}}> No TTL provided </span> : this.state.TTL }
                </span>
              </div>
            </div>
          </div>
          <div style={{paddingTop: "25px"}}>
            <div>
              <span class="title is-5"> URL </span>
              <div>
                <span class="subtitle is-6">
                { this.state.url != "" ?
                    <a href={this.state.url}>{this.state.url}</a>
                  :
                    <span style={{"fontStyle":"italic"}}> No URL provided </span> 
                }
                </span>
              </div>
            </div>
          </div>
          <div style={{paddingTop: "20px"}}>
            <span class="title is-5"> Notes: </span>
            <div>
              <span class="subtitle is-6">
                {this.state.notes === "" ? <span style={{"fontStyle":"italic"}}> No notes </span> : this.state.notes }
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
            <a href={"/clothing/"+this.state.id+"/edit"}><button class="button is-link is-small">Edit</button></a>
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

export default withRouter(GetClothing);