import { DefaultTheme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';

import { StyleSheet,
         Text, 
         View, 
         TouchableOpacity,
         Alert,
         Modal,

        } from 'react-native';
import { Button } from 'react-native-web';

function ProduitL(props){
    const [modalVisible, setModalVisible] = useState(false);
    return (
        <View>
            <TouchableOpacity style={styles.container} onLongPress = {()=>setModalVisible(true)}>
                <Text style={styles.produit}>{props.produit}</Text>
                <Text style={styles.produit}>{props.marque}</Text>
                <Text style={styles.info}>{props.score}</Text>
                <Text style={styles.info}>{props.qte}</Text>
            </TouchableOpacity>

            <Modal 
                animationType='slide'
                transparent = {true}
                visible={modalVisible}
                onRequestClose={()=>{
                    Alert.alert("Modal has been closed");
                    setModalVisible(!modalVisible);
                }}    
            >   
                <TouchableOpacity style = {styles.deadZone} onPress={()=> setModalVisible(!modalVisible)}></TouchableOpacity>

                <View style = {styles.modal}>
                    <View style={styles.option}>
                        <Text style={styles.title}>{props.produit}</Text>
                        <View style = {styles.AjtRet}>
                            <Button title='-' style = {styles.btn}/>
                            <Text style = {{width : 50, textAlign : 'center'}}>{props.qte}</Text>
                            <Button title='+' style = {styles.btn}/>
                        </View>
                    </View>
                    <Button title = 'Modifier'/>
                    <TouchableOpacity onPress={()=> setModalVisible(!modalVisible)}>
                        <Text>Annuler</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>

        
    );
};

export default ProduitL;

const styles = StyleSheet.create({
    container : {
        flexDirection : 'row',
        paddingVertical : 15,
        alignItems : 'center',
        borderBottomColor : 'lightgrey',
        borderBottomWidth : 0.5,
    },
    produit : {
        width : '30%',
        textAlign : 'center',

    },
    info : {
        width : '20%',
        textAlign : 'center',
    },
    deadZone : {
        height : '50%',
    },
    modal : {
        backgroundColor : 'lightblue',
        height : '50%',
        width : '100%',
        
        borderTopLeftRadius : 25,
        borderTopRightRadius : 25,
        alignItems : 'center',
        justifyContent : 'center',

    },
    AjtRet : {
        backgroundColor : 'white',
        flexDirection : 'row',
        width : '100%',
        justifyContent : 'space-between',
        alignItems : 'center',
        marginBottom : 20,
    },
    option : {
        alignItems : 'center',
    },
    title : {
        fontSize : 18,
        fontWeight : 'bold',
        marginBottom : 30,
    },
    btn : {
        color : 'white',
    }
});