document.addEventListener('DOMContentLoaded', function () {
  let headerPath = 'components/header.html';
  if (location.pathname.includes('/pages/')) {
    headerPath = '../components/header.html';
  } else {
    headerPath = 'components/header.html';
  }

  fetch(headerPath)
    .then((res) => res.text())
    .then((data) => {
      const wrapper = document.createElement('div');
      wrapper.classList.add('relative');
      wrapper.innerHTML = data;
      document.getElementById('header').appendChild(wrapper);
    });
});

document.addEventListener('DOMContentLoaded', function () {
  let footerPath = 'components/footer.html';
  if (location.pathname.includes('/pages/')) {
    footerPath = '../components/footer.html';
  } else {
    footerPath = 'components/footer.html';
  }

  fetch(footerPath)
    .then((res) => res.text())
    .then((data) => {
      const wrapper = document.createElement('div');
      wrapper.classList.add('relative');
      wrapper.innerHTML = data;
      document.getElementById('footer').appendChild(wrapper);
    });
});
