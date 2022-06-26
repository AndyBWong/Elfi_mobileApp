import * as SecureStore from "expo-secure-store";

/**
 * Get stored value for key
 * @param {string} key
 * @returns {string} stored key value or error
 */
export async function getValueFor(key) {
  let result = await SecureStore.getItemAsync(key);
  if (result) {
    return result;
  } else {
    var e = new Error("Impossible de lire la donnée");
    throw e;
  }
}

/**
 * Save key and value in Secure store
 * @param {string} key
 * @param {string} value
 */
export async function SecureSave(key, value) {
  await SecureStore.setItemAsync(key, value);
}

/**
 * Post request
 * @param {string} page Name of the target page in the PHP API
 * @param {string} POSTBody Name of the parameters and the parameters to be send.
 * @returns {promise}
 */
export function POSTRequest(page, POSTBody){
  const url = "http://192.168.1.33:80/elfi/" + page;
  const myInit = {
    method: "POST",
    body: POSTBody,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    mode: "cors",
    cache: "default",
  };
  const promise = fetch(url, myInit);
  return promise;
}

/**
 * Defines the action to be performed in the API
 * @param {string} type name of the action to be performed
 * @returns {string} the action to be performed
 */
export const RequestType = (type)=>{
  return "&requestType=" + type
}

/**
 * - List of actions's name that can be performed by ***RequestType***
 * - List of action's name available in the API
 */
export const actionType = {
  subscribe : "inscription",
  connexion : "connexion",
  insert : "insertCart",
  getUserInv : "GetUserInv",
  udpateProduct : "updateProduct",
}

/**
 * - List of url parameters available in the API
 */
export const urlParams = {
  mail : "mail=",
  password : "password=",
  pseudo : "pseudo=",
  cart : "cart=",
  qte : "qte=",
  id : "_id",
}

/**
 * - List of API endpoint
 */
export const page = {
  user : "User.php",
  product : "Product.php"
}

/**
 * Request init
 */
export const myInit = {
  method: "GET",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
  mode: "cors",
  cache: "default",
};

/**
 * Get request
 * @param {string} page Name of the target page in the PHP API
 * @param {array} paramList couples of param name and value
 * @returns 
 */
export function GetRequest(page, paramList){
  let url = "http://192.168.1.33:80/elfi/" + page;
  url = new URL(url);

  paramList.forEach(param => {
    url.searchParams.append(param.name, param.value)
  });
  console.log(url);
  const promise = fetch(url, myInit);
  return promise
}