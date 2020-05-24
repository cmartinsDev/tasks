import React from 'react'
import { ScrollView, StyleSheet, View, Platform, Text } from 'react-native'
import { DrawerItems } from 'react-navigation-drawer'
import { Gravatar } from 'react-native-gravatar';
import commonStyles from '../commonStyles';

export default props => {
  // Na tela de Auth.js no método sigin é passado o res.data
  // Nesse caso estamos usando ele
  const optionGravatar = {
    email: props.navigation.getParam('email'),
    secure: true
  }

  return (
    <ScrollView>
      <View style={styles.header}>
      <Text style={styles.title}>Tasks</Text>
        <Gravatar style={styles.avatar} options={optionGravatar}/>
        <View style={styles.userInfo}>
          <Text style={styles.name}>{props.navigation.getParam('name')}</Text>
          <Text style={styles.email}>{props.navigation.getParam('email')}</Text>
        </View>
      </View>
      <DrawerItems {...props} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  header: {
    borderBottomWidth: 1,
    borderColor: '#DDD'
  },
  title: {
    color: '#000',
    fontFamily: commonStyles.fontFamily,
    fontSize: 30,
    paddingTop: Platform.OS === 'ios' ? 70 : 30,
    padding: 10,
  },
  avatar: {
    width: 60,
    height: 60,
    borderWidth: 3,
    borderRadius: 30,
    margin: 10,
    backgroundColor: '#222'
  },
  userInfo: {
    marginLeft: 10,
  },
  name: {
    fontFamily: commonStyles.fontFamily,
    fontSize: 20,
    color: commonStyles.colors.mainText,
    marginBottom: 5,
  },
  email: {
    fontFamily: commonStyles.fontFamily,
    fontSize: 15,
    color: commonStyles.colors.subText,
    marginBottom: 10,
  }
})