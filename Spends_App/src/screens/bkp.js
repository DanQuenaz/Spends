<FlatList
                            style={{marginBottom:50, marginTop:10, marginLeft:5, marginRight:5}}
                            keyExtractor={(item)=>item.SPREAD_SHEET_ID}
                            data={result.data}
                            renderItem={({item})=>(
                                
                                <View 
                                    style={{flexDirection:'row',width:'100%',borderWidth:1,borderColor:'#ddd',borderRadius:15,justifyContent:'space-between',paddingRight:10,marginBottom:10}} 
                                >
                                    {/* Coin image ,coin name and symbol */}
                                    <View style={{flexDirection:'row',alignItems:'center'}} >
                                        {/* Coin image */}
                                        {/* <Image style={{height:'65%'}} resizeMode="contain" source={item.image} /> */}

                                        {/* Coin symbol */}
                                        <View style={{flexDirection:'column',justifyContent:'flex-start'}} >
                                            <Text style={{fontFamily:'Roboto-Medium',color:'#333',fontSize:20}} >{item.NAME}</Text>
                                            <Text>{item.NICKNAME}</Text>
                                            <Text style={{fontFamily:'Roboto-Bold',fontSize:12}} >{moment(item.CREATION_DATE).format("DD MMM HH:mm")}</Text>
                                        </View>
                                    </View>


                                    {/* Coin price and indicator */}
                                    
                                    <View style={{flexDirection:'column',alignItems:'center'}} >
                                        <TouchableOpacity
                                            style={login_style.botao_lista}
                                            onPress = { () =>{definirPlanilhaPadrao(item.SPREAD_SHEET_ID)} }
                                        >
                                            <Icon name='plus' size={30} color='#ffffff' />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={login_style.botao_lista}
                                            onPress = { () =>{
                                                Alert.alert(
                                                    "Está certo disso?",
                                                    "Você tem certeza que deseja deletar esta planilha?",
                                                    [
                                                      // The "Yes" button
                                                      {
                                                        text: "Sim",
                                                        onPress: () => {
                                                            deletarPlanilha(item.SPREAD_SHEET_ID);
                                                        },
                                                      },
                                                      // The "No" button
                                                      // Does nothing but dismiss the dialog when tapped
                                                      {
                                                        text: "Não",
                                                      },
                                                    ]
                                                  );
                                            } }
                                        >
                                            <Icon name='trash' size={30} color='#ffffff' />
                                        </TouchableOpacity>
                                    </View>


                                </View>
                               
                            )}
                        />