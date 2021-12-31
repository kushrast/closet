import logo from './logo.svg';
import 'bulma/css/bulma.min.css';
import './App.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faCloud } from '@fortawesome/free-solid-svg-icons';
import * as stringSimilarity from "string-similarity";
import { useParams } from "react-router";
import React from 'react';

import RemoveItem from './RemoveItem.jsx';
import {getStyles} from "./api/Storage.js";

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

  onSubmit = () => {
    this.props.submit(this.state.value, this.state.searchType);
    this.setState({value: "", searchType: "", showDropdown: false});
  }

  onKeyDown = (event) => {
    var parent = this;

    if (event.key==="Enter") {
      this.onSubmit();
    } else {
      this.props.fetchAutofill()
      .then(
        (data) => {
          this.setState({autofillGuesses: data, showDropdown: true});
        }
        ,(error)=>console.log(error));
    }
  }

  getAutofillDropdown = () => {
    var titleGuesses = [];
    var clothingGuesses = [];
    var tagGuesses = [];

    if ("title" in this.state.autofillGuesses) {
      titleGuesses = this.state.autofillGuesses["title"].map((autofillGuess) => 
        <a class="dropdown-item" onClick={()=>{this.selectFromAutofill(autofillGuess, "Matches Title")}}>
          <span class="tag" style={{"marginRight": "10px"}}>
            Title Match
          </span>
        {autofillGuess}
        </a>);
    }

    if ("clothing" in this.state.autofillGuesses) {
      clothingGuesses = this.state.autofillGuesses["clothing"].map((autofillGuess) => 
        <a class="dropdown-item" onClick={()=>{this.selectFromAutofill(autofillGuess, "Has Clothing")}}>
          <span class="tag" style={{"marginRight": "10px"}}>
            Contains
          </span>
        {autofillGuess}
        </a>);
    }


    if ("tag" in this.state.autofillGuesses) {
      tagGuesses = this.state.autofillGuesses["tag"].map((autofillGuess) => 
        <a class="dropdown-item" onClick={()=>{this.selectFromAutofill(autofillGuess, "Has Tag")}}>
          <span class="tag" style={{"marginRight": "10px"}}>
            Tag
          </span>
        {autofillGuess}
        </a>);
    }

    return (
      <div>
        {titleGuesses}
        { titleGuesses.length > 0 && (clothingGuesses.length > 0 || tagGuesses.length > 0) ?
        <hr class="dropdown-divider"/> : ""}
        {clothingGuesses}
        { clothingGuesses.length > 0 && tagGuesses.length > 0 ?
        <hr class="dropdown-divider"/> : ""}
        {tagGuesses}
      </div>
      )
  }

  hasAutoFill = () => {
    return Object.keys(this.state.autofillGuesses).length > 0;
  }

  selectFromAutofill = (item, searchType) => {
    this.setState({value: item, searchType: searchType}, ()=>{this.onSubmit();});
  }

  render() {
    return (
      <div ref={this.box}>
        <div class="dropdown is-active is-fullwidth" style={{"marginTop":"5px"}}>
          <div class="dropdown-trigger">
              <div class="field has-addons">
                  <div class="control is-expanded">
                      <input class="input" type="search" placeholder="Search by Name, Tag, or Piece of Clothing" value={this.state.value} onChange={this.updateInputValue} onKeyDown={this.onKeyDown}/>
                  </div>
                  <div class="control">
                    <a class="button is-info">
                      Search
                    </a>
                  </div>
              </div>
          </div>
          { this.state.showDropdown && this.hasAutoFill() ?
          <div class="dropdown-menu" id="dropdown-menu" role="menu">
              <div class="dropdown-content">
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
      <div class="box" style={{"padding": "20px 20px 15px 20px"}}>
        {this.props.result.type === "outfit" ?
          <a href={"outfit/"+this.props.result.id} class="result">
            <span class="title is-6" style={{"paddingRight": "10px"}}>
              {this.props.result.name}
            </span>
            <span class="tag is-info" style={{"marginRight": "7px"}}>
              Outfit
            </span>
            {this.props.result.styles.map((style, index) => 
              <span class="tag is-primary is-light" style={{"marginRight": "7px"}}>
                {style}
              </span>
            )}
            {this.props.result.other_tags.map((tag, index) => 
              <span class="tag" style={{"marginRight": "7px"}}>
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
              <span class="tag is-info is-light"> 
                <span style={{"paddingRight": "5px"}}>{this.props.result.weather_rating}</span> 
                <FontAwesomeIcon icon={faCloud} size="xs"/>
              </span>
            </div>
          </a>
        : 
          <div>
            <span class="title is-6" style={{"paddingRight": "10px"}}>
              {this.props.result.name}
            </span>
            <span class="tag is-warning" style={{"marginRight": "7px"}}>
              Clothing
            </span>
            {this.props.result.styles.map((style, index) => 
              <span class="tag is-primary is-light" style={{"marginRight": "7px"}}>
                {style}
              </span>
            )}
            {this.props.result.other_tags.map((tag, index) => 
              <span class="tag" style={{"marginRight": "7px"}}>
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
        searchQueries: [],
        tags: []
      },
      results: [
        {
          type: "outfit",
          id: "619f517d7105e3db8b626617",
          name: "Outfit #4",
          clothes: ["Grey Reigning Champ Hoodie", "Black \"Beat LA\" Shirt", "Black Uniqlo Jeans", "Triple White Jordan 1 Mid's"],
          styles: ["casual"],
          other_tags: ["game day", "giants"],
          weather_rating: "57-63"
        },
        {
          type: "clothing",
          id: "619f517d7105e3db8b626617",
          name: "Black Nike Hoodie",
          styles: ["casual"],
          other_tags: ["game day", "giants"],
        }
      ]
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

  addTag = (tag) => {
    console.log(tag);
    this.setState({searchParams: {...this.state.searchParams, tags: [...this.state.searchParams.tags, tag]}})
  }

  deleteWeatherRating = (weatherRating) => {
    var weatherRatings = this.state.searchParams.weatherRatings;
    delete weatherRatings[weatherRating];
    this.setState({searchParams: {...this.state.searchParams, weatherRatings: weatherRatings}});
  }

  selectSearch = (searchItem, searchType) => {
    this.setState({searchParams: {...this.state.searchParams, searchQueries: [...this.state.searchParams.searchQueries, {value: searchItem, searchType: searchType}]}});
  }

  deleteSearchQuery = (index) => {
    var searchQueries = this.state.searchParams.searchQueries;
    searchQueries.splice(index, 1);
    this.setState({searchParams: {...this.state.searchParams, searchQueries: searchQueries}});
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
      <div class="columns is-multiline is-vcentered"  style={{"paddingTop": "15px"}}>
        <div class="column is-12" style={{"paddingBottom": "2px"}}>
          <ItemTypeDropdown selectedType={this.state.searchParams.type} updateInputValue={this.toggleType}/>
          { this.state.searchParams.type === "Clothes" ? 
              <ClothingTypeDropdown updateInputValue={this.selectClothingTypes} selectedClothingTypes={this.state.searchParams.clothingTypes}/>
              : ""
          }
          <StylesDropdown allStyles={this.state.allStyles} updateInputValue={this.selectStyles} selectedStyles={this.state.searchParams.styles}/>
          <WeatherDropdown updateInputValue={this.selectWeatherRanges} selectedWeatherRanges={this.state.searchParams.weatherRatings}/>
        </div>
        <div class="column is-5" style={{"paddingTop": "2px"}}>
          <SearchBar submit={this.selectSearch} fetchAutofill={()=>{return Promise.resolve({"title": ["yabadabadoo"], "clothing": ["Padagonia"], "tag": ["yesh"]})}}/>
        </div>
        <div class="column is-7"  style={{"paddingTop":"0px","paddingBottom":"0px"}}></div>
        <div class="column is-5" style={{"paddingTop":"0px", "paddingBottom": "0px"}}>
          <div class="tags">
            {this.state.searchParams.searchQueries.map((query, index) => 
              // <div style={{"paddingBottom": "4px"}}>
                <span class="tag">
                  {query["searchType"]}: {query["value"]}
                <RemoveItem deleteItem={()=>{this.deleteSearchQuery(index)}}/>
                </span>
              // </div>
            )}
            { this.state.searchParams.type != "" ? 
                // <div style={{"paddingBottom": "4px"}}>
                  <span class="tag">
                    Type: {this.state.searchParams.type}
                  <RemoveItem deleteItem={()=>{this.toggleType("")}}/>
                  </span>
                // </div>
                : ""
            }
            {Object.keys(this.state.searchParams.clothingTypes).map((clothingType, index) => 
              // <div style={{"paddingBottom": "4px"}}>
                <span class="tag">
                  Clothing Type: {clothingType}
                <RemoveItem deleteItem={()=>{this.deleteClothingType(clothingType)}}/>
                </span>
              // </div>
            )}
            {Object.keys(this.state.searchParams.styles).map((style, index) => 
              // <div style={{"paddingBottom": "4px"}}>
                <span class="tag">
                  Style: {style}
                <RemoveItem deleteItem={()=>{this.deleteStyle(style)}}/>
                </span>
              // </div>
            )}
            {Object.keys(this.state.searchParams.weatherRatings).map((weatherRating, index) => 
              // <div style={{"paddingBottom": "4px"}}>
                <span class="tag">
                  Weather Range: {weatherRating}
                <RemoveItem deleteItem={()=>{this.deleteWeatherRating(weatherRating)}}/>
                </span>
              // </div>
            )}
            {this.state.searchParams.tags.map((tag, index) => 
              // <div style={{"paddingBottom": "4px"}}>
                <span class="tag">
                  Tag: {tag}
                <RemoveItem deleteItem={()=>{}}/>
                </span>
              // </div>
            )}
          </div>
        </div>
        <div class="column is-7"  style={{"paddingTop":"0px","paddingBottom":"0px"}}></div>
        <div class="column is-5" style={{"paddingTop":"0px"}}>
          <hr class="dropdown-divider"/>
          { this.state.results.length == 0 ? 
              <div class="has-text-centered" style={{"fontStyle": "italic", "marginTop":"15px"}}>
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
