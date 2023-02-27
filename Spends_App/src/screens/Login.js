import React, {useEffect, useState} from "react";
import { Text, SafeAreaView, TextInput, TouchableOpacity, Alert, View } from "react-native";
import Tooltip from "react-native-walkthrough-tooltip";
import { useNavigation } from "@react-navigation/native";

import axios from "axios";

import login_style from "../styles/login_styles";
import { useApi } from "../Hooks/useApi";
import { useLocalStorage } from "../Hooks/useLocalStorage";
import { Image } from "react-native";

const Login = () => {
    const [tipo_tela, setTipoTela] = useState("login")
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [tp_email, setTpEmail] = useState(false);
    const [tp_texto_email, setTpTextoEmail] = useState("");
    const [tp_senha, setTpSenha] = useState(false);
    const [tp_texto_senha, setTpTextoSenha] = useState("");
    const [nome, setNome] = useState("");
    const [apelido, setApelido] = useState("");
    const [senha_repetida, setSenhaRepetida] = useState("");
    const [tp_nome, setTpNome] = useState(false);
    const [tp_apelido, setTpApelido] = useState(false);
    const [tp_senha_repetida, setTpSenhaRepetida] = useState(false);
    const [tp_texto_nome, setTpTextoNome] = useState("");
    const [tp_texto_senha_repetida, setTpTextoSenhaRepetida] = useState("");
    const [tp_texto_apelido, setTpTextoApelido] = useState("");

    const navigation = useNavigation();

    const login_click = async () =>{

        var passwordValidator = require('password-validator');
        var emailValidator = require("email-validator");
        
        var schema = new passwordValidator();
        schema
        .is().min(8)                                   
        .is().max(12)  
        .has().uppercase()
        .has().lowercase()
        .has().digits(2)
        .has().not().spaces()
        .is().not().oneOf(['Passw0rd', 'Password123']);

        if(!emailValidator.validate(email)){
            setTpTextoEmail("Email inválido!");
            setTpEmail(true);
            return null;
        }

        if(!schema.validate(senha)){
            setTpTextoSenha("Senha inválida!");
            setTpSenha(true);
            return null;
        }

        const body_request = {
            "email": email,
            "password": senha
        }

        try{
            const result = await useApi("/signin", body_request, "POST");
            const localStorage = useLocalStorage()
            if(result.status == 200){
                axios.defaults.headers.common['Authorization'] = `bearer ${result.data.token}`
                await localStorage.storeData("@TOKEN", result.data.token);
                await localStorage.storeData("@USER_DATA", JSON.stringify(result.data));
                navigation.navigate("HomeIndex");
            }
        }catch(e){
            Alert.alert("Erro ao logar", "Erro ao logar " + e)
        }
    };

    const signup_click = async () =>{
        var passwordValidator = require('password-validator');
        var emailValidator = require("email-validator");
        
        var schema = new passwordValidator();
        schema
        .is().min(8)                                   
        .is().max(12)  
        .has().uppercase()
        .has().lowercase()
        .has().digits(2)
        .has().not().spaces()
        .is().not().oneOf(['Passw0rd', 'Password123']);
        
        if(nome == ""){
            setTpTextoNome("Necessário preencher seu nome completo!");
            setTpNome(true);
            return null;
        }
        if(apelido == ""){
            setTpTextoApelido("Como gostaria de ser chamado?");
            setTpApelido(true);
            return null;
        }
        if(email == ""){
            setTpTextoEmail("Precisamos do seu email :)");
            setTpEmail(true);
            return null;
        }
        if(!emailValidator.validate(email)){
            setTpTextoEmail("Insira um email válido!");
            setTpEmail(true);
            return null;
        }
        if(senha == ""){
            setTpTextoSenha("Preencha sua senha, é para seua segurança!");
            setTpSenha(true);
            return null;
        }
        if(!schema.validate(senha)){
            setTpTextoSenha("Senha precisa ter pelo menos 8 dígitos, letras maiúsculas e minúsculas e números!");
            setTpSenha(true);
            return null;
        }
        if(senha == senha_repetida){
            const body_request = {
                "name":nome,
                "nickname":apelido,
                "email":email,
                "password":senha
            }

            try{
                const result = await useApi("/signup", body_request, "POST");
                if(result.status == 201){
                    Alert.alert("Parabéns", "Sua conta foi criada com sucesso!");
                    setTipoTela("login");
                }
                else if(result.status == 200){
                    Alert.alert("Opa", 'Essa conta já existe. Se esqueceu sua senha, clique em "Esqueci minha senha"');
                    setTipoTela("login");
                }
            }catch(e){
                Alert.alert("Erro ao logar", "Erro ao logar " + e)
                (e)
            }

        }else{
            setTpTextoSenhaRepetida("As senhas estão diferentes :(");
            setTpSenhaRepetida(true);
            return null;
        } 
    };

    const corpo_login = () =>{
        
        if(tipo_tela == "login"){
            return (
                <View>
                    
                    <Tooltip
                        isVisible={tp_email}
                        content={<Text>{tp_texto_email}</Text>}
                        placement="top"
                        onClose={() => setTpEmail(false)}
                    >
                        <TextInput style={login_style.input}
                            placeholder="Email"
                            onChangeText={(text) => setEmail(text)}
                        />
                    </Tooltip>
                    
                    <Tooltip
                        isVisible={tp_senha}
                        content={<Text>{tp_texto_senha}</Text>}
                        placement="top"
                        onClose={() => setTpSenha(false)}
                    >
                        <TextInput 
                            style={login_style.input}
                            secureTextEntry={true}
                            placeholder="Senha"
                            onChangeText={(text) => setSenha(text)}
                        />
                    </Tooltip>
                    
                    <TouchableOpacity 
                        style={login_style.botao}
                        onPress = { login_click }
                    >
                        <Text style={login_style.textoBotao}>LOGIN</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{marginTop:'3%', alignSelf:'center'}} 
                        onPress = { () => {setTipoTela("logon")} }
                    >
                        <Text style={login_style.textoBotao}>Quero criar uma conta</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{marginTop:'3%', alignSelf:'center'}} 
                        onPress = { () => {} }
                    >
                        <Text style={login_style.textoBotao}>Esqueci minha senha</Text>
                    </TouchableOpacity>
                </View>
            );
        }else{
            return (
                <View>
                    <Tooltip
                    isVisible={tp_nome}
                    content={<Text>{tp_texto_nome}</Text>}
                    placement="top"
                    onClose={() => setTpNome(false)}
                    >
                        <TextInput style={login_style.input}
                            placeholder="Nome Completo"
                            onChangeText={(text) => setNome(text)}
                            onFocus={()=> setTpNome(false)}
                        />
                    </Tooltip>
                    <Tooltip
                        isVisible={tp_apelido}
                        content={<Text>{tp_texto_apelido}</Text>}
                        placement="top"
                        onClose={() => setTpApelido(false) }
                    >
                        <TextInput style={login_style.input}
                            placeholder="Apelido"
                            onChangeText={(text) => setApelido(text) }
                            onFocus={()=> setTpApelido(false)}
                        />
                    </Tooltip>
                    <Tooltip
                        isVisible={tp_email}
                        content={<Text>{tp_texto_email}</Text>}
                        placement="top"
                        onClose={() => setTpEmail(false)}
                    >
                        <TextInput style={login_style.input}
                            placeholder="Email"
                            onChangeText={(text) => setEmail(text)}
                            onFocus={()=> setTpEmail(false) }
                        />
                    </Tooltip>
                    <Tooltip
                        isVisible={tp_senha}
                        content={<Text>{tp_texto_senha}</Text>}
                        placement="top"
                        onClose={() => setTpSenha(false)}
                    >
                        <TextInput 
                            style={login_style.input}
                            secureTextEntry={true}
                            placeholder="Senha"
                            onChangeText={(text) => setSenha(text)}
                            onFocus={()=>setTpSenha(false)}
                        />
                    </Tooltip>
                    <Tooltip
                        isVisible={tp_senha_repetida}
                        content={<Text>{tp_texto_senha_repetida}</Text>}
                        placement="top"
                        onClose={() => setTpSenhaRepetida(false)}
                    >
                        <TextInput 
                            style={login_style.input}
                            secureTextEntry={true}
                            placeholder="Repita a senha"
                            onChangeText={(text) => setSenhaRepetida(text)}
                            onFocus={()=>setTpSenhaRepetida(false)}
                        />
                    </Tooltip>
                    <TouchableOpacity 
                        style={login_style.botao}
                        onPress = { signup_click }
                    >
                        <Text style={login_style.textoBotao}>Criar Conta</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{marginTop:'3%', alignSelf:'center'}} 
                        onPress = { () => {setTipoTela("login")} }
                    >
                        <Text style={login_style.textoBotao}>Já tenho uma conta</Text>
                    </TouchableOpacity>
                </View>
            );

        }
    };

    return(
            <SafeAreaView style={login_style.container}>
                <Image 
                        source={require('../assets/imgs/logo/spends_bg.png')}
                        style={{width:'60%', height:'30%'}}
                />
                {corpo_login()}
            </SafeAreaView>
    )
   
};

export default Login;

