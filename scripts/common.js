document.addEventListener('DOMContentLoaded', function () {
  // Header 로딩
  let headerPath = location.pathname.includes('/pages/')
    ? '../components/header.html'
    : 'components/header.html';

  fetch(headerPath)
    .then((res) => res.text())
    .then((data) => {
      const wrapper = document.createElement('div');
      wrapper.classList.add('relative');
      wrapper.innerHTML = data;
      document.getElementById('header').appendChild(wrapper);
    });

  // Footer 로딩 + hover 이벤트 추가
  let footerPath = location.pathname.includes('/pages/')
    ? '../components/footer.html'
    : 'components/footer.html';

  fetch(footerPath)
    .then((res) => res.text())
    .then((data) => {
      const wrapper = document.createElement('div');
      wrapper.classList.add('relative');
      wrapper.innerHTML = data;
      document.getElementById('footer').appendChild(wrapper);

      // footer 로드 후에 이미지 hover 이벤트 바인딩
      const hoverIcons = wrapper.querySelectorAll('.sns-hover');

      hoverIcons.forEach((img) => {
        const originalSrc = img.getAttribute('src');
        const hoverSrc = originalSrc.replace('.png', '_1.png');

        img.addEventListener('mouseenter', () => {
          img.src = hoverSrc;
        });

        img.addEventListener('mouseleave', () => {
          img.src = originalSrc;
        });
      });
    });
});
