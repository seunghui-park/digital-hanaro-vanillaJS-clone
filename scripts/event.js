import eventData from '../data/eventData.js';

const container = document.getElementById('event-container');
const title = document.getElementById('event-title');
const count = document.getElementById('event-count');
const filterButtons = document.querySelectorAll('.filter-btn');
const sortButtons = document.querySelectorAll('.sort-btn');
const overlay = document.getElementById('overlay');
const today = new Date();

let currentFilter = '진행중';
let currentSort = 'latest';

const enrichedData = eventData.map((event) => {
  const [startStr, endStr] = event.period.split(' ~ ');
  const startDate = new Date(startStr.replace(/\./g, '-'));
  const endDate = new Date(endStr.replace(/\./g, '-'));
  const status = startDate <= today && today <= endDate ? '진행중' : '종료';
  return { ...event, status };
});

function renderEvents(filter = '전체', sort = 'latest') {
  container.innerHTML = '';

  let filtered =
    filter === '전체'
      ? enrichedData
      : enrichedData.filter((e) => e.status === filter);

  if (sort === 'latest') {
    filtered.sort(
      (a, b) =>
        new Date(b.period.split(' ~ ')[0].replace(/\./g, '-')) -
        new Date(a.period.split(' ~ ')[0].replace(/\./g, '-')),
    );
  } else if (sort === 'popular') {
    filtered.sort((a, b) => b.likes - a.likes);
  }

  count.innerHTML = `총 <span class="text-blue-600 font-semibold">${filtered.length}</span>건`;
  title.textContent = `#${filter} 이벤트`;

  filtered.forEach((event) => {
    const card = document.createElement('div');
    card.className = 'border-b pb-8 relative z-30';
    card.innerHTML = `
      <div class="mb-2 flex justify-between items-center relative">
        <span class="inline-block px-2 py-1 text-sm font-semibold rounded ${
          event.status === '진행중'
            ? 'bg-red-500 text-white'
            : 'bg-gray-300 text-gray-800'
        }">${event.status}</span>
        <div class="relative">
          <button class="more-btn text-xl" data-id="${event.id}">⋮</button>
          <div class="more-menu hidden absolute right-0 top-6 w-32 bg-white shadow-lg border rounded z-40">
            <ul class="text-sm text-gray-800">
              <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer">즐겨찾기</li>
              <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer">공유하기</li>
            </ul>
          </div>
        </div>
      </div>
      <h3 class="text-xl font-semibold">${event.title}</h3>
      <p class="text-sm text-gray-500 mb-1">${event.period}</p>
      <p class="text-sm text-pink-600 font-medium">❤️ ${event.likes}</p>
      <img src="../assets/images/event/${event.image}" alt="${event.title}" class="w-full rounded-md mt-2" />
    `;
    container.appendChild(card);
  });
}

filterButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterButtons.forEach((b) =>
      b.classList.remove('bg-gray-800', 'text-white'),
    );
    btn.classList.add('bg-gray-800', 'text-white');
    currentFilter = btn.dataset.filter;
    renderEvents(currentFilter, currentSort);
    overlay.classList.add('hidden');
  });
});

sortButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    sortButtons.forEach((b) =>
      b.classList.remove('text-black', 'border-b-2', 'border-black'),
    );
    sortButtons.forEach((b) => b.classList.add('text-gray-400'));

    btn.classList.remove('text-gray-400');
    btn.classList.add('text-black', 'border-b-2', 'border-black');

    currentSort = btn.dataset.sort;
    renderEvents(currentFilter, currentSort);
  });
});

document.addEventListener('click', (e) => {
  const isMoreBtn = e.target.classList.contains('more-btn');
  const isInsideMenu = e.target.closest('.more-menu');
  const isMenuItem = e.target.closest('.more-menu li');

  if (isMoreBtn) {
    document
      .querySelectorAll('.more-menu')
      .forEach((m) => m.classList.add('hidden'));
    e.target.nextElementSibling.classList.toggle('hidden');
    overlay.classList.remove('hidden');
    e.stopPropagation();
    return;
  }

  if (!isInsideMenu || isMenuItem) {
    document
      .querySelectorAll('.more-menu')
      .forEach((m) => m.classList.add('hidden'));
    overlay.classList.add('hidden');
  }
});

renderEvents(currentFilter, currentSort);
