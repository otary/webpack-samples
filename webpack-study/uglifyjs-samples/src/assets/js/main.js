/**
 * 非模块化代码不会被打包
 * @param msg
 */
function showMessage(msg) {
    // 测试
    alert(msg);
}


module.exports = {
    /**
     * 显示消息
     * @param msg
     */
    msg: function () {
        alert(1);

        console.log('----------')
    }
}
