/*************************************************************
 *      iframe预热方案
 *************************************************************/
const idlist = [
    "a40b09d7454c1081adacf0da5b91c912",
    "30bf42716e4849d0d58a10483757c6a9",
    "3a674ba1f210a3ec0b986c3c044d18da"
];
$(() => {
    const hashId = md5(idlist);
    console.log('~~~~~hashId:', hashId); // 693e9af84d3dfcc71e640e005bdc5e2e
    // 不可以用 display 或改变宽高, 播放器需要用宽高计算场景；可以用 visibility 或 z-index 隐藏
    $('#viewIframeId').css('visibility', 'hidden');
    // 预加载
    this.preload(hashId);
    // 秒切
    let num = 1;
    this.setLabel(num);
    $('.switch-btn').click(() => {
        console.log('~切换课件');
        num++;
        this.setLabel(num);
        // 播放
        if (num % 2) {
            $('#viewIframeId').css('visibility', 'hidden');
            clearAndStop(); // 清空并暂停实验
        } else {
            $('#viewIframeId').css('visibility', 'visible');
            if (num > 3) {
                if(idlist.length) {
                    this.setSourceId(idlist.shift());
                } else {
                    layer.alert('没实验了');
                }
            }
            play(); // 播放实验
        }
    });
});

function setLabel(num) {
    $('.tip-label').text('当前正在播放第'+num+'个课件');
}

// 预加载
function preload(hashId) {
    const url = 'http://localhost:8080/local/' + hashId+'?from=wangxiao&type=nobook&pause=1&sourceid='+idlist.shift();
    // 添加 pause=1 参数,加载完成自动暂停
    // const url = 'https://wuliplayercdn.nobook.com/?from=wangxiao&type=nobook&sourceid=res-a40b09d7454c1081adacf0da5b91c912&pause=1';
    console.log('预览:', url);
    $('#viewIframeId').attr('src', url); // 设置src
    // 可以监听实验加载情况
    window.addEventListener('message', (event) => {
        switch (event.data.type) {
            case 'onload':
                console.log('~~~~~~~~~~~加载成功');
                layer.msg('播放器加载成功！');
                $('.switch-btn').attr('disabled', false); // 放开点击按钮, 如果在加载完成前点击则会看到加载过程
                break;
            case 'load_error':
                console.log('~~~~~~~~~~~加载失败');
                layer.msg('错误，实验不存在');
                break;
        }
    });
}
// 设置实验id,切换实验
function setSourceId(sourceid) {
    console.log('***************************setSourceId:', sourceid);
    this.sendMess({type:'PHYSICS_SET_SOURCEID', sourceid: sourceid});
}
// 播放实验
function play() {
    this.sendMess({type:'PHYSICS_PLAYER_PLAY'});
}
// 清空并暂停
function clearAndStop() {
    this.sendMess({type:'PHYSICS_PLAYER_CLEAR_AND_STOP'});
}
// postMessage 通信
function sendMess(obj) {
    const iframeWindow = $('#viewIframeId')[0].contentWindow;
    iframeWindow.postMessage(obj, '*');
}