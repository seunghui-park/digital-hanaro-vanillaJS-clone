import regionData from '../data/regionData.js';

const dateSlider = document.getElementById('date-slider');
const eventList = document.getElementById('event-list');

const today = new Date();
const dateRange = [...Array(14)].map((_, i) => {
  const date = new Date(today);
  date.setDate(date.getDate() + i);
  return date;
});

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

function renderDateSlider() {
  dateRange.forEach((date, index) => {
    const div = document.createElement('div');
    div.className = 'date-item';
    div.innerHTML = `
      <div>${date.getDate()}</div>
      <small>${['일', '월', '화', '수', '목', '금', '토'][date.getDay()]}</small>
    `;
    div.dataset.date = formatDate(date);
    if (index === 0) div.classList.add('active');

    div.addEventListener('click', () => {
      document
        .querySelectorAll('.date-item')
        .forEach((el) => el.classList.remove('active'));
      div.classList.add('active');
      renderEventList(div.dataset.date);
    });

    dateSlider.appendChild(div);
  });
}

function renderEventList(selectedDate) {
  eventList.innerHTML = '';

  const filtered = regionData.filter((event) => {
    return selectedDate >= event.startDate && selectedDate <= event.endDate;
  });

  if (filtered.length === 0) {
    eventList.innerHTML = '<p>선택한 날짜에 해당하는 축제가 없습니다.</p>';
    return;
  }

  filtered.forEach((event) => {
    const card = document.createElement('div');
    card.className = 'event-card';
    card.innerHTML = `
      <h4>${event.title}</h4>
      <p><strong>${event.location}</strong></p>
      <p>${event.startDate} ~ ${event.endDate}</p>
      <p>${event.address}</p>
    `;
    eventList.appendChild(card);
  });
}

renderDateSlider();
renderEventList(formatDate(today));
