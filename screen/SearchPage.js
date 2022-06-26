/* ----------------------------------IMPORT----------------------------------- */
/* expo */
import { StatusBar } from "expo-status-bar";
/* react */
import React from "react";
import { useState, useEffect } from "react";
/* redux */
import { useDispatch, useSelector } from "react-redux";
import { newResult } from "../redux/redux";
/* functions */
import { myInit } from "../components/functions";
/* react-native */
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Pressable,
} from "react-native";
/* components */
import ProductCard from "../components/ProductCard";
import LoadingItem from "../components/LoadingItem";
import Cart from "../components/Cart";
import Theme from "../components/Theme"; 

/* ------------------------------COMPONENT----------------------------------- */
function SearchPageScreen({ navigation }) {
  // const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInupt] = useState("");
  // const [disable, setDisable] = useState(true);
  const [requestType, setRequestType] = useState("getAllProduct");
  const [switchState, setSwitchState] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const url = new URL("http://192.168.1.33:80/elfi/Product.php");
  const index = [1,2,3,4,5];
  const dispatch = useDispatch();

  url.searchParams.append("requestType", requestType);
  url.searchParams.append("page", page);
  url.searchParams.append("searchInput", searchInput);

  
  useEffect(() => {
    const getData = async () => {
      setIsLoading(false);
      const response = await fetch(url, myInit);
      let dataJson = await response.json();
      dispatch(newResult(dataJson.products));
      setIsLoading(true);
    };
    
    getData()
    .catch(e => console.log(e.message));
    // console.log(data);
  }, [page, switchState]);

  function LaunchSearch() {
    setRequestType("searchProduct");
    setPage(1);
    setSwitchState(!switchState);
  }

  const products = useSelector((state)=>state.searchResultReducer)

  return (
    <View style={styles.body}>
      <View style={styles.container}>
        <Text style={[Theme.title2, styles.h2]}>Trouver un produit</Text>
        <View style={styles.container2}>
          <View style={styles.searchBar}>
            <TextInput
              style={styles.inputSearch}
              placeholder="Rechercher un produit"
              onChangeText={(newText) => setSearchInupt(newText)}
            />
            <TouchableOpacity
              style={styles.logoContainer}
              onPress={() => {
                LaunchSearch();
              }}
            >
              <Image
                style={styles.logoLoupe}
                source={require("../images/loupe.png")}
              />
            </TouchableOpacity>
          </View>
          <Pressable onPress={()=>{navigation.navigate("CartPage")}}>
            <Cart />
          </Pressable>
        </View>
      </View>
      <ScrollView>
        <>
          {isLoading ? (
            products.map((p) => (
              <ProductCard
                key={products._id}
                product={p}
              modal={true}
              />
            ))
          ) : (
            <>
              {index.map((i) => (
                <LoadingItem key={index[i]} />
              ))}
            </>
          )}
        </>

        <View style={styles.nav}>
          <TouchableOpacity
            style={styles.previous}
            onPress={() => {
              if (page > 1) {
                setPage((prevState) => prevState - 1);
              }
            }}
          >
            <Text>Précédent</Text>
          </TouchableOpacity>
          <Text style={styles.pagenum}>{page}</Text>
          <TouchableOpacity
            style={styles.next}
            onPress={() => {
              setPage((prevState) => prevState + 1);
            }}
          >
            <Text>Suivant</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
export default SearchPageScreen;

/* ----------------------------------STYLES----------------------------------- */
const styles = StyleSheet.create({
  body: {
    backgroundColor: "white",
    flex: 1,
  },
  container: {
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  container2: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 15,
  },

  h2: {
    // fontSize: 18,
    // fontWeight: "bold",
    padding: 15,
  },
  searchBar: {
    flexDirection: "row",
    padding: 10,
    marginBottom: 15,
    justifyContent: "center",
    backgroundColor: "#eeeeee",
    width: "75%",
    borderRadius: 5,
  },
  logoContainer: {
    alignItems: "center",
    marginLeft: 25,
  },
  logoLoupe: {
    width: 30,
    height: 30,
  },
  inputSearch: {
    // backgroundColor: "white",
    width: "75%",
  },
  nav: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 15,
  },
  previous: {
    backgroundColor: "#ff595e",
    width: 75,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
  next: {
    backgroundColor: "#1982c4",
    width: 75,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
  pagenum: {
    marginHorizontal: 25,
  },
});
