function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = message;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300); // 等待过渡效果完成
        }, 2000); // 显示时间
    }, 10); // 确保元素被添加到DOM后立即开始动画
}

// 将 RGB 转 16 进制
function rgbToHex(r, g, b) {
    return "#" + [r, g, b].map(v => v.toString(16).padStart(2, "0")).join("");
}

// 查找调色板中最接近的颜色
function findNearestPaletteColor(palette, targetHex) {
    const [r1, g1, b1] = hexToRgb(targetHex);
    let minDist = Infinity, nearest = palette[0];
    for (const c of palette) {
        const [r2, g2, b2] = hexToRgb(c);
        const d = (r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2;
        if (d < minDist) {
            minDist = d;
            nearest = c;
        }
    }
    return nearest;
}

// HEX 转 RGB
function hexToRgb(hex) {
    const n = parseInt(hex.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/* ====== 鼠标坐标映射 ====== */
function getPixelFromEvent(e) {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / PIXEL_SIZE);
    const y = Math.floor((e.clientY - rect.top) / PIXEL_SIZE);
    if (x >= 0 && x < COLS && y >= 0 && y < ROWS) return {x, y};
    return null;
}