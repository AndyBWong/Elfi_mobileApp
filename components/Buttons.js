import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
} from "react-native";

function MainButton(props) {

  return (
    <View>
        <Pressable style={[styles.container, props.btnStyle]} onPress={props.action}>
            <Text style={[styles.label, props.labelStyle]}>{props.label}</Text>
        </Pressable>
    </View>
  );
}

export default MainButton;

const styles = StyleSheet.create({
    container : {
        backgroundColor : "#1982c4",
        justifyContent : "center",
        alignItems : "center",
        height : 50,
        width : 125,
        borderRadius : 5,
        elevation : 2
    },
    label: {
        color : "white",
        fontWeight : "700",
    }
});
