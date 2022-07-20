document.addEventListener('DOMContentLoaded', init);

let datas;
function init() {
    const type = 'pie';
    const ctx = document.getElementById('chart').getContext('2d');//表示する場所取得

    //ここで今までの設定した値を出力
    let myChart;
    setInterval(function() {
        getPoint();
        if (datas) {
            if (myChart) {
                myChart.destroy();
            }
            let sum = Number.parseFloat(datas[0]) + Number.parseFloat(datas[1]);
            console.log(`${sum},${Math.round((datas[0] / sum) * 10000) / 100},${Math.round((datas[1] / sum) * 10000) / 100}`);
            myChart = new Chart(ctx, {
                type: type,
                data: {
                    labels: ['positive', 'negative'],
                    datasets: [
                        {
                            backgroundColor: ['blue','red'],
                            data: [Math.round((datas[0] / sum) * 10000) / 100, Math.round((datas[1] / sum)* 10000) / 100],
                            borderWidth: 1,
                        }
                    ]
                },
                options: {
                    responsive: false,
                    plugins: {
                        datalabels: {
                            color: '#000',
                            font: {
                                weight: 'bold',
                                size: 30,
                            },
                            formatter: (value, ctx) => {
                                let label = ctx.chart.data.labels[ctx.dataIndex];
                                return `${label}\n${Math.floor(value)}%` 
                            },
                        },
                        legend : {// 凡例の非表示
                            display : false
                        }
                    },
                },
                plugins: [ChartDataLabels]
            });
            myChart.canvas.style.height = '20%';
            myChart.canvas.style.width = '20%';
        }
    }, 10000);

}

function getPoint(){
    $.ajax({
        // 通信先ファイル名
        url: "http://localhost/_get_point.php",
        type: 'post',
        datatype : 'text',
        contentType: 'application/json',

        // 通信が成功した時
        success: function(data) { 
            // console.log(JSON.parse(data));
            datas = JSON.parse(data);
            // return JSON.parse(data);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
            console.log("XMLHttpRequest : " + XMLHttpRequest.status);
            console.log("textStatus     : " + textStatus);
            console.log("errorThrown    : " + errorThrown.message);
        },
        complete: function() { 
            console.log('ajax finish2');
        }
    });
}
