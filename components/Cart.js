import React from "react";
import { View, 
         Text,
         StyleSheet, 
         Image } from "react-native";
import { useSelector } from "react-redux";

function Cart() {
  const cartQty = useSelector((state)=> state.cartReducer)
  const number = cartQty.length
  return (
    <View>
        <Image
          style={styles.logo}
          source={require("../images/logoPanier.png")}
        />
        <View style={styles.counter}>
          <Text style={styles.text}>{number}</Text>
        </View>
    </View>
  );
}

export default Cart;

const styles = StyleSheet.create({
  logo: {
    width: 40,
    height: 40,
  },
  counter: {
      position:"absolute",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ff595e",
    width: 20,
    height: 20,
    borderRadius: 50,
    left: -10,
    top:-5,
  },
  text: {
    color: "white",
    fontWeight: "bold",
  },
});
