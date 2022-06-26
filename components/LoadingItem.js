import { DefaultTheme } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React from "react";

import { StyleSheet, View, Animated } from "react-native";
import { useState, useEffect } from "react";

function LoadingItem() {
  const [animation, setAnimation] = useState(new Animated.Value(0));

  const handleAnimation = () => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 500,
      useNativeDriver: false,
    }).start(() => {
      Animated.timing(animation, {
        toValue: 0,
        duration: 500,
        useNativeDriver: false,
      }).start();
    });
  };

  useEffect(() => {
    setInterval(() => {
      Animated.loop(handleAnimation()).start();
    }, 1001);
  }, []);

  const boxInterpolation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgb(192,192,192)", "rgb(119,136,153)"],
  });
  const animatedStyle = {
    backgroundColor: boxInterpolation,
  };

  return (
    <Animated.View style={{ ...styles.container, ...animatedStyle }}>
      <Animated.View style={styles.image} />
      <View style={styles.infos}>
        <View style={styles.text} />
        <View style={styles.text1} />
        <View style={styles.text2} />
      </View>
    </Animated.View>
  );
}

export default LoadingItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row-reverse",
    alignItems: "center",
    height: 125,
    marginHorizontal: 15,
    marginVertical: 15,
    // backgroundColor: "lightgrey",
    borderRadius: 5,
  },
  image: {
    width: "25%",
    height: 100,
    borderRadius: 5,
    marginHorizontal: 15,
    backgroundColor: "white",
  },
  infos: {
    width: "65%",
    // backgroundColor : "white",
    marginLeft: "10%",
  },
  text: {
    width: "100%",
    height: 18,
    backgroundColor: "white",
    marginVertical: 5,
    borderRadius: 5,
  },
  text1: {
    width: "75%",
    height: 18,
    backgroundColor: "white",
    marginVertical: 5,
    borderRadius: 5,
  },
  text2: {
    width: "40%",
    height: 18,
    backgroundColor: "white",
    marginVertical: 5,
    borderRadius: 5,
  },
});
