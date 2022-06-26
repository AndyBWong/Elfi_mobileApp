/* ----------------------------------IMPORT----------------------------------- */
/* expo */
import { StatusBar } from "expo-status-bar";
/* react */
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect } from "react";
/* redux */
import { Provider } from "react-redux";
import { store } from "./redux/redux";
import { logIn, logOut } from "./redux/redux";
import { useDispatch, useSelector } from "react-redux";
/* components */
import Connexion from "./screen/Connexion";
import UserPage from "./screen/UserPage";
import SearchPageScreen from "./screen/SearchPage";
import UserCartScreen from "./screen/UserCart";
import Inscription from "./screen/Inscription";
import ProductCard from "./components/ProductCard";
/* functions */
import {
  POSTRequest,
  urlParams,
  page,
  actionType,
  RequestType,
  getValueFor,
} from "./components/functions";
/* react-native */
import { 
  StyleSheet, 
} from "react-native";


/* ----------------------------------Navigation----------------------------------- */
const Stack = createNativeStackNavigator();

function RootNavigation() {
  const dispatch = useDispatch()
  const isLogedIn = useSelector((state)=>state.userInfoReducer.isConnected)

  useEffect(()=>{
    async function SetIsLogedIn(){
      const storedMail = await getValueFor("mail");
      const storedPwd = await getValueFor("pwd");

      const POSTBody = 
        urlParams.mail + storedMail + "&"
        + urlParams.password + storedPwd + "&"
        + RequestType(actionType.connexion);
      const promise = POSTRequest(page.user, POSTBody);

      promise.then(async (response) => {
        const content = await response.json();

        if (content["status"] == true){
          dispatch(logIn({
            mail : storedMail,
            pseudo : content["pseudo"],
            invId: content["userInv"],
            isConnected : true,
          }));
        }else{
          dispatch(logOut());
        }
      });
    }

    SetIsLogedIn().catch(e=> console.log(e.message));
  }, [isLogedIn])

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <>
          {isLogedIn ? (
            <>
              <Stack.Screen name="UserPage" component={UserPage} />
              <Stack.Screen name="SearchPage" component={SearchPageScreen} />
              <Stack.Screen name="CartPage" component={UserCartScreen} />
              <Stack.Screen name="ProductCard" component={ProductCard}/>
            </>
          ) : (
            <>
              <Stack.Screen name="Connexion" component={Connexion} />
              <Stack.Screen name="Inscription" component={Inscription} />
            </>
          )}
        </>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

/* -------------------------------------Main-------------------------------------- */
function App() {
  return (
    <Provider store={store}>
      <RootNavigation />
    </Provider>
  );
}
export default App;

/* -------------------------------------STYLES------------------------------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
