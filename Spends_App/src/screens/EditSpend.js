import React, {useEffect, useState} from "react";
import { Text, View, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import CurrencyInput from 'react-native-currency-input';
import Tooltip from "react-native-walkthrough-tooltip";

import { useApi } from "../Hooks/useApi";
import { BackCard } from "../components/BackCard";

import User from "../class/User";

import BouncyCheckbox from "react-native-bouncy-checkbox";

import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation, useRoute } from "@react-navigation/native";
import { TelaSimples } from "../components/TelaSimples";
import { ScrollView } from "react-native";

import { PopupNovaTag } from "../components/PopUpNovaTag";

import colors from "../styles/colors";
import { ToastAndroid } from "react-native";



const EditSpend = () =>{

    const [valor_spend, setValorSpend] = useState(null);
    const [descricao_spend, setDescricaoSpend] = useState("");
    const [tp_descricao_spend, setTpDescricaoSpend]= useState(false);
    const [tp_valor_spend, setTpValorSpend]= useState(false);
    const [tp_texto_descricao_spend, setTpTextoDescricaoSpend]= useState("");
    const [tp_texto_valor_spend, setTpTextoValorSpend]= useState("");
    const [cadastrar_spend, setCadastrarSpend] = useState(false);
    const [gasto_fixo, setGastoFixo] = useState(false);
    const [open_tags, setOpenTags] = useState(false);
    const [value_tags, setValueTags] = useState(29);
    const [items_tags, setItemsTags] = useState([]);
    const [tags_selector, setTagsSelector] = useState(null);
    const [num_cadastro, setNumCadastro] = useState(0);
    const [user_id, setUserId] = useState(null);

    const route = useRoute();
    const navigation = useNavigation();

    const loadTags = async () =>{
        try{
            const result = await useApi(`/tags?owner_id=${user_id}`, null, 'GET');
            if(result.status == 200){
                if(result.data[0]){
                    setItemsTags(result.data);
                    // console.log(result.data, user_id);
                }
            }
        }catch(e){
            console.log(e)
        }
    };

    useEffect(()=>{
        setUserId( User.getUser().user_id );
        loadTags();
        setValorSpend(route.params.valor);
        setDescricaoSpend(route.params.descricao);
        setGastoFixo(route.params.fixado);
        setValueTags(route.params.tag);
        // console.warn(route.params.spend_id);
    }, []);

    useEffect(()=>{
        async function fetchData(){
            if(valor_spend !== null && descricao_spend !== "" && num_cadastro>0){
                
                const bodyRequest = {
                    owner_id: user_id,
                    tag_id: value_tags,
                    description: descricao_spend,
                    value: valor_spend,
                    fixed: gasto_fixo,
                    spend_id:route.params.spend_id
                }
                try{
                    const result = await useApi("/spends/edit", bodyRequest, "POST");
                    if(result.status == 200){
                        navigation.navigate("Home");
                        ToastAndroid.show("Despesa alterada com sucesso", ToastAndroid.SHORT);
                        
                    }else{
                        ToastAndroid.show("Falha ao editar despesa", ToastAndroid.SHORT);
                    }
                }catch(e){
                    ToastAndroid.show("Falha ao editar despesa", ToastAndroid.SHORT); 
                } 
            }
        }
        fetchData();
    }, [cadastrar_spend]);

    return(
        (
            <TelaSimples titulo='Editar Despesa'>
                <View style={{flex:1,  paddingTop:10}}>
                    <View style={{flex:0.25, paddingBottom:5}}>
                        <BackCard>
                            <View>
                                <Text style={{paddingLeft:5, fontSize:22, paddingBottom:10, marginRight:10, color:colors.branco}}>Valor</Text>
                            </View>
                                <View style={{flex:1, marginBottom:20, marginHorizontal:20}}>
                                    <Tooltip
                                        isVisible={tp_valor_spend}
                                        content={<Text>{tp_texto_valor_spend}</Text>}
                                        placement="top"
                                        onClose={() => setTpValorSpend(false)}
                                    >
                                        <CurrencyInput
                                            value={valor_spend}
                                            onChangeValue={setValorSpend}
                                            prefix="R$"
                                            delimiter="."
                                            separator=","
                                            precision={2}
                                            style = {{  
                                                width:'100%',
                                                fontSize:40,
                                                fontWeight:'bold',
                                                borderBottomColor:colors.preto_2,
                                                borderBottomWidth:0.9,
                                                borderBottomColor:colors.branco,
                                                color:colors.branco,
                                                textAlign:'center'
                                                        
                                            }}
                                            keyboardType="numeric"
                                            placeholder="R$0,00"
                                            placeholderTextColor={colors.branco}
                                        />
                                    </Tooltip>
                                </View>
                        </BackCard>
                    </View>

                    <View style={{flex:0.25, paddingBottom:5}}>
                        <BackCard>
                            <View>
                                <Text style={{paddingLeft:5, fontSize:22, paddingBottom:10, marginRight:10, color:colors.branco}}>Descrição</Text>
                            </View>
                            <View style={{flex:1, paddingVertical:10, width:'100%', justifyContent:'space-between'}}>
                                <View style={{paddingBottom:0}}>
                                    <Tooltip
                                        isVisible={tp_descricao_spend}
                                        content={<Text>{tp_texto_descricao_spend}</Text>}
                                        placement="top"
                                        onClose={() => setTpDescricaoSpend(false)}
                                    >
                                        <TextInput
                                            style = {{  width:'100%',
                                                        fontSize:20,
                                                        fontWeight:'bold',
                                                        color:colors.preto,
                                                        backgroundColor:colors.branco,
                                                        borderRadius:8
                                                                
                                                    }}
                                            value={descricao_spend}
                                            placeholderTextColor={colors.branco}
                                            onChangeText={(text) => { setDescricaoSpend(text) } }
                                        />
                                    </Tooltip>
                                </View>
                                
                            </View>
                            
                        </BackCard>
                    </View>
                    
                    
                    <View style={{flex:0.35}}>
                        <BackCard>
                        
                            <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:20}}>
                                <Text style={{paddingLeft:5, fontSize:22, paddingBottom:10, marginRight:10, color:colors.branco}}>Categoria</Text>
                                <PopupNovaTag user_id = {user_id} funcReload = {loadTags} tag_id={value_tags}/>  
                            </View>
                            <View style={{flex:1}}>
                                <ScrollView contentContainerStyle ={[styles.list]}>
                                    {items_tags.map((item, i)=>(
                                        <TouchableOpacity onPress={()=>{ setValueTags(item.id) }} style={[styles.listItem, {backgroundColor: item.id == value_tags ? colors.secundaria : colors.terciaria}]} key={i}>
                                            <Text style={{color:colors.branco, fontSize:18}}>{item.label}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        </BackCard>
                    </View>
                    
                    <View style={{flex:0.2, flexDirection:'row',  alignItems:'baseline', marginTop:5}}>
                        <BackCard>
                            <BouncyCheckbox
                                size={25}
                                fillColor={colors.primaria}
                                text="Fixar despesa"
                                unfillColor={colors.branco}
                                iconStyle={{ borderColor: "black" }}
                                innerIconStyle={{ borderWidth: 0, borderRadius: 0}}
                                textStyle={{ fontFamily: "JosefinSans-Regular", color:colors.branco, textDecorationLine: "none" }}
                                style={{paddingTop:10, paddingBottom:10}}
                                onPress={(isChecked) => {setGastoFixo(isChecked)}}
                            />
                        </BackCard>
                    </View>

                    <View style={{flex:0.2, justifyContent:'center', alignItems:'center'}}>
                        <TouchableOpacity
                            style={styles.botaoSave}
                            onPress = { () => {
                                setNumCadastro(1);
                                setCadastrarSpend(!cadastrar_spend);
                            }}
                        >
                            <Icon name='edit' size={40} color={colors.branco}/>
                        </TouchableOpacity>
                    </View>
                </View>
            </TelaSimples>
        )
    )
};

const styles = StyleSheet.create({
    list:{
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        justifyContent:'flex-start'
        
    },
    listItem:{
        flexDirection:'row',
        justifyContent:'center',
        alignSelf: 'flex-start',
        borderColor:colors.cinza_1,
        borderWidth:1,
        borderRadius:5,
        paddingHorizontal:5,
        paddingVertical:5,
        margin:2
    },
    botaoSave:{
        borderRadius:100,
        backgroundColor:colors.primaria,
        paddingHorizontal:25,
        paddingVertical:25
        
    },
    maisTag:{
        borderWidth: 1,
        borderColor: colors.preto_2,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal:5,
        paddingVertical:5,
        position: 'absolute',
        backgroundColor: colors.branco,
        borderRadius: 100,
    }
})

export default EditSpend;