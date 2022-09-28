import React, { useEffect, useState } from 'react'
import { View, StyleSheet } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { createUserWithEmailAndPassword, updateProfile, onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase.js';

const RegisterScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // Usuário logou
                navigation.replace("Chat");
            } else {
                // Usuário deslogou
            }
        });
    }, []);

    const register = () => {
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            updateProfile(auth.currentUser, {
                displayName: name,
                photoURL: imageUrl || 'https://www.trackergps.com/canvas/images/icons/avatar.jpg',
            }).then(() => {
                // Profile updated!
                alert('Registrado');
            });

            navigation.replace("Chat");
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(errorMessage);
        });
    }

    return (
        <View style={styles.container}>
            <Input
                placeholder="Informe seu nome"
                label="Nome"
                leftIcon={{ type: 'material', name: 'badge' }}
                value={name}
                onChangeText={text => setName(text)}
                keyboardType='ascii-capable'
            />
            <Input
                placeholder="Informe seu e-mail"
                label="E-mail"
                leftIcon={{ type: 'material', name: 'email' }}
                value={email}
                onChangeText={text => setEmail(text)}
                keyboardType='email-address'
            />
            <Input
                placeholder="Informe sua senha"
                label="Senha"
                leftIcon={{ type: 'material', name: 'lock' }}
                value={password}
                onChangeText={text => setPassword(text)}
                secureTextEntry
            />
            <Input
                placeholder="Informe a URL da sua imagem de perfil"
                label="Imagem de Perfil"
                leftIcon={{ type: 'material', name: 'face' }}
                value={imageUrl}
                onChangeText={text => setImageUrl(text)}
                keyboardType='url'
            />
            <Button
                title={"Registrar"}
                style={styles.button}
                onPress={register}
            />
        </View>
    );
};

export default RegisterScreen;

const styles = StyleSheet.create({
    button: {
        width: 200,
        marginTop: 10,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 10,
    },
});