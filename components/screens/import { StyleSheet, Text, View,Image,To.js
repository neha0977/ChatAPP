import { StyleSheet, Text, View,Image,TouchableOpacity,TextInput,Button } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Bubble, GiftedChat, Send } from 'react-native-gifted-chat'
import { useRoute } from '@react-navigation/native'
import firestore from '@react-native-firebase/firestore';
import base64 from 'react-native-base64';
import AsyncStorage from '@react-native-async-storage/async-storage';
const MessagePage = () => {
    const route = useRoute()
    console.log("route", route)
    const [messages, setMessages] = useState([]);
    const [user, setUser] = useState({});
    const [email, setEmail] = useState('');
    //const [messages, setMessages] = useState([]);
    // useEffect(() => {
    //     const querySnapShot = firestore()
    //         .collection('chats')
    //         .doc('123456789')
    //         .collection('messages')
    //         .orderBy("createdAt", 'desc');
    //     querySnapShot.onSnapshot(snapShot => {
    //         const allMsg = snapShot.docs.map(docSnap => {
    //             // const data = docSnap.data()
    //             return {
    //                 ...docSnap.data(),
    //                 createdAt: new Date()
    //             }
    //         })
    //         setMessages(allMsg)
    //     })


    // }, [])
    useEffect(() => {
        getUser();

        // For real time updates
        const subscribe = firestore()
            .collection('chatId')
            .onSnapshot((querySnapshot) => {
                querySnapshot.docChanges().forEach((change) => {
                    if (change.type === 'added') {
                        let data: any = change.doc.data();
                        data.createdAt = data.createdAt.toDate();
                        setMessages((prevMessage) => GiftedChat.append(prevMessage, data));
                    }
                });
            });

        return () => subscribe();
    }, []);
    // const onSend = messageArray => {
    //     console.log("messageArray", messageArray)
    //     const msg = messageArray[0];
    //     const myMsg = {
    //         ...msg,
    //         senderId: route.key,
    //         receiverId: route.key,
    //     }
    //     setMessages(previousMessages => GiftedChat.append(previousMessages, myMsg))
    //     firestore()
    //         .collection('chats')
    //         .doc('123456789')
    //         .collection("messages")
    //         .add({
    //             ...myMsg,
    //             createdAt: firestore.FieldValue.serverTimestamp()
    //         })
    // }
    async function getUser() {
        let userLocal = await AsyncStorage.getItem('user');
        if (userLocal) setUser(JSON.parse(userLocal));
    }

    async function handlePress() {
        let _id = base64.encode(email);
        let userLocal = { id: _id, email: email };
        await AsyncStorage.setItem('user', JSON.stringify(userLocal));
        setUser(userLocal);
    }

    // Store message in firestore
    function send(message: IMessage[]) {
        firestore().collection('chatId').doc(Date.now().toString()).set(message[0]);
    }

    if (Object.keys(user).length == 0) {
        return (
            <View style={styles.container}>
                <TextInput
                    placeholder="Enter your Email"
                    value={email}
                    onChangeText={setEmail}
                    style={styles.textInput}
                />
                <Button title="Sign In" onPress={handlePress} />
            </View>
        );
    }
    return (
        // <View style={{ flex: 1, backgroundColor: 'white' }}>
        //     <GiftedChat
        //         messages={messages}
        //         onSend={messages => onSend(messages)}
        //         user={{
        //             _id: 1,
        //             //  _id:route.params.data.myId
        //         }}
        //         alwaysShowSend={true}
        //         renderSend={props => {
        //             return (
        //                 <View style={{ flexDirection: 'row', alignItems: 'center', height: 60 }}>
        //                     {/* <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', height: 60 }}>
        //                         <Image source={require('../Images/gallery.png')}
        //                             style={{ height: 20, width: 20, tintColor: '#ACE1AF', marginRight: 15, }}
        //                         />
        //                     </TouchableOpacity> */}
        //                     <Send {...props} containerStyle={{ justifyContent: 'center' }}>
        //                         <Image source={require('../Images/paper-plane.png')}
        //                             style={{ height: 20, width: 20, tintColor: '#ACE1AF', marginRight: 15, }}
        //                         />

        //                     </Send>
        //                 </View>
        //             )
        //         }}
        //         renderBubble={(props) => {
        //             return <Bubble {...props} wrapperStyle={{
        //                 right: {
        //                     backgroundColor: '#ACE1AF'
        //                 }
        //             }} />
        //         }}
        //     />
        // </View>
        <View style={styles.chatContainer}>
            <GiftedChat
                messages={messages}
                onSend={(message) => send(message)}
                user={{
                    _id: user.id,
                }}
            />
        </View>
    )
}

export default MessagePage

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    textInput: {
        height: 40,
        width: '100%',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
    },
    chatContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
})