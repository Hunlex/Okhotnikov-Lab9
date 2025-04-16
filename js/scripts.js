document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('.order_form');
    const element1 = document.getElementById('element1');


    document.getElementById('magicBtn').addEventListener('click', function () {
        const element = document.getElementById('magicElement');

        if (element.style.opacity === '0') {
            element.style.opacity = '1';
        } else {
            element.style.opacity = '0';
        }
    });
    //изменение цвета в поле input при наведении курсора
    const boxes = document.querySelectorAll('.order_input');

    boxes.forEach(box => {
        box.addEventListener('mouseenter', function () {
            this.style.backgroundColor = 'gold';
        });

        box.addEventListener('mouseleave', function () {
            this.style.backgroundColor = '';
        });
    });
    // Изменяет стиль первого элемента (контейнера в котором форма и валидация)
    element1.style.backgroundColor = 'lightblue';
    element1.style.padding = '100px';
    element1.style.borderRadius = '100px';

    const regexPatterns = {
        name: /^[А-ЯЁа-яёA-Za-z]{2,50}$/, // Только буквы, длина 2 - 50 символов
        phone: /^(\+7|8)[\s(]?\d{3}[)\s]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/, // Российский номер
        city: /^[А-ЯЁа-яёA-Za-z\s-]{2,25}$/, // Название города (буквы, пробелы, дефисы) длина 2-25
        quantity: /^[1-9]\d*$/ // Число больше 0
    };

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const elements = form.elements;
        let isValid = true;

        // Валидация полей (без даты и времени)
        if (!validateField(elements.order_first_name, regexPatterns.name, 'Имя должно содержать только буквы (минимум 2; максимум 50)')) isValid = false;
        if (!validateField(elements.order_second_name, regexPatterns.name, 'Фамилия должна содержать только буквы (минимум 2; максимум 50)')) isValid = false;
        if (!validateField(elements.order_tel, regexPatterns.phone, 'Введите корректный номер (+7/8 XXX XXX-XX-XX)')) isValid = false;
        if (!validateField(elements.order_place, regexPatterns.city, 'Название города должно содержать только буквы, пробелы и дефисы')) isValid = false;
        if (!validateField(elements.order_quantity, regexPatterns.quantity, 'Введите число больше 0')) isValid = false;
        if (!elements.pay.value) {
            showError(elements.pay, 'Пожалуйста, выберите способ оплаты');
            isValid = false;
        } else {
            clearError(elements.pay);
        }

        if (isValid) {
            // Собираем все данные в форму ключ-значение
            const formData = {
                'Имя': elements.order_first_name.value.trim(),
                'Фамилия': elements.order_second_name.value.trim(),
                'Телефон': elements.order_tel.value.trim(),
                'Город': elements.order_place.value.trim(),
                'Дата': elements.order_date.value,
                'Время': elements.order_time.value,
                'Количество': elements.order_quantity.value,
                'Способ оплаты': getPaymentMethodText(elements.pay.value)
            };

            // Формируем сообщение для alert
            let message = "Данные формы:\n\n";
            for (const [key, value] of Object.entries(formData)) {
                message += `${key}: ${value}\n`;
            }

            // Выводим данные
            alert(message);
            form.reset();
        }
    });

    // Функция для получения текстового описания способа оплаты
    function getPaymentMethodText(value) {
        const methods = {
            'qr': 'QR-код',
            'cart': 'Банковская карта',
            'p2p': 'Банковский перевод'
        };
        return methods[value] || value;
    }

    // Функции для ошибок
    function validateField(field, regex, errorMessage) {
        const value = field.value.trim();

        if (!value) {
            showError(field, 'Это поле обязательно для заполнения');
            return false;
        }

        if (!regex.test(value)) {
            showError(field, errorMessage);
            return false;
        }

        clearError(field);
        return true;
    }

    function showError(input, message) {
        const inputSpace = input.closest('.order_input_space');
        let errorElement = inputSpace.querySelector('.error-message');

        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            inputSpace.appendChild(errorElement);
        }

        errorElement.textContent = message;
        input.classList.add('invalid');
    }

    function clearError(input) {
        const inputSpace = input.closest('.order_input_space');
        const errorElement = inputSpace.querySelector('.error-message');

        if (errorElement) {
            errorElement.remove();
        }

        input.classList.remove('invalid');
    }
});



