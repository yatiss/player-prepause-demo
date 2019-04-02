/*************************************************************
 *      iframe预热方案,
 *************************************************************/
$(() => {
    const sourceidArr = [
      'res-6f74fd406b93cb66f25607bf347d63d4', // 电与磁
      'res-3a674ba1f210a3ec0b986c3c044d18da', // 声学
      'res-09be2259345bcfaa4aaab3724fc7ccc3', // 热学
      'res-0057fb7bb2a7903d007ee4c5e8c56872', // 光学
      'res-0e853dbcbd443c2c6a20329e7667c3fd', // 力学
      'res-5fb846f693bab8d6812f031e7ce7972e' // 力与运动
    ];
    // 不可以用 display 或改变宽高, 播放器需要用宽高计算场景；可以用 visibility 或 z-index 隐藏
    $('#viewIframeId').css('visibility', 'hidden');
    // 预加载
    this.preload();
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
                if(sourceidArr.length) {
                    this.setSourceId(sourceidArr.shift());
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
function preload() {
    // 添加 pause=1 参数,加载完成自动暂停
    const url = 'https://wuliplayercdn.nobook.com/?from=zuoyebang&type=nobook&sourceid=res-a40b09d7454c1081adacf0da5b91c912&pause=1';
    // const url = 'http://localhost:4800/?from=zuoyebang&type=nobook&sourceid=res-a40b09d7454c1081adacf0da5b91c912&pause=1';
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