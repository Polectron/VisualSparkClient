import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { colorMarker } from "./MapMarkers/MapMarkers";

class MapOutput extends React.Component<any, any> {
    private options: any;

    constructor(props: any) {
        super(props);

        this.state = {
            markers: [],
            center: [40.418889, -3.691944],
            color: "blue"
        }
    }

    setColor = (color: string) => {
        this.setState({color: color});
    }

    addMarker = (marker: any) => {
        const markers = [...this.state.markers, marker];
        this.setState({markers: markers});
    }

    clear = () => {
        this.setState({markers: [], center: [40.418889, -3.691944], color: ""});
    }

    render() {
        return (
            <div className={"elevation"}>
                <h5>Map {this.props.id}</h5>
                <MapContainer center={this.state.center} zoom={9} scrollWheelZoom={false}>
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {this.state.markers.map((x: any)=>{return <Marker icon={colorMarker(this.state.color)} position={[x.lat, x.lon]}><Popup>{x.popup}</Popup></Marker>})}
                </MapContainer>
            </div>
        );
    }
}

export default MapOutput;