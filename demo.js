$(() => {
    // 不可以用 display 或改变宽高, 播放器需要用宽高计算场景；可以用 visibility 或 z-index 隐藏
    $('#viewIframeId').css('visibility', 'hidden');
    // 预加载
    this.preload();
    // 秒切
    const iframeWindow = $('#viewIframeId')[0].contentWindow;
    $('.switch-btn').click(() => {
        console.log('秒切实验~');
        // 播放
        iframeWindow.postMessage({
            type: 'PHYSICS_PLAYER_PLAY'
        }, '*');
        $('#viewIframeId').css('visibility', 'visible');
    });
});

// 预加载
function preload() {
    // 添加 pause=1 参数,加载完成自动暂停
    const url = 'https://wuliplayercdn.nobook.com/?from=zuoyebang&type=nobook&sourceid=res-a40b09d7454c1081adacf0da5b91c912&pause=1';
    console.log('预览:', url);
    $('#viewIframeId').attr('src', url);
}