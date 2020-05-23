import React, {Component} from "react"
import { View, Text, StyleSheet, ImageBackground, FlatList, TouchableOpacity, Platform, Alert } from "react-native"
// Importando stylos
import commonStyles from '../commonStyles'
// importar imagem
import todayImage from '../../assets/imgs/today.jpg'
// Traduzir o valor das datas para PT-BR
import moment from 'moment'
import 'moment/locale/pt-br'

// Importando os Components
import Task from '../components/Task'
import AddTask from './AddTask'

// importando os Icones
import Icon from 'react-native-vector-icons/FontAwesome'

import AsyncStorage from '@react-native-community/async-storage'
import { server, showError, showSuccess } from '../common';
import axios from "axios"

const initState = { showDoneTasks: true, showAddTask: false, visibleTasks: [], tasks:[] }

export default class TaskList extends Component {
  // estado
  state = { ...initState }
  
  // função ciclo de vida
  componentDidMount = async () => {
    const stateString = await AsyncStorage.getItem('TasksState')
    const savedState = JSON.parse(stateString) || initState
    this.setState({ showDoneTasks: savedState.showDoneTasks }, this.filterTasks)
    this.loadTasks()
  }

 // carregar as tasks do banco de dados 
  loadTasks = async () => {
    try {
      const maxDate = moment().format('YYYY-MM-DD 23:59:59')
      const res = await axios.get(`${server}/tasks?date=${maxDate}`)
      this.setState({tasks: res.data}, this.filterTasks)
    } catch (e) {
      showError(e)
    }
  }

  // função para fazer a alternancia para ver as tasks concluidas.
  toggleFilter = () => {
    this.setState({showDoneTasks: !this.state.showDoneTasks}, this.filterTasks)
  }

  // Função para trazer todas as tasks pendentes
  isPending = task => {
    return task.doneAt === null
  }

  // filtrar as tasks
  filterTasks  = () => {
    let visibleTasks = null
    if (this.state.showDoneTasks) {
      visibleTasks = [...this.state.tasks]
    } else {      
      visibleTasks = this.state.tasks.filter(this.isPending)
    }
    this.setState({visibleTasks})
    AsyncStorage.setItem('TasksState', JSON.stringify({
      showDoneTasks: this.state.showDoneTasks
    }))
  }

  // marcar e desmarcar a task como concluido
  toggleTask = async taskId => {
    try {
      await axios.put(`${server}/tasks/${taskId}/toggle`)
      this.loadTasks()
    } catch (e) {
      showError(e)
    }
       
    // const tasks = [...this.state.tasks]
    // tasks.forEach(task => {
    //   if (task.id === taskId) {
    //     task.doneAt = task.doneAt ? null : new Date()
    //   }
    // })
    // // O SetState recebe como 2nd parametro uma callback então para que depois de habilitar o filtro
    // // e selecionar a tarefa como concluida ele deve esconde-la.
    // this.setState({tasks: tasks}, this.filterTasks)
  }

  // função para add nova task
  addTask = async newTask => {
    try {
      if(!newTask.desc || !newTask.desc.trim()) {
        Alert.alert('Dados Inválidos', 'Descrição não informada!')
        return
      }
      await axios.post(`${server}/tasks`, { desc: newTask.desc, estimateAt: newTask.date })
      this.setState({showAddTask: false}, this.loadTasks)
    } catch (e) {
      showError(e)
    }
  }

  // Remover a task
  deleteTask = async id => {
    try {
      await axios.delete(`${server}/tasks/${id}`)
      this.loadTasks()
    } catch (e) {
      showError(e)
    }
    // const tasks = this.state.tasks.filter(task => task.id !== id)
    // this.setState({tasks}, this.filterTasks)
  }

  render () {
    const today = moment().locale('pt-br').format('ddd, D [de] MMMM')
    return (
      <View style={styles.container}>
        <AddTask isVisible={this.state.showAddTask}
                  onCancel={() => this.setState({showAddTask: false})}
                  onSave={this.addTask} />

        <ImageBackground style={styles.background} // Header com a imagem 
                         source={todayImage} >
          <View style={styles.iconBar}>
            <TouchableOpacity onPress={this.toggleFilter}>
              <Icon name={this.state.showDoneTasks ? 'eye' : 'eye-slash' } // Icone
                    size={25}
                    color={commonStyles.colors.secondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.titleBar}>
            <Text style={styles.title}>Hoje</Text>
            <Text style={styles.subtitle}>{today}</Text>
          </View>
        </ImageBackground>
        
        <View style={styles.taskList}>
          <FlatList data={this.state.visibleTasks}
                    keyExtractor={item => `${item.id}`}
                    renderItem={({item}) => <Task {...item} onToggleTask={this.toggleTask} onDelete={this.deleteTask} /> } />
        </View>

        
        <TouchableOpacity style={styles.addButton} // Botão para adicionar uma nova tarefa
                          activeOpacity={0.7} // mexendo na opacidade quando clicado
                          onPress={() => this.setState({showAddTask: true})} >
          <Icon name="plus" size={25} color={commonStyles.colors.secondary} /> 
        </TouchableOpacity>

      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  background: {
    flex: 3,
  },
  taskList: {
    flex: 7,
  },
  titleBar: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  title: {
    fontFamily: commonStyles.fontFamily,
    color: commonStyles.colors.secondary,
    fontSize: 50,
    marginLeft: 20,
    marginBottom: 20,
  },
  subtitle: {
    fontFamily: commonStyles.fontFamily,
    color: commonStyles.colors.secondary,
    fontSize: 20,
    marginLeft: 20,
    marginBottom: 20,
  },
  iconBar: {
    flexDirection: 'row',
    marginHorizontal: 20,
    justifyContent: 'flex-end',
    // alterando a margin de acordo com a plataforma.
    marginTop: Platform.OS === 'ios' ? 40 : 10
  },
  addButton: {
    position: 'absolute',
    right: 30,
    bottom: 30,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: commonStyles.colors.today,
    justifyContent: 'center',
    alignItems: 'center',
  }

})