import * as THREE from "../build/three.module.js";
import { FontLoader } from "../loaders/FontLoader.js";
import { TextGeometry } from "../geometries/TextGeometry.js";

// ページの読み込みを待つ
window.addEventListener('DOMContentLoaded', init);

// グローバル変数宣言部分
let scene, camera, renderer, container;
let rot = 0;
let textMesh = [];
let thoughts = [];
let geometries = [];

/**
 * ページの読み込みが完了したら最初に実行される
 * 引数・戻り値：なし
 */
function init(){    
    // シーンの追加
    scene = new THREE.Scene();

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

    // テキスト表示
    thoughts = ['test', 'テスト', '検査']
    
    const fontLoader = new FontLoader();
    fontLoader.load("../fonts/07YasashisaGothic_Regular.json", function(font) {
        createText(font);
    });

    /**
    * 真ん中に配置するオブジェクト作成
    */

    // sphere（球）の作成
    const sphereGeometry = new THREE.SphereGeometry(100);
    const sphereMaterial = new THREE.MeshBasicMaterial({color: 0x1597bb, wireframe: true});
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

    // sphereの配置
    sphere.position.x = 0;
    sphere.position.y = 10;
    sphere.position.z = 1;

    // sphereをsceneに追加して表示する
    scene.add(sphere);

    // ウィンドウのサイズが変わったら実行
    window.addEventListener("resize", onWindowResize)

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
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}

/**
 * 毎フレーム時に実行されるループイベント
 * 引数・戻り値：なし
 */
function tick() {

    rot += 0.5; // 毎フレーム角度を0.5度ずつ足していく
    // ラジアンに変換する
    const radian = (rot * Math.PI) / 180;
    // 角度に応じてカメラの位置を設定
    camera.position.x = 1000 * Math.sin(radian);
    camera.position.z = 1000 * Math.cos(radian);
    // 原点方向を見つめる
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // 常にカメラ方向を向かせる
    if(geometries.length > 0){
        for(let i = 0; i < geometries.length; i++){
            geometries[i].quaternion.copy( camera.quaternion );
        }
    }
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
    for(let i = 0; i < thoughts.length; i++){
        const textGeometry = new TextGeometry(thoughts[i], {
            font: font,
            size: 25,
            height: 15,
            curveSegments: 5,
            bevelEnabled: true,
            bevelThickness: 0.1,
            bevelSize: 0.2,
            bevelOffset: 0,
            bevelSegments: 3,
        });
    
        const textMaterial = new THREE.MeshBasicMaterial({ color : generateRandomCode});
        const text = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.push(text);
    }
    placement();
    num++;
}
 
/**
 * カラーコードを自動生成をするためのメソッド
 * 引数・戻り値：なし
 */
function generateRandomCode() {
    let randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
    return randomColor;
}

/**
 * メッシュを円周上に配置するためのメソッド
 * 引数：ジオメトリの配列
 * 戻り値：なし
 */
function placement() {
    console.log('呼び出されてる');
    console.log(textMesh.length)
    console.log(textMesh)
    textMesh.map((geometry, index) => {        
        
        // 3D表示インスタンスのsceneプロパティーが3D表示空間となる
        container.add(geometry);

        // geometry情報を保持しておく
        geometries.push(geometry);
        // 円周上に配置
        geometry.position.x = 300 * Math.sin((index / textMesh.length) * Math.PI * 2);
        geometry.position.z = 300 * Math.cos((index / textMesh.length) * Math.PI * 2);
    });
}