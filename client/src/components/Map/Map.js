import React, { Component } from "react";
import {
    withGoogleMap,
    withScriptjs,
    GoogleMap,
    Marker,
    InfoWindow
  } from "react-google-maps";
import { GOOGLE_API } from '../../config';
import { compose, withProps } from "recompose";
import "./map.css";


// Returns color marker based on market value -----------------------------------------------------------------------------------
function color(val) {
   let color = val <= 400000 ? 'green-dot.png' : val > 400000 && val <= 600000 ? 'yellow-dot.png' : 'red-dot.png';
   return color
}

// creates map outside of component to keep it from reloading on state change --------------------------------------------------- 
const MyMapComponent = compose(
    withProps({
        googleMapURL: `https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${GOOGLE_API}`,
        loadingElement: <div style={{ height: `100%` }} />,
        containerElement: <div style={{ height: `100%` }} />,
        mapElement: <div style={{ height: `100%` }} />
    }),
    withScriptjs,
    withGoogleMap
  )(props => (
    <GoogleMap 
        defaultZoom={14}
        defaultCenter={{ lat: 41.869, lng: -87.6659458 }}
        defaultOptions={{fullscreenControl: false}}
    >
    {
        //go through each property and place marker on map ------------------------------------------------      
        props.data.properties.map((property, i) => (
           
        <Marker
          key={`marker${i}`}
          position={{
            lat: property.Longitude,
            lng: property.Latitude
          }}
          icon={{
            url: 'http://maps.google.com/mapfiles/ms/icons/' + color(property.ESTIMATED_MARKET_VALUE)
          }}
          onClick={() => {
            props.onMarkerClick(property);
          }}
        />
      ))}
       {props.vis && (
       <InfoWindow
          
          visible={props.vis}
          onCloseClick={props.onClose}
          position={{ lat: props.property.Longitude, lng: props.property.Latitude}}
         
        >
          {/* html for info window -------------------------------------------------------------------- */}
          <div id="info" className="container">
            <div className="row">
              <div className="col-12 text-center">
                <h4>{props.property["Full Address"]}</h4>
              </div>
              <div className="col-6">  
                <p><i className="fas fa-coins"></i> Market Value: ${props.property.ESTIMATED_MARKET_VALUE}</p>
                <p>
                  <i className="fas fa-map-signs"></i> Street Name: {` ${props.property.STREET.charAt(0).toUpperCase() + props.property.STREET.slice(1).toLowerCase()} ${props.property.SUFFIX}`}
                </p>
                <p><i className="fas fa-map-marker-alt"></i> Zip Code: {props.property.Zip}</p>
                <p><i className="fas fa-building"></i> Property Type: {props.property.RES_TYPE.trim() !== "" ? props.property.RES_TYPE : "No Info" }</p>
                <p><i className="fas fa-home"></i> Exterior Type: {props.property.EXT_DESC.trim() !== "" ? props.property.EXT_DESC : "No Info" }</p>
              </div>
              <div className="col-6">
                <h6>Property Description</h6>
                <hr/>
                <p>{props.property.CLASS_DESCRIPTION}</p>
             </div>
            </div>
          </div>
        </InfoWindow>
       )}
    </GoogleMap>
  )
);

export class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showingInfoWindow: false,      
      selectedPlace: {}         
    };
    this.handleMarkerClick = this.handleMarkerClick.bind(this);
    this.onClose = this.onClose.bind(this);
  }

  //Change selected place to current marker and show to true -----------------------------------------------
  handleMarkerClick(props) {
    this.setState({
      showingInfoWindow: true,
      selectedPlace: props
    }); 
  }

  //Change sleced place to null and show to false ----------------------------------------------------------
  onClose(props) {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        selectedPlace: null,
      });
    }
  }

  //Front End ----------------------------------------------------------------------------------------------
  render() {
    return (
        <div style={{ width: "100vw", height: "100vh" }} id="map">
            <MyMapComponent 
                data={this.props}
                onMarkerClick={this.handleMarkerClick}
                onClose={this.onClose}
                property={this.state.selectedPlace}
                vis={this.state.showingInfoWindow}
            />  
        </div>
    )
  }
}

export default Map;