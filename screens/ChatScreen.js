import { View, TouchableOpacity } from 'react-native'
import { signOut } from 'firebase/auth'
import React, { useLayoutEffect, useState, useCallback, useEffect } from 'react'
import { db, auth } from '../firebase.js'
import { MaterialIcons } from '@expo/vector-icons';
import { Avatar } from 'react-native-elements';
import { GiftedChat } from 'react-native-gifted-chat';
import { query, orderBy, collection, addDoc, getDocs } from "firebase/firestore"; 

const ChatScreen = ({ navigation }) => {
    const [messages, setMessages] = useState([]);
    const chatsRef = collection(db, "chats");

    useLayoutEffect(() => {
        const fetchData = async () => {
            const q = query(chatsRef, orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);

            setMessages(
                querySnapshot.docs.map((doc) => ({
                    _id: doc.data()._id,
                    createdAt: doc.data().createdAt.toDate(),
                    text: doc.data().text,
                    user: doc.data().user,
                }))
            );
        }
        
        fetchData().catch(console.error);
    });
  
    const onSend = useCallback((messages = []) => {
      setMessages(previousMessages => GiftedChat.append(previousMessages, messages));
      const {
        _id,
        createdAt,
        text,
        user,
      } = messages[0];

      addDoc(chatsRef, {
        _id,
        createdAt,
        text,
        user,
      });
    }, [])

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <View style={{
                    marginLeft: 20
                }}>
                    <Avatar
                        rounded
                        source={{
                            uri: auth?.currentUser?.photoURL
                        }}
                    />
                </View>
            ),
            headerRight: () => (
                <TouchableOpacity style={{
                    marginRight: 30
                }}
                    onPress={signOutUser}
                >
                    <MaterialIcons name="logout" size={24} color="black" />
                </TouchableOpacity>
            )
        });
    }, [])

    const signOutUser = () => {
        signOut(auth).then(() => {
            // Sign-out successful.
            navigation.replace("Login");
        }).catch((error) => {
            // An error happened.
        });
    };

    return (
        <GiftedChat
            messages={messages}
            showAvatarForEveryMessage={true}
            onSend={messages => onSend(messages)}
            user={{
                _id: auth?.currentUser?.email,
                name: auth?.currentUser?.displayName,
                avatar: auth?.currentUser?.photoURL,
            }}
        />
    );
}

export default ChatScreen