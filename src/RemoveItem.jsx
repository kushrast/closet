import logo from './logo.svg';
import 'bulma/css/bulma.min.css';
import './App.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faTimes } from '@fortawesome/free-solid-svg-icons';
import React from 'react';

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

export default RemoveItem;