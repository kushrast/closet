import logo from './logo.svg';
import 'bulma/css/bulma.min.css';
import './App.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faPen } from '@fortawesome/free-solid-svg-icons';
import { Navigate } from "react-router-dom";
import React from 'react';

import AddListItem from './AddListItem.jsx';
import RemoveItem from './RemoveItem.jsx';
import {validatePotentialClothing, createNewClothing, getStyles} from "./api/Storage.js";

class TypePicker extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      active: false
    }

    this.box = React.createRef();
  }

  handleClickOutside(event) {
    if (this.box.current && !this.box.current.contains(event.target)) {
      this.setState({active: false})
    }
  };

  componentDidMount() {
    document.addEventListener('click', this.handleClickOutside.bind(this), true);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickOutside.bind(this), true);
    this.box = null;
  };

  getClasses = () => {
    if (this.state.active) {
      return "dropdown is-active";
    }
    return "dropdown";
  }

  toggleDropdown = () => {
    this.setState({active: !this.state.active});
  }

  /**
   * Alert if clicked on outside of element
   */
  handleClickOutside(event) {
    if (this.box && !this.box.current.contains(event.target)) {
      this.setState({active: false});
    }
  }

  selectType(type) {
    this.props.updateType(type);
    this.setState({active: false});
  }


  getClassNames = (type) => {
    if (this.props.selectedType === type) {
      return "dropdown-item is-active";
    }
    return "dropdown-item";
  }

  render() {
    return (
    <div>
      <div>
        <span class="title is-5"> Clothing Type </span>
      </div>
      <div class={this.getClasses()} ref={this.box}>
        <div class="dropdown-trigger">
            <div class="field">
                <p class="control is-expanded">
                  {this.props.selectedType + " "}
                  <a style={{"fontSize": "13px"}} aria-haspopup="true" aria-controls="dropdown-menu3" onClick={this.toggleDropdown}>{this.props.selectedType === "" ? <span>Choose Type</span> : <FontAwesomeIcon icon={faPen} size="xs"/>} </a>
                </p>
            </div>
        </div>
        <div class="dropdown-menu" id="dropdown-menu3" role="menu">
          <div class="dropdown-content">
            <a href="#" className={this.getClassNames("Shirt")} onClick={()=>this.selectType("shirt")}>
              Shirt
            </a>
            <a href="#" className={this.getClassNames("Jacket")} onClick={()=>this.selectType("jacket")}>
              Jacket
            </a>
            <a href="#" className={this.getClassNames("Bottom")} onClick={()=>this.selectType("bottom")}>
              Bottom
            </a>
            <a href="#" className={this.getClassNames("Shoe")} onClick={()=>this.selectType("shoe")}>
              Shoe
            </a>
          </div>
        </div>
      </div>
      <div>
        
      </div>
    </div>
    );
  }
}

class CreateClothing extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      clothing_id: "",
      clothing: {
        name: "",
        type: "",
        color: "" ,
        TTL: "",
        styles: [],
        other_tags: [],
        notes: "",
        url: ""
      }
    }
  }

  updateName = (inputElem) => {
    this.setState({clothing: {...this.state.clothing, name: inputElem.target.value}});
  }

  updateColor = (inputElem) => {
    this.setState({clothing: {...this.state.clothing, color: inputElem.target.value}});
  }

  updateTTL = (inputElem) => {
    this.setState({clothing: {...this.state.clothing, TTL: inputElem.target.value}});
  }

  updateURL = (inputElem) => {
    this.setState({clothing: {...this.state.clothing, url: inputElem.target.value}});
  }

  updateNotes = (inputElem) => {
    this.setState({clothing: {...this.state.clothing, notes: inputElem.target.value}});
  }

  updateType = (type) => {
    this.setState({clothing: {...this.state.clothing, type: type}});
  }

  addStyleTag = (style) => {
    this.setState({clothing: {...this.state.clothing, styles: [...this.state.clothing.styles, style.toLowerCase()]}})
  }

  deleteStyleTag = (index) => {
    var styles = this.state.clothing.styles;
    styles.splice(index, 1);
    this.setState({clothing: {...this.state.clothing, styles: styles}});
  }

  addOtherTag = (tag) => {
    this.setState({clothing: {...this.state.clothing, other_tags: [...this.state.clothing.other_tags, tag.toLowerCase()]}})
  }

  deleteOtherTag = (index) => {
    var other_tags = this.state.clothing.other_tags;
    other_tags.splice(index, 1);
    this.setState({clothing: {...this.state.clothing, other_tags: other_tags}});
  }

  validateFieldsForSubmission = () => {
    var submissionErrors = [];
    if (this.state.clothing.name == "") {
      submissionErrors.push("Clothing does not have a name");
    }

    if (this.state.clothing.type == "") {
      submissionErrors.push("Clothing must have a type");
    }

    return submissionErrors;
  }

  verifyClothing = () => {
    var submissionErrors = this.validateFieldsForSubmission();

    if (submissionErrors.length > 0) {
      alert(submissionErrors[0]);
      return;
    }

    validatePotentialClothing(this.state.clothing)
    .then(
      (response) => {
        createNewClothing(this.state.clothing)
          .then(
            (data) => {
              this.setState({clothing_id: data.clothing_id});
            },
            (error)=>console.log(error));
      },
      (error) => {
        alert(error.message);
    });
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
          {this.state.clothing_id != "" ? <Navigate to={"/clothing/"+this.state.clothing_id} replace={true} /> : ""}
          <div>
            <nav class="breadcrumb" aria-label="breadcrumbs">
              <ul>
                <li><a href="/clothing">Clothes</a></li>
                <li class="is-active"><a aria-current="page">Add New Clothing</a></li>
              </ul>
            </nav>
          </div>
          <div class="columns">
            <div class="column is-4">
              <div style={{paddingTop: "15px"}}>
                <div>
                <input class="input name-input" ref="input" placeholder="Clothing Name" onChange={this.updateName}/>
                </div>
              </div>
              <div style={{paddingTop: "25px"}}>
                <TypePicker selectedType={this.state.clothing.type} updateType={this.updateType} />
              </div>
              <div style={{"paddingTop": "25px", "marginTop": "0px", "marginBottom": "0px"}} class="columns">
                <div class="column is-6"  style={{"padding": "0px 0px 0px 12px"}}>
                  <div>
                    <span class="title is-5">Color </span>
                  </div>
                  <div>
                    <input class="input small-input" ref="input" placeholder="Color of item" onChange={this.updateColor}/>
                  </div>
                </div>
              </div>
              <div style={{"paddingTop": "25px", "marginTop": "0px", "marginBottom": "0px"}} class="columns">
                <div class="column is-6"  style={{"padding": "0px 0px 0px 12px"}}>
                  <div>
                    <span class="title is-5">TTL </span>
                  </div>
                  <div>
                    <input class="input small-input" ref="input" placeholder="Time to Live" onChange={this.updateTTL}/>
                  </div>
                </div>
              </div>
              <div style={{"paddingTop": "25px", "marginTop": "0px", "marginBottom": "0px"}} class="columns">
                <div class="column is-10"  style={{"padding": "0px 0px 0px 12px"}}>
                  <div>
                    <span class="title is-5">URL </span>
                  </div>
                  <div>
                    <input class="input small-input" ref="input" placeholder="Image URL" onChange={this.updateURL}/>
                  </div>
                </div>
              </div>
              <div style={{paddingTop: "25px"}}>
                <div>
                  <span class="title is-6"> Style Tags </span>
                </div>
                <div>
                  {this.state.clothing.styles.map((style, index) => 
                    <div style={{"display":"flex"}}>
                      <span class="tag" style={{"marginTop":"5px"}}>
                        {style}
                      <RemoveItem deleteItem={()=>{this.deleteStyleTag(index)}}/>
                      </span>
                    </div>
                  )}
                  <AddListItem numItems={this.state.clothing.styles.length} multipleString="Add Style Tag" singleString="Add Style Tag" addNew={this.addStyleTag} fetchAutofill={()=>{return getStyles()}}/>
                </div>
              </div>
              <div style={{paddingTop: "25px"}}>
                <div>
                  <span class="title is-6"> Other Tags </span>
                </div>
                <div>
                  {this.state.clothing.other_tags.map((tag, index) => 
                    <div style={{"display":"flex"}}>
                      <span class="tag" style={{"marginTop":"5px"}}>
                        {tag}
                      <RemoveItem deleteItem={()=>{this.deleteOtherTag(index)}}/>
                      </span>
                    </div>
                    )}
                  <AddListItem numItems={this.state.clothing.other_tags.length} multipleString="Add Other Tag" singleString="Add Other Tag" addNew={this.addOtherTag} fetchAutofill={()=>{return Promise.resolve([])}}/>
                </div>
              </div>
              <div style={{paddingTop: "20px"}}>
                <span class="title is-5"> Notes: </span>
                <div>
                  <textarea class="textarea" placeholder="Extra Notes" rows="4" onChange={this.updateNotes}></textarea>
                </div>
              </div>
              <div style={{paddingTop: "20px"}}>
                <button class="button is-info is-small" onClick={this.verifyClothing}>Add Clothing</button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  )}
}

export default CreateClothing;