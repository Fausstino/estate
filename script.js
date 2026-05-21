// Наша "База данных" в памяти (Толстый клиент)
const properties = [
  {
    id: 1,
    title: "Стильная студия Loft",
    type: "apartment",
    rooms: 1,
    price: 48000,
    district: "Центральный",
    desc: "Дизайнерский ремонт в стиле лофт. Панорамные окна на город, вся техника в наличии. Рядом лучшие кофейни и парк.",
    img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600",
  },
  {
    id: 2,
    title: 'Усадьба "Зеленый берег"',
    type: "house",
    rooms: 3,
    price: 135000,
    district: "Пригород",
    desc: "Двухэтажный дом с выходом к реке. Своя парковка на 2 машины, каминный зал и огромная кухня-столовая.",
    img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600",
  },
  {
    id: 3,
    title: "Светлая 2-к квартира",
    type: "apartment",
    rooms: 2,
    price: 72000,
    district: "Западный",
    desc: "Уютная квартира для семьи. Раздельный санузел, большая лоджия, тихие соседи и детская площадка во дворе.",
    img: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600",
  },
  {
    id: 4,
    title: "Коттедж High-Tech",
    type: "house",
    rooms: 3,
    price: 190000,
    district: "Северный",
    desc: "Умный дом с системой голосового управления. Бассейн с подогревом, панорамная терраса и охраняемая территория.",
    img: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600",
  },
];

// Элементы интерфейса
const catalog = document.getElementById("catalog");
const modal = document.getElementById("propertyModal");
const modalBody = document.getElementById("modalBody");

// Работа с LocalStorage (Избранное и Бронирования)
let favorites = JSON.parse(localStorage.getItem("abdul_favs")) || [];
let bookings = JSON.parse(localStorage.getItem("abdul_bookings")) || [];

// Главная функция отрисовки карточек
function render(data) {
  catalog.innerHTML = "";

  if (data.length === 0) {
    catalog.innerHTML =
      '<div style="grid-column: 1/-1; text-align: center; padding: 50px;">Упс! Ничего не найдено. Попробуйте поменять фильтры.</div>';
    return;
  }

  data.forEach((item) => {
    const isFav = favorites.includes(item.id) ? "❤️" : "🤍";
    const card = document.createElement("div");
    card.className = "card";
    card.onclick = () => openModal(item.id);

    card.innerHTML = `
            <button class="fav-btn" onclick="event.stopPropagation(); toggleFav(${item.id})">${isFav}</button>
            <img src="${item.img}" alt="${item.title}">
            <div class="card-info">
                <div class="card-price">${item.price.toLocaleString()} ₽/мес</div>
                <h3 class="card-title">${item.title}</h3>
                <div class="card-district">${item.district} • ${item.rooms} комн.</div>
            </div>
        `;
    catalog.appendChild(card);
  });
}

// Фильтрация
function applyFilters() {
  const searchVal = document.getElementById("searchInput").value.toLowerCase();
  const typeVal = document.getElementById("typeFilter").value;
  const roomsVal = document.getElementById("roomsFilter").value;
  const priceVal = document.getElementById("priceFilter").value;

  const filtered = properties.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchVal) ||
      item.district.toLowerCase().includes(searchVal);
    const matchesType = typeVal === "all" || item.type === typeVal;
    const matchesRooms =
      roomsVal === "all" ||
      (roomsVal === "3" ? item.rooms >= 3 : item.rooms == roomsVal);
    const matchesPrice = !priceVal || item.price <= priceVal;

    return matchesSearch && matchesType && matchesRooms && matchesPrice;
  });

  render(filtered);
}

// Избранное
window.toggleFav = function (id) {
  if (favorites.includes(id)) {
    favorites = favorites.filter((favId) => favId !== id);
  } else {
    favorites.push(id);
  }
  localStorage.setItem("abdul_favs", JSON.stringify(favorites));
  applyFilters();
};

// Функция бронирования
window.bookProperty = function (id) {
  // Проверяем, есть ли уже этот ID в списке броней
  if (bookings.includes(id)) {
    alert("Ошибка: Этот объект уже забронирован вами!");
  } else {
    bookings.push(id);
    localStorage.setItem("abdul_bookings", JSON.stringify(bookings));
    alert("Успешно забронировано!");
    closeModal(); // Закрываем окно после успеха
  }
};

// Модальное окно
window.openModal = function (id) {
  const p = properties.find((item) => item.id === id);
  modalBody.innerHTML = `
        <img src="${p.img}" class="modal-img">
        <h2 style="margin-bottom:5px">${p.title}</h2>

        <div class="modal-header-action">
            <div style="font-size:24px; color:#4a68e8; font-weight:bold">${p.price.toLocaleString()} ₽/мес</div>
            <button class="book-btn-main" onclick="bookProperty(${p.id})">Забронировать</button>
        </div>

        <div class="modal-specs">
            <p><strong>Район:</strong> ${p.district}</p>
            <p><strong>Тип:</strong> ${p.type === "house" ? "Дом" : "Квартира"}</p>
            <p><strong>Комнат:</strong> ${p.rooms}</p>
        </div>

        <hr style="border:0; border-top:1px solid #eee; margin:15px 0">
        <p style="line-height:1.5; color:#555; font-size:14px">${p.desc}</p>
    `;
  modal.style.display = "block";
};
window.closeModal = function () {
  modal.style.display = "none";
};

document.querySelector(".close-btn").onclick = closeModal;
window.onclick = (e) => {
  if (e.target == modal) closeModal();
};

// Слушатели фильтров
["searchInput", "typeFilter", "roomsFilter", "priceFilter"].forEach((id) => {
  document.getElementById(id).addEventListener("input", applyFilters);
});

document.getElementById("resetBtn").onclick = () => {
  document.getElementById("searchInput").value = "";
  document.getElementById("typeFilter").value = "all";
  document.getElementById("roomsFilter").value = "all";
  document.getElementById("priceFilter").value = "";
  applyFilters();
};

// Запуск
render(properties);
