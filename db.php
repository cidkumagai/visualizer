<?php

class db {
    private $user = "root";
    private $password = "root";
    private $dbname = "expo";
    public $pdo = null;

    /**
     * データベース接続メソッド
     * 引数：なし
     * 戻り値：0 -> 成功、1 -> 接続失敗
     */
    public function db_connect() {
        $ret = 0;
        $dsn  = "mysql:host=localhost;charset=utf8;dbname=".$this->dbname;
        try {
            $this->pdo = new PDO($dsn,$this->user,$this->password);
        } catch (PDOException $e) {
            // 例外エラー表示
            echo $e->getMessage();
            $ret = 1;
        }

        return $ret;

    }

    /**
     * データベース接続解除メソッド
     * 引数：なし
     * 戻り値：なし
     */
    public function db_disconnect() {
        // データベースとの接続を閉じる
        $this->pdo = null;
    }

    public function insert_thought($user_agent, $text) {
        $ret = 0;

        try {
            $stmt = $this->pdo->prepare('INSERT INTO expo (user_agent, thought) VALUES (:user_agent, :thought)');
            $stmt->bindParam(':user_agent', $user_agent, PDO::PARAM_STR);
            $stmt->bindParam(':thought', $text, PDO::PARAM_STR);

            $stmt->execute();

        } catch (PDOException $e) {
            // 例外エラー表示
            echo $e->getMessage();

            $ret = 1;
        }

        return $ret;
    }

    public function select_texts() {
        $sth = null;

        try {
            $sql = "SELECT thought FROM expo";
            $sth = $this->pdo->query($sql);
            $sth->execute();
        } catch (PDOException $e) {
            // 例外エラー表示
            echo $e->getMessage();
            $sth = null;
        }

        return $sth;
        
    }

    public function select_points() {
        $sth = null;

        try {
            $sql = "SELECT * FROM Emotions";
            $sth = $this->pdo->query($sql);
            $sth->execute();
        } catch (PDOException $e) {
            // 例外エラー表示
            echo $e->getMessage();
            $sth = null;
        }

        return $sth;

    }

}
?>