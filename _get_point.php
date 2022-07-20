<?php
require_once 'db.php';

$param_json = array();
$db = new db();
$result = array();

if($db->db_connect() == 0) {
    $result = $db->select_points();
    $positive = 0;
    $negative = 0;
    foreach( $result as $row) {
        $positive = $row['positive'];
        $negative = $row['negative'];
    }
    array_push( $param_json, $positive, $negative);
}   

echo json_encode($param_json);
?>