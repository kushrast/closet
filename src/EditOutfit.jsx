import logo from './logo.svg';
import 'bulma/css/bulma.min.css';
import './App.css';

import { Navigate } from "react-router-dom";
import { useParams } from "react-router";
import React from 'react';

import AddListItem from './AddListItem.jsx';
import RemoveItem from './RemoveItem.jsx';
import WeatherPicker from './WeatherPicker.jsx';
import {getOutfit, getClothesOfType, validatePotentialOutfit, updateOutfit, getStyles} from "./api/Storage.js";

class EditOutfit extends React.Component {
  constructor(props) {
    super(props);

    var id = this.props.params.id;
    if (id == null) {
      id = "619f517d7105e3db8b626617";
    }


    this.state = {
      loading: true,
      showSubmitModal: false,
      sendToOutfitPage: false,

      outfit: {},
      newClothes: {}
    }

    getOutfit(id)
    .then(
      (data) => {
        console.log(data);
        this.setState({outfit: data, loading: false});
      }
      ,(error)=>console.log(error));
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
        updateOutfit(this.state.outfit)
          .then(
            (data) => {
              this.setState({sendToOutfitPage: true});
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
          {this.state.sendToOutfitPage ? <Navigate to={"/outfit/"+this.state.outfit.id} replace={true} /> : ""}
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
                <li><a href={"/outfit/"+this.state.outfit.id} aria-current="page">{this.state.outfit.name}</a></li>
                <li class="is-active"><a aria-current="page">Edit Outfit</a></li>
              </ul>
            </nav>
          </div>
          <div class="columns">
            <div class="column is-4">
              <div style={{paddingTop: "15px"}}>
                <div>
                <input class="input name-input" ref="input" placeholder="Outfit Name" value={this.state.outfit.name} onChange={this.updateOutfitName}/>
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
                  <AddListItem numItems={this.state.outfit.styles.length} multipleString="Add Style Tag" singleString="Add Style Tag" addNew={this.addStyleTag} fetchAutofill={()=>{return getStyles()}}/>
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
                <button class="button is-link is-small">Update Outfit</button>
              </div>
            </div>
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

export default withRouter(EditOutfit);