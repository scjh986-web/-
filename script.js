// 1. 基础配置
const TEXT_LIST = [
    "2025蛇年大吉(点击下方导出照片)", 
    "阖家团圆 万事如意", 
    "财源广进 步步高升", 
    "待添加",
    "愿你新的一年 平安喜乐 万事顺遂 前程似锦"
];
const EXPORT_FIXED_TEXT = "我要告诉你的事情 其实是周四晚上罗博城和我说他对你的看法之类的 还给我们宿舍所有人都说 不和你闹掰就要和他闹掰了 就这些话之类的 周五的时候我想征集一下你的意见 但是回来一想感觉好像没啥必要"; 
let currentIndex = 0;

// 2. 元素获取（确保DOM加载完成后获取）
let el = {};
document.addEventListener('DOMContentLoaded', () => {
    el = {
        typeText: document.getElementById('typeText'),
        cursor: document.getElementById('cursor'),
        resetBtn: document.getElementById('resetBtn'),
        changeBtn: document.getElementById('changeBtn'),
        exportBtn: document.getElementById('exportBtn'),
        exportTempContainer: document.getElementById('exportTempContainer'),
        themeBtns: document.querySelectorAll('.theme-btn')
    };

    // 初始化功能
    init();
});

// 3. 打字机功能
function typeWriter(text) {
    el.typeText.textContent = "";
    let index = 0;
    const typeSpeed = 150;
    const timer = setInterval(() => {
        el.typeText.textContent += text[index];
        index++;
        if (index >= text.length) {
            clearInterval(timer);
        }
    }, typeSpeed);
}

// 4. 导出功能
function exportImage() {
    const bodyClass = document.body.className;
    const isSpring = bodyClass.includes('spring');
    const textColor = isSpring ? "#9e2a2b" : "#ff6b6b";
    const borderColor = isSpring ? "#ffd700" : "#4ecdc4";

    el.exportTempContainer.innerHTML = "";

    const tempBox = document.createElement('div');
    tempBox.className = "export-temp-box";
    tempBox.style.borderColor = borderColor;

    const tempText = document.createElement('h1');
    tempText.className = "export-temp-text";
    tempText.style.color = textColor;
    tempText.textContent = EXPORT_FIXED_TEXT;

    // 自适应字号
    const textLength = EXPORT_FIXED_TEXT.length;
    if (textLength > 20) {
        tempText.style.fontSize = "1.5rem";
    }

    tempBox.appendChild(tempText);
    el.exportTempContainer.appendChild(tempBox);

    // 显示临时容器
    el.exportTempContainer.style.display = "flex";

    // 等待渲染后截图
    setTimeout(() => {
        html2canvas(tempBox, {
            useCORS: true,
            allowTaint: true,
            scale: window.devicePixelRatio || 2,
            backgroundColor: null,
            removeContainer: false,
            logging: false,
            letterRendering: true
        }).then(canvas => {
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png', 1.0);
            link.download = `蛇年祝福_${new Date().getTime()}.png`;
            link.click();

            // 隐藏临时容器，恢复按钮可点击
            el.exportTempContainer.style.display = "none";
        }).catch(err => {
            console.error('导出失败:', err);
            alert('导出失败，请重试！');
            el.exportTempContainer.style.display = "none";
        });
    }, 200);
}

// 5. 事件绑定
function bindEvents() {
    // 重新打字
    el.resetBtn.addEventListener('click', () => {
        typeWriter(TEXT_LIST[currentIndex]);
    });

    // 切换文案
    el.changeBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % TEXT_LIST.length;
        typeWriter(TEXT_LIST[currentIndex]);
    });

    // 导出图片
    el.exportBtn.addEventListener('click', exportImage);

    // 主题切换
    el.themeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            el.themeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            document.body.className = `theme-${btn.dataset.theme}`;
        });
    });
}

// 6. 初始化
function init() {
    typeWriter(TEXT_LIST[currentIndex]);
    bindEvents();
}