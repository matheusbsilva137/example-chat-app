import React, { useState, useEffect } from 'react'
import { View, StyleSheet } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase.js';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const signIn = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                alert(errorMessage);
            });
    };

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // Usuário logou
                navigation.replace("Chat");
            } else {
                // Usuário deslogou
                navigation.canGoBack() && navigation.popToTop();
            }
        });
    }, []);
    
    
    return (
        <View style={styles.container}>
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
            <Button
                title={"Entrar"}
                style={styles.button}
                onPress={signIn}
            />
            <Button
                title={"Registrar"}
                style={styles.button}
                onPress={() => navigation.navigate("Register")}
            />
        </View>
    );
};

export default LoginScreen;

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