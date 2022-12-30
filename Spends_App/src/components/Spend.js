import React, {useEffect, useState} from "react";
import { Text, View, TextInput, TouchableOpacity } from "react-native";
import CurrencyInput from 'react-native-currency-input';
import Tooltip from "react-native-walkthrough-tooltip";
import axios from "axios";

import home_style from "../styles/home_styles";
import colors from "../styles/colors";


const Spend = () =>{

    const [valor_spend, setValorSpend] = useState(null);
    const [descricao_spend, setDescricaoSpend] = useState("");
    const [tp_descricao_spend, setTpDescricaoSpend]= useState(false);
    const [tp_valor_spend, setTpValorSpend]= useState(false);
    const [tp_texto_descricao_spend, setTpTextoDescricaoSpend]= useState("");
    const [tp_texto_valor_spend, setTpTextoValorSpend]= useState("");
    

    return(
        (
            <View
                style={{flex:3,
                    marginTop:50,
                    alignItems:'center'}}
            >
                <Tooltip
                    isVisible={tp_descricao_spend}
                    content={<Text>{tp_texto_descricao_spend}</Text>}
                    placement="top"
                    onClose={() => setTpDescricaoSpend(false)}
                >
                    <TextInput
                        style = {{  width:300,
                                    fontSize:16,
                                    fontWeight:'bold',
                                    borderBottomColor:'#0f0f0f',
                                    borderBottomWidth:1
                                            
                                }}
                        placeholder="Descrição"
                        onChangeText={(text) => { setDescricaoSpend(text) } }
                    />
                </Tooltip>
                <Tooltip
                    isVisible={tp_valor_spend}
                    content={<Text>{tp_texto_valor_spend}</Text>}
                    placement="top"
                    onClose={() => setTpValorSpend(false)}
                >
                    <CurrencyInput
                        value={valor_spend}
                        onChangeValue={setValorSpend}
                        prefix="$"
                        delimiter=","
                        separator="."
                        precision={2}
                        style = {{  width:300,
                            fontSize:16,
                            fontWeight:'bold',
                            borderBottomColor:'#000000',
                            borderBottomWidth:1
                                    
                        }}
                        
                        keyboardType="numeric"
                        placeholder="Valor"
                        onChangeText={(text) => {}}
                    />
                </Tooltip>
                <TouchableOpacity
                    style={home_style.botao}
                    onPress = { () =>{} }
                >
                    <Text>Criar Planilha</Text>
                </TouchableOpacity>
            </View>
            
      
        )
    )
};

export default Spend;