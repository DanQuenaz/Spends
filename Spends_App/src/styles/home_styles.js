import { StyleSheet } from "react-native";

import colors from "./colors";

const home_style = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    container_sem_planilhas:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        marginTop:'5%'
    },
    container_top:{
        flex:2.3,
        backgroundColor:colors.primaria,
        width: '100%' 
    },
    container_under:{
        flex:9.7,
        backgroundColor:colors.branco,
        width: '100%' 
    },
    bem_vindo:{
        color:colors.branco,
        fontSize:24,
        marginLeft:10,
        marginTop:20
    },
    botao:{
        width:300,
        height:42,
        backgroundColor:colors.secundaria,
        marginTop:30,
        borderRadius:5,
        alignItems:'center',
        justifyContent:'center'
    },
    textoBotao:{
        fontSize:16,
        fontWeight:'bold',
        color:colors.branco
    }

});

export default home_style;