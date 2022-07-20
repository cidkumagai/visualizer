<?php
require_once 'db.php';

$param_json = array();
$db = new db();
$texts = array();
if($db->db_connect() == 0) {
    $param = $db->select_texts();
    foreach ($param as $row) {
        array_push($texts, $row['thought']);
    }
}   
echo json_encode($texts);
?>