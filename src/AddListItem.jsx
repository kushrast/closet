import 'bulma/css/bulma.min.css';
import './App.css';

import * as stringSimilarity from "string-similarity";
import React from 'react';

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
                        <input class="input" type="search" placeholder="Search or Add New" value={this.state.value} onChange={this.updateInputValue} onKeyDown={this.onKeyDown}/>
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

export default AddListItem;