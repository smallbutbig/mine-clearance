// 游戏状态 0.未开始 1.失败 2.获胜
var start = 0;

// 当前递归次数
var time = 0;
// 递归最大次数
var limit = 1000;

// 雷盘
var arrLei = new Array();

// 纵向长度
var mainBoxX = 30;
// 横向长度
var mainBoxY = 30;
// 雷数量
var mainBoxLei = 160;

/** -----屏蔽右键点击----- **/
if (window.Event)
    document.captureEvents(Event.MOUSEUP);

function nocontextmenu() {
    event.cancelBubble = true
    event.returnValue = false;
    return false;
}

function norightclick(e) {
    if (window.Event) {
        if (e.which == 2 || e.which == 3)
            return false;
    } else
    if (event.button == 2 || event.button == 3) {
        event.cancelBubble = true
        event.returnValue = false;
        return false;
    }
}
document.oncontextmenu = nocontextmenu;
document.onmousedown = norightclick;
/** -----屏蔽右键点击----- **/


/**
 * 游戏初始化
 */
function begin() {
    var arr = new Array();
    var x = mainBoxX;
    var y = mainBoxY;
    // 构造游戏盘子
    for (i = 0; i < x; i++) {
        arr.push(new Array());
        for (j = 0; j < y; j++) {
            arr[i].push(0);
        }
    }

    // 雷数量检测
    var lei = mainBoxLei;
    if (x * y < lei*5) {
        alert('雷数量过多');
        return false;
    }
    // 注入雷
    arr = initLei(arr, x, y, lei, 0);

    // 建立坐标及界面渲染
    arrLei = arr;
    html = '';
    for (i = 0; i < x; i++) {
        for (j = 0; j < y; j++) {
            if (arr[i][j] != 's') {
                var num = 0;
                ownCallBack(i, j, function(x, y) {
                    arrLei[x][y] == 's' ? num++ : false;
                });
                arr[i][j] = num;
            }
            html += `<button class="black"  onmousedown="checkDown(event)" onmouseup="checkUp(event,` + i + `,` + j + `,this)"></button>`;
        }
        html += `<br>`;
    }
    document.getElementById("main").innerHTML = html
    start = 0;

    // console.log(arrLei);
}

/**
 * 
 * @param {array} arr 
 * @param {int} x 
 * @param {int} y 
 * @param {int} lei 
 * @param {int} num 
 */
function initLei(arr, x, y, lei, num) {
    // 限制递归次数
    if (time == limit) {
        time = 0;
        limit = 1000;
        return arr;
    }
    time++
    if (lei <= num) {
        return arr;
    }

    // 随机取雷坐标
    var rx = parseInt(Math.random() * x);
    var ry = parseInt(Math.random() * y);
    // 是否已有雷判断
    if (arr[rx][ry] != 's') {
        arr[rx][ry] = 's';
        num++;
    }
    // 递归注入雷
    return initLei(arr, x, y, lei, num);
}

/**
 * 打开白格子
 * @param {int} x 
 * @param {int} y 
 * @param {dom} div 
 */
function openBox(x, y, div) {
    // 判断是否存在旗子标记
    var hasFlag = hasClass(div, 'flag')
    if (hasFlag) {
        return false;
    }

    // 雷判断
    if (arrLei[x][y] != 's' && start == 0) {
        div.classList.add("show")
        div.innerHTML = arrLei[x][y]
        if (arrLei[x][y] == 0) {
            openBlack(x, y);
        }
        // 判断胜负
        checkWin()
        return false
    }
    if (start != 0) {
        alert('请重新开始');
        return false
    }
    gameDie();
}

/**
 * 双击效果，扫雷
 */
function checkFlag(x, y, div) {
    if (!hasClass(div, 'show') || hasClass(div, 'flag')) {
        return false;
    }

    // 标记旗子等于实际雷数，自动开盒子
    var realNumLei = arrLei[x][y];
    var gloablLei = 0;
    var gloablQi = 0
    ownCallBack(x, y, function(x, y) {
        var dom = document.getElementById("main").children
        if (hasClass(dom[x*(mainBoxY+1)+y], 'flag')) {
            gloablLei++
        }
        if (!hasClass(dom[x*(mainBoxY+1)+y], 'show')) {
            gloablQi++
        }
    });
    if (gloablLei == realNumLei) {
        autoOpenBox(x, y);
    }

    // 未开盒子数等于实际雷数，自动标记旗子
    if (gloablQi == realNumLei) {
        ownCallBack(x, y, function(x, y) {
            var dom = document.getElementById("main").children
            if (!hasClass(dom[x*(mainBoxY+1)+y], 'flag') && !hasClass(dom[x*(mainBoxY+1)+y], 'show')) {
                addClass(dom[x*(mainBoxY+1)+y], "flag")
                dom[x*(mainBoxY+1)+y].innerHTML = 'p';
            }
        });
    }
}

/**
 * 自动开格子
 * @param {int} x 
 * @param {int} y 
 */
function autoOpenBox(x, y) {
    ownCallBack(x, y, function(x, y) {
        var dom = document.getElementById("main").children
        if (!hasClass(dom[x*(mainBoxY+1)+y], 'flag') && !hasClass(dom[x*(mainBoxY+1)+y], 'show')) {
            openBox(x,y,dom[x*(mainBoxY+1)+y]);
        }
    });
}

/**
 * 开空白格子--实现
 * @param {int} x 
 * @param {int} y 
 */
function openBlack(x, y) {
    var dom = document.getElementById("main").children
    ownCallBack(x, y, function(x, y) {
        if (!hasClass(dom[x*(mainBoxY+1)+y], 'show')) {
            removeClass(dom[(x)*(mainBoxY+1)+y], 'flag');
            dom[(x)*(mainBoxY+1)+y].classList.add("show");
            dom[(x)*(mainBoxY+1)+y].innerHTML = arrLei[x][y];
            if (arrLei[x][y] == 0) {
                openBlack(x, y);
            }
        }
    })
}

function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}

function removeClass(element, cls) {
    if (hasClass(element, cls)) {
        element.classList.remove(cls)
    }
}

function addClass(element, cls) {
    if (!hasClass(element, cls)) {
        element.classList.add(cls)
    }
}

/**
 * 标记旗子
 * @param {int} x 
 * @param {int} y 
 * @param {dom} div 
 */
function openFlag(x, y, div) {
    var hasFlag = hasClass(div, 'flag')
    var hasShow = hasClass(div, 'show')
    if (hasShow) {
        return false;
    }
    if (hasFlag) {
        div.classList.remove("flag");
        div.innerHTML = '';
        return false;
    }
    div.classList.add("flag");
    div.innerHTML = 'p';
    checkWin()
}

/**
 * 获胜判断
 */
function checkWin() {
    var dom = document.getElementById("main").children;
    var x = mainBoxX;
    var y = mainBoxY;

    for (i=0;i<x;i++) {
        for (j=0;j<y;j++) {
            if (!hasClass(dom[i*(mainBoxY+1)+j],'show') && arrLei[i][j] != 's') {
                return false
            }
        }
    }
    gameWin();
    return false;
}

/**
 * 获胜
 */
function gameWin() {
    start = 2;

    // 显示所有标记
    var dom = document.getElementById("main").children;
    for (i=0;i<mainBoxX;i++) {
        for (j=0;j<mainBoxY;j++) {
            if (arrLei[i][j] == 's') {
                if (hasClass(dom[i*(mainBoxY+1)+j], 'flag')) {
                    dom[i*(mainBoxY+1)+j].classList.remove('flag');
                }
                dom[i*(mainBoxY+1)+j].classList.add('lei');
                dom[i*(mainBoxY+1)+j].innerHTML = 'X';
            } else {
                if (!hasClass(dom[i*(mainBoxY+1)+j], 'show')) {
                    dom[i*(mainBoxY+1)+j].classList.add('show');
                }
                dom[i*(mainBoxY+1)+j].innerHTML = arrLei[i][j];
            }            
        }
    }
    document.getElementById("restart").style.display = "inline"
    alert('通关');
}

/**
 * 失败
 */
function gameDie() {
    var dom = document.getElementById("main").children
    var x = mainBoxX
    var y = mainBoxY
    for (i=0; i<x; i++) {
        for (j=0; j<y; j++) {
            if (arrLei[i][j] == 's') {
                removeClass(dom[i*(mainBoxY+1)+j], 'flag');
                addClass(dom[i*(mainBoxY+1)+j], 'lei')
                addClass(dom[i*(mainBoxY+1)+j], 'show')
                dom[i*(mainBoxY+1)+j].innerHTML = 's';
            }
        }
    }

    start = 1;
    document.getElementById("restart").style.display = "inline"
    alert('已被炸死，请重新游戏');
}


/**
 * 周围点回调（3-8次）
 * @param {int} x 
 * @param {int} y 
 * @param {function} fun 
 */
function ownCallBack(x, y, fun) {
    if (fun!=undefined && typeof fun=='function') {
        if (x-1>=0) {
            if (y-1 >= 0) {
                fun(x-1, y-1);
            }
            fun(x-1, y);
            if (y+1 < mainBoxY) {
                fun(x-1,y+1)
            }
        }
        if (y-1 >= 0) {
            fun(x,y-1);
        }
        if (y+1 < mainBoxY) {
            fun(x,y+1);
        }
        if (x+1 < mainBoxX) {
            if (y-1 >= 0) {
                fun(x+1,y-1);
            }
            fun(x+1,y);
            if (y+1 < mainBoxY) {
                fun(x+1,y+1);
            }
        }
    }
}