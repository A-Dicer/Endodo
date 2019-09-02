import React, { Component } from 'react';
import noUiSlider from 'nouislider'; //NPM for Slider
import 'nouislider/distribute/nouislider.css';  //cs for Slider
import "./filter.css";

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      STREET: {param: null, type: true},
      Zip: {param: null , type: true},
      ESTIMATED_MARKET_VALUE: {param: {min: 0, max:0}, type: false},
      EXT_DESC: {param: null , type: true},
      RES_TYPE: {param: null , type: true},
    }
    this.handleChange = this.handleChange.bind(this);
    this.updateFilter = this.updateFilter.bind(this);
    this.handleSliderChange = this.handleSliderChange.bind(this);
  }

  //Loads Slider in after component mounts -----------------------------------------------------------------
  componentDidMount(){
    const slider = document.getElementById('slider')
    noUiSlider.create(slider, { start: [0, 3300], step: 10, connect: true, range: {'min': 0, 'max': 3300}})
    slider.noUiSlider.on('update', (values) =>(this.handleSliderChange(values, 'ESTIMATED_MARKET_VALUE' )))
  }

  //Checks for String and trims it -------------------------------------------------------------------------
  strCheck(str){
    if(typeof str === 'string' || str instanceof String) return str.trim() 
    else return str
  }

  //filteres data from state options then updates markers --------------------------------------------------
  updateFilter(e) {
    e.preventDefault()

    const searchItems = ["STREET","Zip","ESTIMATED_MARKET_VALUE","EXT_DESC","RES_TYPE"]
    let filterData = Object.assign([], this.props.data);

    searchItems.forEach(item => { 
     this.state[item].param
      ? this.state[item].type
        ? filterData = filterData.filter(data => this.strCheck(data[item]) === this.state[item].param)
        : filterData = filterData.filter(
          data => data[item] >  this.state[item].param.min && data[item] < this.state[item].param.max 
        )
      : null
    })

    this.props.changeUpdate(filterData) //sends updated markers to main
  }

  //updates state with new filter properties ---------------------------------------------------------------
  handleChange(e){
    let { name, value } = e.target;
    let data = Object.assign({}, this.state[name]);

    name === "Zip" ? value = parseInt(value, 10) : null
    name === "STREET" ? value = value.toUpperCase().trim() : null
    value === "All" ? data.param = null : data.param = value 

    this.setState({[name]: data})   
  }

  //updates state after sliders have been moved ------------------------------------------------------------
  handleSliderChange = (values, name) =>{
  let data = Object.assign({}, this.state[name]);
  data.param.min = values[0]*1000; data.param.max = values[1]*1000;
  this.setState({[name]: data})
  }

  //opens and closes Property Filter... also changes the icon ----------------------------------------------
  dropDown(){
    const filter = document.getElementById('filter')
    const icon = document.getElementById('icon')
    
    filter.style.height === "40px" ?  (
        filter.style.height = "376px", 
        icon.classList.remove("fa-caret-square-down"),
        icon.classList.add("fa-caret-square-up")
      ) : (
        filter.style.height = "40px",
        icon.classList.remove("fa-caret-square-up"),
        icon.classList.add("fa-caret-square-down")
      )
  }
 
  //Front End ----------------------------------------------------------------------------------------------
  render() {
    return (
    <div className="container" id="filter" style={{height: 40+'px'}}>
      <img src={require("../../assets/img/enodo.png" )} alt="Smiley face" height="42" width="42" />
      <div className="properties"><i className="fas fa-map-marker-alt"></i> {this.props.amount}</div>
      
      <div className="row">
        <div className="col-12 top">
          <span  onClick={this.dropDown}>Property Filter <i className="far fa-caret-square-down" id="icon"></i></span>
        </div>
        
        <div className="col-12 bottom text-left">
        <form>
        
          {/* Property Type ---------------------------------------------------------------------------- */}
          <label><i className="fas fa-building"></i> Property Type:</label>
          <select className="form-control form-control-sm" name="RES_TYPE" onClick={this.handleChange}>
            <option>All</option>
            <option>One Story</option>
            <option>1.5 - 1.9</option>
            <option>Two Story</option>
            <option>Three Story</option>
          </select>

          {/* Exterior Type ---------------------------------------------------------------------------- */}
          <label><i className="fas fa-home"></i> Exterior Type:</label>
          <select className="form-control form-control-sm" name="EXT_DESC" onChange={this.handleChange}>
            <option>All</option>
            <option>Masonry</option>
            <option>Frame/Masonry</option>
            <option>Frame</option>
            <option>Stucco</option>
          </select>
          <hr/>
          
          {/* Estimated Value Slider ------------------------------------------------------------------- */}
          <div className="slidecontainer col-12">
            <div className="row">
              <div className="col-12 text-center">
              <i className="fas fa-coins"></i> Estimated Market Value
                <div id="slider" name="slider"></div>
              </div>
              <div className="col-6">
                <div>
                {
                    this.state.ESTIMATED_MARKET_VALUE.param.min > 999999
                    ? `Min: $${this.state.ESTIMATED_MARKET_VALUE.param.min/1000000}M`
                    : `Min: $${this.state.ESTIMATED_MARKET_VALUE.param.min/1000}K`
                  }
                </div>
              </div>
              <div className="col-6 text-right">
                <div>
                  {
                    this.state.ESTIMATED_MARKET_VALUE.param.max > 999999
                    ? `Max: $${this.state.ESTIMATED_MARKET_VALUE.param.max/1000000}M`
                    : `Max: $${this.state.ESTIMATED_MARKET_VALUE.param.max/1000}K`
                  }
                </div>
              </div>
            </div>
          </div>
          <hr/> 

          {/* Zip Code --------------------------------------------------------------------------------- */}
          <label><i className="fas fa-map-marker-alt"></i> Zip Code:</label>
          <input 
            className="form-control form-control-sm"
            type="text" 
            name="Zip" 
            placeholder="Example: 60608"
            onChange={this.handleChange}
            maxLength={5}
          >
          </input>
         
          {/* Street Name ------------------------------------------------------------------------------ */}
          <label><i className="fas fa-map-signs"></i> Street Name:</label>
          <input 
            className="form-control form-control-sm" 
            type="text" 
            name="STREET" 
            placeholder="Example: Taylor"
            onChange={this.handleChange}
            >
          </input>  
          <hr/>
          <button type="submit" className="btn btn-primary btn-sm" onClick={this.updateFilter}>Update Filter</button>
        
        </form>
        </div>

      </div>
    </div>
      );
  }
}

export default Navbar;