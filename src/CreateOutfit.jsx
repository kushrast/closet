import logo from './logo.svg';
import 'bulma/css/bulma.min.css';
import './App.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWind, faCloud, faCloudSun, faSun, faTemperatureHigh, faPen } from '@fortawesome/free-solid-svg-icons';
import { withRouter } from "react-router";
import * as stringSimilarity from "string-similarity";
import React from 'react';

import {getClothesOfType} from "./api/Storage.js";

class AddListItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showInput: false,
      showDropdown: false,
      value: "",

      existingCategoryValues: [],
      autofillGuesses: []
    }

    this.box = React.createRef();
  }

  componentDidMount() {
    document.addEventListener('click', this.handleClickOutside.bind(this), true);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickOutside.bind(this), true);
  };

  /**
   * Alert if clicked on outside of element
   */
  handleClickOutside(event) {
    if (this.box && !this.box.current.contains(event.target)) {
      this.setState({showInput: false, showDropdown: false});
    }
  }

  updateInputValue = (inputElem) => {
    this.setState({value: inputElem.target.value});
  }

  onSubmit = () => {
    this.props.addNew(this.state.value);
    this.setState({value: "", showInput: false, showDropdown: false});
  }

  showInput = () => {
    this.setState({showInput: true});
  }

  onKeyDown = (event) => {
    //TODO: FIX LOGIC, ONLY FOR TESTING, NOT ROBUST
    console.log(this.state.existingCategoryValues.length);
    if (this.state.existingCategoryValues.length == 0) {
      this.props.fetchAutofill()
      .then(
        (data) => {
          this.setState({existingCategoryValues: data});
        }
        ,(error)=>console.log(error));
    } else {
      console.log(this.state.existingCategoryValues);
      var matches = stringSimilarity.findBestMatch(this.state.value, this.state.existingCategoryValues);
      if (matches.bestMatch.rating > 0.15) {
        this.setState({autofillGuesses: this.state.existingCategoryValues, showDropdown: true});
      } else {
        this.setState({autofillGuesses: [], showDropdown: false});
      }

      if (event.key==="Enter") {
        this.onSubmit();
      }
    }
  }

  selectFromAutofill = (item) => {
    this.setState({value: item}, ()=>{this.onSubmit();});
  }

  render() {
    return (
      <div ref={this.box}>
      {
        !this.state.showInput ?
          <a style={{"fontSize": "13px"}} onClick={this.showInput}>{ this.props.numItems > 0 ? this.props.multipleString : this.props.singleString} </a>
        :
          <div class="dropdown is-active" style={{"marginTop":"5px"}}>
            <div class="dropdown-trigger">
                <div class="field">
                    <p class="control is-expanded">
                        <input class="input is-small" type="search" placeholder="Search or Add New" value={this.state.value} onChange={this.updateInputValue} onKeyDown={this.onKeyDown}/>
                    </p>
                </div>
            </div>
            { this.state.showDropdown && this.state.autofillGuesses.length > 0 ?
            <div class="dropdown-menu" id="dropdown-menu" role="menu">
                <div class="dropdown-content">
                    {this.state.autofillGuesses.map((autofillGuess) => <a class="dropdown-item" onClick={()=>{this.selectFromAutofill(autofillGuess)}}>{autofillGuess}</a>)}
                </div>
            </div>
            : ""}
          </div>
      }
      </div>
      );
  }
}

class WeatherPicker extends React.Component {
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

  setWeather(weather) {
    this.props.updateWeatherRating(weather);
    this.setState({active: false});
  }

  formatWeatherRating = () => {
    switch(this.props.weather_rating) {
      case "45-55":
        return (
          <span>
            <FontAwesomeIcon icon={faWind} size="xs"/>
            <span class="subtitle is-6"> 45-55 degrees </span>
          </span>
          );
        break;
      case "55-63":
        return (
          <span>
            <FontAwesomeIcon icon={faCloud} size="xs"/>
            <span class="subtitle is-6"> 55-63 degrees </span>
          </span>
          );
      case "65-66":
        return (
          <span>
            <FontAwesomeIcon icon={faCloudSun} size="xs"/>
            <span class="subtitle is-6"> 63-66 degrees </span>
          </span>
          );
      case "66-73":
        return (
          <span>
            <FontAwesomeIcon icon={faSun} size="xs"/>
            <span class="subtitle is-6"> 66-73 degrees </span>
          </span>
          );
      case "73+":
        return (
          <span>
            <FontAwesomeIcon icon={faTemperatureHigh} size="xs"/>
            <span class="subtitle is-6"> 73+ degrees </span>
          </span>
          );
    }
  }

  render() {
    return (
    <div>
      <div>
        <span class="title is-5"> Weather Rating </span>
      </div>
      <div class={this.getClasses()} ref={this.box}>
        <div class="dropdown-trigger">
            <div class="field">
                <p class="control is-expanded">
                  { this.props.weather_rating === "" ? "" : this.formatWeatherRating()}
                  <a style={{"fontSize": "13px"}} aria-haspopup="true" aria-controls="dropdown-menu3" onClick={this.toggleDropdown}>{this.props.weather_rating === "" ? <span>Choose Weather Rating</span> : <FontAwesomeIcon icon={faPen} size="xs"/>} </a>
                </p>
            </div>
        </div>
        <div class="dropdown-menu" id="dropdown-menu3" role="menu">
          <div class="dropdown-content">
            <a class="dropdown-item">
              <FontAwesomeIcon icon={faWind} size="xs"/>
              <span style={{paddingLeft: "5px"}} onClick={()=>{this.setWeather("45-55")}}> 45-55 degrees </span>
            </a>
            <a class="dropdown-item">
              <FontAwesomeIcon icon={faCloud} size="xs"/>
              <span style={{paddingLeft: "5px"}} onClick={()=>{this.setWeather("55-63")}}> 55-63 degrees </span>
            </a>
            <a class="dropdown-item">
              <FontAwesomeIcon icon={faCloudSun} size="xs"/>
              <span style={{paddingLeft: "5px"}} onClick={()=>{this.setWeather("63-66")}}> 63-66 degrees </span>
            </a>
            <a class="dropdown-item">
              <FontAwesomeIcon icon={faSun} size="xs"/>
              <span style={{paddingLeft: "5px"}} onClick={()=>{this.setWeather("66-73")}}> 66-73 degrees </span>
            </a>
            <a class="dropdown-item">
              <FontAwesomeIcon icon={faTemperatureHigh} size="xs"/>
              <span style={{paddingLeft: "5px"}} onClick={()=>{this.setWeather("73+")}}> 73+ degrees </span>
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

class CreateOutfit extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      outfit: {
        name: "",
        notes: "",
        jackets: ["Green Shirt Jacket"],
        shirts: [],
        bottoms: [],
        shoes: [],
        styles: [],
        other_tags: [],
        weather_rating: ""
      }
    }
  }

  addNewJacket = (jacket) => {
    this.setState({outfit: {...this.state.outfit, jackets: [...this.state.outfit.jackets, jacket]}})
  }

  addNewShirt = (shirt) => {
    this.setState({outfit: {...this.state.outfit, shirts: [...this.state.outfit.shirts, shirt]}})
  }

  addNewBottom = (bottom) => {
    this.setState({outfit: {...this.state.outfit, bottoms: [...this.state.outfit.bottoms, bottom]}})
  }

  addNewShoe = (shoe) => {
    this.setState({outfit: {...this.state.outfit, shoes: [...this.state.outfit.shoes, shoe]}})
  }

  addStyleTag = (style) => {
    this.setState({outfit: {...this.state.outfit, styles: [...this.state.outfit.styles, style]}})
  }

  addOtherTag = (tag) => {
    this.setState({outfit: {...this.state.outfit, other_tags: [...this.state.outfit.other_tags, tag]}})
  }

  updateWeather = (weather) => {
    this.setState({outfit: {...this.state.outfit, weather_rating: weather}})
  }

  validateFieldsForSubmission = () => {
    var submissionErrors = [];
    if (this.state.outfit.name == "") {
      submissionErrors.push("Outfit does not have a name");
    }

    if (this.state.outfit.shirts.length == 0) {
      submissionErrors.push("Must select at least one shirt");
    }

    if (this.state.outfit.bottoms.length == 0) {
      submissionErrors.push("Must select at least one bottom");
    }

    if (this.state.outfit.shoes.length == 0) {
      submissionErrors.push("Must select at least one shoe");
    }

    if (this.state.outfit.weather_rating == "") {
      submissionErrors.push("Must select a Weather Rating");
    }

    return submissionErrors;
  }

  submitOutfit = () => {
    var submissionErrors = this.validateFieldsForSubmission();

    if (submissionErrors.length > 0) {
      alert(submissionErrors[0]);
    }
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
                <li class="is-active"><a aria-current="page">Add New Outfit</a></li>
              </ul>
            </nav>
          </div>
          <div class="columns">
            <div class="column is-4">
              <div style={{paddingTop: "15px"}}>
                <div>
                <input class="input name-input" ref="input" placeholder="Outfit Name"/>
                </div>
              </div>
              <div style={{paddingTop: "25px"}}>
                <div>
                  <span class="title is-5"> Jackets </span>
                  {this.state.outfit.jackets.map((jacket) => 
                    <div>
                      <span class="subtitle is-6">
                        {jacket}
                      </span>
                    </div>
                  )}
                  <AddListItem numItems={this.state.outfit.jackets.length} multipleString="Add Another Jacket" singleString="Add Jacket" addNew={this.addNewJacket} fetchAutofill={()=>{return getClothesOfType("jacket")}}/>
                </div>
              </div>
              <div style={{paddingTop: "25px"}}>
                <div>
                  <span class="title is-5"> Shirts </span>
                  {this.state.outfit.shirts.map((shirt) => 
                    <div>
                      <span class="subtitle is-6">
                        {shirt}
                      </span>
                    </div>
                  )}
                  <AddListItem numItems={this.state.outfit.shirts.length} multipleString="Add Another Shirt" singleString="Add Shirt" addNew={this.addNewShirt} fetchAutofill={()=>{return getClothesOfType("shirt")}}/>
                </div>
              </div>
              <div style={{paddingTop: "25px"}}>
                <div>
                  <span class="title is-5"> Bottoms </span>
                  {this.state.outfit.bottoms.map((bottom) => 
                    <div>
                      <span class="subtitle is-6">
                        {bottom}
                      </span>
                    </div>
                  )}
                  <AddListItem numItems={this.state.outfit.bottoms.length} multipleString="Add Another Bottom" singleString="Add Bottom" addNew={this.addNewBottom} fetchAutofill={()=>{return getClothesOfType("bottom")}}/>
                </div>
              </div>
              <div style={{paddingTop: "25px"}}>
                <div>
                  <span class="title is-5"> Shoes </span>
                  {this.state.outfit.shoes.map((shoe) => 
                    <div>
                      <span class="subtitle is-6">
                        {shoe}
                      </span>
                    </div>
                  )}
                  <AddListItem numItems={this.state.outfit.shoes.length} multipleString="Add Another Shoe" singleString="Add Shoe" addNew={this.addNewShoe} fetchAutofill={()=>{return getClothesOfType("shoe")}}/>
                </div>
              </div>
              <div style={{paddingTop: "20px"}}>
                <WeatherPicker weather_rating={this.state.outfit.weather_rating} updateWeatherRating={this.updateWeather}/>
              </div>
              <div style={{paddingTop: "25px"}}>
                <div>
                  <span class="title is-6"> Style Tags </span>
                </div>
                <div>
                  {this.state.outfit.styles.map((style) => <span class="tag">{style}</span>)}
                  <AddListItem numItems={this.state.outfit.styles.length} multipleString="Add Style Tag" singleString="Add Style Tag" addNew={this.addStyleTag} fetchAutofill={()=>{return getClothesOfType("shoe")}}/>
                </div>
              </div>
              <div style={{paddingTop: "25px"}}>
                <div>
                  <span class="title is-6"> Other Tags </span>
                </div>
                <div>
                  {this.state.outfit.other_tags.map((tag) => <span class="tag">{tag}</span>)}
                  <AddListItem numItems={this.state.outfit.other_tags.length} multipleString="Add Other Tag" singleString="Add Other Tag" addNew={this.addOtherTag} fetchAutofill={()=>{return getClothesOfType("shoe")}}/>
                </div>
              </div>
              <div style={{paddingTop: "20px"}}>
                <span class="title is-5"> Notes: </span>
                <div>
                  <textarea class="textarea" placeholder="Extra Notes" rows="4"></textarea>
                </div>
              </div>
              <div style={{paddingTop: "20px"}} onClick={this.submitOutfit}>
                <button class="button is-info is-small">Add Outfit</button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  )}
}

export default CreateOutfit;