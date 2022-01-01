import logo from './logo.svg';
import 'bulma/css/bulma.min.css';
import './App.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faCloud } from '@fortawesome/free-solid-svg-icons';
import * as stringSimilarity from "string-similarity";
import { useParams } from "react-router";
import React from 'react';

import RemoveItem from './RemoveItem.jsx';
import {getStyles, search, getSearchPredictions} from "./api/Storage.js";

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
      <div className="dropdown is-active" ref={this.box} style={{"paddingTop": "4px", "paddingRight": "4px"}}>
        <div className="dropdown-trigger">
          <button className="button" aria-haspopup="true" aria-controls="dropdown-menu" onClick={this.toggleDropdown}>
            {this.props.trigger}
          </button>
        </div>
        { this.state.showDropdown ? 
        <div className="dropdown-menu" id="dropdown-menu" role="menu">
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
        <span className="icon is-small">
          <FontAwesomeIcon icon={faAngleDown} size="xs"/>
        </span>
      </div>);
  }

  getclassNamees = (type) => {
    if (this.props.selectedType === type) {
      return "dropdown-item is-active";
    }
    return "dropdown-item";
  }

  dropdownContent = () => {
    return (
      <div>
        <div className="dropdown-content">
          <a href="#" className={this.getclassNamees("Outfits")} onClick={()=>this.selectType("Outfits")}>
            Outfits
          </a>
          <a className={this.getclassNamees("Clothes")} onClick={()=>this.selectType("Clothes")}>
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
        <span className="icon is-small">
          <FontAwesomeIcon icon={faAngleDown} size="xs"/>
        </span>
      </div>);
  }

  getClassNames = (type) => {
    if (type in this.props.selectedClothingTypes) {
      return "dropdown-item is-active";
    }
    return "dropdown-item";
  }

  dropdownContent = () => {
    return (
      <div>
        <div className="dropdown-content">
          <a href="#" className={this.getClassNames("Shirt")} onClick={()=>this.selectType("Shirt")}>
            Shirts
          </a>
          <a href="#" className={this.getClassNames("Jacket")} onClick={()=>this.selectType("Jacket")}>
            Jackets
          </a>
          <a href="#" className={this.getClassNames("Bottom")} onClick={()=>this.selectType("Bottom")}>
            Bottoms
          </a>
          <a href="#" className={this.getClassNames("Shoe")} onClick={()=>this.selectType("Shoe")}>
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
        <span className="icon is-small">
          <FontAwesomeIcon icon={faAngleDown} size="xs"/>
        </span>
      </div>);
  }

  getclassNamees = (type) => {
    if (type in this.props.selectedStyles) {
      return "dropdown-item is-active";
    }
    return "dropdown-item";
  }

  dropdownContent = () => {
    return (
      <div>
        <div className="dropdown-content">
          { 
            this.props.allStyles.map((style) => 
              <a href="#" className={this.getclassNamees(style)} onClick={()=>this.selectStyle(style)}>
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
        <span className="icon is-small">
          <FontAwesomeIcon icon={faAngleDown} size="xs"/>
        </span>
      </div>);
  }

  getclassNamees = (type) => {
    if (type in this.props.selectedWeatherRanges) {
      return "dropdown-item is-active";
    }
    return "dropdown-item";
  }

  dropdownContent = () => {
    return (
      <div>
        <div className="dropdown-content">
          { 
            this.getWeatherRanges().map((weatherRange) => 
              <a href="#" className={this.getclassNamees(weatherRange)} onClick={()=>this.selectWeatherRanges(weatherRange)}>
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

class SearchBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: "",
      showDropdown: false,
      autofillGuesses: {},
      searchType: ""
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
      this.setState({showDropdown: false});
    }
  }

  updateInputValue = (inputElem) => {
    this.setState({value: inputElem.target.value});
  }

  onSubmit = (value, type) => {
    if (type === "title") {
      this.props.selectTitleMatch(value);
    } else if (type === "clothing") {
      this.props.addClothingMatch(value);
    } else if (type === "tag") {
      this.props.addTag(value);
    }

    this.setState({value: "", searchType: "", showDropdown: false});
  }

  onKeyDown = (event) => {
    var parent = this;

    if (event.key==="Enter") {
      this.onSubmit(this.state.value, "general");
    } else {
      this.props.fetchAutofill(this.state.value)
      .then(
        (data) => {
          this.setState({autofillGuesses: data, showDropdown: true});
        }
        ,(error)=>console.log(error));
    }
  }

  getAutofillDropdown = () => {
    var clothingGuesses = [];
    var tagGuesses = [];

    if ("clothing" in this.state.autofillGuesses) {
      clothingGuesses = this.state.autofillGuesses["clothing"].map((autofillGuess) => 
        <a className="dropdown-item" onClick={()=>{this.onSubmit(autofillGuess, "clothing")}}>
          <span className="tag" style={{"marginRight": "10px"}}>
            Contains
          </span>
        {autofillGuess}
        </a>);
    }


    if ("tag" in this.state.autofillGuesses) {
      tagGuesses = this.state.autofillGuesses["tag"].map((autofillGuess) => 
        <a className="dropdown-item" onClick={()=>{this.onSubmit(autofillGuess, "tag")}}>
          <span className="tag" style={{"marginRight": "10px"}}>
            Tag
          </span>
        {autofillGuess}
        </a>
      );
    }

    return (
      <div>
        <a className="dropdown-item" onClick={()=>{this.onSubmit(this.state.value, "title")}}>
          <span className="tag" style={{"marginRight": "10px"}}>
            Title Match
          </span>
        {this.state.value}
        </a>
        { clothingGuesses.length > 0 ?
        <hr className="dropdown-divider"/> : ""}
        {clothingGuesses}
        { clothingGuesses.length > 0 && tagGuesses.length > 0 ?
        <hr className="dropdown-divider"/> : ""}
        {tagGuesses}
      </div>
      )
  }

  hasAutoFill = () => {
    return Object.keys(this.state.autofillGuesses).length > 0;
  }

  render() {
    return (
      <div ref={this.box}>
        <div className="dropdown is-active is-fullwidth" style={{"marginTop":"5px"}}>
          <div className="dropdown-trigger">
              <div className="field has-addons">
                  <div className="control is-expanded">
                      <input className="input" type="search" placeholder="Search by Name, Tag, or Piece of Clothing" value={this.state.value} onChange={this.updateInputValue} onKeyDown={this.onKeyDown}/>
                  </div>
                  <div className="control">
                    <a className="button is-info">
                      Search
                    </a>
                  </div>
              </div>
          </div>
          { this.state.showDropdown && this.hasAutoFill() ?
          <div className="dropdown-menu" id="dropdown-menu" role="menu">
              <div className="dropdown-content">
                {this.getAutofillDropdown()}
              </div>
          </div>
          : ""}
        </div>
      </div>
      );
  }
}

class ResultBox extends React.Component {
  render() {
    return (
      <div className="box" style={{"padding": "20px 20px 15px 20px"}}>
        {this.props.result.type === "outfit" ?
          <a href={"outfit/"+this.props.result.id} className="result">
            <span className="title is-6" style={{"paddingRight": "10px"}}>
              {this.props.result.name}
            </span>
            <span className="tag is-info" style={{"marginRight": "7px"}}>
              Outfit
            </span>
            {this.props.result.styles.map((style, index) => 
              <span className="tag is-primary is-light" style={{"marginRight": "7px"}}>
                {style}
              </span>
            )}
            {this.props.result.other_tags.map((tag, index) => 
              <span className="tag" style={{"marginRight": "7px"}}>
                {tag}
              </span>
            )}
            <div style={{"paddingTop": "10px"}}>
              <span style={{"fontSize": "0.9rem"}}>
                {this.props.result.clothes.map((clothing, index) =>
                  <span>
                    {index > 0 ? ", " : ""}
                    {clothing}
                  </span>
                )}
              </span>
            </div>
            <div style={{"paddingTop": "10px"}}>
              <span className="tag is-info is-light"> 
                <span style={{"paddingRight": "5px"}}>{this.props.result.weather_rating}</span> 
                <FontAwesomeIcon icon={faCloud} size="xs"/>
              </span>
            </div>
          </a>
        : 
          <div>
            <span className="title is-6" style={{"paddingRight": "10px"}}>
              {this.props.result.name}
            </span>
            <span className="tag is-warning" style={{"marginRight": "7px"}}>
              Clothing
            </span>
            {this.props.result.styles.map((style, index) => 
              <span className="tag is-primary is-light" style={{"marginRight": "7px"}}>
                {style}
              </span>
            )}
            {this.props.result.other_tags.map((tag, index) => 
              <span className="tag" style={{"marginRight": "7px"}}>
                {tag}
              </span>
            )}
          </div>
        }
        </div>
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
        titleMatch: "",
        tags: {},
        containsClothing: {},
      },
      results: []
    }

    getStyles()
    .then(
      (data) => {
        this.setState({...data, allStyles: data});
      }
      ,(error)=>console.log(error));
  }

  isTypeSelected = (type) => {
    return this.state.searchParams.type === type;
  }

  setStateAndSearch(newState) {
    this.setState(newState, this.executeSearch);
  }

  toggleType = (type) => {
    if (type != "Clothes") {
      this.setStateAndSearch({searchParams: {...this.state.searchParams, type: type, clothingTypes: []}});
    } else {
      this.setStateAndSearch({searchParams: {...this.state.searchParams, type: type, weatherRatings: [], containsClothing: []}});
    }
  }

  selectTitleMatch = (titleMatchQuery) => {
    this.setStateAndSearch({searchParams: {...this.state.searchParams, titleMatch: titleMatchQuery}});
  }

  deleteTitleMatch = () => {
    this.setStateAndSearch({searchParams: {...this.state.searchParams, titleMatch: ""}});
  }

  addTag = (tag) => {
    var tags = this.state.searchParams.tags;
    tags[tag] = "";

    this.setStateAndSearch({searchParams: {...this.state.searchParams, tags: tags}});
  }

  deleteTag = (tag) => {
    var tags = this.state.searchParams.tags;
    delete tags[tag];
    this.setStateAndSearch({searchParams: {...this.state.searchParams, tags: tags}});
  }

  addClothingMatch = (clothing) => {
    var containsClothing = this.state.searchParams.containsClothing;
    containsClothing[clothing] = "";

    this.setStateAndSearch({searchParams: {...this.state.searchParams, containsClothing: containsClothing}});
  }

  deleteClothingMatch = (clothing) => {
    var containsClothing = this.state.searchParams.containsClothing;
    delete containsClothing[clothing];
    this.setStateAndSearch({searchParams: {...this.state.searchParams, containsClothing: containsClothing}});
  }

  selectClothingTypes = (clothingTypes) => {
    this.setStateAndSearch({searchParams: {...this.state.searchParams, clothingTypes: clothingTypes}});
  }

  deleteClothingType = (clothingType) => {
    var clothingTypes = this.state.searchParams.clothingTypes;
    delete clothingTypes[clothingType];
    this.setStateAndSearch({searchParams: {...this.state.searchParams, clothingTypes: clothingTypes}});
  }

  selectStyles = (styles) => {
    this.setStateAndSearch({searchParams: {...this.state.searchParams, styles: styles}});
  }

  deleteStyle = (style) => {
    var styles = this.state.searchParams.styles;
    delete styles[style];
    this.setStateAndSearch({searchParams: {...this.state.searchParams, styles: styles}});
  }

  selectWeatherRanges = (weatherRatings) => {
    this.setStateAndSearch({searchParams: {...this.state.searchParams, weatherRatings: weatherRatings}});
  }

  deleteWeatherRating = (weatherRating) => {
    var weatherRatings = this.state.searchParams.weatherRatings;
    delete weatherRatings[weatherRating];
    this.setStateAndSearch({searchParams: {...this.state.searchParams, weatherRatings: weatherRatings}});
  }

  deleteSearchQuery = (index) => {
    var searchQueries = this.state.searchParams.searchQueries;
    searchQueries.splice(index, 1);
    this.setStateAndSearch({searchParams: {...this.state.searchParams, searchQueries: searchQueries}});
  }

  executeSearch = () => {
    console.log(this.state.searchParams);
    search(this.state.searchParams)
      .then(
        (response) => {
          this.setState({results: response});
        },
        (error) => {
          alert(error.message);
    });
  }

  render() {
  return (
    <div style={{"paddingTop": "15px"}}>
      <div>
        <nav className="breadcrumb" aria-label="breadcrumbs">
          <ul>
            <li><a href="/">Home</a></li>
            <li className="is-active"><a aria-current="page">Search</a></li>
          </ul>
        </nav>
      </div>
      <div className="columns is-multiline is-vcentered"  style={{"paddingTop": "15px"}}>
        <div className="column is-12" style={{"paddingBottom": "2px"}}>
          <ItemTypeDropdown selectedType={this.state.searchParams.type} updateInputValue={this.toggleType}/>
          <StylesDropdown allStyles={this.state.allStyles} updateInputValue={this.selectStyles} selectedStyles={this.state.searchParams.styles}/>
          { this.state.searchParams.type === "Clothes" ? 
              <ClothingTypeDropdown updateInputValue={this.selectClothingTypes} selectedClothingTypes={this.state.searchParams.clothingTypes}/>
              : ""
          }
          { this.state.searchParams.type === "Outfits" ? 
              <WeatherDropdown updateInputValue={this.selectWeatherRanges} selectedWeatherRanges={this.state.searchParams.weatherRatings}/>
              : ""
          }
        </div>
        <div className="column is-5" style={{"paddingTop": "2px"}}>
          <SearchBar addTag={this.addTag} addClothingMatch={this.addClothingMatch} selectTitleMatch={this.selectTitleMatch} fetchAutofill={getSearchPredictions}/>
        </div>
        <div className="column is-7"  style={{"paddingTop":"0px","paddingBottom":"0px"}}></div>
        <div className="column is-5" style={{"paddingTop":"0px", "paddingBottom": "0px"}}>
          <div className="tags">
            { this.state.searchParams.type != "" ? 
                // <div style={{"paddingBottom": "4px"}}>
                  <span className="tag">
                    Type: {this.state.searchParams.type}
                  <RemoveItem deleteItem={()=>{this.toggleType("")}}/>
                  </span>
                // </div>
                : ""
            }
            { this.state.searchParams.titleMatch != "" ? 
                // <div style={{"paddingBottom": "4px"}}>
                  <span className="tag">
                    Matches Title: {this.state.searchParams.titleMatch}
                  <RemoveItem deleteItem={()=>{this.deleteTitleMatch()}}/>
                  </span>
                // </div>
                : ""
            }
            {Object.keys(this.state.searchParams.clothingTypes).map((clothingType, index) => 
              // <div style={{"paddingBottom": "4px"}}>
                <span className="tag">
                  Clothing Type: {clothingType}
                <RemoveItem deleteItem={()=>{this.deleteClothingType(clothingType)}}/>
                </span>
              // </div>
            )}
            {Object.keys(this.state.searchParams.styles).map((style) => 
              // <div style={{"paddingBottom": "4px"}}>
                <span className="tag">
                  Style: {style}
                <RemoveItem deleteItem={()=>{this.deleteStyle(style)}}/>
                </span>
              // </div>
            )}
            {Object.keys(this.state.searchParams.containsClothing).map((clothing) => 
              // <div style={{"paddingBottom": "4px"}}>
                <span className="tag">
                  Has Clothing: {clothing}
                <RemoveItem deleteItem={()=>{this.deleteClothingMatch(clothing)}}/>
                </span>
              // </div>
            )}
            {Object.keys(this.state.searchParams.tags).map((tag) => 
              // <div style={{"paddingBottom": "4px"}}>
                <span className="tag">
                    Has Tag: {tag}
                  <RemoveItem deleteItem={()=>{this.deleteTag(tag)}}/>
                </span>
              // </div>
            )}
            {Object.keys(this.state.searchParams.weatherRatings).map((weatherRating) => 
              // <div style={{"paddingBottom": "4px"}}>
                <span className="tag">
                  Weather Range: {weatherRating}
                <RemoveItem deleteItem={()=>{this.deleteWeatherRating(weatherRating)}}/>
                </span>
              // </div>
            )}
          </div>
        </div>
        <div className="column is-7"  style={{"paddingTop":"0px","paddingBottom":"0px"}}></div>
        <div className="column is-5" style={{"paddingTop":"0px"}}>
          <hr className="dropdown-divider"/>
          { this.state.results.length == 0 ? 
              <div className="has-text-centered" style={{"fontStyle": "italic", "marginTop":"15px"}}>
                No Results
              </div>
            :
              <div style={{"marginTop":"17px"}}>
                {this.state.results.map((result, index) => 
                  <ResultBox result={result}/>
                )}
              </div>
          }
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
