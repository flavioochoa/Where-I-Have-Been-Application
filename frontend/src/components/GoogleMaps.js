import React, { Component } from 'react';
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css"
import { googleMapsKey } from '../config';

const style = {
  width: '100%',
  height: '100%'
}

const _initialCenter = { lat: 20.659914, lng: -103.351952 };

class GoogleMaps extends Component {
  state = {
    showingInfoWindow: false,
    activeMarker: {},
    selectedPlace: {},
  };

  render() {
    const values = this.getValues();
    const { coordinates, markerName, markerText, draggable, showGallery, initialCenter, images } = values;
    return (
      <div>
        <h3>Click on marker to see more details...</h3>
        <div style={{ position: 'relative', minHeight: '500px', maxHeight: '500px' }}>
          <Map
            style={style}
            google={this.props.google}
            onClick={this.onMapClicked}
            initialCenter={initialCenter}
            zoom={12}
          >
            <Marker
              onClick={this.onMarkerClick}
              name={markerName}
              position={coordinates}
              draggable={draggable}
              onDragend={this.moveMarker.bind(this)}
            />

            <InfoWindow
              marker={this.state.activeMarker}
              visible={this.state.showingInfoWindow}
            >
              <div>
                <h1>{this.state.selectedPlace.name}</h1>
                <h3>{markerText}</h3>
              </div>
            </InfoWindow>
          </Map>
        </div>
        {
          showGallery &&
          <div style={{ marginTop: '10px' }}>
            <ImageGallery items={[{
              original: images,
              thumbnail: images,
            }]} />
          </div>
        }

      </div>

    )
  }

  onMarkerClick = (props, marker, e) =>
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });

  onMapClicked = (props) => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      })
    }
  };

  moveMarker = (t, map, coord) => {
    const { latLng } = coord;
    const lat = latLng.lat();
    const lng = latLng.lng();
    if (this.props.onDragEndCallback) {
      this.props.onDragEndCallback({ lat, lng })
    }
  };

  getValues = () => {
    let values = {
      initialCenter: _initialCenter,
      coordinates: _initialCenter,
      markerName: 'default name',
      markerText: 'default text',
      draggable: false,
      showGallery: false,
    }
    if (this.props.isRedirect) {
      let { lat, lng } = this.props.location.state.data;
      values = {
        ...values,
        ...this.props.location.state.data,
        showGallery: true,
        initialCenter: { lat, lng },
      }
    } else {
      values = {
        ...values,
        ...this.props,
        initialCenter: this.props.coordinates,
      }
    }

    return values;
  }
}

export default GoogleApiWrapper({
  apiKey: (googleMapsKey)
})(GoogleMaps);