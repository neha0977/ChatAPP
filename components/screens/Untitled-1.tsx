
import React, { useState, useEffect, useRef } from 'react';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  View,
  Text
} from 'react-native';

import MapView, { Polygon, Marker, Polyline, PROVIDER_GOOGLE, Heatmap, Circle, Overlay, } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { locations } from "../../nehasingh/demoMap/marker/Data";

//https://maps.googleapis.com/maps/api/directions/json?origin=Disneyland&destination=Universal+Studios+Hollywood&key=YOUR_API_KEY
function App() {
  // Geolocation.getCurrentPosition(info => console.log(info));

  const [state, setstate] = useState([
    {
      name: '1',
      latitude: 28.667856,
      longitude: 77.440091,
    },
    {
      name: '2',
      latitude: 28.557856,
      longitude: 77.360191,
    },
    {
      name: '3',
      latitude: 28.337856,
      longitude: 77.4390991,
    },
  ])
  const [croods, setCroods] = useState([]);

  const [position, setPosition] = useState({
    latitude: 10,
    longitude: 10,
    latitudeDelta: 0.001,
    longitudeDelta: 0.001,
  });
  const [coordinates] = useState([
    {
      latitude: 28.667856,
      longitude: 77.440091,
    },
    {
      latitude: 28.557856,
      longitude: 77.360191,
    },
  ]);
  
  const [forDrawPolygon, setforDrawPolygon] = useState([])

  useEffect(() => {
    Geolocation.getCurrentPosition((pos) => {
      const crd = pos.coords;
      console.log("crd", crd)
      setPosition({
        latitude: crd.latitude,
        longitude: crd.longitude,
        latitudeDelta: 0.0421,
        longitudeDelta: 0.0421,
      });
    })
    // .catch((err) => {
    //   console.log(err);
    // });
    //getDirections("28.667856,77.440091 ", "28.557856,77.360191")

  }, [1]);

  // const getDirections = async (startLoc, destinationLoc) => {
  //   console.log("startLoc, destinationLoc", startLoc, destinationLoc)
  //   try {
  //     //let resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${destinationLoc}`)
  //     let resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${destinationLoc}&key=AIzaSyBlANyQRGuIUnPydSjXeFzf_hRiFT6QUQY`)
  //     let respJson = await resp.json();
  //     console.log("respJson", respJson)
  //     let points = Polyline.decode(respJson.routes[0].overview_polyline.points);
  //     console.log("points", points)
  //     let coords = points.map((point, index) => {
  //       console.log("point, index", point, index)
  //       return {
  //         latitude: point[0],
  //         longitude: point[1]
  //       }
  //     })
  //     setCroods(croods)
  //     return coords
  //   } catch (error) {
  //     // alert(error)
  //     return error
  //   }
  // }

  // push the lat long an array from position in map view 
  const polygonCoordinate = (cord) => {
    console.log("polygonCoordinate", cord)
    const latLogArr = []
    const obj = {
      latitude: cord.latitude,
      longitude: cord.longitude
    }
    forDrawPolygon.push(obj)

    console.log("latLongArr", forDrawPolygon)

  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <MapView
          style={styles.mapStyle}
          provider={PROVIDER_GOOGLE}
          initialRegion={position}
          showsMyLocationButton={true}
          followsUserLocation={true}
          showsUserLocation={true}
          rotateEnabled={true}
          pitchEnabled={true}
          zoomControlEnabled={true}
          scrollEnabled={true}
          zoomEnabled={true}
          onRegionChangeComplete={(position) => setPosition(position)}
          onPress={(position) => {
            //console.log("position", position.nativeEvent.coordinate)
            polygonCoordinate(position.nativeEvent.coordinate)
          }
          }
        >
          {/* <Overlay
            image=""
            bounds={[
              [40.712216, -74.22655],
              [40.773941, -74.12544]
            ]}
          /> */}
          {/* <Heatmap points={locations} /> */}

          <Marker
            title='Yor are here'
            description='This is a description'
            coordinate={position}
          />
          {forDrawPolygon.length>=3?
           <Polygon
           coordinates={forDrawPolygon}
           fillColor={'#474567'}
         />:null}
         

        </MapView>

        {/* <Text>Current latitude: {position.latitude}</Text>
        <Text>Current longitude: {position.longitude}</Text> */}
      </View>


    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  mapStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default App;
