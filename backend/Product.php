<?php
// Connect to database
require("DB.php");

if (isset($_GET["requestType"])) {
    $requestType = $_GET["requestType"];
} else {
    if (isset($_POST["requestType"])) {
        $requestType = $_POST["requestType"];
    } else {
        $requestType = null;
    }
}

switch ($requestType) {
    case 'GetUserInv':
        GetUserInv($response); 
        break;
    case 'getAllProduct':
        GetAllProduct();
        break;
    case "searchProduct" :
        SearchProduct();
        break;
    case 'insertCart' :
        InsertProduct($response);
        break;
    case 'updateProduct':
        UdpateInv($response);
        break;
    case null :
        $response["requestType"] = "ERROR!. Request type undefined";
        echo json_encode($response);
    break;
}

/**
 * Add fetched products infos from user's inventory to json response
 * @param &$response json response 
 */
function GetUserInv(&$response){
    global $conn;
    $mail = $_GET["mail"];
    $str_qry = "SELECT P.PRODUCT_ID, P.PRODUCT_NAME, P.PRODUCT_NUTRISCORE, P.PRODUCT_IMG, B.BRAND_NAME, UPI.QTE, P.PRODUCT_IMG
                FROM USER_PRODUCT_INV UPI, PRODUCT P, BRAND B
                WHERE UPI.PRODUCT_ID = P.PRODUCT_ID
                  AND P.BRAND_ID = B.BRAND_ID
                  AND UPI.USER_MAIL = '$mail';";
    $qry = mysqli_query($conn, $str_qry);
    if($qry){
        $productList = array();
        $key = 0;
        while($row = $qry -> fetch_array()){
            $key += 1;
            $productInfo = [
                "key" => $key,
                "_id" => $row["PRODUCT_ID"],
                "product_name" => $row["PRODUCT_NAME"],
                "nutriscore_grade" => $row["PRODUCT_NUTRISCORE"],
                "brands" => $row["BRAND_NAME"],
                "qte" => $row["QTE"],
                "image_front_small_url" => $row["PRODUCT_IMG"]
            ];
            array_push(
                $productList,
                $productInfo,
            );
        }
        $response["status"] = TRUE;
        $response["status_message"] = "La récupération de l'inventaire est un succès";
        $response["products"] = json_encode($productList);
    }else{
        $response["status"] = FALSE;
        $response["status_message"] = 'ERREUR!.' . mysqli_error($conn);
    }
    header('Content-type: application/json');
    echo(json_encode($productList));
}

/**
 * Get all product
 */
function GetAllProduct(){
    $page = $_GET["page"];
    $url = "https://world.openfoodfacts.org?json=true&page=".$page ;
    $json = file_get_contents($url);
    echo $json;
}

/**
 * Search product
 */
function SearchProduct(){
        $page = $_GET["page"];
        $searchInput = $_GET["searchInput"];
        // Format searchInput
        $indice = strlen($searchInput);
        $goodFormat = '';
        $space = ' '; 

        for($i = 0 ; $i < $indice; $i++){
            if($searchInput[$i] == $space){
                $goodFormat = $goodFormat.'+';
            }
            else{
                $goodFormat = $goodFormat.$searchInput[$i];
            }
        }
        $searchInput = $goodFormat;

        $url = "https://fr.openfoodfacts.org/cgi/search.pl?search_terms=".$searchInput."&search_simple=1&action=process&page=".$page."&json=true";
        $json = file_get_contents($url);
        echo $json;
}

/**
 * Insert porducts into user's inventory
 */
function InsertProduct(&$response){
    global $conn;
    $cart = $_POST["cart"];
    $cart = json_decode($cart, true);
    $cartLength = sizeof($cart);
    $mail = $_POST["mail"];
    $response["mail"] = $mail;

    for ($i=0; $i < $cartLength ; $i++) { 
        $produit = $cart[$i];
        $id = $produit["_id"];
        $brand = $produit["brands"];
        $image = $produit["image_front_small_url"];
        $score = $produit["nutriscore_grade"];
        $name = $produit["product_name"];
        $qte = $produit["qte"];
        // Insert brand in db if does not exist
        $str_qry = "INSERT IGNORE INTO BRAND(BRAND_NAME) VALUES('$brand')";
        if(mysqli_query($conn, $str_qry)){
            $response["status"] = TRUE;
            $response["status_message"] = "L'insertion de la marque est un succès";
        }
        else{
            $response["status"] = FALSE;
            $response["status_message"] = 'ERREUR!.' . mysqli_error($conn);
        }
        // Select brand's id
        $brandId = 0;
        $str_qry = "SELECT BRAND_ID FROM BRAND WHERE BRAND_NAME = '$brand'";
        $qry = mysqli_query($conn,$str_qry);
        if($qry){
            if($qry->num_rows>0){
                while($row = $qry->fetch_assoc()){
                    $brandId = $row["BRAND_ID"];
                }
            }
        }else{
            $response["status"] = FALSE;
            $response["status_message"] = 'ERREUR!.' . mysqli_error($conn);
        }

        // Insert product in db if does not exist
        $str_qry = "INSERT IGNORE INTO PRODUCT(PRODUCT_IMG, PRODUCT_NAME, PRODUCT_NUTRISCORE, PRODUCT_OFF_ID, BRAND_ID) 
                    VALUES('$image', '$name', '$score','$id', $brandId)";
        if(mysqli_query($conn,$str_qry)){
            $response["status"] = TRUE;
            $response["status_message"] = "L'insertion du produit est un succès";
            // INSERT PRODUCT INTO USER INVENTORY
            // Check if the product is already in inventory
            $str_qry = "SELECT P.PRODUCT_ID AS productID, UPI.QTE AS qte
                        FROM USER_PRODUCT_INV UPI, PRODUCT P
                        WHERE UPI.PRODUCT_ID = P.PRODUCT_ID
                          AND P.PRODUCT_OFF_ID = '$id';";
            $qry = mysqli_query($conn,$str_qry);
            if($qry -> num_rows > 0){
                while($row = $qry->fetch_assoc()){
                    $idDb = $row["productID"];
                    $qteDb = $row["qte"];
                    $sumQte = $qteDb + $qte;
                    $str_qry = "UPDATE USER_PRODUCT_INV SET QTE = '$sumQte' WHERE PRODUCT_ID = '$idDb'";
                    if(mysqli_query($conn,$str_qry)){
                        $response["status"] = TRUE;
                        $response["status_message"] = "dans le true - Produit inséré dans l'inventaire";
                    }else{
                        $response["status"] = FALSE;
                        $response["status_message"] = 'ERREUR!.' . mysqli_error($conn);
                    }
                }
            }else{
                $str_qry = "SELECT PRODUCT_ID from product where PRODUCT_OFF_ID = '$id';";
                $qry = mysqli_query($conn, $str_qry);
                if($qry){
                    while($row = $qry->fetch_assoc()){
                        $idDb = $row["PRODUCT_ID"];
                        $invId = GetInvId($response,$mail);
                        $str_qry = "INSERT INTO USER_PRODUCT_INV(`PRODUCT_ID`, `USER_MAIL`, `INVENTORY_ID`, QTE) 
                                    VALUES('$idDb','$mail','$invId','$qte') ;";
                        if(mysqli_query($conn,$str_qry)){
                            $response["query"] = $str_qry;
                            $response["status"] = TRUE;
                            $response["status_message"] = "Produit inséré dans l'inventaire";
                        }else{
                            $response["status"] = FALSE;
                            $response["status_message"] = 'ERREUR!.' . mysqli_error($conn);
                        }
                    }
                }else{
                    $response["status"] = FALSE;
                    $response["status_message"] = 'ERREUR!.' . mysqli_error($conn);
                }
            }
        }else{
            $response["status"] = FALSE;
            $response["status_message"] = 'ERREUR!.' . mysqli_error($conn);
        };
    }
    header('Content-Type: application/json');
    echo json_encode($response);

}

/**
 * Get user's inventory ID
 */
function GetInvId(&$response, $mail){
    global $conn;
    $str_qry = "SELECT inventory_id FROM inventory WHERE user_mail = '$mail';";
    $qry = mysqli_query($conn,$str_qry);
    if($qry){
        while($row = $qry -> fetch_array()){
            $invId = $row["inventory_id"];
        }
        $response["userInv"] = "L'id de l'inventaire est $invId";
        return $invId;
    }
    else{
        $response["userInv"] = "pas d'inv trouvé";
    }
}

/**
 * Udpate user's inventory
 */
function UdpateInv(&$response){
    global $conn;
    $qte = $_GET["qte"];
    $productId = $_GET["productId"];
    $invId = $_GET["invId"];
    if($qte == 0){
        $str_qry = "DELETE FROM user_product_inv
                    WHERE PRODUCT_ID = '$productId'
                    AND INVENTORY_ID = '$invId'";
    }else{
        $str_qry="UPDATE user_product_inv 
                  SET QTE = '$qte' 
                  WHERE PRODUCT_ID = '$productId' 
                  And INVENTORY_ID = '$invId' ;";
    }
    $qry = mysqli_query($conn,$str_qry);
    if($qry){
        $response["status"] = true;
        $response["status_message"] = "La mise à jour est un succès";
    }else{
        $response["status"] = FALSE;
        $response["status_message"] = 'ERREUR!.' . mysqli_error($conn);
    }
    header('Content-Type: application/json');
    echo json_encode($response);
}
?>