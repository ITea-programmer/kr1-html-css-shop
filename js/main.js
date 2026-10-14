// ===============================
// Модальное окно заявки (только для index.html)
// ===============================

const orderDialog = document.getElementById('order-dialog');
const orderButtons = document.querySelectorAll('.product-card__button');
const closeDialogButton = document.getElementById('close-order-dialog');
const selectedProductInput = document.getElementById('selected-product');
const orderForm = document.getElementById('order-form');
const successMessage = document.getElementById('success-message');

// Работаем с модалкой, только если она есть на странице
if (orderDialog && orderForm) {
  // Клики по кнопкам «Заказать»
  orderButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const productName = button.dataset.product;
      if (selectedProductInput) {
        selectedProductInput.value = productName;
      }
      orderDialog.showModal();
    });
  });

  // Закрытие по кнопке «Закрыть»
  if (closeDialogButton) {
    closeDialogButton.addEventListener('click', () => {
      orderDialog.close();
    });
  }

  // Отправка формы
  orderForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formElements = Array.from(orderForm.elements);

    formElements.forEach((element) => {
      if (element.willValidate) {
        element.removeAttribute('aria-invalid');
      }
    });

    if (!orderForm.checkValidity()) {
      formElements.forEach((element) => {
        if (element.willValidate && !element.checkValidity()) {
          element.setAttribute('aria-invalid', 'true');
        }
      });
      orderForm.reportValidity();
      return;
    }

    if (successMessage) {
      successMessage.hidden = false;
    }

    orderForm.reset();
    orderDialog.close();
  });
}

// ===============================
// Карточка книги: подстановка данных по ?id=
// ===============================

function renderBookCard() {
  const params = new URLSearchParams(window.location.search);
  const bookId = params.get('id');
  const book = (bookId && books[bookId]) ? books[bookId] : books.demidovich;

  document.title = `${book.title} — ВышRead`;

  const title = document.querySelector('.product-detail__info .section__title');
  if (title) title.textContent = book.title;

  const description = document.querySelector('.product-detail__info .section__text');
  if (description) description.textContent = book.description;

  const price = document.querySelector('.product-detail__price');
  if (price) price.textContent = `Цена: ${book.price} руб.`;

  const coverImage = document.querySelector('.book-cover-image');
  if (coverImage) {
    coverImage.src = book.image;
    coverImage.alt = `Обложка книги «${book.title}» — ${book.author}`;
  }

  const rows = document.querySelectorAll('.product-table tbody tr');
  const data = [
    ['Автор', book.author],
    ['Название', book.title],
    ['Раздел', book.section],
    ['Издательство', book.publisher],
    ['Год издания', book.year],
    ['ISBN', book.isbn],
    ['Страниц', book.pages],
    ['Переплёт', 'Твёрдый'],
    ['Уровень', 'Бакалавриат'],
    ['Наличие', 'В наличии']
  ];

  rows.forEach((row, i) => {
    const cells = row.querySelectorAll('td');
    if (cells.length >= 2 && data[i]) {
      cells[1].textContent = data[i][1];
    }
  });

  const orderBtn = document.querySelector('.product-detail__button');
  if (orderBtn && bookId) {
    orderBtn.href = `order.html?id=${bookId}`;
  }
}

if (document.querySelector('.product-detail')) {
  renderBookCard();
}

// ===============================
// Страница заказа: подстановка книги по ?id=
// ===============================

function selectBookInOrder() {
  const params = new URLSearchParams(window.location.search);
  const bookId = params.get('id');
  if (!bookId) return;

  const select = document.getElementById('order-page-book');
  if (!select) return;

  select.value = bookId;
}

if (document.querySelector('.order-page')) {
  selectBookInOrder();
}