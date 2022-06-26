import { DefaultTheme } from "@react-navigation/native";
import React from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Alert,
    Modal,
    Image,
    Pressable,
    Modal
  } from "react-native";

  function ProductModal(props){
    const product = props;
    /*
    Props List :
    - source
    - 
    */
    return(
        <View>
            <Modal>
            <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Image
                style={styles.modalImage}
                source={{ uri: product.image_front_small_url }}
                resizeMode="contain"
              />
              <View style={styles.nav}>
                <Pressable
                  style={styles.addBtn}
                >
                  <Text>-</Text>
                </Pressable>
                <Text>{counter}</Text>
                <Pressable
                  style={styles.addBtn}
                >
                  <Text>+</Text>
                </Pressable>
              </View>
              <Pressable style={[styles.button, styles.buttonClose]}>
                <Text style={styles.textStyle}>Ajouter au panier</Text>
              </Pressable>
              <Pressable style={styles.annulerBtn}>
                <Text>Annuler</Text>
              </Pressable>
            </View>
          </View>
            </Modal>
        </View>
    )
  }

  export default ProductModal;