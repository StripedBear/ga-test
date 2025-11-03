# General Arcade — Hugo + GitHub Pages

Статический сайт с автодеплоем на GitHub Pages. Визуал и ассеты скопированы из предоставленного архива `_files`.
Чтобы повторить верстку 1:1, вставьте HTML-разметку текущего сайта в шаблоны Hugo:

- `layouts/partials/header.html` — шапка
- `layouts/index.html` — главная
- `layouts/_default/single.html` — страница/статья
- `layouts/_default/list.html` — список статей/новостей
- `layouts/partials/footer.html` — футер

Ассеты (CSS/JS/картинки/шрифты) уже лежат в `static/` под своими путями. Подключение главного CSS/JS происходит в `baseof.html`. 
При необходимости, поправьте пути к файлам стилей/скриптов под ваш реальный `main.css`/`main.js`.

## Локально
```bash
hugo server -D
```
Откройте http://localhost:1313

## Деплой
- Запушьте в ветку `main`. CI соберёт и задеплоит на GitHub Pages.

## Безопасность
- CSP/Referrer-Policy/X-Frame-Options/Permissions-Policy выставлены через `<meta http-equiv>` в `baseof.html` (для GitHub Pages).
- Не используйте инлайн-скрипты и сторонние CDN-скрипты. Все ассеты должны идти с вашего домена.

## Контент (Markdown)
- Страницы и статьи — в `content/`. Пример поста: `content/blog/2025-11-03-sample.md`.