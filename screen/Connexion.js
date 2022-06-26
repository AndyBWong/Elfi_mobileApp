/* ----------------------------------IMPORT----------------------------------- */
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
} from "react-native";

/* ------------------------------COMPONENT----------------------------------- */
function ConnexionScreen({ navigation }) {
  const [mail, setMail] = useState("");
  const [pwd, setPwd] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();
  const LogIn = useSelector((state)=> state.userInfoReducer);
  console.log(LogIn)
  function Connexion() {
    const POSTBody =
      urlParams.mail + mail + "&" 
      + urlParams.password + pwd
      + RequestType(actionType.connexion);
    const promise = POSTRequest(page.user, POSTBody);
    console.log(POSTBody)
    promise
    .then(async (response) => {
      const content = await response.json();
      console.log(content);

      // Redirect to user page if login infos are correct
      if (content["status"] == true) {
        // Save login infos in a secured store
        SecureSave("mail", mail);
        SecureSave("pwd", pwd);
        SecureSave("userInv", content["userInv"]);
        // update userInfo state in redux store
        dispatch(logIn({ 
                        mail: mail,
                        pseudo: content["pseudo"], 
                        invId: content["userInv"],
                        isConnected : true, 
                       })
        );
        console.log("API RESPONSE");
        console.log(content);
      }else {
        // Reinitialize login info in secured store
        SecureSave("mail", "");
        SecureSave("pwd", "");
        //  Reinitialize userInfo state in redux store
        dispatch(logOut());
        setErrorMessage(content["status_message"])
        console.log("API RESPONSE");
        console.log(content);
      }
    })
    .catch(e => console.log(e.message));
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.background}
        source={require("../images/banniere_connexion.jpg")}
      >
        <Image style={styles.logo} source={require("../images/logo.png")} />
        <View behavior="padding" style={styles.connexionBox}>
          <Text style={styles.h1}>Connectez-vous</Text>
          <View>
            <Text style={styles.label}>E-mail : {errorMessage}</Text>
            <TextInput
              style={styles.input}
              spellCheck={false}
              textContentType="emailAddress"
              placeholder="Entrez votre email"
              onChangeText={(newMail) => setMail(newMail)}
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
              <Text style={{ color: "white" }}>Connexion</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inscription}>
            <Text style={styles.inscription}>Pas encore inscrit ? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("Inscription")}
            >
              <Text style={styles.inscription2}>S'inscrire !</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity>
            <Text style={{ color: "red" }}>Mot de passe oublié</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}
export default ConnexionScreen;

/* ----------------------------------STYLES----------------------------------- */
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  background: {
    width: "100%",
    height: "100%",
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
    marginTop: 50,
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
