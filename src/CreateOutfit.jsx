import logo from './logo.svg';
import 'bulma/css/bulma.min.css';
import './App.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWind, faCloud, faCloudSun, faSun, faTemperatureHigh, faPen, faMinus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { withRouter } from "react-router";
import { Navigate } from "react-router-dom";
import * as stringSimilarity from "string-similarity";
import React from 'react';

import {getClothesOfType, validatePotentialOutfit, createNewOutfit} from "./api/Storage.js";

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

class CreateOutfit extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      showSubmitModal: true,
      newClothes: {"jacket":["Green Shirt Jacket"]},
      outfit_id: "",
      outfit: {
        name: "Name",
        notes: "A bunch of notes about this outfit",
        jackets: ["Green Shirt Jacket", "Nike Hoodie" ],
        shirts: ["Shirt"],
        bottoms: ["bottom"],
        shoes: ["shoe"],
        styles: ["casual"],
        other_tags: ["a tag"],
        weather_rating: "55-63"
      }
    }
  }

  updateOutfitName = (inputElem) => {
    this.setState({outfit: {...this.state.outfit, name: inputElem.target.value}});
  }

  addNewJacket = (jacket) => {
    this.setState({outfit: {...this.state.outfit, jackets: [...this.state.outfit.jackets, jacket]}})
  }

  deleteJacket = (index) => {
    var jackets = this.state.outfit.jackets;
    jackets.splice(index, 1);
    this.setState({outfit: {...this.state.outfit, jackets: jackets}});
  }

  addNewShirt = (shirt) => {
    this.setState({outfit: {...this.state.outfit, shirts: [...this.state.outfit.shirts, shirt]}})
  }

  deleteShirt = (index) => {
    var shirts = this.state.outfit.shirts;
    shirts.splice(index, 1);
    this.setState({outfit: {...this.state.outfit, shirts: shirts}});
  }

  addNewBottom = (bottom) => {
    this.setState({outfit: {...this.state.outfit, bottoms: [...this.state.outfit.bottoms, bottom]}})
  }

  deleteBottom = (index) => {
    var bottoms = this.state.outfit.bottoms;
    bottoms.splice(index, 1);
    this.setState({outfit: {...this.state.outfit, bottoms: bottoms}});
  }

  addNewShoe = (shoe) => {
    this.setState({outfit: {...this.state.outfit, shoes: [...this.state.outfit.shoes, shoe]}})
  }

  deleteShoe = (index) => {
    var shoes = this.state.outfit.shoes;
    shoes.splice(index, 1);
    this.setState({outfit: {...this.state.outfit, shoes: shoes}});
  }

  addStyleTag = (style) => {
    this.setState({outfit: {...this.state.outfit, styles: [...this.state.outfit.styles, style]}})
  }

  deleteStyleTag = (index) => {
    var styles = this.state.outfit.styles;
    styles.splice(index, 1);
    this.setState({outfit: {...this.state.outfit, styles: styles}});
  }

  addOtherTag = (tag) => {
    this.setState({outfit: {...this.state.outfit, other_tags: [...this.state.outfit.other_tags, tag]}})
  }

  deleteOtherTag = (index) => {
    var other_tags = this.state.outfit.other_tags;
    other_tags.splice(index, 1);
    this.setState({outfit: {...this.state.outfit, other_tags: other_tags}});
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

  verifyOutfit = () => {
    var submissionErrors = this.validateFieldsForSubmission();

    if (submissionErrors.length > 0) {
      alert(submissionErrors[0]);
      return;
    }

    validatePotentialOutfit(this.state.outfit)
    .then(
      (response) => {
        if (response.newClothes.length > 0) {
          this.setState({newClothes: response.newClothes, showSubmitModal: true});
        } else {
          this.submitOutfit();
        }
      },
      (error) => {
        alert(error.message);
        this.setState({showSubmitModal: false});
    });

    validatePotentialOutfit(this.state.outfit)
    .then(
      (newClothes) => {
        if (newClothes.length > 0) {
          this.setState({newClothes: newClothes, showSubmitModal: true});
        } else {
          this.submitOutfit();
        }
      },
      (error) => {
        console.log(error);
    });
  }

  submitOutfit = () => {
    validatePotentialOutfit(this.state.outfit)
    .then(
      (response) => {
        createNewOutfit(this.state.outfit)
          .then(
            (data) => {
              this.setState({outfit_id: data.outfit_id});
            },
            (error)=>console.log(error));
      },
      (error) => {
        alert(error.message);
        this.setState({showSubmitModal: false});
    });
  }

  getSubmitModalBody = () => {
    var parent = this;
    function getListItems() {
      function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      }
      var items = [];
      Object.keys(parent.state.newClothes).forEach(
        (key) => 
          parent.state.newClothes[key].forEach((clothing) => {
            items.push(<li style={{"color": "green"}}>+ [{capitalizeFirstLetter(key)}] {clothing}</li>);
          })
      )

      return items;
    }

    return (
      <div>
        <div class="title is-3"  style={{marginBottom: "20px"}}>
          Confirm Changes
        </div>
        <div>
          <div>
            <div class="subtitle is-6">
              <ul>
                {getListItems()}
              </ul>
            </div>
          </div>
        </div>
      </div>
      );
  }

  closeModal = () => {
    this.setState({showSubmitModal: false});
  }

  getModalActive = () => {
    if (this.state.showSubmitModal) {
      return "modal is-active";
    } else {
      return "modal";
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
          {this.state.outfit_id != "" ? <Navigate to={"/outfit/"+this.state.outfit_id} replace={true} /> : ""}
          <div class={this.getModalActive()}>
            <div class="modal-background"></div>
            <div class="modal-content">
              <div class="box">
                <div>
                  {this.getSubmitModalBody()}
                </div>
                <div class="submit-form" style={{"marginTop": "20px"}}>
                  <button class="button is-light" style={{"marginRight": "10px"}} aria-label="close" onClick={this.closeModal}>Back</button>
                  <button class="button is-success" aria-label="close" onClick={this.submitOutfit}>Confirm</button>
                </div>
              </div>
            </div>
          </div>
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
                <input class="input name-input" ref="input" placeholder="Outfit Name" onChange={this.updateOutfitName}/>
                </div>
              </div>
              <div style={{paddingTop: "25px"}}>
                <div>
                  <span class="title is-5"> Jackets </span>
                  {this.state.outfit.jackets.map((jacket, index) => 
                    <div style={{"display":"flex"}}>
                      <span class="subtitle is-6">
                        {jacket}
                      <RemoveItem deleteItem={()=>{this.deleteJacket(index)}}/>
                      </span>
                    </div>
                  )}
                  <AddListItem numItems={this.state.outfit.jackets.length} multipleString="Add Another Jacket" singleString="Add Jacket" addNew={this.addNewJacket} fetchAutofill={()=>{return getClothesOfType("jacket")}}/>
                </div>
              </div>
              <div style={{paddingTop: "25px"}}>
                <div>
                  <span class="title is-5"> Shirts </span>
                  {this.state.outfit.shirts.map((shirt, index) => 
                    <div style={{"display":"flex"}}>
                      <span class="subtitle is-6">
                        {shirt}
                      <RemoveItem deleteItem={()=>{this.deleteShirt(index)}}/>
                      </span>
                    </div>
                  )}
                  <AddListItem numItems={this.state.outfit.shirts.length} multipleString="Add Another Shirt" singleString="Add Shirt" addNew={this.addNewShirt} fetchAutofill={()=>{return getClothesOfType("shirt")}}/>
                </div>
              </div>
              <div style={{paddingTop: "25px"}}>
                <div>
                  <span class="title is-5"> Bottoms </span>
                  {this.state.outfit.bottoms.map((bottom, index) => 
                    <div style={{"display":"flex"}}>
                      <span class="subtitle is-6">
                        {bottom}
                      <RemoveItem deleteItem={()=>{this.deleteBottom(index)}}/>
                      </span>
                    </div>
                  )}
                  <AddListItem numItems={this.state.outfit.bottoms.length} multipleString="Add Another Bottom" singleString="Add Bottom" addNew={this.addNewBottom} fetchAutofill={()=>{return getClothesOfType("bottom")}}/>
                </div>
              </div>
              <div style={{paddingTop: "25px"}}>
                <div>
                  <span class="title is-5"> Shoes </span>
                  {this.state.outfit.shoes.map((shoe, index) => 
                    <div style={{"display":"flex"}}>
                      <span class="subtitle is-6">
                        {shoe}
                      <RemoveItem deleteItem={()=>{this.deleteShoe(index)}}/>
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
                  {this.state.outfit.styles.map((style, index) => 
                    <div style={{"display":"flex"}}>
                      <span class="tag">
                        {style}
                      <RemoveItem deleteItem={()=>{this.deleteStyleTag(index)}}/>
                      </span>
                    </div>
                  )}
                  <AddListItem numItems={this.state.outfit.styles.length} multipleString="Add Style Tag" singleString="Add Style Tag" addNew={this.addStyleTag} fetchAutofill={()=>{return getClothesOfType("shoe")}}/>
                </div>
              </div>
              <div style={{paddingTop: "25px"}}>
                <div>
                  <span class="title is-6"> Other Tags </span>
                </div>
                <div>
                  {this.state.outfit.other_tags.map((tag, index) => 
                    <div style={{"display":"flex"}}>
                      <span class="tag">
                        {tag}
                      <RemoveItem deleteItem={()=>{this.deleteOtherTag(index)}}/>
                      </span>
                    </div>
                    )}
                  <AddListItem numItems={this.state.outfit.other_tags.length} multipleString="Add Other Tag" singleString="Add Other Tag" addNew={this.addOtherTag} fetchAutofill={()=>{return getClothesOfType("shoe")}}/>
                </div>
              </div>
              <div style={{paddingTop: "20px"}}>
                <span class="title is-5"> Notes: </span>
                <div>
                  <textarea class="textarea" placeholder="Extra Notes" rows="4"></textarea>
                </div>
              </div>
              <div style={{paddingTop: "20px"}} onClick={this.verifyOutfit}>
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