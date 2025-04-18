import regionData from '../data/regionData.js';

const monthLabels = document.getElementById('month-labels');
const dateSlider = document.getElementById('date-slider');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const festivalList = document.getElementById('festivalList');
const indicatorContainer = document.getElementById('indicator');
const slidePrevBtn = document.getElementById('slide-prev');
const slideNextBtn = document.getElementById('slide-next');

slidePrevBtn.addEventListener('click', () => {
  const scrollAmount = 672;
  festivalList.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
});
slideNextBtn.addEventListener('click', () => {
  const scrollAmount = 672;
  festivalList.scrollBy({ left: scrollAmount, behavior: 'smooth' });
});

let baseDate = new Date();
let selectedDateStr = formatDate(baseDate);
let currentIndex = 0;
let visibleCardCount = 0;

function formatDate(date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function stripTime(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function get14DayRange(startDate) {
  return [...Array(14)].map((_, i) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    return date;
  });
}

function renderMonthLabels(range) {
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
}

function renderDateSlider() {
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
    const textColor = isSelected
      ? 'text-white'
      : day === 0
        ? 'text-red-500'
        : day === 6
          ? 'text-blue-500'
          : 'text-gray-800';

    button.innerHTML = `
  <span class="font-semibold ${textColor}">${date.getDate()}</span>
  <span class="text-xs ${textColor}">
    ${['일', '월', '화', '수', '목', '금', '토'][day]}
    ${
      isToday
        ? `<span class='text-[10px] ${
            isSelected ? 'text-white' : 'text-red-400'
          }'>(오늘)</span>`
        : ''
    }
  </span>
`;

    button.dataset.date = dateStr;

    button.addEventListener('click', () => {
      selectedDateStr = dateStr;
      renderDateSlider();
      renderFestivalCards(selectedDateStr);
    });

    dateSlider.appendChild(button);

    if (isSelected) {
      setTimeout(
        () => button.scrollIntoView({ inline: 'center', behavior: 'smooth' }),
        0,
      );
    }
  });

  renderFestivalCards(selectedDateStr);
}

function renderFestivalCards(dateStr) {
  const selected = new Date(dateStr);

  const events = regionData.filter((event) => {
    const start = stripTime(new Date(event.startDate));
    const end = stripTime(new Date(event.endDate));
    return selected >= start && selected <= end;
  });

  if (events.length === 0) {
    festivalList.innerHTML =
      '<p class="text-gray-600 px-8">해당 날짜에 열리는 행사가 없습니다.</p>';
    indicatorContainer.innerHTML = '';
    visibleCardCount = 0;
    return;
  }

  visibleCardCount = events.length;
  currentIndex = 0;

  festivalList.innerHTML = `
    <div class="w-[45rem] h-[18rem] flex-shrink-0 bg-transparent pointer-events-none select-none"></div>
    ${events
      .map(
        (event) => `
      <div class="snap-center flex-shrink-0 w-[40rem] h-[22rem] bg-white rounded-xl shadow-md flex items-center px-6 py-4 select-none">
        <div class="w-[13rem] h-[14rem] flex items-center justify-center">
          <img src="../assets/images/region/${event.image}" alt="${event.title}" class="w-full h-full object-cover rounded-md" />
        </div>
        <div class="w-px h-[80%] border-r border-dashed border-gray-300 mx-6"></div>
        <div class="flex flex-col justify-between h-[15rem] w-full">
          <div>
            <h2 class="text-2xl font-bold text-gray-900 mb-1">${event.title}</h2>
            <p class="text-sm text-gray-600 mb-4">${event.location}</p>
            <div class="flex text-sm text-gray-800 gap-12 mt-10">
              <div>
                <p class="font-semibold text-gray-500 mb-1">기간</p>
                <p>${event.startDate} ~ ${event.endDate}</p>
              </div>
              <div>
                <p class="font-semibold text-gray-500 mb-1">장소</p>
                <p class="w-[16rem] leading-snug">${event.address}</p>
              </div>
            </div>
          </div>
          <div class="flex gap-4 mt-3">
            <button class="bg-black text-white px-5 py-1.5 rounded text-sm w-[8rem]">바로가기</button>
            <button class="border border-black px-5 py-1.5 rounded text-sm w-[8rem]">길찾기</button>
          </div>
        </div>
      </div>
    `,
      )
      .join('')}
    <div class="w-[45rem] h-[18rem] flex-shrink-0 bg-transparent pointer-events-none select-none"></div>
  `;

  setTimeout(() => {
    festivalList.scrollTo({ left: 0, behavior: 'smooth' });
  }, 0);
  currentIndex = 0;
  renderIndicator();
}

function renderIndicator() {
  indicatorContainer.innerHTML = '';

  for (let i = 0; i < visibleCardCount; i++) {
    const dot = document.createElement('button');
    dot.className =
      i === currentIndex
        ? 'w-7 h-3 rounded-full bg-black transition-all duration-300'
        : 'w-3 h-3 rounded-full border border-black';

    dot.addEventListener('click', () => {
      const scrollTarget = (i + 1) * 672;
      festivalList.scrollTo({ left: scrollTarget, behavior: 'smooth' });
    });

    indicatorContainer.appendChild(dot);
  }
}

festivalList.addEventListener('scroll', () => {
  const scrollLeft = festivalList.scrollLeft;
  const index = Math.round(scrollLeft / 672) - 1;

  if (index !== currentIndex && index >= 0 && index < visibleCardCount) {
    currentIndex = index;
    renderIndicator();
  }
});

prevBtn.addEventListener('click', () => {
  baseDate.setDate(baseDate.getDate() - 14);
  selectedDateStr = formatDate(baseDate);
  renderDateSlider();
});
nextBtn.addEventListener('click', () => {
  baseDate.setDate(baseDate.getDate() + 14);
  selectedDateStr = formatDate(baseDate);
  renderDateSlider();
});

renderDateSlider();
