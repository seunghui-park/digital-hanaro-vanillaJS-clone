const track = document.getElementById('sliderTrack');
const indexText = document.getElementById('sliderIndex');
const toggleBtn = document.getElementById('toggleBtn');

const imageWidth = 300;
const visibleImages = 4;
const loopImages = 8; // 4 실제 + 4 복제
let currentIndex = 0;
let isPlaying = true;
let intervalId = null;

// 인덱스 업데이트
function updateIndexText(idx) {
  const shownIndex = (idx % visibleImages) + 1;
  indexText.textContent = `${String(shownIndex).padStart(2, '0')} / 04`;
}

// 실제 한 칸 미끄러지는 이동
function slideStep() {
  currentIndex++;
  track.style.transition = 'transform 0.4s ease';
  track.style.transform = `translateX(-${currentIndex * imageWidth}px)`;
  updateIndexText(currentIndex);

  // 복제 세트 도달하면 순간 이동 (transition 없이)
  if (currentIndex === loopImages - visibleImages) {
    setTimeout(() => {
      track.style.transition = 'none';
      currentIndex = 0;
      track.style.transform = `translateX(0px)`;
      updateIndexText(currentIndex);
    }, 400); // transition 시간 후에 순간 리셋
  }
}

// 자동 슬라이드 시작
function startSlider() {
  intervalId = setInterval(slideStep, 2000); // 2초마다 이동
}

// 정지/재생 토글
toggleBtn.addEventListener('click', () => {
  if (isPlaying) {
    clearInterval(intervalId);
    toggleBtn.textContent = '▶️';
  } else {
    startSlider();
    toggleBtn.textContent = '⏸️';
  }
  isPlaying = !isPlaying;
});

// 초기 세팅
track.style.transform = `translateX(0px)`;
track.style.transition = 'none';
updateIndexText(0);
startSlider();
