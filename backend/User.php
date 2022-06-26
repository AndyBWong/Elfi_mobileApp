<?php
// Connect to database
require("DB.php");

if (isset($_POST["requestType"])) {
    $requestType = $_POST["requestType"];
} else {
    $requestType = null;
}

switch ($requestType) {
    case 'connexion':
        ConnectUser($response);
        break;
    case 'inscription':
        AddUser($response);
    default:
        break;
}

/**
 * Check if user mail exist in database
 * @return Boolean
 */
function CheckUserExist()
{
    global $conn;
    $mail = $_POST["mail"];
    $str_qry = "SELECT USER_MAIL FROM USER WHERE USER_MAIL = '$mail'";
    $qry = mysqli_query($conn, $str_qry);

    while ($row = mysqli_fetch_array($qry)) {
        if ($mail == $row["USER_MAIL"]) {
            return TRUE;
        } else {
            return FALSE;
        }
    }
}

/**
 * Add new user in database if mail not aleready registered
 */
function AddUser(&$response)
{
    global $conn;
    $mail = $_POST["mail"];
    $password = $_POST["password"];
    $hashed_password = password_hash($password, PASSWORD_BCRYPT);
    $pseudo = $_POST["pseudo"];
    $userExist = CheckUserExist();

    if ($userExist == TRUE) {
        // Return usermail existe déjà
        $response["status"] = FALSE;
        $response["status_message"] = "Ce mail a déjà été utilisé";
    } else {
        $str_qry_insertUser = "INSERT INTO USER(USER_MAIL, USER_PASSWORD, USER_PSEUDO) 
                                   VALUES('$mail',  '$hashed_password', '$pseudo');";
        if (mysqli_query($conn, $str_qry_insertUser)) {
            $str_qry_insertInv = "INSERT INTO INVENTORY(USER_MAIL) 
                                      VALUES('$mail');";
            if (mysqli_query($conn, $str_qry_insertInv)) {
                $response["status"] = TRUE;
                $response["status_message"] = "Utilisateur créé avec succès";
                session_start();
                $_SESSION["mail"] = $mail;
            }
        } else {
            $response["status"] = FALSE;
            $response["status_message"] = 'ERREUR!.' . mysqli_error($conn);
        }
    }
    header('Content-Type: application/json');
    echo json_encode($response);
}

/**
 * Check if user login is correct
 */
function ConnectUser(&$response)
{
    global $conn;
    $mail = $_POST["mail"];
    $password = $_POST["password"];
    $userExist = CheckUserExist();

    if ($userExist) {
        $str_qry = "SELECT DISTINCT USER_PASSWORD, USER_PSEUDO, INVENTORY_ID 
                    FROM USER, USER_PRODUCT_INV 
                    WHERE USER.USER_MAIL = '$mail';";
        $qry = mysqli_query($conn, $str_qry);

        while ($row = mysqli_fetch_array($qry)) {
            $db_password = $row["USER_PASSWORD"];
            if (password_verify($password, $db_password)) {
                $response["status"] = TRUE;
                $response["status_message"] = 'La connexion utilisateur est un succes.';
                // $response["mail"] = $mail;
                // $response["password"] = $password;
                $response["pseudo"] = $row["USER_PSEUDO"];
                $response["userInv"] = $row["INVENTORY_ID"];
                session_start();
                $_SESSION["mail"] = $mail;
            } else {
                $response["status"] = FALSE;
                $response["status_message"] = 'ERREUR!.' . mysqli_error($conn);
                // $response["mail"] = $mail;
                // $response["password"] = $password;
            }
        }
    } else {
        // $response["mail"] = $mail;
        // $response["password"] = $password;
        $response["status"] = FALSE;
        $response["status_message"] = "Ce mail n'existe pas.";
    }
    header('Content-Type: application/json');
    echo json_encode($response);
}

