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

renderDateSlider();
