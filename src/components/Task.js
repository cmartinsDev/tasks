import React from 'react'
import {View, Text, StyleSheet, TouchableWithoutFeedback, TouchableOpacity, Platform} from 'react-native'
import commonStyles from '../commonStyles'
import Icon from 'react-native-vector-icons/FontAwesome'

// importando elemento
import Swipeable from 'react-native-gesture-handler/Swipeable'

// Usando o moment para setar o idioma
import moment from 'moment'
import 'moment/locale/pt-br'

export default props => {
  // Aplicar style para as tarefas completadas (done)
  const doneOrNotStyle = props.doneAt != null ? {textDecorationLine: 'line-through'} : {}

  // Verificando se uma há data completada e então retorna ela
  // caso contrario deve retornar a data estimada
  const date = props.doneAt ? props.doneAt : props.estimateAt
  const formattedDate = moment(date).locale('pt-br').format('ddd, D [de] MMMM')

  // Remover tarefa quando puxa da direita para esquerda
  const getRightContent = () => {
    return (
      <TouchableOpacity style={styles.right} //
                        onPress={() => props.onDelete && props.onDelete(props.id)} >
        <Icon name='trash' size={25} color='#FFF' />
      </TouchableOpacity>
    )
  }

  const getLeftContent = () => {
    return (
      <View style={styles.left}>
        <Icon style={styles.excludeIcon} name='trash' size={20} color='#FFF' />
        <Text style={styles.excludeText}>Excluir</Text>
      </View>
    )
  }

  return (
    <Swipeable renderRightActions={getRightContent}
               renderLeftActions={getLeftContent} 
               onSwipeableLeftOpen={() => props.onDelete && props.onDelete(props.id)} >
      <View style={styles.container}>      
        <TouchableWithoutFeedback onPress={() => props.onToggleTask(props.id)}>
          <View style={styles.checkContainer}>
            {getCheckView(props.doneAt)}
          </View>
        </TouchableWithoutFeedback>
        
        <View>
          <Text style={[styles.desc, doneOrNotStyle]}>{props.desc}</Text>
          <Text style={styles.date} >{formattedDate}</Text>      
        </View>
      </View>    
    </Swipeable>

  )
}

// Checkbox para saber se a tarefa foi concluida
function getCheckView(doneAt) {
  if (doneAt != null) {  
    return (
      <View style={styles.done}>
        <Icon name='check' size={20} color="#FFF"></Icon>
      </View>
    )
  } else {
    return (<View style={styles.pending}></View>)
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderColor: '#AAA',
    borderBottomWidth: 1,
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#FFF',
  },
  checkContainer: {
    width: '20%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pending: {
    height: 25,
    width: 25,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#555',
  },
  done: {
    height: 25,
    width: 25,
    borderRadius: 13,
    backgroundColor: '#4D7031',
    alignItems: 'center',
    justifyContent: 'center',
  },
  desc: {
    fontFamily: commonStyles.fontFamily,
    fontSize: 15,
    color: commonStyles.colors.mainText    
  },
  date: {
    fontFamily: commonStyles.fontFamily,
    color: commonStyles.colors.subText,
    fontSize: 12,
  },
  right: {
    backgroundColor: 'red',
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 20
  },
  left: {
    flex: 1,
    backgroundColor: 'red',
    flexDirection: 'row',
    alignItems: 'center',    
  },
  excludeText: {
    fontFamily: commonStyles.fontFamily,
    color: '#FFF',
    fontSize: 20,
    margin: 10,
  },
  excludeIcon: {
    marginLeft: 10
  },

})