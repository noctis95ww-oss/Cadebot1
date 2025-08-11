const img = document.getElementById('slideshow');
let images = [];
let index = 0;

function showNext() {
  if (images.length === 0) return;
  img.classList.add('fade-out');
  setTimeout(() => {
    img.src = `/images/${images[index]}`;
    index = (index + 1) % images.length;
    img.classList.remove('fade-out');
  }, 1000);
}

fetch('/api/images')
  .then(res => res.json())
  .then(list => {
    images = list;
    if (images.length > 0) {
      img.src = `/images/${images[0]}`;
      index = 1;
      setInterval(showNext, 5000);
    }
  })
  .catch(err => console.error('加载图片列表失败:', err));
