import React, { Component } from 'react';
import axios from 'axios';
import Map from '../../components/Map';
import Filter from '../../components/Filter/';
import "./Main.css";

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      properties: [],
      filteredProperties: []
    };
    this.getProperties = this.getProperties.bind(this);
    this.changeUpdate = this.changeUpdate.bind(this);
  }

  //Once component mounts grab property data from api using axios -------------------------------------------
  componentDidMount() {this.getProperties();}

  getProperties() {
    axios.get('/api/properties')
      .then((response) => {
        this.setState({properties: response.data,filteredProperties: response.data});
      })
      .catch((error) => { console.log(error);
      });
  }

  //changes the filteredProperties state once called (called in filter/sent to map) -------------------------
  changeUpdate(data) {this.setState({filteredProperties: data})}

  //Front End -----------------------------------------------------------------------------------------------
  render () {
    return (
      <div>
        <Filter
        data={this.state.properties} 
        changeUpdate={this.changeUpdate}
        amount={this.state.filteredProperties.length}
        />
        <Map properties={this.state.filteredProperties}/>
      </div>
    );
  }
}

export default Main;