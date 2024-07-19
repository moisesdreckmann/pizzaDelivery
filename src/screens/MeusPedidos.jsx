import React from "react";
import { ScrollView, Image, StyleSheet, View, StatusBar } from "react-native";
import Icon from 'react-native-vector-icons/Entypo';
import logo from '../assets/logo.png';

function MeusPedidos() {
    return (
        <View>
            <StatusBar backgroundColor="#A60303" barStyle="light-content" />
            <ScrollView contentContainerStyle={styles.container}>
                <Image source={logo} style={styles.logo} resizeMode="cover" />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'flex-start',
        paddingBottom: 30,
        backgroundColor: '#FEEBE9',
        height: '100%'
    },
    logo: {
        width: '100%',
        height: 100,
        resizeMode: 'contain',
    },
});

export default MeusPedidos;
