import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button, Linking } from "react-native";
import React, { useState, useEffect } from "react";

function HomeScreen({ navigation }) {
    return (
      <View>
        <Text>Page d'accueil</Text>
        <Button
          title="Connexion"
          onPress={() => navigation.navigate("Connexion")}
        />
      </View>
    );
  }

  export default HomeScreen;