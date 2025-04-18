const track = document.getElementById('sliderTrack');
const indexText = document.getElementById('sliderIndex');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const toggleBtn = document.getElementById('toggleBtn');

const imageWidth = 300;
let isPlaying = true;
let intervalId = null;
let currentIndex = 0;

// 인덱스 갱신
function updateIndexText() {
  const index = (currentIndex % 4) + 1;
  indexText.textContent = `${String(index).padStart(2, '0')} / 04`;
}

// 슬라이드 왼쪽으로 이동 후 첫 번째 요소를 뒤로 보냄
function slideNext() {
  track.style.transition = 'transform 0.3s ease';
  track.style.transform = `translateX(-${imageWidth}px)`;
  currentIndex = (currentIndex + 1) % 4;
  updateIndexText();

  setTimeout(() => {
    track.appendChild(track.children[0]); // 첫 이미지 맨 뒤로
    track.style.transition = 'none';
    track.style.transform = 'translateX(0)';
  }, 300);
}

// 슬라이드 오른쪽으로 이동 후 마지막 요소를 앞으로 보냄
function slidePrev() {
  track.insertBefore(track.lastElementChild, track.firstElementChild);
  track.style.transition = 'none';
  track.style.transform = `translateX(-${imageWidth}px)`;

  setTimeout(() => {
    track.style.transition = 'transform 0.3s ease';
    track.style.transform = 'translateX(0)';
  }, 10);

  currentIndex = (currentIndex - 1 + 4) % 4;
  updateIndexText();
}

// 자동 슬라이드
function startAutoSlide() {
  intervalId = setInterval(slideNext, 2000);
}

function stopAutoSlide() {
  clearInterval(intervalId);
}

toggleBtn.addEventListener('click', () => {
  if (isPlaying) {
    stopAutoSlide();
    toggleBtn.textContent = '▶️';
  } else {
    startAutoSlide();
    toggleBtn.textContent = '⏸️';
  }
  isPlaying = !isPlaying;
});

prevBtn.addEventListener('click', () => {
  stopAutoSlide();
  slidePrev();
});

nextBtn.addEventListener('click', () => {
  stopAutoSlide();
  slideNext();
});

// 초기 세팅
updateIndexText();
startAutoSlide();
