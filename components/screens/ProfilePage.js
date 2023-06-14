import { StyleSheet, Text, View, TouchableOpacity, Image, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
const ProfilePage = ({ navigation }) => {
    navigation.setOptions({ headerShown: false })
    let [profileUpdate, setprofileUpdate] = useState([])

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", () => {
            usersCollection()
        });
        return unsubscribe;
    }, [navigation]);

    // get data of the users from firebase 
    const usersCollection = async () => {
        let Userid = await AsyncStorage.getItem('@yUID')
        firestore()
            .collection('users')
            .get()
            .then((collectionSnapshot) => {
                collectionSnapshot
                    .forEach(documentSnapshot => {
                        if (documentSnapshot.id == Userid) {
                            setprofileUpdate(documentSnapshot.data())
                            console.log("profileUpdate", documentSnapshot.data())
                        }
                    });
            });
    }
    const logoutUser = async () => {
        Alert.alert(
            'Logout',
            "are you sure you want to logout?",
            [
                {
                    text: "cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel",
                },
                {
                    text: "yes", onPress: async () => {
                        let Userid = await AsyncStorage.getItem('@yUID')
                        const data = firestore()
                            .collection('users').
                            doc(Userid)
                            .update({
                                status: firestore.FieldValue.serverTimestamp()
                            })
                        //alert("updated", data)
                        AsyncStorage.clear()
                            .then(() => {
                                auth().signOut().then(() => {
                                    navigation.reset({
                                        index: 0,
                                        routes: [{ name: "LoginPage" }]
                                    })
                                });
                            });
                    }
                },
            ],
            { cancelable: false }
        );
    };
    return (
        <View style={{ flex: 1, flexDirection: 'column', backgroundColor: 'white' }}>
            <View style={styles.header}>
                <View style={{ flexDirection: 'row', width: '50%', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() =>
                        navigation.goBack()} style={{ width: 40 }}>
                        <Image source={require('../Images/arrow.png')} style={styles.headericon} />
                    </TouchableOpacity>
                    <Text style={styles.headertext}>Profile</Text>
                </View>
                <View style={{ flexDirection: 'row', width: '50%', alignItems: 'center', justifyContent: 'flex-end', paddingEnd: 10 }}>
                    <TouchableOpacity onPress={() => {
                        logoutUser()
                    }}>
                        <Image style={styles.logoutstyle} source={require('../Images/logout.png')} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={{ flexDirection: 'row', marginHorizontal: 10, marginVertical: 10 }}>
                <View style={{ width: '30%', }}>
                    <Image style={styles.userimg}
                        resizeMode={'contain'}
                        source={profileUpdate.image !== '' ? { uri: profileUpdate.image } : require('../Images/user.png')} />
                </View>
                <View style={{ flexDirection: 'column', width: '50%', marginTop: 10, }}>
                    <Text style={styles.name}>{profileUpdate.name}</Text>
                    <Text style={styles.email}>{profileUpdate.email}</Text>
                </View>
                <TouchableOpacity style={{ width: '20%', alignItems: 'center', marginTop: 10, padding: 10 }}
                    onPress={() => {
                        navigation.navigate("UpdatePage")}
                        }
                >
                    <Image
                        style={{
                            height: 40,
                            width: 50,
                            tintColor: '#ACE1AF'
                        }}
                        resizeMode={'contain'}
                        source={require('../Images/update.png')} />
                </TouchableOpacity>
            </View>

        </View>
    )
}
export default ProfilePage
const styles = StyleSheet.create({
    imageBackgroundNb: {
        width: '100%',
        height: 250,
    },
    header: {
        backgroundColor: '#ACE1AF',
        height: 40,
        width: '100%',
        flexDirection: 'row'
    },
    headertext:
    {
        fontWeight: 'bold',
        fontSize: 20,
        color: 'white',
        textAlign: 'center'
    },
    userimg: {
        height: 90,
        width: 90,
        borderRadius: 50,
    },
    name: {
        color: 'black',
        fontSize: 25,
        fontWeight: '500'
    },
    email: {
        fontSize: 18,
        color: 'black',
        fontWeight: '400'
    },
    headericon:
    {
        height: 20,
        width: 20,
        top: 1,
        marginHorizontal: 10,
        tintColor: '#fff'
    },
    logoutstyle: {
        height: 20,
        width: 20,
        tintColor: 'white',

    },

})