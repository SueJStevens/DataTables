<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
//require_once ($_SERVER['DOCUMENT_ROOT'].'\incl\connectPCdb.php');
require_once ($_SERVER['DOCUMENT_ROOT'].'\PoliticalContributions\incl\connectPCdb.php');

/*you can test to confirm the connection to this file is working by setting only these three lines:
$reply="test reply";
$json = json_encode($reply);    
echo $json;
*/

if(isset($_POST['dataToSave'])) {
    $data = $_POST['dataToSave'];
    $empID = $_POST['dataToSave'][0];
    $firstName = $_POST['dataToSave'][1];
    $middleInt = $_POST['dataToSave'][2];
    $lastName = $_POST['dataToSave'][3];
    $suffix = $_POST['dataToSave'][4];

    //sql query to update table

    $update = "UPDATE Employees
                SET  FirstName = '$firstName'
                    ,MiddleInt = '$middleInt'
                    ,LastName = '$lastName'
                    ,Suffix = '$suffix'
                    ,ModifiedByUserID = '1'  --change this to a variable
                    ,ModifiedOnDtTm = getdate()
                WHERE EmpID = '$empID'";
    $updateresult = odbc_prepare($connection,$update);
    $updateexc = odbc_execute($updateresult);

    //message back to the callback if successful
    $reply = array('error' => false, 'sql'=>$update);
} else {
    $reply = array('error' => true, 'sql'=>$update);
}

$json = json_encode($reply);    
echo $json; 
?>