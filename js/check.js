var leftCheck = 0;
var rightCheck = 0;
var imp = 0;

function checkDown(event) {
    imp = 1
    if (event.button == 0) {
        // 左键按下
        leftCheck = 1
        return false;
    }
    if (event.button == 2){
        // 右键按下
        rightCheck = 1
        return false;
    }
}

function checkUp(event, x, y, div) {
    if (imp == 1) {
        checkButton(x, y, div)
    }
    if (event.button == 0) {
        // 左键松开
        leftCheck = 0
        return false;
    }
    if (event.button == 2){
        // 右键松开
        rightCheck = 0
        return false;
    }
}

function checkButton(x, y, div) {
    imp = 0;
    if (leftCheck == 1 && rightCheck == 1) {
        // 双键点击效果触发
        checkFlag(x, y, div)
        return false;
    }
    if (leftCheck == 1 && rightCheck != 1) {
        // 左键点击效果触发
        openBox(x, y, div)
        return false;
    }
    if (leftCheck != 1 && rightCheck == 1) {
        // 右键点击效果触发
        openFlag(x, y, div)
        return false;
    }
}

function rebegin() {
    document.getElementById("restart").style.display = "none"
    begin()
}