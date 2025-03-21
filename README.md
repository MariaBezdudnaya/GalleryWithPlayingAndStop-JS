# GalleryWithPlayingAndStop-JS
---

## Описание

Это простой веб-проект, представляющий собой галерею изображений. Изначально проект использовал API [Lorem Picsum](https://picsum.photos/) для получения случайных изображений. Однако, в связи с тем, что доступ к данному API был ограничен на территории России, потребовалось найти альтернативное решение.

## История изменений API

### Изначальное использование Lorem Picsum

Проект был начат с использованием API Lorem Picsum, так как он предоставлял простой и удобный способ получения случайных изображений для демонстрационных целей. Этот API позволял легко интегрировать случайные изображения в веб-приложение без необходимости хранения собственных изображений.

**Проблемы с Lorem Picsum:**

•   Ограничение доступа на территории России: API Lorem Picsum стал недоступен без использования VPN, что ухудшило пользовательский опыт для пользователей из России.

### Переход на Unsplash API

В качестве альтернативы был рассмотрен [Unsplash API](https://unsplash.com/developers). Unsplash предоставляет высококачественные изображения и API для их получения.

**Проблемы с Unsplash API:**

•   Ограничения по количеству запросов: Unsplash API имеет ограничения по количеству запросов, что может быть проблемой для приложений с высокой посещаемостью.
•   Сложность реализации: Требуется ключ API и более сложная обработка данных.

### Решение: Использование локальных моков в JSON

Наиболее оптимальным решением было создание собственных моков изображений в формате JSON. Это позволило:

•   Устранить зависимость от внешних API: Проект больше не зависит от доступности сторонних сервисов.
•   Контролировать изображения: Разработчик имеет полный контроль над отображаемыми изображениями.
•   Упростить разработку: Использование локальных данных упрощает отладку и тестирование.

## Структура проекта

•   `index.html`: Основной HTML-файл, содержащий структуру страницы галереи.
•   `style.css`: Файл стилей, определяющий внешний вид галереи.
•   `main.js`: JavaScript-файл, отвечающий за логику работы галереи, загрузку изображений и управление таймером.
•   `mock.json`: JSON-файл, содержащий массив объектов с информацией об изображениях (URL и автор).

## Как запустить проект

1.  Клонируйте репозиторий на свой локальный компьютер.
2.  Откройте файл `index.html` в вашем браузере.

## Используемые технологии

•   HTML
•   CSS
•   JavaScript
