const img = document.getElementById('slideshow');
let images = [];
let index = 0;

function showNext() {
  if (images.length === 0) return;
  img.src = `/images/${images[index]}`;
  index = (index + 1) % images.length;
}

fetch('/api/images')
  .then(res => res.json())
  .then(list => {
    images = list;
    showNext();
    setInterval(showNext, 5000);
  })
  .catch(err => console.error('加载图片列表失败:', err));
