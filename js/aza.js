// 保证只创建一次
let _toyAvatarCreated = false;
let _audioCtx = null;
let _audioBuffer = null;

// 预加载音频
function preloadAudio() {
  if (!_audioCtx) _audioCtx = new window.AudioContext();
  const ctx = _audioCtx;

  fetch('./assets/sound/duck-toy-sound.ogg')
    .then(response => response.arrayBuffer())
    .then(data => ctx.decodeAudioData(data))
    .then(buffer => {
      _audioBuffer = buffer;
    })
    .catch(err => console.error('Error loading audio:', err));
}

function handleUnlockClick() {
    // 打开新标签页
    window.open('https://live.bilibili.com/52030', '_blank');

    // 获取按钮元素并应用激活状态
    const button = document.getElementById('unlock');
    applyActivationState(button);

    spawnToyAvatar();
}

// 封装按钮激活逻辑
function applyActivationState(button) {
    button.textContent = '已激活';
    button.classList.add('activated');
    button.disabled = true;
}

function playToySqueak() {
  try {
    if (!_audioCtx) _audioCtx = new window.AudioContext();
    const ctx = _audioCtx;

    if (_audioBuffer) {
      const source = ctx.createBufferSource();
      source.buffer = _audioBuffer;
      source.connect(ctx.destination);
      source.start(0);  // 立即开始播放
    } else {
      console.warn('Audio buffer not available.');
    }

  } catch (err) {
    console.warn('Audio not available:', err);
  }
}

function spawnToyAvatar() {
  if (_toyAvatarCreated) return;
  _toyAvatarCreated = true;

  const avatar = document.createElement('div');
  avatar.id = 'toyAvatar';
  avatar.setAttribute('role', 'button');
  avatar.innerHTML = `
    <div class="hint">🎵</div>
    <img src="../aza.webp" alt=""/>
  `;

  document.body.appendChild(avatar);

  avatar.addEventListener('click', () => {
    avatar.classList.remove('squeeze');
    void avatar.offsetWidth;  // 强制重绘
    avatar.classList.add('squeeze');
    playToySqueak();
  });

  ['mousedown', 'mouseup', 'mouseleave'].forEach(eventType => {
    avatar.addEventListener(eventType, _ => {
      avatar.style.transform = eventType === 'mousedown' ? 'scale(0.98)' : '';
    });
  });
}