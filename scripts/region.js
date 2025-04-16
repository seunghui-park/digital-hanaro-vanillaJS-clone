import regionData from '../data/regionData.js';

const monthLabels = document.getElementById('month-labels');
const dateSlider = document.getElementById('date-slider');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');

const formatDate = (date) => date.toISOString().split('T')[0];
let baseDate = new Date();
let selectedDateStr = formatDate(baseDate);

const get14DayRange = (startDate) => {
  return [...Array(14)].map((_, i) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    return date;
  });
};

const renderMonthLabels = (range) => {
  const monthSet = new Set(
    range.map((date) => `${date.getFullYear()}.${date.getMonth() + 1}`),
  );
  monthLabels.innerHTML = [...monthSet]
    .map(
      (m) => `
    <div class="border rounded-full px-3 py-1">${m}</div>
  `,
    )
    .join('');
};

const eventList = document.createElement('div');
eventList.id = 'event-list';
eventList.className = 'flex gap-6 overflow-x-auto snap-x px-2 pb-4';
document.getElementById('main').appendChild(eventList);

const renderDateSlider = () => {
  dateSlider.innerHTML = '';
  const range = get14DayRange(baseDate);
  renderMonthLabels(range);

  const todayStr = formatDate(new Date());

  range.forEach((date) => {
    const dateStr = formatDate(date);
    const isToday = dateStr === todayStr;
    const isSelected = dateStr === selectedDateStr;
    const day = date.getDay();

    const button = document.createElement('button');
    button.className = `
        flex flex-col items-center justify-center w-12 py-2 rounded-full text-sm shrink-0
        ${isSelected ? 'bg-black text-white' : ''}
        ${!isSelected ? 'hover:bg-gray-200' : ''}
        ${day === 0 ? 'text-red-500' : day === 6 ? 'text-blue-500' : 'text-gray-800'}
        transition-all
    `;
    button.innerHTML = `
      <span class="font-semibold">${date.getDate()}</span>
      <span class="text-xs">
        ${['일', '월', '화', '수', '목', '금', '토'][day]}
        ${isToday ? "<span class='text-[10px] text-red-400'>(오늘)</span>" : ''}
      </span>
    `;
    button.dataset.date = dateStr;

    button.addEventListener('click', () => {
      selectedDateStr = dateStr;
      renderDateSlider();
      renderEventList(selectedDateStr);
    });

    dateSlider.appendChild(button);

    if (isSelected) {
      setTimeout(
        () => button.scrollIntoView({ inline: 'center', behavior: 'smooth' }),
        0,
      );
    }
  });

  renderEventList(selectedDateStr);
};

prevBtn.addEventListener('click', () => {
  baseDate.setDate(baseDate.getDate() - 14);
  renderDateSlider();
});
nextBtn.addEventListener('click', () => {
  baseDate.setDate(baseDate.getDate() + 14);
  renderDateSlider();
});

const applySliderOffset = () => {
  const track = document.getElementById('slider-track');
  const cardWidth = 640;
  const gap = 24; // gap-6 = 1.5rem = 24px
  const screenWidth = window.innerWidth;
  const padding = Math.max((screenWidth - cardWidth - gap) / 2, 0);
  track.style.paddingLeft = `${padding}px`;
};

const renderEventList = (selectedDate) => {
  const wrapper = document.getElementById('slider-wrapper');
  const track = document.getElementById('slider-track');
  const pagination = document.getElementById('pagination');
  const prevBtn = document.getElementById('slide-prev');
  const nextBtn = document.getElementById('slide-next');

  track.innerHTML = '';
  pagination.innerHTML = '';
  applySliderOffset();

  const filtered = regionData.filter((event) => {
    return selectedDate >= event.startDate && selectedDate <= event.endDate;
  });

  if (filtered.length === 0) {
    track.innerHTML = `<p class="text-center text-gray-300 w-full">해당 날짜에 축제가 없습니다.</p>`;
    return;
  }

  let currentIndex = 0;

  // 카드 및 gap 설정
  const slideWidth = 640;
  const gap = 24; // gap-6 = 24px

  // 카드 생성
  filtered.forEach((event, index) => {
    const card = document.createElement('div');
    card.className = `
          bg-white text-black rounded-xl shadow-md overflow-hidden flex
          flex-shrink-0 w-[640px] transition-transform duration-300
          ${index === 0 ? 'scale-105 shadow-2xl z-10' : 'scale-100 opacity-80'}
        `;
    const imgSrc = `../assets/images/region/${event.image}`;
    card.innerHTML = `
          <img src="${imgSrc}" alt="${event.title}" class="w-60 h-full object-cover" />
          <div class="p-6 flex flex-col justify-between w-full">
            <div>
              <h3 class="text-xl font-bold mb-1">${event.title}</h3>
              <p class="text-sm text-gray-600">${event.location}</p>
            </div>
            <div class="text-sm text-gray-500 mt-2 space-y-1">
              <p><strong>기간</strong> ${event.startDate} ~ ${event.endDate}</p>
              <p><strong>장소</strong> ${event.address}</p>
            </div>
            <div class="mt-4 flex gap-2">
              <button class="px-4 py-1 bg-black text-white rounded-md text-sm">바로가기</button>
              <button class="px-4 py-1 border border-gray-400 text-sm rounded-md">길찾기</button>
            </div>
          </div>
        `;
    track.appendChild(card);

    // 페이지 dot 생성
    const dot = document.createElement('div');
    dot.className = `w-3 h-3 rounded-full border border-white ${index === 0 ? 'bg-white' : ''}`;
    dot.addEventListener('click', () => {
      currentIndex = index;
      updateSlider();
    });
    pagination.appendChild(dot);
  });

  const updateSlider = () => {
    // 중앙에 오도록 transform 계산
    const screenWidth = window.innerWidth;
    const centerOffset = (screenWidth - slideWidth) / 2;
    track.style.transform = `translateX(${centerOffset - currentIndex * (slideWidth + gap)}px)`;

    // 카드 강조 효과
    [...track.children].forEach((card, i) => {
      card.classList.toggle('scale-105', i === currentIndex);
      card.classList.toggle('shadow-2xl', i === currentIndex);
      card.classList.toggle('z-10', i === currentIndex);
      card.classList.toggle('opacity-80', i !== currentIndex);
      card.classList.toggle('scale-100', i !== currentIndex);
    });

    // dot 강조
    [...pagination.children].forEach((dot, i) => {
      dot.classList.toggle('bg-white', i === currentIndex);
    });
  };

  prevBtn.onclick = () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateSlider();
    }
  };

  nextBtn.onclick = () => {
    if (currentIndex < filtered.length - 1) {
      currentIndex++;
      updateSlider();
    }
  };
  updateSlider();
  window.addEventListener('resize', updateSlider); // 창 크기 변경 시 중앙 유지
};

renderDateSlider();
