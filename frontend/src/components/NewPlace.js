import React, { Component } from 'react';
import { Grid, Form, Divider } from 'semantic-ui-react'
import GoogleMaps from './GoogleMaps';
import { createTodo } from '../api/todos-api'

class NewPlace extends Component {
    constructor(props) {
        super(props);
        this.state = {
            markerName: '',
            markerText: '',
            lat: '20.659914',
            lng: '-103.351952',
            draggable: true,
            images: '',
        };
    }

    render() {
        const { markerName, markerText, lat, lng } = this.state
        return (
            <Grid.Row>
                <Grid.Column width={16}>
                    <Divider />
                </Grid.Column>
                <Grid.Column width={16}>
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Group widths='equal'>
                            <Form.Input
                                fluid label='Marker name' placeholder='Marker name'
                                name='markerName'
                                value={markerName}
                                onChange={this.handleChange}
                            />
                            <Form.Input fluid label='Latitude' placeholder='Latitude'
                                name='lat'
                                value={lat}
                                onChange={this.handleChange}
                                readOnly
                            />
                            <Form.Input fluid label='Longitude' placeholder='Longitude'
                                name='lng'
                                value={lng}
                                onChange={this.handleChange}
                                readOnly
                            />
                        </Form.Group>
                        <Form.TextArea label='About' placeholder='Tell us more about this place...'
                            name='markerText'
                            value={markerText}
                            onChange={this.handleChange}
                        />
                        <Grid.Column width={16}>
                            <h3> Move the marker to set a new location</h3>
                        </Grid.Column>
                        <Grid.Column width={16}>
                            <GoogleMaps
                                markerName={markerName}
                                markerText={markerText}
                                coordinates={{ lat, lng }}
                                draggable
                                onDragEndCallback={this.onDragEnd.bind(this)}
                            />
                        </Grid.Column>
                        <Form.Button>Submit</Form.Button>
                    </Form>
                </Grid.Column>
                <Grid.Column width={16}>
                    <Divider />
                </Grid.Column>
            </Grid.Row>
        );
    }

    onDragEnd(coordinates) {
        const { lat, lng } = coordinates;
        this.setState({ lat, lng })

    }

    handleChange = (e, { name, value }) => this.setState({ [name]: value })

    handleSubmit = async () => {
        try {
            const { markerName, markerText, lat, lng, images } = this.state;
            if(!markerName || !markerText || !lat || !lng) {
                alert('All fields are required!');
                return;
            }
            const data = { markerName, markerText, lat, lng, images };
            
            await createTodo(this.props.auth.getIdToken(), data);
            alert('Saved!');
            this.props.history.push('/');
        } catch(e){
            console.log(e)
            alert('Todo creation failed')
        }
    }
}

export default NewPlace;