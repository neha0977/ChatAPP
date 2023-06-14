import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Modal,
} from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { Bubble, GiftedChat, InputToolbar, Send, } from 'react-native-gifted-chat'

import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import storage from '@react-native-firebase/storage';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const MessagePage = ({ user, navigation, props, route }) => {
    const [messages, setMessages] = useState([]);
    const [loginUID, setloginUID] = useState('')
    const [imageData, setImageData] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [uploadimagesModel, setuploadimagesModel] = useState(false);
    const [typing, setTyping] = useState(null);
    const [IntervalId, setIntervalId] = useState('')
    const uid = route.params.uid;
    const name = route.params.name;
    const imageUser = route.params.imageUser;
    const status = route.params.status;
    console.log(uid, name, imageUser)

    useEffect(() => {
        getId()
        const myFunction = () => {
            getAllMessages()
        }
        let intervalId = setInterval(myFunction, 3000);
        setIntervalId(intervalId)
        console.log("intervalId", intervalId, IntervalId)

    }, [1]);

    // get all messages of the user 
    const getAllMessages = async () => {
        let Userid = await AsyncStorage.getItem('@yUID')
        const chatid = route.params.uid > Userid ? Userid + "-" + route.params.uid : route.params.uid + "-" + Userid;
        // console.log("chatid", chatid)
        const msgResponse = await firestore().collection('chats')
            .doc(chatid)
            .collection('messages')
            .orderBy('createdAt', "desc")
            .get()
        const allTheMsgs = msgResponse.docs.map(docSanp => {
            // console.log("allTheMsgs...", docSanp)
            return {
                ...docSanp.data(),
                createdAt: docSanp.data().createdAt.toDate()
            }
        })
        // console.log("allTheMsgs", allTheMsgs)
        setMessages(allTheMsgs)
    }

    // save login user id 
    const getId = async () => {
        var userid = await AsyncStorage.getItem('@yUID')
        if (userid != null) {
            setloginUID(userid)
        }
    }

    // messages save in the firebase database 
    const onSend = (messageArray) => {
        console.log("messageArray", messageArray,)
        let myMsg = null;
        const msg = messageArray[0];
        if (imageUrl != '') {
            myMsg = {
                ...msg,
                senderId: loginUID,
                receiverId: route.params.uid,
                createdAt: new Date(),
                image: imageUrl
            }
        } else {
            myMsg = {
                ...msg,
                senderId: loginUID,
                receiverId: route.params.uid,
                createdAt: new Date(),
                image: ''
            }
        }
        setMessages(previousMessages => GiftedChat.append(previousMessages, myMsg))
        const chatid = route.params.uid > loginUID ? loginUID + "-" + route.params.uid : route.params.uid + "-" + loginUID
        firestore()
            .collection('chats')
            // .doc('123456789')
            .doc(chatid)
            .collection("messages")
            .add({
                ...myMsg,
                createdAt: firestore.FieldValue.serverTimestamp()
            })
        setImageUrl('');
        setImageData(null);
        console.log('mmm', myMsg)
    }

    //open camaera function 
    const openCamera = async () => {
        setuploadimagesModel(false)
        const result = await launchCamera({ mediaType: 'photo' });
        console.log("..." + result);
        if (result.didCancel && result.didCancel == true) {
        } else {
            setImageData(result);
            uplaodImage(result);
        }
    };

    //upload image 
    const uplaodImage = async imageDataa => {
        console.log("imageDataa", imageDataa)
        const reference = storage().ref(imageDataa.assets[0].fileName);
        console.log("reference", reference)
        const pathToFile = imageData.assets[0].uri;
        console.log("pathToFile", pathToFile)
        await reference.putFile(pathToFile);
        const url = await storage()
            .ref(imageData.assets[0].fileName)
            .getDownloadURL();
        console.log('url', url);
        setImageUrl(url);
    };
    const customOnPress = (text, onSend) => {
        if (imageUrl && !text && onSend) {
            console.log(imageUrl, !text, onSend)
            onSend({ text: text.trim() }, true);
        } else if (text && onSend) {
            console.log(text, onSend)
            onSend({ text: text.trim() }, true);
            0;
        } else {
            return false;
        }
    };

    const imageGalleryLaunch = () => {
        setuploadimagesModel(false)
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
                setImageData(res);
                uplaodImage(res);
            }
        });
    }
    const renderFooter = () => {
        if (typing) {
            return (
                <View style={styles.footerr}>
                    <Text>{name} is typing</Text>
                </View>
            );
        }

        return null;
    }
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={styles.header}>
                <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                    <TouchableOpacity onPress={() => {
                        clearInterval(IntervalId);
                        navigation.goBack()
                    }} style={{ width: 40 }}>
                        <Image source={require('../Images/arrow.png')} style={styles.headericon} />
                    </TouchableOpacity>
                    <Image
                        source={imageUser !== null ? { uri: imageUser } : require('../Images/user.png')}
                        style={styles.img} />
                    <View style={{ flexDirection: 'column' }}>
                        <Text style={styles.headertext}>{name}</Text>
                        <Text style={{
                            color: 'white',
                        }}>{status}</Text>
                    </View>
                </View>
            </View>
            <GiftedChat
                style={{ flex: 1 }}
                messages={messages}
                onSend={text => onSend(text)}
                showAvatarForEveryMessage
                user={{
                    _id: loginUID,
                    avatar: 'https://placeimg.com/140/140/any',
                }}
                alwaysShowSend={true}
                scrollToBottom={true}

                renderSend={({ onSend, text, sendButtonProps, ...props }) => {
                    return (
                        <View style={{ flexDirection: 'row', alignItems: 'center', height: 60 }}>
                            {imageUrl != '' ?
                                <View style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 10,
                                    backgroundColor: '#fff',
                                    marginRight: 10
                                }}>
                                    <Image source={{ uri: imageData.assets[0].uri }}
                                        style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: 10,
                                            position: 'absolute'
                                        }} />
                                    <TouchableOpacity onPress={() => {
                                        setImageUrl('')
                                    }}>
                                        <Image
                                            source={require('../Images/x-mark.png')}
                                            style={{ width: 16, height: 16, tintColor: '#fff' }}
                                        />
                                    </TouchableOpacity>
                                </View>
                                : null}
                            <TouchableOpacity
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    height: 60
                                }}
                                onPress={() => setuploadimagesModel(true)}
                            >
                                <Image source={require('../Images/diaphragm.png')}
                                    style={{ height: 20, width: 20, tintColor: '#ACE1AF', marginRight: 15, }}
                                />
                            </TouchableOpacity>
                            <Send
                                {...props} sendButtonProps={{ ...sendButtonProps, onPress: () => customOnPress(text, onSend) }}
                                containerStyle={{ justifyContent: 'center' }}
                            >

                                <Image source={require('../Images/paper-plane.png')}
                                    style={{ height: 20, width: 20, tintColor: '#ACE1AF', marginRight: 15, }}
                                />
                            </Send>
                        </View>
                    )
                }}
                renderInputToolbar={props => {
                    return (
                        <InputToolbar {...props} containerStyle={{ borderTopColor: '#ACE1AF', borderTopWidth: 1 }}>

                        </InputToolbar>
                    )
                }}
                renderBubble={(props) => {
                    return <Bubble {...props} wrapperStyle={{
                        right: {
                            backgroundColor: '#ACE1AF'
                        }
                    }} />
                }}
                renderFooter={renderFooter}
            />
            <Modal
                transparent={true}
                animationType="slide"
                visible={uploadimagesModel}
                activeOpacity={0.3}
                onRequestClose={() => { setuploadimagesModel(!uploadimagesModel) }}
            >
                <View style={{ height: '100%', width: '100%', backgroundColor: 'black', opacity: 0.8 }} />

                <View
                    style={{
                        height: 100,
                        backgroundColor: "white",
                        toborderRadius: 25,
                        borderWidth: 1,
                        borderColor: "#ACE1AF",
                        marginTop: 'auto'
                    }}
                >
                    <TouchableOpacity onPress={() => {
                        setuploadimagesModel(false)
                    }}
                        style={{ alignItems: 'flex-end', margin: 10 }}
                    >
                        <Image source={require('../Images/x-mark.png')} style={{
                            height: 20, width: 20, tintColor: '#ACE1AF',
                            position: 'absolute'
                        }} />
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flexDirection: 'column' }}>
                            <TouchableOpacity
                                onPress={() => imageGalleryLaunch()}
                                style={{ marginHorizontal: 15, width: 40, height: 30, marginTop: 15 }}
                            >
                                <Image source={require('../Images/gallery.png')} style={{
                                    height: 20, width: 20,
                                    position: 'absolute', tintColor: '#ACE1AF',
                                }} />
                            </TouchableOpacity>
                            <Text style={{ fontSize: 12, color: '#ACE1AF', alignItems: 'center', marginHorizontal: 5 }}> Gallery</Text>
                        </View>

                        <View style={{ flexDirection: 'column' }}>
                            <TouchableOpacity
                                onPress={() => openCamera()}
                                style={{ marginHorizontal: 15, width: 40, height: 30, marginTop: 15 }}
                            >
                                <Image source={require('../Images/camera.png')} style={{
                                    height: 20, width: 20,
                                    position: 'absolute', tintColor: '#ACE1AF',
                                }} />
                            </TouchableOpacity>
                            <Text style={{ fontSize: 12, color: '#ACE1AF', alignItems: 'center', marginHorizontal: 5 }}> Camera</Text>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

export default MessagePage

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#ACE1AF',
        height: 50,
        width: '100%',
    },
    headertext:
    {
        fontWeight: 'bold',
        fontSize: 20,
        color: 'white',
    },
    headericon:
    {
        height: 20,
        width: 20,
        top: 1,
        marginHorizontal: 10,
        tintColor: '#fff'
    },
    container: {
        backgroundColor: "#ffffff",
        borderRadius: 25,
        borderWidth: 1,
        borderColor: "#000",
        borderStyle: "solid",
    },
    text: {
        paddingTop: 10,
        textAlign: "center",
        fontSize: 24,
    },
    body: {
        justifyContent: "center",
        paddingHorizontal: 15,
        minHeight: 100,
    },
    footer: {
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
        flexDirection: "row",
    },
    footerr: {
        paddingRight: 10,
        paddingLeft: 10,
        paddingBottom: 5
    },
    userimg: {
        height: 35,
        width: 35,
        borderRadius: 60,
        tintColor: 'grey',
        marginHorizontal: 5,
        borderColor: 'white'
    },
    img: {
        borderRadius: 30,
        height: 35,
        width: 35,
        borderRadius: 60,
        marginHorizontal: 5,
        borderColor: 'white'
    },
})