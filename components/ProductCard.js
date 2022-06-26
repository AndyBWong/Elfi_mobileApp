import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { addProduct, deleteProduct, modifyProduct } from "../redux/redux";
import Theme from "./Theme";
import { GetRequest, page, actionType, RequestType } from "./functions";
import { reloading } from "../redux/redux";

function ProductCard(props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [counter, setCounter] = useState(0);
  const { product } = props;
  const dispatch = useDispatch();
  const userInfo = useSelector((state)=> state.userInfoReducer);

  useEffect(()=>{
    if(props.modal===false){
      setCounter(parseInt(product.qte));
    };
  },[]);

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
      dispatch(addProduct(
        {
          product : productToAdd,
          _id : productToAdd._id,
          qte : counter
        }
        ));

      Alert.alert("Produit ajouté au panier !");
      setCounter(0);
    }
    setModalVisible(!modalVisible);
  }

  function ChangeQte(){
    if(counter > 0){
      dispatch(modifyProduct({
        _id : product._id,
        qte : counter 
      }));
    }
    else{
      dispatch(deleteProduct(product._id));
    }
    setModalVisible(!modalVisible);
  }

  function updateProduct(){
    const invId = userInfo.invId;
    const mail = userInfo.mail;
    const paramList = [
      {name : "mail", value: mail},
      {name : "qte", value: counter},
      {name : "productId", value: product._id},
      {name : "invId", value: invId},
      {name : "requestType", value: actionType.udpateProduct},
    ]
    const promise = GetRequest(page.product, paramList);
    promise
    .then(async (response)=>{
      const content = await response.json();
      if(content["status"]){
        // Alert.alert("Votre produit a bien été mise à jour");
        setModalVisible(!modalVisible);
        dispatch(reloading());
      }
      else{
        Alert.alert("Une erreur est survenue, veuillez réessayer");
        setModalVisible(!modalVisible);
      }
    })
    .catch(e => console.log(e.message));
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
            <Text>quantité : {props.qte}</Text>
          </View>
        </View>
      </TouchableOpacity>

      {props.modal ? (
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
      ) : (
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
              onPress={ ()=>{
                if (props.update){
                  updateProduct()
                }else{
                  ChangeQte()
                }
              }}
            >
              <Text style={styles.textStyle}>Modifier</Text>
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
      )}
    </View>
  );
}
export default ProductCard;

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
