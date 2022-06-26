/* --------------------------------------------------------------------------- */
/* ----------------------------------IMPORT----------------------------------- */
/* --------------------------------------------------------------------------- */
/* expo */
import { StatusBar } from "expo-status-bar";
/* react */
import React, { useState } from "react";
/* redux */
import { useDispatch, useSelector } from "react-redux";
import { logIn, logOut } from "../redux/redux";
/* functions */
import {
  SecureSave,
  POSTRequest,
  urlParams,
  page,
  actionType,
  RequestType
} from "../components/functions";
/* react-native */
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";

function InscriptionScreen({ navigation }) {
  const dispatch = useDispatch();
  const [mail, setMail] = useState("");
  const [pwd, setPwd] = useState("");
  const [pseudo, setPseudo] = useState(""); 
  const [errorMessage, setErrorMessage] = useState("");
  const userState = useSelector((state)=> state.userInfoReducer)

  function Connexion(){
    SecureSave("mail", mail);
    SecureSave("pwd",pwd);
    dispatch(logIn({
      mail: mail,
      pseudo: pseudo,
    }))

    const POSTBody = 
      urlParams.mail + mail + "&"
      + urlParams.password + pwd + "&"
      + urlParams.pseudo + pseudo + "&"
      + RequestType(actionType.subscribe);
    const promise = POSTRequest(page.user, POSTBody);

    promise
    .then(async (response) => {
      const content = await response.json();
      console.log(content);
 
      if (content["status"] == true){
        SecureSave("mail", mail);
        SecureSave("pwd", pwd);
        dispatch(logIn({
                        mail : mail,
                        pseudo : pseudo,
                        isConnected : true,
                      })
        );
        console.log("API RESPONSE");
        console.log(content);
      }else{
        SecureSave("mail", "");
        SecureSave("pwd", "");
        dispatch(logOut());
        console.log("API RESPONSE");
        console.log(content);
      }
    })
    .catch(e => console.log(e.message));

    console.log(userState);
  }

  return (
    <View style={{ flexGrow: 1 }}>
      <ScrollView style={styles.container}>
        <ImageBackground
          style={styles.background}
          source={require("../images/banniere_connexion.jpg")}
        >
          <Image style={styles.logo} source={require("../images/logo.png")} />
          <View behavior="padding" style={styles.connexionBox}>
            <Text style={styles.h1}>Bienvenue</Text>
            <View>
              <Text style={styles.label}>E-mail {": " + errorMessage}</Text>
              <TextInput
                style={styles.input}
                placeholder="Entrez votre email"
                onChangeText={(newMail) => setMail(newMail)}
              />
              <Text style={styles.label}>Pseudo</Text>
              <TextInput
                style={styles.input}
                placeholder="Entrez votre pseudo"
                onChangeText={(newPseudo) => setPseudo(newPseudo)}
              />
              <Text style={styles.label}>Mot de passe</Text>
              <TextInput
                style={styles.input}
                secureTextEntry={true}
                placeholder="Entrez votre mot de passe"
                onChangeText={(newPwd) => setPwd(newPwd)}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  Connexion();
                }}
              >
                <Text style={{ color: "white" }}>S'inscrire</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.inscription}>
              <Text style={styles.inscription}>Déjà inscrit ? </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("Connexion")}
              >
                <Text style={styles.inscription2}>Se connecter !</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </ScrollView>
    </View>
  );
}

export default InscriptionScreen;

//-------------------------------------------------------------------//
//                           STYLES                                  //
//-------------------------------------------------------------------//

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  background: {
    flex: 1,
  },
  goBack: {
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    width: 75,
    height: 30,
    marginLeft: 15,
    marginTop: 15,
    borderRadius: 5,
  },
  connexionBox: {
    flex: 1,
    backgroundColor: "rgba(52,52,52,0.8)",
    marginTop: "25%",
    paddingTop: 50,
    alignItems: "center",
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
  },
  logo: {
    width: 150,
    height: 120,
    alignSelf: "center",
  },
  h1: {
    fontSize: 20,
    color: "white",
    marginVertical: 20,
  },
  label: {
    fontWeight: "bold",
    color: "white",
    marginVertical: 5,
    marginLeft: 10,
  },
  input: {
    width: 250,
    borderWidth: 2,
    padding: 5,
    marginBottom: 15,
    borderRadius: 10,
    borderColor: "#2A9D8F",
    backgroundColor: "white",
    paddingLeft: 10,
    color: "black",
  },
  button: {
    backgroundColor: "#F4A261",
    borderRadius: 15,
    padding: 15,
    alignItems: "center",
    color: "white",
  },
  inscription: {
    flexDirection: "row",
    marginVertical: 15,
    color: "white",
  },
  inscription2: {
    marginVertical: 15,
    color: "white",
    fontWeight: "bold",
  },
});
