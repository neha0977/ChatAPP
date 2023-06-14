import {
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableOpacity,
    SafeAreaView,
    Image,
    ActivityIndicator,
    TextInput
} from 'react-native'
import React, { useState, useEffect } from 'react'
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MessageListPage = ({ navigation }) => {
    useEffect(() => {
        getUsers()
    }, [])
    const [users, setUsers] = useState(null)
    const [isLoading, setisLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [filteredDataSource, setFilteredDataSource] = useState([]);
    const [masterDataSource, setMasterDataSource] = useState([]);

    // get all users from firebase 
    const getUsers = async () => {
        setisLoading(true);
        const userid = await AsyncStorage.getItem('@yUID');
        const querySanp = await firestore().collection('users').where('uid', '!=', userid).get()
        setisLoading(false);
        const allUsers = querySanp.docs.map(docSnap => docSnap.data())
        setUsers(allUsers)
        setFilteredDataSource(allUsers);
        setMasterDataSource(allUsers);
        console.log("allUsers", allUsers)
    }
    const RenderCard = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => navigation.navigate('MessagePage', {
                name: item.name, uid: item.uid,
                imageUser: item.image,
                status: typeof (item.status) == "string" ? item.status : item.status.toDate().toString()
            })}>
                <View style={styles.mycard}>
                    <Image source={{ uri: item.image }} style={styles.img} />
                    <View>
                        <Text style={styles.text}>
                            {item.name}
                        </Text>
                        <Text style={styles.text}>
                            {item.email}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    const searchFilterFunction = (text) => {
        if (text) {
            const newData = masterDataSource.filter(function (item) {
                const itemData = item.name
                    ? item.name.toUpperCase()
                    : ''.toUpperCase();
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
            setFilteredDataSource(newData);
            setSearch(text);
        } else {
            setFilteredDataSource(masterDataSource);
            setSearch(text);
        }
    };

    const ItemSeparatorView = () => {
        return (
            <View
                style={{
                    height: 0.5,
                    width: '100%',
                    backgroundColor: '#C8C8C8',
                }}
            />
        );
    };

    const ItemView = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => navigation.navigate('MessagePage', {
                name: item.name, uid: item.uid,
                imageUser: item.image,
                status: typeof (item.status) == "string" ? item.status : item.status.toDate().toString()
            })}>
                <View style={styles.mycard}>
                    <Image
                        source={item.image !== null ? { uri: item.image } : require('../Images/user.png')}
                        style={styles.img} />
                    <View>
                        <Text style={styles.text}>
                            {item.name}
                        </Text>
                        <Text style={styles.text}>
                            {item.email}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    };

    return (
        <SafeAreaView style={{ flex: 1, }}>

            <View style={styles.header}>
                <Text style={styles.headertext}>Messages</Text>
            </View>

            <View style={{ backgroundColor: 'white', height: '100%' }}>
                <View style={styles.searchView}>
                    <View style={{ flexDirection: 'row' }}>
                        <Image
                            source={require('../Images/seachicon.png')}
                            style={styles.searchIcon}
                        />
                    </View>
                    <TextInput
                        style={styles.input}
                        onChangeText={(text) => searchFilterFunction(text)}
                        value={search}
                        placeholder="Search Here"
                    />
                </View>

                {
                    filteredDataSource.length > 0 ?
                        <FlatList
                            data={filteredDataSource}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={ItemView}
                        /> : <View style={{ alignItems: 'center' }}>
                            <Text style={styles.text}> Not Found </Text>
                        </View>
                }

            </View>
            {isLoading ? (
                <ActivityIndicator
                    style={{
                        position: "absolute",
                        bottom: 0,
                        top: 0,
                        left: 0,
                        right: 0,
                    }}
                    color="black"
                    size="large"
                />
            ) : null}
        </SafeAreaView>
    )
}

export default MessageListPage

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#ACE1AF',
        height: 40,
        width: '100%',
    },
    headertext:
    {
        fontWeight: 'bold',
        fontSize: 20,
        color: 'white',
        textAlign: 'center'
    },
    img: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    text: {
        fontSize: 18,
        marginLeft: 15,
    },
    mycard: {
        flexDirection: "row",
        margin: 3,
        padding: 4,
        backgroundColor: "white",
        borderBottomWidth: 1,
        borderBottomColor: 'grey'
    },
    input: {
        fontSize: 13,
        color: 'black',
        width: '100%'
    },
    searchView: {
        height: 40,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        margin: 10,
        backgroundColor: '#F0FFF0',
        width: '90%'
    },
    searchIcon: {
        height: 14,
        width: 14,
        tintColor: 'grey',
        marginHorizontal: 10
    }
})