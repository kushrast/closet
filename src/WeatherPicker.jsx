import 'bulma/css/bulma.min.css';
import './App.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWind, faCloud, faCloudSun, faSun, faTemperatureHigh, faPen } from '@fortawesome/free-solid-svg-icons';
import React from 'react';

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

export default WeatherPicker;