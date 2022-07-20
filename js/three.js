import * as THREE from "../build/three.module.js";
import { FontLoader } from "../loaders/FontLoader.js";
import { TextGeometry } from "../geometries/TextGeometry.js";

// ページの読み込みを待つ
window.addEventListener('DOMContentLoaded', init);

// グローバル変数宣言部分
let scene, camera, renderer, container, directionalLight;
let titleText = new THREE.Mesh;
let rot = 0;
let textMesh = [];
let thoughts = [];
let db_thoughts = [];
let geometries = [];
let x_index = []
let y_index = []
let z_index = []
let colorCodes = [0x99FFFF, 0x00FFCC, 0x99FF99, 0x33FF66, 0xCCCCFF, 0xCCCC33];


/**
 * ページの読み込みが完了したら最初に実行される
 * 引数・戻り値：なし
 */
function init(){
    // シーンの追加
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x000000 );
    // カメラの追加
    camera = new THREE.PerspectiveCamera(
        50,
        window.innerWidth / window.innerHeight,
        0.01,
        10000
    );
    
    // カメラの位置を調整
    camera.position.set(0, 0, +500);

    // レンダラーを追加
    renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('#myCanvas'),
        alpha: true,
        antialias: false,
    });

    // 画質の荒さに対応
    renderer.setPixelRatio(window.devicePixelRatio);

    // 画面いっぱいに表示
    renderer.setSize(window.innerWidth, window.innerHeight);

    // コンテナーを作成
    container = new THREE.Object3D();
    scene.add(container);

    setInterval(function() {
        getAllData();            
    }, 10000);

    /**
    * 真ん中に配置するオブジェクト作成
    */

    //ジオメトリ作成（球）
    const geometry = new THREE.SphereGeometry(180);
 
    // 画像を読み込む
    const texture = new THREE.TextureLoader().load('../images/earth_tx.jpeg');
    //マテリアルにテクスチャ貼り付け
    const earthMmaterial = new THREE.MeshStandardMaterial({
        map: texture
    });
    // メッシュを作成
    const mesh = new THREE.Mesh(geometry, earthMmaterial);
    // 3D空間にメッシュを追加
    scene.add(mesh);

    // テクスチャを追加
    // let texture = new THREE.TextureLoader().load("../images/earth_tx.jpeg");
    let ballMaterial = new THREE.MeshPhysicalMaterial({ map : texture });

    // ジオメトリを作成
    let ballGeometry = new THREE.SphereGeometry(0, 0, 0);
    // メッシュ化
    let ballMesh = new THREE.Mesh(ballGeometry, ballMaterial);
    ballMesh.position.set(0, 0, 0);
    scene.add(ballMesh);

    directionalLight = new THREE.DirectionalLight(0xffffff, 1.9);
    directionalLight.position.set(1, 100, 1);
    scene.add(directionalLight);



    // ウィンドウのサイズが変わったら実行
    window.addEventListener("resize", onWindowResize)


    // 3Dオブジェクトを作る
    const x_size = window.innerWidth;
    const y_size = window.innerHeight;
    const length = 500;
    // const plane_scale = 2;
    const plane = [];
    
    for(let i=0; i<length; i++){
        let geometry = new THREE.SphereGeometry( 1.5, 2, 1 );
        var material = new THREE.MeshBasicMaterial({
        color: 0xFFFFFF,
        opacity: 0.7,
        transparent: true
        });
    
        plane[i] = new THREE.Mesh( geometry, material );
    
        plane[i].position.x = x_size * (Math.random() - 0.5);
        plane[i].position.y = y_size * (Math.random() - 0.5);
        plane[i].position.z = x_size * (Math.random() - 0.5);
        scene.add( plane[i] );
    }
    
    //半径
    const r = 50;
    
    //頂点数
    const starsNum = 30000;
    
    //バッファーオブジェクトの生成
    const Geometry = new THREE.BufferGeometry();
    
    //型付配列で頂点座標を設定
    const positions = new Float32Array(starsNum * 3);
    
    //球状に配置する頂点座標を設定
    for(let i = 0; i < starsNum; i++){
        const theta = Math.PI * Math.random();
        const phi = Math.PI * Math.random() * 2;
    
        positions[i * 3] = r * Math.sin(theta) * Math.cos(phi);
        positions[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
        positions[i * 3 + 2] = r * Math.cos(theta);
    }
    
    //バッファーオブジェクトのattributeに頂点座標を設定
    Geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));
    
    const Gmaterial = new THREE.PointsMaterial({
        size:0.3
    });
    
    const points = new THREE.Points(Geometry,Gmaterial);

    scene.add(points);
    

    tick();
}

/**
 * ブラウザのリサイズに対応するためのメソッド
 * 引数・戻り値：なし
 */
function onWindowResize() {
    // レンダーのサイズを随時更新
    renderer.setSize(window.innerWidth, window.innerHeight);

    // カメラのアスペクト比を正す
    camera.aspect = window.innerWidth/ window.innerHeight;
    camera.updateProjectionMatrix();
}

/**
 * 毎フレーム時に実行されるループイベント
 * 引数・戻り値：なし
 */
function tick() {

    function random(min, max) {
        let rand = Math.floor((min + (max - min + 1) * Math.random()));
        return rand;
    }

    for(let i=0; i<length; i++){
        // ジオメトリを下から上に動かす
        plane[i].position.x += (random(-5, 5)*0.1);
        plane[i].position.y += 2.5;
        plane[i].position.z += (random(-5, 5)*0.1);
        if (plane[i].position.y > height) {
            // ジオメトリの位置がウィンドウの高さより大きくなったら初期位置に戻す
            plane[i].position.x = x_size * (Math.random() - 0.5);
            plane[i].position.y = 0;
            plane[i].position.z = x_size * (Math.random() - 0.5);
        }
    }

    rot += 0.5; // 毎フレーム角度を0.5度ずつ足していく
    // ラジアンに変換する
    const radian = (rot * Math.PI) / 180;
    // 角度に応じてカメラの位置を設定
    camera.position.x = 1000 * Math.sin(radian);
    camera.position.z = 1000 * Math.cos(radian);
    // 原点方向を見つめる
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // 常にカメラ方向を向かせる
    titleText.quaternion.copy( camera.quaternion );
    if(geometries.length > 0){
        for(let i = 0; i < geometries.length; i++){
            // console.log(geometries[i])
            geometries[i].quaternion.copy( camera.quaternion );
        }
    }

    directionalLight.position.x = camera.position.x;
    directionalLight.position.z = camera.position.z;

    // レンダリング
    renderer.render(scene, camera);

    requestAnimationFrame(tick);
    
}

/**
 * TextGeometry作成を作成するためのメソッド
 * 引数：あらかじめロードしておいたフォント
 * 戻り値：なし
 */
function createText(font) {
    for(let i = thoughts.length; i < db_thoughts.length; i++){
        let thought = db_thoughts[i];
        if(thought.length > 20) {
            thought = thought.substring(0, 20) + '...'
        }
        const textGeometry = new TextGeometry(thought, {
            font: font,
            size:  20,
            height: 10,
            curveSegments: 5,
            bevelEnabled: true,
            bevelThickness: 0.1,
            bevelSize: 0.2,
            bevelOffset: 0,
            bevelSegments: 3,
        });
        const textMaterial = new THREE.MeshBasicMaterial({ color : colorCodes[Math.floor(Math.random() * (colorCodes.length))]});
        const text = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.push(text);
    }
    // let log1 = document.getElementById('log1');
    // log1.innerHTML += 'データ表示処理...' + '<br>';
    thoughts = db_thoughts.slice(0, db_thoughts.length);
    placement();
}

/**
 * メッシュを円周上に配置するためのメソッド
 * 引数：ジオメトリの配列
 * 戻り値：なし
 */
function placement() {

    textMesh.map((geometry, index) => {        
        if(index > textMesh.length - 20) {
            // 3D表示インスタンスのsceneプロパティーが3D表示空間となる
            container.add(geometry);
    
            // geometry情報を保持しておく
            geometries.push(geometry);
    
            // 円周上に配置
            if(index < x_index.length){
                geometry.position.x = x_index[index];
                geometry.position.y = y_index[index];
                geometry.position.z = z_index[index];
            } else {
                x_index.push(300 * Math.sin((index / textMesh.length) * Math.PI * 3));
                z_index.push(300 * Math.cos((index / textMesh.length) * Math.PI * 3));
                y_index.push(Math.floor((Math.random() * 300 - 200)));
                geometry.position.x = x_index[index];
                geometry.position.y = y_index[index];
                geometry.position.z = z_index[index];
            }
        }
    });
}

/**
 * phpとのajax通信をするためのメソッド
 * パラメータ付きURLを作成し、phpを呼び出す
 */
function getAllData(){
    // let log1 = document.getElementById('log1');
    // log1.innerHTML += 'HTMLRequest開始...' + '<br>';
    $.ajax({
        // 通信先ファイル名
        url: "http://localhost/_select.php",
        type: 'post',
        datatype : 'text',
        contentType: 'application/json',

        // 通信が成功した時
        success: function(data) { 
            db_thoughts = JSON.parse(data);
            
            // log1.innerHTML += 'DBのデータ取得中...' + '<br>';
            // log1.innerHTML += 'HTMLRequest終了...' + '<br>';
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
            console.log("XMLHttpRequest : " + XMLHttpRequest.status);
            console.log("textStatus     : " + textStatus);
            console.log("errorThrown    : " + errorThrown.message);
        },
        complete: function() { 
            console.log('ajax finish1');
            const fontLoader = new FontLoader();
            fontLoader.load("../fonts/07YasashisaGothic_Regular.json", function(font) {                
                createText(font);
            });
        }
    });

}
