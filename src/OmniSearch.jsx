import logo from './logo.svg';
import 'bulma/css/bulma.min.css';
import './App.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWind, faCloud, faCloudSun, faSun, faTemperatureHigh, faPen, faMinus, faTimes, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import * as stringSimilarity from "string-similarity";
import { useParams } from "react-router";
import React from 'react';

import {getOutfit, getStyles} from "./api/Storage.js";


class RemoveItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      numClicks: 0
    }

    this.box = React.createRef();
  }

  componentDidMount() {
    document.addEventListener('click', this.handleClickOutside.bind(this), true);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickOutside.bind(this), true);
    this.box = null;
  };

  /**
   * Alert if clicked on outside of element
   */
  handleClickOutside(event) {
    if (this.box && !this.box.current.contains(event.target)) {
      this.setState({numClicks: 0});
    }
  }

  toggleClick = () => {
    if (this.state.numClicks == 0) {
      this.setState({numClicks: 1});
    } else {
      this.setState({numClicks: 2});
      this.props.deleteItem();
    }
  }

  render() {
    return (
      <span ref={this.box} style={{"paddingLeft": "10px"}}>
        <FontAwesomeIcon icon={this.state.numClicks == 0 ? faMinus : faTimes} color={this.state.numClicks == 0 ? "black" : "red"} onClick={this.toggleClick} size="xs"/>
      </span>
      );
  }
}


class AddListItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showInput: false,
      showDropdown: false,
      shouldFetchAutofill: true,
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
    this.box = null;
  };

  /**
   * Alert if clicked on outside of element
   */
  handleClickOutside(event) {
    if (this.box && !this.box.current.contains(event.target)) {
      this.setState({showInput: false, showDropdown: false, shouldFetchAutofill: true});
    }
  }

  updateInputValue = (inputElem) => {
    this.setState({value: inputElem.target.value});
  }

  onSubmit = () => {
    this.props.addNew(this.state.value);
    this.setState({value: "", showInput: false, showDropdown: false, shouldFetchAutofill: true});
  }

  showInput = () => {
    this.setState({showInput: true});
  }

  onKeyDown = (event) => {
    var parent = this;
    function compareToAutofillGuesses() {
      var matches = []
      if (parent.state.existingCategoryValues.length > 0) {
        var similarityRatings = stringSimilarity.findBestMatch(parent.state.value, parent.state.existingCategoryValues);
        for (var i = 0; i < similarityRatings.ratings.length; i++) {
          var stringRating = similarityRatings.ratings[i];
          if (stringRating.rating > 0.1) {
            matches.push(stringRating.target);
          }
        }
      }
      if (matches.length > 0) {
        parent.setState({autofillGuesses: matches, showDropdown: true});
      } else {
        parent.setState({autofillGuesses: [], showDropdown: false});
      }
    }

    if (this.state.shouldFetchAutofill) {
      this.props.fetchAutofill()
      .then(
        (data) => {
          this.setState({existingCategoryValues: data, shouldFetchAutofill: false});
          compareToAutofillGuesses();
        }
        ,(error)=>console.log(error));
    } else {
      if (event.key==="Enter") {
        this.onSubmit();
      } else {
        compareToAutofillGuesses();
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

class MenuDropdownElement extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showDropdown: false
    }

    this.box = React.createRef();
  }

  componentDidMount() {
    document.addEventListener('click', this.handleClickOutside.bind(this), true);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickOutside.bind(this), true);
    this.box = null;
  };

  /**
   * Alert if clicked on outside of element
   */
  handleClickOutside(event) {
    if (this.box && !this.box.current.contains(event.target)) {
      this.setState({showInput: false, showDropdown: false, shouldFetchAutofill: true});
    }
  }

  toggleDropdown = () => {
    this.setState({showDropdown: !this.state.showDropdown});
  }

  render() {
    return (
      <div class="dropdown is-active" ref={this.box} style={{"paddingTop": "4px", "paddingRight": "4px"}}>
        <div class="dropdown-trigger">
          <button class="button" aria-haspopup="true" aria-controls="dropdown-menu" onClick={this.toggleDropdown}>
            {this.props.trigger}
          </button>
        </div>
        { this.state.showDropdown ? 
        <div class="dropdown-menu" id="dropdown-menu" role="menu">
          {this.props.dropdownContent}
        </div>
        : ""}
      </div>
      );
  }
}

class ItemTypeDropdown extends React.Component {
  constructor(props) {
    super(props);
  }

  selectType = (type) => {
    var selectedVal = "";

    if (this.props.selectedType != type) {
      selectedVal = type;
    }
    this.props.updateInputValue(selectedVal);
  }

  trigger = () => {
    return (
      <div>
        <span>{ this.props.selectedType==="" ? "Type" : "Type: " + this.props.selectedType} </span>
        <span class="icon is-small">
          <FontAwesomeIcon icon={faAngleDown} size="xs"/>
        </span>
      </div>);
  }

  getClasses = (type) => {
    if (this.props.selectedType === type) {
      return "dropdown-item is-active";
    }
    return "dropdown-item";
  }

  dropdownContent = () => {
    return (
      <div>
        <div class="dropdown-content">
          <a href="#" class={this.getClasses("Outfits")} onClick={()=>this.selectType("Outfits")}>
            Outfits
          </a>
          <a class={this.getClasses("Clothes")} onClick={()=>this.selectType("Clothes")}>
            Clothes
          </a>
        </div>
      </div>);
  }

  render() {
    return (
      <MenuDropdownElement trigger={this.trigger()} dropdownContent={this.dropdownContent()}/>
      );
  }
}

class ClothingTypeDropdown extends React.Component {
  constructor(props) {
    super(props);
  }

  selectType = (type) => {
    var selectedTypes = this.props.selectedClothingTypes;
    if (type in selectedTypes) {
      delete selectedTypes[type];
    } else {
      selectedTypes[type] = "";
    }
    this.props.updateInputValue(selectedTypes);
  }

  trigger = () => {
    return (
      <div>
        <span>Clothing Types</span>
        <span class="icon is-small">
          <FontAwesomeIcon icon={faAngleDown} size="xs"/>
        </span>
      </div>);
  }

  getClasses = (type) => {
    if (type in this.props.selectedClothingTypes) {
      return "dropdown-item is-active";
    }
    return "dropdown-item";
  }

  dropdownContent = () => {
    return (
      <div>
        <div class="dropdown-content">
          <a href="#" class={this.getClasses("Shirts")} onClick={()=>this.selectType("Shirts")}>
            Shirts
          </a>
          <a href="#" class={this.getClasses("Jackets")} onClick={()=>this.selectType("Jackets")}>
            Jackets
          </a>
          <a href="#" class={this.getClasses("Bottoms")} onClick={()=>this.selectType("Bottoms")}>
            Bottoms
          </a>
          <a href="#" class={this.getClasses("Shoes")} onClick={()=>this.selectType("Shoes")}>
            Shoes
          </a>
        </div>
      </div>);
  }

  render() {
    return (
      <MenuDropdownElement trigger={this.trigger()} dropdownContent={this.dropdownContent()}/>
      );
  }
}


class StylesDropdown extends React.Component {
  constructor(props) {
    super(props);
  }

  selectStyle = (style) => {
    var selectedStyles = this.props.selectedStyles;
    if (style in this.props.selectedStyles) {
      delete selectedStyles[style];
    } else {
      selectedStyles[style] = "";
    }
    this.props.updateInputValue(selectedStyles);
  }

  trigger = () => {
    return (
      <div>
        <span>Style</span>
        <span class="icon is-small">
          <FontAwesomeIcon icon={faAngleDown} size="xs"/>
        </span>
      </div>);
  }

  getClasses = (type) => {
    if (type in this.props.selectedStyles) {
      return "dropdown-item is-active";
    }
    return "dropdown-item";
  }

  dropdownContent = () => {
    return (
      <div>
        <div class="dropdown-content">
          { 
            this.props.allStyles.map((style) => 
              <a href="#" class={this.getClasses(style)} onClick={()=>this.selectStyle(style)}>
                {style}
              </a>
            )
          }
        </div>
      </div>);
  }

  render() {
    return (
      <MenuDropdownElement trigger={this.trigger()} dropdownContent={this.dropdownContent()}/>
      );
  }
}

class WeatherDropdown extends React.Component {
  constructor(props) {
    super(props);
  }

  getWeatherRanges = () => {
    return ["Raining", "45-55", "55-63", "63-66", "66-73", "73+"];
  }

  selectWeatherRanges = (weatherRange) => {
    var selectedWeatherRanges = this.props.selectedWeatherRanges;
    if (weatherRange in selectedWeatherRanges) {
      delete selectedWeatherRanges[weatherRange];
    } else {
      selectedWeatherRanges[weatherRange] = "";
    }
    this.props.updateInputValue(selectedWeatherRanges);
  }

  trigger = () => {
    return (
      <div>
        <span>Weather</span>
        <span class="icon is-small">
          <FontAwesomeIcon icon={faAngleDown} size="xs"/>
        </span>
      </div>);
  }

  getClasses = (type) => {
    if (type in this.props.selectedWeatherRanges) {
      return "dropdown-item is-active";
    }
    return "dropdown-item";
  }

  dropdownContent = () => {
    return (
      <div>
        <div class="dropdown-content">
          { 
            this.getWeatherRanges().map((weatherRange) => 
              <a href="#" class={this.getClasses(weatherRange)} onClick={()=>this.selectWeatherRanges(weatherRange)}>
                {weatherRange}
              </a>
            )
          }
        </div>
      </div>);
  }

  render() {
    return (
      <MenuDropdownElement trigger={this.trigger()} dropdownContent={this.dropdownContent()}/>
      );
  }
}

class OmniSearch extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      allStyles: [],
      searchParams: {
        type: "",
        clothingTypes: {},
        styles: {},
        weatherRatings: {},
        tags: {}
      }
    }

    getStyles()
    .then(
      (data) => {
        this.setState({...data, allStyles: data});
      }
      ,(error)=>console.log(error));
  }

  deleteTag = (index) => {
    var tags = this.state.searchParams.tags;
    tags.splice(index, 1);
    this.setState({searchParams: {...this.state.searchParams, tags: tags}});
  }

  addTag = (tag) => {
    this.setState({searchParams: {...this.state.searchParams, tags: [...this.state.searchParams.tags, tag]}})
  }

  isTypeSelected = (type) => {
    return this.state.searchParams.type === type;
  }

  toggleType = (type) => {
    if (type != "clothes") {
      this.setState({searchParams: {...this.state.searchParams, type: type, clothingTypes: []}});
    } else {
      this.setState({searchParams: {...this.state.searchParams, type: type}});
    }
  }

  selectClothingTypes = (clothingTypes) => {
    this.setState({searchParams: {...this.state.searchParams, clothingTypes: clothingTypes}})
  }

  deleteClothingType = (clothingType) => {
    var clothingTypes = this.state.searchParams.clothingTypes;
    delete clothingTypes[clothingType];
    this.setState({searchParams: {...this.state.searchParams, clothingTypes: clothingTypes}});
  }

  selectStyles = (styles) => {
    this.setState({searchParams: {...this.state.searchParams, styles: styles}});
  }

  deleteStyle = (style) => {
    var styles = this.state.searchParams.styles;
    delete styles[style];
    this.setState({searchParams: {...this.state.searchParams, styles: styles}});
  }

  selectWeatherRanges = (weatherRatings) => {
    this.setState({searchParams: {...this.state.searchParams, weatherRatings: weatherRatings}})
  }

  deleteWeatherRating = (weatherRating) => {
    var weatherRatings = this.state.searchParams.weatherRatings;
    delete weatherRatings[weatherRating];
    this.setState({searchParams: {...this.state.searchParams, weatherRatings: weatherRatings}});
  }

  render() {
  return (
    <div style={{"paddingTop": "15px"}}>
      <div>
        <nav class="breadcrumb" aria-label="breadcrumbs">
          <ul>
            <li><a href="/">Home</a></li>
            <li class="is-active"><a aria-current="page">Search</a></li>
          </ul>
        </nav>
      </div>
      <div class="columns is-multiline"  style={{"paddingTop": "15px"}}>
        <div class="column is-12">
          <ItemTypeDropdown selectedType={this.state.searchParams.type} updateInputValue={this.toggleType}/>
          { this.state.searchParams.type === "Clothes" ? 
              <ClothingTypeDropdown updateInputValue={this.selectClothingTypes} selectedClothingTypes={this.state.searchParams.clothingTypes}/>
              : ""
          }
          <StylesDropdown allStyles={this.state.allStyles} updateInputValue={this.selectStyles} selectedStyles={this.state.searchParams.styles}/>
          <WeatherDropdown updateInputValue={this.selectWeatherRanges} selectedWeatherRanges={this.state.searchParams.weatherRatings}/>
        </div>
        <div class="column is-5">
          <input class="input" type="search" placeholder="Name"/>
        </div>
        <div class="column is-12">
          { this.state.searchParams.type != "" ? 
              <div style={{"paddingBottom": "4px"}}>
                <span class="tag">
                  Type: {this.state.searchParams.type}
                <RemoveItem deleteItem={()=>{this.toggleType("")}}/>
                </span>
              </div>
              : ""
          }
          {Object.keys(this.state.searchParams.clothingTypes).map((clothingType, index) => 
            <div style={{"paddingBottom": "4px"}}>
              <span class="tag">
                Clothing Type: {clothingType}
              <RemoveItem deleteItem={()=>{this.deleteClothingType(clothingType)}}/>
              </span>
            </div>
          )}
          {Object.keys(this.state.searchParams.styles).map((style, index) => 
            <div style={{"paddingBottom": "4px"}}>
              <span class="tag">
                Style: {style}
              <RemoveItem deleteItem={()=>{this.deleteStyle(style)}}/>
              </span>
            </div>
          )}
          {Object.keys(this.state.searchParams.weatherRatings).map((weatherRating, index) => 
            <div style={{"paddingBottom": "4px"}}>
              <span class="tag">
                Weather Range: {weatherRating}
              <RemoveItem deleteItem={()=>{this.deleteWeatherRating(weatherRating)}}/>
              </span>
            </div>
          )}
        </div>
      </div>
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

export default withRouter(OmniSearch);
