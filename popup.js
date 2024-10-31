document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('length').value = 32; // Длина по умолчанию
});

// Функция для оценки надежности пароля
function getPasswordStrength(password) {
    let strength = 0;

    if (password.length >= 50) strength++;
    if (password.length >= 100) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password) && password.length >= 20) strength++; // Проверка на специальные символы

    return strength;
}

// Функция генерации пароля
function generatePassword() {
    const length = parseInt(document.getElementById('length').value);
    const useLowercase = document.getElementById('lowercase').checked;
    const useUppercase = document.getElementById('uppercase').checked;
    const useNumbers = document.getElementById('numbers').checked;
    console.log(length);

    // Проверка на минимальную и максимальную длину
    if (length < 8) {
        document.getElementById('message').textContent = 'Длина пароля не может быть меньше восьми символов.';
        document.getElementById('result').style.display = 'none';
        document.getElementById('copy').style.display = 'none';
        document.getElementById('strength').style.display = 'none';
        return;
    }
    if (length > 128) {
        document.getElementById('message').textContent = 'Максимальная длина пароля 128 символов.';
        document.getElementById('result').style.display = 'none';
        document.getElementById('copy').style.display = 'none';
        document.getElementById('strength').style.display = 'none';
        return;
    }

    let charset = '';
    if (useLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (useUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (useNumbers) charset += '0123456789';

    if (charset.length === 0) {
        document.getElementById('strength').style.display = 'none';
        document.getElementById('result').style.display = 'none';
        document.getElementById('copy').style.display = 'none';
        document.getElementById('message').textContent = 'Выберите хотя бы один набор символов.';
        return;
    }

    let password = '';
    for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    document.getElementById('result').textContent = password;
    document.getElementById('strength').style.display = 'block';
    document.getElementById('result').style.display = 'block';
    document.getElementById('copy').style.display = 'block';
    document.getElementById('message').textContent = ''; // Очищаем сообщение

    // Оценка надежности пароля
    const strength = getPasswordStrength(password);
    const strengthFill = document.getElementById('strength-fill');
    const strengthText = document.getElementById('strength-text');

    switch (strength) {
        case 0:
        case 1:
            strengthFill.style.width = '20%';
            strengthFill.style.backgroundColor = 'red';
            strengthText.textContent = 'Надежность: низкая';
            break;
        case 2:
            strengthFill.style.width = '50%';
            strengthFill.style.backgroundColor = 'orange';
            strengthText.textContent = 'Надежность: средняя';
            break;
        case 3:
            strengthFill.style.width = '65%';
            strengthFill.style.backgroundColor = 'orangered';
            strengthText.textContent = 'Надежность: нормальная';
            break;
        case 4:
            strengthFill.style.width = '80%';
            strengthFill.style.backgroundColor = 'yellowgreen';
            strengthText.textContent = 'Надежность: высокая';
            break;
        case 5:
            strengthFill.style.width = '100%';
            strengthFill.style.backgroundColor = 'green';
            strengthText.textContent = 'Надежность: очень высокая';
            break;
        default:
            strengthFill.style.width = '0%';
            strengthText.textContent = 'Надежность: неизвестна';
            break;
    }
}
// Обработчик для кнопки "Сохранить пароль"
document.getElementById('save').addEventListener('click', () => {
    savePassword();
    const saveButton = document.getElementById('save');
    
    // Делаем кнопку неактивной
    saveButton.disabled = true;

    // Показываем сообщение
    document.getElementById('message').textContent = 'Пароль сохранён в папку Загрузки';

    // Возвращаем кнопку в активное состояние через 5 секунд
    setTimeout(() => {
        saveButton.disabled = false;
    }, 5000);
});

// Обновленная функция сохранения пароля
function savePassword() {
    const password = document.getElementById('result').textContent;

    // Проверка наличия поля input с id="login" на странице
    const loginInput = document.querySelector('input#login');
    const loginValue = loginInput ? (loginInput.value || '') : 'None'; // Если поле пустое, записываем "None"

    // Получаем текущую вкладку
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const siteName = tabs[0].url; // Получаем URL текущей вкладки
        const fileContent = `Логин: ${loginValue}\nПароль: ${password}\nСайт: ${siteName}\n`;
        const blob = new Blob([fileContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'password.txt'; // Имя файла для скачивания
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
}


// Обработчик для кнопки "Сгенерировать"
document.getElementById('generate').addEventListener('click', generatePassword);

// Обработчик для клавиши Enter
document.getElementById('length').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        generatePassword();
    }
});

document.getElementById('copy').addEventListener('click', () => {
    const password = document.getElementById('result').textContent;
    navigator.clipboard.writeText(password).then(() => {
        document.getElementById('message').textContent = 'Пароль скопирован в буфер обмена!';
    }).catch(err => {
        console.error('Ошибка при копировании: ', err);
        document.getElementById('message').textContent = 'Ошибка при копировании пароля.';
    });
});
