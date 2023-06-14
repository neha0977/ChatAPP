import { StyleSheet, Text, View } from 'react-native'
import React, { useState, useEffect, } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
const ChatPage = ({ user, route }) => {
    const uid = route.params.uid;
    const name = route.params.name;
    console.log(user, uid, name)
    const [messages, setMessages] = useState([]);

    const onSend = (msgArray) => {
        const msg = msgArray[0]
        const usermsg = {
            ...msg,
            sentBy: user.uid,
            sentTo: uid,
            createdAt: new Date()
        }
        setMessages(previousMessages => GiftedChat.append(previousMessages, usermsg))
        // const chatid = uid > user.uid ? user.uid + "-" + uid : uid + "-" + user.uid
        //console.log("chatid", chatid)
        firestore().collection('Chats')
            .doc('123456789')
            .collection('messages')
            .add({ ...usermsg, createdAt: firestore.FieldValue.serverTimestamp() })

        // setMessages(previousMessages => GiftedChat.append(previousMessages, msgArray))
        // const { _id, createdAt, text, user } = msgArray[0];    
        // console.log("_id, createdAt, text, user", _id, createdAt, text, user, msgArray)

    }
    return (
        <GiftedChat
            messages={messages}
            onSend={messages => onSend(messages)}
            user={{
                _id: auth().currentUser.uid
            }}
        />
    )
}

export default ChatPage

const styles = StyleSheet.create({})