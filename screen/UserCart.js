/* ----------------------------------IMPORT----------------------------------- */
/* expo */
import { StatusBar } from "expo-status-bar";
/* react */
import React from "react";
/* functions */
import { 
  RequestType,
  POSTRequest,
  urlParams,
  actionType,
  page } from "../components/functions";
/* redux */
import { useDispatch, useSelector } from "react-redux";
import { dropCart } from "../redux/redux";
/* components */
import ProductCard from "../components/ProductCard";
import MainButton from "../components/Buttons";
import Theme from "../components/Theme";
/* react-native */
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
} from "react-native";

/* ------------------------------COMPONENT----------------------------------- */
function UserCartScreen({ navigation }) {
  const products = useSelector((state) => state.cartReducer);
  console.log(products);
  const mail = useSelector((state)=>state.userInfoReducer.mail);
  console.log(products)
  const dispatch = useDispatch();
  
  async function ConfirmCart(){

    const POSTBody = 
      urlParams.mail + mail + "&"
      + urlParams.cart + JSON.stringify(products) + "&"
      + RequestType(actionType.insert);
    const promise = POSTRequest(page.product, POSTBody);

    promise
    .then(async (response) => {
      const content = await response.json();
      console.log(content);
      if (content["status"] == true) {
        console.log("API RESPONSE");
        console.log(content);
        console.log(true);
        dispatch(dropCart());
      } else {
        console.log("API RESPONSE");
        console.log(content);
        console.log(false);
      }
      navigation.navigate("UserPage");
    })
    .catch(e => console.log(e.message));
  }

  function EmptyCart(){
    dispatch(dropCart());
    navigation.navigate("SearchPage");
  }
  return (
    // <Provider store={store}>
    <View style={styles.body}>
      <View style={styles.header}>
        {/* Header */}
        <Text style={Theme.header}>Votre panier</Text>
      </View>
      <ScrollView style={styles.contentView}>
        {/* Affichage des produits */}
        <>
          {products.map((p) => {
            console.log("-----------dans le map-------------");
            console.log(p.brands);
            return (
              <View>
                <ProductCard key={p._id} product={p} modal={false} qte={"Quantité : " + p.qte} />
              </View>
            );
          })}
        </>
      </ScrollView>
      <View style={styles.nav}>
        {/* Bouton de validation */}
        <MainButton
          label="Valider le panier"
          btnStyle={btnStyle}
          action={() => ConfirmCart()}
          style={styles.btnValidate}
        />
        <MainButton
          label="Vider"
          btnStyle={btnStyle}
          labelStyle={labelStyle}
          action={() => EmptyCart()}
          style={styles.btnValidate}
        />
      </View>
    </View>
    // </Provider>
  );
}
export default UserCartScreen;

/* ----------------------------------STYLES----------------------------------- */
const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    marginVertical: 5,
    marginHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 0.5,
  },
  nav: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 50,
  },
  contentView: {
    // backgroundColor:"lightgrey",
  },
  container:{
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"center"
  },
  btnModify:{
    backgroundColor : "blue",
    height: 125,
    width : 50
  },
});
const btnStyle = {};
const labelStyle = {
  color: "red",
};
