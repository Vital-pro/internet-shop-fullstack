//* Но в открытом виде оставлять данные нельзя! Хранить данные внутри кода приложения нельзя!
Подключим пакет dotenv in index.js:

require ('dotenv').config()  //так наверху импортим 

dotenv.config();        <!-- так просто вызываем и всё. после const app = express() -->

*Cоздадим -> in folder server create fail .env*

В нем можно create const's и присвоить им:

const PORT = process.env.PORT || 3000
const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_NAME = process.env.DB_NAME

...и потом их использовать. Можно и напрямую без const, но так нагляднее и удобнее.

//! Главное - потом создать дубликат файла .env Он не заливается на github, т.к. есть в .gitignore!!!** 
// Назвать другой файл, например .env-copy или .env-template. И убрать свои данные. Но оставить поля, какие были задействованы с подставлением данных. Чтобы другой пользователь, скачавший  проект с гитхаба, мог вставить свои значения в эти поля, и его проект заработает у него. 
PORT=
DB_USER=
DB_PASSWORD=
DB_NAME=