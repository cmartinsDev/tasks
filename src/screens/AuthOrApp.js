import React, { Component } from 'react'
import { View, ActivityIndicator, StyleSheet } from 'react-native'
import axios from 'axios'
import AsyncStorage from '@react-native-community/async-storage'

export default class AuthOrApp extends Component {

  /**************************************************************
   * Author: Carlos Martins
   * Metodo responsavel por saber se o usuario ja estava logado.
   * Caso Usuario logado então é redirecionado para a tela Home.
   * Caso contrario, então o usuario deve se autenticar (tela: Auth)
  **************************************************************/
  componentDidMount = async () => {
    // Usando AsyncStorage para obter o token
    // Pois validamos se o usuario esta logado pelo token
    const userDataJson = await AsyncStorage.getItem('userData')
    let userData = null 
    try {
      userData = JSON.parse(userDataJson)
      
    } catch (e) {
      // userData é invalido
    }
    if (userData && userData.token) {
      axios.defaults.headers.common['Authorization'] = `bearer ${userData.token}`
      this.props.navigation.navigate('Home', userData)
    } else {
      this.props.navigation.navigate('Auth')
    }
  }

  render () {
    return (
      <View style={styles.container} >
        <ActivityIndicator size='large' />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
})