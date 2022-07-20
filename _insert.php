<?php
require_once 'db.php';

$text = "";
$db = new db();
$data = $_REQUEST['thought'];
$user_agent = $_REQUEST['useragent'];
echo $user_agent;
if(isset ($data)) {
    if($db->db_connect() == 0) {
        $db->insert_thought($user_agent, $data); 
    }
}

?>