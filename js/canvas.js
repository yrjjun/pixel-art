/* ====== DOM 元素 ====== */
const canvas = document.getElementById("canvas");
const canvasWrapper = document.getElementById("canvasWrapper");
const previewLayer = document.getElementById("previewLayer");
const selectionLayer = document.getElementById("selectionLayer");


let pixelData = [];           // ROWS x COLS 的颜色值

/* ====== 初始化数据/画布 ====== */
function initData() {
    pixelData = Array.from({length: ROWS}, () => Array.from({length: COLS}, () => colorPalette[0]));
}

function initCanvas() {
    canvas.innerHTML = "";
    resizeWrapper();

    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
            const d = document.createElement("div");
            d.className = "pixel";
            d.dataset.x = x;
            d.dataset.y = y;
            d.style.width = PIXEL_SIZE + "px";
            d.style.height = PIXEL_SIZE + "px";
            d.style.backgroundColor = pixelData[y][x];
            canvas.appendChild(d);
        }
    }
    renderSelectionLayer();
}

/* ====== 画布大小调整 ====== */
function resizeWrapper() {
    PIXEL_SIZE = Math.min(Math.min(window.innerWidth * 0.0125, window.innerHeight * 0.03), 20) || 10
    canvas.style.gridTemplateColumns = `repeat(${COLS}, ${PIXEL_SIZE}px)`;
    canvas.style.gridTemplateRows = `repeat(${ROWS}, ${PIXEL_SIZE}px)`;
    canvas.style.width = (COLS * PIXEL_SIZE) + "px";
    canvas.style.height = (ROWS * PIXEL_SIZE) + "px";
    canvasWrapper.style.width = (COLS * PIXEL_SIZE + 18) + "px";
    canvasWrapper.style.height = (ROWS * PIXEL_SIZE + 18) + "px";
    previewLayer.style.width = (COLS * PIXEL_SIZE) + "px";
    previewLayer.style.height = (ROWS * PIXEL_SIZE) + "px";
    selectionLayer.style.width = (COLS * PIXEL_SIZE) + "px";
    selectionLayer.style.height = (ROWS * PIXEL_SIZE) + "px";
    document.querySelectorAll(".pixel").forEach(p => {
        p.style.width = `${PIXEL_SIZE}px`;
        p.style.height = `${PIXEL_SIZE}px`;
    });
}

/* ====== 预览绘制（画图形） ====== */
function renderPreview(pixels) {
    previewLayer.innerHTML = "";
    if (!pixels || pixels.length === 0) return;
    pixels.forEach(p => {
        const el = document.createElement("div");
        el.style.position = "absolute";
        el.style.width = PIXEL_SIZE + "px";
        el.style.height = PIXEL_SIZE + "px";
        el.style.left = (p.x * PIXEL_SIZE) + "px";
        el.style.top = (p.y * PIXEL_SIZE) + "px";
        el.style.backgroundColor = currentColor;
        el.style.opacity = 0.35;
        previewLayer.appendChild(el);
    });
}

/* ====== 选区渲染 ====== */
function renderSelectionLayer() {
    selectionLayer.innerHTML = "";
    // 粘贴/移动预览优先显示（颜色块 + 斜线覆盖）
    if (clipboard && pasteOffset) {
        for (let sy = 0; sy < clipboard.h; sy++) {
            for (let sx = 0; sx < clipboard.w; sx++) {
                const col = clipboard.cells[sy][sx];
                if (col == null) continue;
                const x = pasteOffset.x + sx, y = pasteOffset.y + sy;
                if (x < 0 || x >= COLS || y < 0 || y >= ROWS) continue;
                const el = document.createElement('div');
                el.className = 'sel-preview';
                el.style.left = (x * PIXEL_SIZE) + 'px';
                el.style.top = (y * PIXEL_SIZE) + 'px';
                el.style.width = (PIXEL_SIZE) + 'px';
                el.style.height = (PIXEL_SIZE) + 'px';
                el.style.backgroundColor = col;
                selectionLayer.appendChild(el);
            }
        }
        // 边框
        const border = document.createElement('div');
        border.className = 'sel-border';
        border.style.left = (pasteOffset.x * PIXEL_SIZE) + 'px';
        border.style.top = (pasteOffset.y * PIXEL_SIZE) + 'px';
        border.style.width = (clipboard.w * PIXEL_SIZE) + 'px';
        border.style.height = (clipboard.h * PIXEL_SIZE) + 'px';
        selectionLayer.appendChild(border);
        return;
    }

    // 常规选区每像素显示斜线
    selectionPixels.forEach(k => {
        const [x, y] = k.split(',').map(Number);
        const el = document.createElement('div');
        el.className = 'sel-pixel';
        el.style.left = (x * PIXEL_SIZE) + 'px';
        el.style.top = (y * PIXEL_SIZE) + 'px';
        el.style.width = (PIXEL_SIZE) + 'px';
        el.style.height = (PIXEL_SIZE) + 'px';
        selectionLayer.appendChild(el);
    });
    if (selectionBounds) {
        const b = selectionBounds;
        const border = document.createElement('div');
        border.className = 'sel-border';
        border.style.left = (b.minX * PIXEL_SIZE) + 'px';
        border.style.top = (b.minY * PIXEL_SIZE) + 'px';
        border.style.width = ((b.maxX - b.minX + 1) * PIXEL_SIZE) + 'px';
        border.style.height = ((b.maxY - b.minY + 1) * PIXEL_SIZE) + 'px';
        selectionLayer.appendChild(border);
    }
}