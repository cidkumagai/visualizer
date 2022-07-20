let btn = document.getElementById('submit');
btn.addEventListener('click', function(){
	let select = confirm("送信しますか？\n「OK」で送信「キャンセル」で送信中止");
    if(select) {
        let text = document.getElementById('text');
        let userAgent = navigator.userAgent;
        $.ajax({
            // 通信先ファイル名
            url: 'http://localhost/_insert.php?thought=' +  text.value + '&useragent=' + userAgent,
            type: 'post',
            datatype : 'text',
            contentType: 'application/json',
            // 通信が成功した時
            success: function() { 
                alert('追加しました！');
            },
            error: function(XMLHttpRequest, textStatus, errorThrown){
                console.log("XMLHttpRequest : " + XMLHttpRequest.status);
                console.log("textStatus     : " + textStatus);
                console.log("errorThrown    : " + errorThrown.message);
            },
            complete: function() { 
                console.log('ajax finish');
            }
        });
    }
});

console.log(navigator.userAgent);