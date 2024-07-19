import React, { createContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from "@react-native-firebase/auth";
import { useNavigation } from '@react-navigation/native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

export const AuthUserContext = createContext({});

export const AuthUserProvider = ({ children }) => {
  const navigation = useNavigation();
  const [isGoogleSignInAttempted, setIsGoogleSignInAttempted] = useState(false);

  async function signIn(email, password) {
    if (email && password) {
      try {
        const userCredential = await auth().signInWithEmailAndPassword(email, password);
        if (userCredential && userCredential.user.emailVerified) {
          await AsyncStorage.setItem('userEmail', email);
          await AsyncStorage.setItem('userPassword', password);
          navigation.navigate('AuthenticatedScreens');
        } else {
          Alert.alert("Email não verificado. Por favor, verifique seu email.");
        }
      } catch (error) {
        Alert.alert("Usuário não encontrado. Email ou senha inválidos.");
      }
    } else {
      Alert.alert("Por favor, preencha todos os dados.");
    }
  }

  const signOut = async () => {
    try {
      await auth().signOut();
      await AsyncStorage.removeItem('userEmail');
      await AsyncStorage.removeItem('userPassword');
      await AsyncStorage.removeItem('userEmailGoogle');
      navigation.navigate('SignIn');
    } catch (error) {
      console.error(error);
    }
  };

  const cadastrar = async (name, email, password) => {
    if (name && email && password) {
      try {
        const userCredential = await auth().createUserWithEmailAndPassword(email, password);
        await userCredential.user.sendEmailVerification();
        Alert.alert(`Tudo certo! Um Email foi enviado para ${email}`);
        navigation.navigate('SignIn');
      } catch (error) {
        Alert.alert("O email já está em uso.");
      }
    } else {
      Alert.alert("Por favor, preencha todos os dados.");
    }
  }

  const esqueceuSenhaLogin = async (email) => {
    try {
      if (email) {
        await auth().sendPasswordResetEmail(email);
        Alert.alert(`Um Email foi enviado para ${email}`);
        navigation.navigate('SignIn');
      } else {
        Alert.alert("Por favor, preencha o seu Email.");
      }
    } catch (error) {
      Alert.alert("Por favor, preencha o seu Email corretamente.");
    }
  }

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '1097152160456-ncko3givkgfnhgr9rci2bgi2avt40fi5.apps.googleusercontent.com',
    });

    AsyncStorage.getItem('googleSignInAttempted').then((value) => {
      setIsGoogleSignInAttempted(!!value);
    });
  }, []);

  const signInWithGoogle = async (userEmailGoogle = null) => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn(userEmailGoogle);
      const googleCredential = auth.GoogleAuthProvider.credential(userInfo.idToken);
      await auth().signInWithCredential(googleCredential);
      
      // Extrair e salva o email do objeto userInfo
      const userEmailGoogle = userInfo.user.email;
      await AsyncStorage.setItem('userEmailGoogle', userEmailGoogle);
      navigation.navigate('AuthenticatedScreens');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AuthUserContext.Provider value={{ signIn, signOut, cadastrar, esqueceuSenhaLogin, signInWithGoogle }}>
      {children}
    </AuthUserContext.Provider>
  );
};
