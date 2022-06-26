/* ----------------------------------IMPORT----------------------------------- */
/* expo */
import { StatusBar } from "expo-status-bar";
/* react */
import React from "react";
import { useState, useEffect } from "react";
/* redux */
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../redux/redux";
import { invResult } from "../redux/redux";
/* functions */
import {
  GetRequest,
  page,
  actionType,
} from "../components/functions";
/* react-native */
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
/* components */
import LoadingItem from "../components/LoadingItem";
import ProductCard from "../components/ProductCard";

/* ------------------------------COMPONENT----------------------------------- */
function UserPageScreen({ navigation}) {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.userInfoReducer);
  const initial = userInfo.pseudo[0];
  const mail = userInfo.mail;
  const [isLoading, setIsLoading] = useState(false);
  const products = useSelector((state)=>state.userInvReducer);
  const reload = useSelector((state)=> state.reloadReducer);
  // setReloadScreen(reload);
  console.log(reload);

  useEffect(() => {
    console.log("test")
    function getProduct(){
      const paramList = [
        { name: "mail", value: mail },
        { name: "requestType", value: actionType.getUserInv },
      ];
      // setIsLoading(false);
      const promise = GetRequest(page.product, paramList)
      promise.then(async (response)=>{
        setIsLoading(true);
        const content = await response.json();
        dispatch(invResult(content));
        setIsLoading(false);
      })
    }
    navigation.addListener('focus', async ()=>{
      getProduct();
      })
      getProduct();
  }, [navigation, reload]);

  return (
    <View>
      <View style={styles.badgeContainer}>
        <TouchableOpacity style={styles.BtnBadge}
          onPress={() => {
            dispatch(logOut());
          }}
        >
          <View style={styles.badge}>
            <Text style={styles.initial}>{initial}</Text>
          </View>
          <View>
            <Text>Se déconnecter</Text>
          </View>
        </TouchableOpacity>
        {/* <View style={styles.info}>
          <View style={styles.miniInfo}>
            <Text>IMC</Text>
            <Text>imc</Text>
          </View>
          <View style={styles.miniInfo}>
            <Text>Moyenne nutriscore</Text>
            <Text>moyenne</Text>
          </View>
        </View> */}
      </View>

      <View>
        <View style={styles.titles}>
          <Text style={styles.produit}>Inventaire</Text>
          {/* <Text style={styles.produit}>Marque</Text>
          <Text style={styles.scoreQte}>Score</Text>
          <Text style={styles.scoreQte}>Qté</Text> */}
        </View>
      </View>

      <ScrollView style={{ height: "80%" }}>
        <>
        {isLoading?(
          <LoadingItem/>
          ):(
          products.map((p)=>{
            return(
            <ProductCard
              key={p._id}
              product={p}
              qte = {p.qte}
              modal = {false}
              update = {true} 
            />
          )})
        )}
        </>
      </ScrollView>
      <View>
        <TouchableOpacity
          style={styles.logoContainer}
          onPress={() => navigation.navigate("SearchPage")}
        >
          <Image
            style={styles.logoLoupe}
            source={require("../images/loupe.png")}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
export default UserPageScreen;

/* ----------------------------------STYLES----------------------------------- */
const styles = StyleSheet.create({
  badgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 15,
    height: "5%",
  },
  badge: {
    backgroundColor: "#F4A261",
    width: 50,
    height: 50,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  initial: {
    color: "white",
    fontSize: 30,
  },
  name: {
    fontSize: 16,
  },
  info: {
    backgroundColor: "lightblue",
    flexDirection: "row",
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "space-around",
    height: 50,
    borderRadius: 5,
  },
  miniInfo: {
    textAlign: "center",
  },
  titles: {
    backgroundColor: "lightblue",
    flexGrow: 1,
    flexDirection: "row",
  },
  produit: {
    width: "30%",
    textAlign: "center",
  },
  scoreQte: {
    width: "20%",
    textAlign: "center",
  },
  imgProd: {
    width: 50,
    height: 50,
  },
  logoLoupe: {
    width: 50,
    height: 50,
  },
  logoContainer: {
    alignItems: "center",
  },
  BtnBadge: {
    flexDirection : 'row',
    alignItems : 'flex-end'
  }
});
