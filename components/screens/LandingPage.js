import {
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Image,
    StatusBar,
    Platform
} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import {
    Polygon,
    Marker,
    Polyline,
    PROVIDER_GOOGLE,
    Heatmap,
    Circle,
    Overlay,
    Callout,
    AnimatedRegion
} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import MapView from "react-native-map-clustering";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const homePlace = { description: 'Home', geometry: { location: { lat: 28.667856, lng: 77.449791 } } };
const workPlace = { description: 'Work', geometry: { location: { lat: 28.653933, lng: 77.445244 } } };

const LandingPage = ({ navigation }) => {
    const [position, setPosition] = useState({
        latitude: 28.6139,
        longitude: 77.2090,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
    });
    const [forDrawPolygon, setforDrawPolygon] = useState([])
    const [forDrawPolyline, setforDrawPolyline] = useState([])
    const [polylineFlag, setpolylineFlag] = useState(false)
    const [polygonFlag, setpolygonFlag] = useState(false)
    const [searchTxt, setsearchTxt] = useState('')
    const [currentLatLong, setcurrentLatLong] = useState([])
    const mapref = useRef(null)
    const [routeCoordinates, setrouteCoordinates] = useState([])
    const [coordinate, setcoodicoordinate] = useState(
        new AnimatedRegion({
            latitude: 28.667856,
            longitude: 77.449791
        })
    )
    const [
        currentLongitude,
        setCurrentLongitude
    ] = useState('...');
    const [
        currentLatitude,
        setCurrentLatitude
    ] = useState('...');
    const [
        locationStatus,
        setLocationStatus
    ] = useState('');

    useEffect(() => {
        const requestLocationPermission = async () => {
            if (Platform.OS === 'android') {
                getOneTimeLocation();
                subscribeLocationLocation();
            } else {
                try {
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                        {
                            title: 'Location Access Required',
                            message: 'This App needs to Access your location',
                        },
                    );
                    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                        getOneTimeLocation();
                        subscribeLocationLocation();
                    } else {
                        setLocationStatus('Permission Denied');
                    }
                } catch (err) {
                    console.warn(err);
                }
            }
        };
        requestLocationPermission();
        return () => {
            Geolocation.clearWatch(watchID);
        };
    }, [1]);

    // useEffect(() => {
    //     Geolocation.getCurrentPosition(
    //         (position) => {
    //             const crd = position.coords;
    //             console.log("crd", crd)
    //             setPosition({
    //                 latitude: crd.latitude,
    //                 longitude: crd.longitude,
    //                 latitudeDelta: 0.25,
    //                 longitudeDelta: 0.25,
    //             });
    //             let myArr = [], myObj = {};
    //             for (let i = 0; i < 10; i++) {
    //                 myObj = {
    //                     latitude: (crd.latitude).toFixed(7) + i,
    //                     longitude: (crd.longitude).toFixed(7) + i,
    //                 }
    //                 myArr.push(myObj)
    //             }
    //             setcurrentLatLong(myArr)
    //         }, (error) => alert(error.message), {
    //         enableHighAccuracy: true, timeout: 20000, maximumAge: 1000
    //     }
    //     );
    // }, [1]);

    const getOneTimeLocation = () => {
        setLocationStatus('Getting Location ...');
        Geolocation.getCurrentPosition(
            (position) => {
                setLocationStatus('You are Here');
                const crd = position.coords;
                console.log("crd", crd)
                setPosition({
                    latitude: crd.latitude,
                    longitude: crd.longitude,
                    latitudeDelta: 0.25,
                    longitudeDelta: 0.25,
                });
                let myArr = [], myObj = {};
                for (let i = 0; i < 10; i++) {
                    myObj = {
                        latitude: (crd.latitude).toFixed(7) + i,
                        longitude: (crd.longitude).toFixed(7) + i,
                    }
                    myArr.push(myObj)
                }
                setcurrentLatLong(myArr)
            },
            (error) => {
                setLocationStatus(error.message);
            },
            {
                enableHighAccuracy: false,
                timeout: 30000,
                maximumAge: 1000
            },
        );
    };
    const subscribeLocationLocation = () => {
        watchID = Geolocation.watchPosition(
            (position) => {
                setLocationStatus('You are Here');
                console.log("position", position.coords);
                const crd = position.coords;
                setPosition({
                    latitude: crd.latitude,
                    longitude: crd.longitude,
                    latitudeDelta: 0.25,
                    longitudeDelta: 0.25,
                });
                const currentLongitude =
                    JSON.stringify(position.coords.longitude);
                const currentLatitude =
                    JSON.stringify(position.coords.latitude);
                setCurrentLongitude(currentLongitude);
                setCurrentLatitude(currentLatitude);
            },
            (error) => {
                setLocationStatus(error.message);
            },
            {
                enableHighAccuracy: false,
                maximumAge: 1000
            },
        );
    };


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
        const latLogArr = [...forDrawPolygon];
        const obj = {
            latitude: cord.latitude,
            longitude: cord.longitude
        }
        latLogArr.push(obj)
        setforDrawPolygon(latLogArr)
    }
    const polylineCoordinate = (cord) => {
        const latLogArr = [...forDrawPolyline];
        const obj = {
            latitude: cord.latitude,
            longitude: cord.longitude
        }
        latLogArr.push(obj)
        setforDrawPolyline(latLogArr)
    }




    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar backgroundColor="#ACE1AF" barStyle="dark-content" />
            <View style={styles.header}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View
                        style={styles.searchView}
                    >
                        <TouchableOpacity style={{ marginHorizontal: 15, }}>
                            <Image
                                source={require('../Images/find.png')}
                                style={{ height: 14, width: 14, tintColor: 'black', top: 15, }}
                            />
                        </TouchableOpacity>

                        <TextInput
                            onChangeText={(txt) => setsearchTxt(txt)}
                            value={searchTxt}
                            placeholder="Search here"
                            keyboardType="default"
                            placeholderTextColor={'black'}
                        />

                    </View>
                </View>

            </View>
            <View style={styles.btnView}>
                <TouchableOpacity
                    style=
                    {polygonFlag == true ? styles.background1 : styles.background2}
                    onPress={() => {
                        setpolygonFlag(!polygonFlag)
                        // navigation.navigate("ProfilePage")
                    }}
                >
                    <Text style={styles.text}>
                        {polygonFlag == false ? "Enable Polygon" : "Disable Polygon"}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style=
                    {polylineFlag == true ? styles.background1 : styles.background2}
                    onPress={() => {
                        setpolylineFlag(!polylineFlag)
                        //  navigation.navigate("CustomCallOut")
                    }}>
                    <Text style={styles.text}>
                        {polylineFlag == false ? "Enable Polyline" : "Disable Polyline"}
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.container}>
                <MapView
                    ref={mapref}
                    style={styles.mapStyle}
                    provider={PROVIDER_GOOGLE}
                    initialRegion={position}
                    showsMyLocationButton={true}
                    followsUserLocation={true}
                    loadingEnabled
                    showsUserLocation={true}
                    rotateEnabled={true}
                    pitchEnabled={true}
                    zoomControlEnabled={true}
                    scrollEnabled={true}
                    zoomEnabled={true}
                    onPress={(position) => {
                        if (polygonFlag == true) {
                            polygonCoordinate(position.nativeEvent.coordinate)
                        }
                        else {
                            polylineCoordinate(position.nativeEvent.coordinate)
                        }
                    }}
                >
                    <Polyline coordinates={routeCoordinates} strokeWidth={5} />

                    {/* <Overlay
                        image=""
                        bounds={[
                            [40.712216, -74.22655],
                            [40.773941, -74.12544]
                        ]}
                    /> */}
                    {/* <Heatmap points={locations} /> */}

                    <Marker
                        coordinate={position}
                        title='Yor are here'
                        description='This is a description'
                    />
                    {currentLatLong.map((item) =>
                        <Marker
                            // title='Yor are here'
                            // description='This is a description'
                            coordinate={item}
                        >
                            <Callout tooltip>
                                <View>
                                    <View style={styles.bubble}>
                                        <Text style={styles.txt1}>
                                            Favourite place
                                        </Text>
                                        <Text>
                                            A short description
                                        </Text>
                                        <Text>
                                            <Image
                                                style={styles.imagestyle}
                                                resizeMode={'contain'}
                                                source={require('../Images/crtoon.png')}
                                            />
                                        </Text>
                                    </View>
                                    <View style={styles.arrborder} />
                                    <View style={styles.arrow} />
                                </View>
                            </Callout>
                        </Marker>
                    )}

                    {forDrawPolygon.length >= 3 && polygonFlag == true ?
                        <Polygon
                            coordinates={forDrawPolygon}
                            fillColor={'red'}
                        /> : null}

                    {forDrawPolyline.length == 2 && polylineFlag == true ?
                        <Polyline
                            coordinates={forDrawPolyline}
                            strokeColor="#000"
                            fillColor="rgba(255,0,0,0.5)"
                            strokeWidth={1}
                        /> : null}
                </MapView>
            </View>
        </SafeAreaView>
    )
}

export default LandingPage

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    mapStyle: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        marginTop: 10
    },
    touchable: {
        backgroundColor: "#e3e3e3",
        padding: 10,
        margin: 10,
        borderRadius: 10,
        height: 45
    },
    searchView: {
        flexDirection: 'row',
        backgroundColor: '#F0FFF0',
        width: '70%',
        borderRadius: 30,
        margin: 10,
        height: 45,
    },
    text: {
        color: 'black',
        fontSize: 12,
        textAlign: 'center',
    },
    background2: {
        backgroundColor: '#ACE1AF',
        width: '45%',
        justifyContent: 'center',
        marginHorizontal: 5,
        borderBottomEndRadius: 10,
        borderTopLeftRadius: 10
    },
    background1: {
        backgroundColor: '#F0FFF0',
        width: '45%',
        justifyContent: 'center',
        marginHorizontal: 5,
        borderBottomEndRadius: 10,
        borderTopLeftRadius: 10
    },
    btnView: {
        flexDirection: 'row',
        height: 35,
        justifyContent: 'center',
    },
    bubble: {
        flexDirection: 'column',
        alignSelf: 'flex-start',
        backgroundColor: '#ffff',
        borderRadius: 6,
        borderColor: '#ccc',
        borderWidth: 0.5,
        padding: 15,
        width: 150,
    },
    txt1: {
        fontSize: 16,
        marginBottom: 5
    },
    desc: {

    }
    ,
    arrow: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        borderTopColor: '#fff',
        borderWidth: 16,
        alignSelf: 'center',
        marginTop: -32
    },
    arrborder: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        borderTopColor: '#009a87',
        borderWidth: 16,
        alignSelf: 'center',
        marginTop: -5

    },
    imagestyle: {
        width: 150,
        height: 80
    },
    logoutstyle: {
        height: 20,
        width: 20,
        tintColor: 'green',

    },
    header:
    {
        flexDirection: 'row',
        backgroundColor: 'green',
        height: 40,
        //width: '100%',
        flexDirection: 'row',
        backgroundColor: '#F0FFF0',
        width: '75%',
        borderRadius: 30,
        margin: 10,
        height: 45,
    },
    headericon:
    {
        height: 20,
        width: 20,
        margin: 5,

    },
    headertext:
    {
        fontWeight: 'bold',
        fontSize: 20,
        color: 'white',
        marginStart: 5
    },
})