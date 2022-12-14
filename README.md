# petsfeeder
Простой web-интерфейс системы умных кормушек для кошек и собак.
## Небольшое описание, что это
Проект является учебным. Для серверной части была использована связка Python + Flask во избежание постоянной загрузки файлов на плату и замедления редактирования.  Может быть использован в разработке реальной системы умных кормушек. Предполагаемая плата для использования - ESP-32. ***Текущая серверная часть не предназначена для загрузки на плату, а служит лишь для более удобной отладки.***

Краткий список функций:

1. Кнопка ручного наполнения миски
2. Отображение данных с датчиков уровня корма
3. Хранение данных о питомцах
4. Настройка расписания кормления
5. Отобрабражение времени до следующего кормления
## Подробное описание функционала, скриншоты страниц
### Pages
Страниц всего четыре: одна с основной информацией, две для редактирования расписаний и списка питомцев и еще одна, оставленная мной по историческим причинам.
Внешний вид меню

![Image alt](https://github.com/BlackFlowerDog/laughing-bassoon/raw/main/menu.png)

#### MAIN

![pet card](https://github.com/BlackFlowerDog/laughing-bassoon/raw/main/pet_card.png)

![Image alt](https://github.com/BlackFlowerDog/laughing-bassoon/raw/main/time_PC.png)

![Image alt](https://github.com/BlackFlowerDog/laughing-bassoon/raw/main/foodlvl.png)

#### ADD PETS

![Image alt](https://github.com/BlackFlowerDog/laughing-bassoon/raw/main/addPet.png)

![Image alt](https://github.com/BlackFlowerDog/laughing-bassoon/raw/main/uploads_image.png)

#### EDIT SCHEDULES, /settings/schedule

![Image alt](https://github.com/BlackFlowerDog/laughing-bassoon/raw/main/schedule_editor.png)

#### ABOUT US

![Image alt](https://github.com/BlackFlowerDog/laughing-bassoon/raw/main/about_us.png)


### config.json

Все данные о животных хранит файл config.json, используемый как аналог базы данных. 
Пример записи об одном питомце.

```
{"Cocca": {"type": true, "photoName": "Cocca201c72b1-aa26-4a61-a765-ded2347e65c3.jpg", "birthday": "", "sex": true, "schedule": {"activate": false, "time": ["12:12"]}}}
```

Все питомцы хранятся как записи в словаре. Ключом является имя животного, соответственно добавление нескольких питомцев с одинаковыми именами невозможно.
Type - cat (true), dog (false). Sex - male (true), female (false).
К началу названия загруженной фотографии добавляется имя питомца для создания уникального названия для фотографии во избежание ошибочного удаления из файловой системы при загрузке одинаковых фотографий для нескольких питомцев пользователем.
Activate - отвечает за активацию расписания кормления. Time - массив со временем кормления, отсортированным по возрастанию.

### Формат данных с сервера

