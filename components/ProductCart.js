import { DefaultTheme } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Modal,
  Image,
  Pressable,
} from "react-native";
import { useDispatch } from "react-redux";
import { addProduct } from "../redux/redux";
import Theme from "./Theme";

function ProductCart(props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [counter, setCounter] = useState(0);
  const { product } = props;
  console.log("----------Dans le component--------------");
  console.log(product);
  console.log(product.image_front_small_url)
  const dispatch = useDispatch();
  
  function AddProduct(product, image, nom, marque, score) {
    if (counter > 0) {
      let productToAdd = {
        _id: product.id,
        product_name: nom, 
        brands: marque,
        nutriscore_grade: score,
        image_front_small_url: image,
        qte: counter,  
      };
      dispatch(addProduct(productToAdd));

      console.log(productToAdd);
      Alert.alert("Produit ajouté au panier !");
      setCounter(0);
    }
    setModalVisible(!modalVisible);
  }

  return (
    <View>
      <TouchableOpacity
        style={styles.container}
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.card}>
          <Image
            style={styles.image}
            source={{ uri: product.image_front_small_url }}
            resizeMode="contain"
          />
          <View style={styles.infos}>
            <Text style={Theme.headline}>{product.product_name}</Text>
            <Text style={styles.marque}>{product.brands}</Text>
            <Text style={styles.score}>
              Nutriscore : {product.nutriscore_grade}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Image
              style={styles.modalImage}
              source={{ uri: product.image_front_small_url }}
              resizeMode="contain"
            />
            <View style={styles.nav}>
              <Pressable
                onPress={() => {
                  if (counter > 0) {
                    setCounter((prevState) => prevState - 1);
                  }
                }}
                style={styles.addBtn}
              >
                <Text>-</Text>
              </Pressable>
              <Text>{counter}</Text>
              <Pressable
                onPress={() => setCounter((prevState) => prevState + 1)}
                style={styles.addBtn}
              >
                <Text>+</Text>
              </Pressable>
            </View>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() =>
                AddProduct(
                  product,
                  product.image_front_small_url,
                  product.product_name,
                  product.brands,
                  product.nutriscore_grade
                )
              }
            >
              <Text style={styles.textStyle}>Ajouter au panier</Text>
            </Pressable>
            <Pressable
              style={styles.annulerBtn}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text>Annuler</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default ProductCart;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    height: 125,
    borderBottomWidth: 0.7,
    borderColor: "lightgrey",
    marginHorizontal: 15,
  },
  card: {
    flexDirection: "row-reverse",
    alignItems: "center",
  },
  image: {
    width: "25%",
    height: 100,
    borderRadius: 5,
  },
  infos: {
    width: "75%",
  },
  nom: {
    fontWeight: "bold",
  },
  marque: {
    color: "grey",
    fontStyle: "italic",
  },
  score: {
    color: "orange",
    fontWeight: "bold",
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    width: "100%",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 5,
    padding: 10,
    elevation: 1,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
    marginBottom: 15,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  modalImage: {
    width: 100,
    height: 100,
  },
  nav: {
    flexDirection: "row",
    width: 120,
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 15,
  },
  addBtn: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  annulerBtn: {},
});
