import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import {Home, Sheets, Config, Charts} from '../screens'
import Icon from 'react-native-vector-icons/Ionicons'
import Icon2 from 'react-native-vector-icons/Entypo'
import Icon3 from 'react-native-vector-icons/FontAwesome'
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons'

import colors from "../styles/colors";

const Tab = createBottomTabNavigator();

const HomeIndex = () => {
    return (
        <Tab.Navigator screenOptions={{
            headerShown:false,
            tabBarStyle:{
                position:'absolute',
                marginTop:'2%',
                height:50,
                ...styles.shadow
            },
            tabBarShowLabel:false,

        }} >
            <Tab.Screen options={{
                tabBarIcon:({focused})=>(
                    <View style={{alignItems:'center'}} >
                         <IconMaterialIcons name={focused ? 'attach-money' : 'attach-money'} size={20} color={focused ? colors.branco:colors.cinza_3} />
                         <Text style={{color: focused ? colors.branco:colors.cinza_3,fontFamily:'Roboto-Bold', fontSize:10}} >Despesas</Text>       
                    </View>
                )
            }}  name="Home" component={Home}/>
            
            <Tab.Screen options={{
                tabBarIcon:({focused})=>(
                    <View style={{alignItems:'center'}}>
                        <Icon2 name={focused ? 'archive':'archive'} size={20} color={focused ? colors.branco:colors.cinza_3} />
                        <Text style={{color:focused ? colors.branco:colors.cinza_3, fontSize:10, fontFamily:'Roboto-Bold'}} >Planilhas</Text>
                    </View>
                )
            }} name="Sheets" component={Sheets} />

            <Tab.Screen options={{
                tabBarIcon:({focused})=>(
                    <View style={{alignItems:'center'}} >
                         <Icon name={focused ? 'ios-bar-chart-outline' : 'ios-bar-chart-outline'} size={20} color={focused ? colors.branco:colors.cinza_3} />
                         <Text style={{color: focused ? colors.branco:colors.cinza_3,fontFamily:'Roboto-Bold', fontSize:10}} >Gráficos</Text>       
                    </View>
                )
            }}  name="Charts" component={Charts}/>

            <Tab.Screen options={{
                tabBarIcon:({focused})=>(
                    <View style={{alignItems:'center'}} >
                         <Icon3 name={focused ? 'gear' : 'gear'} size={20} color={focused ? colors.branco:colors.cinza_3} />
                         <Text style={{color: focused ? colors.branco:colors.cinza_3,fontFamily:'Roboto-Bold', fontSize:10}} >Config</Text>       
                    </View>
                )
            }}  name="Config" component={Config}/>
        </Tab.Navigator>
    )
}

export default HomeIndex

const styles = StyleSheet.create({
    shadow:{
        elevation:30,
        shadowColor:colors.preto,
        backgroundColor:colors.primaria,
        borderWidth:1,
        borderColor:'transparent',
    }
})