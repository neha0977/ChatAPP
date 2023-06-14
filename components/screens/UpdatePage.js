import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    StyleSheet,
    TextInput,
    Modal,
    alert,
    Alert
} from 'react-native'
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage'
import auth from '@react-native-firebase/auth';

const UpdatePage = ({ route, navigation }) => {

    useEffect(() => {
        usersCollection()
    }, [1]);

    const [userName, setuserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    let [profileUpdate, setprofileUpdate] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [image, setImage] = useState(null)

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
                            setprofileUpdate(documentSnapshot.data())
                            setuserName(documentSnapshot.data().name)
                            setUserEmail(documentSnapshot.data().email)
                            setImage(documentSnapshot.data().image)
                        }
                    });
            });
    }

    //update the profile of the user
    const userUpdate = async () => {
        let Userid = await AsyncStorage.getItem('@yUID')
        firestore()
            .collection('users')
            .get()
            .then((collectionSnapshot) => {
                collectionSnapshot
                    .forEach(documentSnapshot => {
                        if (documentSnapshot.id == Userid) {
                            console.log("data is" + JSON.stringify(documentSnapshot.data()))
                            firestore()
                                .collection('users')
                                .doc(documentSnapshot.id)
                                .update({
                                    name: userName,
                                    email: userEmail,
                                    image: image
                                })
                                .then(() => {
                                    alert('User updated!');
                                });
                            setprofileUpdate(documentSnapshot.data())
                        }
                    });
            });
        navigation.navigate("LandingPage")
    }

    const openCamera = async () => {
        setModalVisible(false)
        const result = await launchCamera({ mediaType: 'photo' });
        const img = JSON.stringify(result)
        console.log("..." + JSON.stringify(result));
        if (result.didCancel && result.didCancel == true) {
        } else {
            setImage(result.assets[0].uri);
            pickImageAndUpload(result);
        }
    };

    const imageGalleryLaunch = () => {
        setModalVisible(false)
        let options = {
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };
        launchImageLibrary(options, (res) => {
            console.log('Response = ', res);
            if (res.didCancel) {
                console.log('User cancelled image picker');
            } else if (res.error) {
                console.log('ImagePicker Error: ', res.error);
            } else if (res.customButton) {
                console.log('User tapped custom button: ', res.customButton);
                alert(res.customButton);
            } else {
                setImage(res);
                console.log("image", image)
                pickImageAndUpload(res)
            }
        });
    }

    const pickImageAndUpload = async (fileobj) => {
        const UID = auth().currentUser.uid;
        console.log(UID, "neha")
        console.log("fileobj", fileobj)
        const fileReference = storage().ref(`/users/${UID}/profile`)
        const uploadTask = fileReference.put(fileobj.assets[0].uri)
        uploadTask.on('state_changed',
            (snapshot) => {
                console.log("snapshot", snapshot)
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log("progress", progress + '% done')
                if (progress == 100) alert('image uploaded')
                switch (snapshot.state) {
                    case storage().TaskState.PAUSED:
                        console.log('upload is pause')
                        break;
                    case storage().TaskState.RUNNING:
                        console.log('upload is running');
                        break
                }
            },
            (error) => {
                alert("error uploading image")
            },
            () => {
                uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                    setImage(downloadURL)
                    console.log("image,,,", image)
                    alert('upload image')
                });
            }
        );

        // const reference = storage().ref(`/userprofile/${Date.now()}`)
        // console.log('reference', reference)
        // const PathToFile = fileobj.assets[0].uri;
        // const task = reference.putFile(PathToFile)
        // task.on('state_changed', taskSnapshot => { });
        // task.then(() => {
        //     console.log('Image uploaded to the bucket!');
        // });
        // const url = storage().ref(`/userprofile/${Date.now()}`).getDownloadURL();
        // console.log("url", url)

        // uploadTask.on('state_changed',
        //     (snapshot) => {
        //         console.log("snapshot", snapshot)
        //         var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        //         if (progress == 100) alert('image uploaded')
        //     },
        //     (error) => {
        //         alert("error uploading image")
        //     },
        //     () => {
        //         uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
        //             setImage(downloadURL)
        //             console.log("image,,,", image)
        //             alert('upload image')
        //         });
        //     }
        // );

        //        
    }


    return (
        <ScrollView style={{ backgroundColor: '#fff' }}>
            <View>
                <View style={styles.header}>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={{ width: 40 }}>
                            <Image source={require('../Images/arrow.png')} style={styles.headericon} />
                        </TouchableOpacity>
                        <Text style={styles.headertext}>Profile Update</Text>
                    </View>
                </View>

                <View style={{ alignItems: 'center', marginTop: '5%', }}>

                    <Image style={styles.userimg}
                        resizeMode={'contain'}
                        source={image !== '' ? { uri: image } : require('../Images/user.png')}
                    />

                    <View style={{ position: 'absolute', }}>
                        <TouchableOpacity onPress={() => {
                            setModalVisible(true)
                            //pickImageAndUpload()
                        }}
                            style={{
                                backgroundColor: 'white',
                                borderRadius: 20,
                                borderColor: '#ACE1AF',
                                borderWidth: 0.5,
                                left: 20,
                                top: 0,
                            }} >
                            <Image source={require('../Images/camera.png')} style={styles.camerastyle} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.footer} >

                    <View style={styles.action}>
                        <TextInput
                            style={styles.text_input}
                            onChangeText={(userName) => setuserName(userName)}
                            autoCapitalize="none"
                            autoCorrect={false}
                            placeholderTextColor={'#ACE1AF'}
                            value={userName}
                        />
                    </View>

                    <View style={styles.action}>
                        <TextInput
                            style={styles.text_input}
                            onChangeText={(userEmail) => setUserEmail(userEmail)}
                            autoCapitalize="none"
                            autoCorrect={false}
                            placeholderTextColor={'#ACE1AF'}
                            value={userEmail}
                        />
                    </View>
                    <TouchableOpacity
                        onPress={() => userUpdate()}
                        style={styles.signupbtn}
                    >
                        <Text style={styles.buttonTextStyle}>
                            Update
                        </Text>
                    </TouchableOpacity>
                </View>


                <Modal
                    transparent={true}
                    animationType="slide"
                    visible={modalVisible}
                    activeOpacity={0.3}
                    onRequestClose={() => { setModalVisible(!modalVisible) }}
                >
                    <View style={{ height: '100%', width: '100%', backgroundColor: 'black', opacity: 0.5 }} />

                    <View style={{
                        marginTop: 'auto',
                        backgroundColor: '#ACE1AF',
                        bottom: -20,
                        width: '100%',
                        flexDirection: 'column',
                        borderTopRightRadius: 15,
                        borderTopLeftRadius: 15,
                        padding: 15,
                        height: 200,

                    }}>

                        <Text style={{ textAlign: 'center', color: 'white', fontSize: 20 }}>Upload Image</Text>
                        <TouchableOpacity onPress={() => {
                            setModalVisible(false)
                        }}>
                            <View style={{ alignItems: 'flex-end', justifyContent: "flex-end", marginEnd: 10 }}>
                                <Image source={require('../Images/x-mark.png')} style={{
                                    height: 20, width: 20, tintColor: 'white',
                                    position: 'absolute'
                                }} />
                            </View>

                        </TouchableOpacity>
                        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
                            <View style={{ flex: 1, height: 2, backgroundColor: 'white' }} />
                        </View>

                        <View style={{ margin: 10 }}>
                            <View style={{ marginTop: 15 }}>
                                <TouchableOpacity onPress={() => imageGalleryLaunch()}>
                                    <Image source={require('../Images/gallery.png')} style={{
                                        height: 20, width: 20,
                                        position: 'absolute', tintColor: 'white', top: 2
                                    }} />
                                    <Text style={{ fontSize: 15, color: 'white', left: 25, }}>Choose from Gallery</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ marginTop: 15 }}>
                                <TouchableOpacity onPress={() => openCamera()}>
                                    <Image source={require('../Images/camera.png')} style={{
                                        height: 20, width: 20,
                                        position: 'absolute', tintColor: 'white', top: 2
                                    }} />
                                    <Text style={{ fontSize: 15, color: 'white', left: 25 }}>Choose from Camera</Text>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity style={styles.cancelbutton} onPress={() => {
                                modelClose()
                            }}>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

            </View>
        </ScrollView>
    )
}

export default UpdatePage
const styles = StyleSheet.create({

    buttonTextStyle: {
        color: "#FFFFFF",
        paddingVertical: 10,
        fontSize: 16,
    },
    button: {
        marginTop: 50,
        height: 70,
        width: 250,
        backgroundColor: '#026efd',
        alignContent: 'center',
        justifyContent: 'center',
        borderRadius: 50
    },
    signupbtn: {
        width: '100%',
        height: 50,
        backgroundColor: '#ACE1AF',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginTop: 30
    },
    header: {
        backgroundColor: '#ACE1AF',
        height: 40,
        width: '100%',
    },
    footer: {
        // flex: 3,
        paddingHorizontal: 20,
        paddingVertical: 50,
    },
    action: {
        flexDirection: 'row',
        marginTop: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ACE1AF',
        paddingBottom: 5,
    },
    text_input: {
        // flex: 1,
        marginTop: -12,
        paddingLeft: 10,
        color: '#ACE1AF'
    },
    headertext:
    {
        fontWeight: 'bold',
        fontSize: 20,
        color: 'white',
        textAlign: 'center'
    },
    userimg: {
        height: 80,
        width: 80,
        borderRadius: 50,
    },
    camerastyle: {
        height: 15,
        width: 15,
        margin: 5,
    },
    headericon:
    {
        height: 20,
        width: 20,
        top: 1,
        marginHorizontal: 10,
        tintColor: '#fff'
    },
})