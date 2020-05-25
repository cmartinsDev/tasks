import React from 'react'
import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import { createDrawerNavigator } from 'react-navigation-drawer'

// importando as telas
import Auth from './screens/Auth'
import TaskList from './screens/TaskList'
import Menu from './screens/Menu'
import commonStyles from './commonStyles'
import AuthOrApp from './screens/AuthOrApp';

const menuConfig = {
  initialRouteName: 'Today',
  contentComponent: Menu,
  contentOptions: {
    labelStyle: {
      fontFamily: commonStyles.fontFamily,
      fontWeight: 'normal',
      fontSize: 20,
    },
    activeLabelStyle: {
      fontWeight: 'bold',
      color: '#080'
    },
  }
}

const menuRoutes = {
  Today: {
    name: 'Today',
    screen: props => <TaskList title='Hoje' daysAhead={0} {...props} />,
    navigationOptions: {
      title: 'Hoje'
    }
  },
  Tomorrow: {
    name: 'Tomorrow',
    screen: props => <TaskList title='Amanhã' daysAhead={1} {...props} />,
    navigationOptions: {
      title: 'Amanhã'
    }
  },
  Week: {
    name: 'Week',
    screen: props => <TaskList title='Semana' daysAhead={7} {...props} />,
    navigationOptions: {
      title: 'Semana'
    }
  },
  Month: {
    name: 'Month',
    screen: props => <TaskList title='Mês' daysAhead={30} {...props} />,
    navigationOptions: {
      title: 'Mês'
    }
  }
}

const menuNavigator = createDrawerNavigator(menuRoutes, menuConfig)

// Routas
const mainRoutes = {
  AuthOrApp: {
    name: 'AuthOrApp', // Component para ver se o user ja esta logado ou não
    screen: AuthOrApp
  },
  Auth: {
    name: 'Auth',
    screen: Auth
  },
  Home: {
    name: 'Home',
    screen: menuNavigator
  }
}

const mainNavigator = createSwitchNavigator(mainRoutes, {initialRouteName: 'AuthOrApp'})

export default createAppContainer(mainNavigator)