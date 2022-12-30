import { StyleSheet } from "react-native";
import colors from "./colors";

const login_style = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:colors.primaria
    },
    container_withe:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:colors.branco
    },
    input:{
        marginTop:10,
        width:300,
        backgroundColor:colors.branco,
        fontSize:16,
        fontWeight:'bold',
        borderRadius:5,
        color:colors.preto
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
    botao_lista:{
        width:100,
        height:42,
        backgroundColor:colors.secundaria,
        marginTop:5,
        marginBottom:5,
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



export default login_style;