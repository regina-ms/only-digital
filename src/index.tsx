import { createRoot } from "react-dom/client"
import { App } from "@/components/App/App"
import { createBrowserRouter, RouterProvider } from "react-router"
import "./global.scss"

export type Data = {
  id: string
  name: string
  content: {
    year: number
    text: string
  }[]
}

const MOCK_DATA: Data[] = [
  {
    id: "science",
    name: "Наука",
    content: [
      {
        year: 1905,
        text: "Альберт Эйнштейн публикует специальную теорию относительности",
      },
      { year: 1928, text: "Александр Флеминг открывает пенициллин" },
      { year: 1953, text: "Уотсон и Крик открывают структуру ДНК" },
      { year: 1969, text: "Нил Армстронг становится первым человеком на Луне" },
      { year: 1990, text: "Запуск космического телескопа Хаббл" },
      { year: 2012, text: "Открытие бозона Хиггса в ЦЕРНе" },
    ],
  },
  {
    id: "history",
    name: "История",
    content: [
      { year: 476, text: "Падение Западной Римской империи" },
      { year: 1492, text: "Открытие Америки Христофором Колумбом" },
      { year: 1789, text: "Начало Великой французской революции" },
      { year: 1914, text: "Начало Первой мировой войны" },
      { year: 1945, text: "Окончание Второй мировой войны" },
    ],
  },
  {
    id: "film",
    name: "Кино",
    content: [
      { year: 1895, text: "Первый платный киносеанс братьев Люмьер в Париже" },
      { year: 1927, text: "Выход первого звукового фильма 'Певец джаза'" },
      { year: 1939, text: "Премьера фильма 'Унесенные ветром'" },
      { year: 1977, text: "Выход фильма 'Звездные войны'" },
      { year: 1997, text: "Премьера фильма 'Титаник'" },
      { year: 2010, text: "Выход фильма 'Начало' Кристофера Нолана" },
      { year: 2019, text: "Триумф фильма 'Паразиты' на Оскаре" },
    ],
  },
  {
    id: "literature",
    name: "Литература",
    content: [
      { year: 1605, text: "Публикация первой части 'Дон Кихота' Сервантеса" },
      { year: 1869, text: "Публикация романа 'Война и мир' Льва Толстого" },
      { year: 1925, text: "Выход романа 'Великий Гэтсби' Фицджеральда" },
      { year: 1949, text: "Публикация романа '1984' Джорджа Оруэлла" },
      { year: 1967, text: "Публикация романа 'Сто лет одиночества' Маркеса" },
      { year: 1997, text: "Выход первой книги о Гарри Поттере" },
    ],
  },
  {
    id: "music",
    name: "Музыка",
    content: [
      { year: 1685, text: "Рождение Иоганна Себастьяна Баха" },
      { year: 1770, text: "Рождение Людвига ван Бетховена" },
      { year: 1824, text: "Премьера Девятой симфонии Бетховена" },
      {
        year: 1956,
        text: "Элвис Пресли врывается в чарты с 'Heartbreak Hotel'",
      },
      { year: 1964, text: "The Beatles покоряют США" },
      { year: 1982, text: "Выход альбома 'Thriller' Майкла Джексона" },
      { year: 1991, text: "Выход альбома 'Nevermind' группы Nirvana" },
    ],
  },
  {
    id: "philosophy",
    name: "Философия",
    content: [
      { year: 399, text: "Суд и казнь Сократа" },
      { year: 1637, text: "Публикация 'Рассуждения о методе' Декарта" },
      { year: 1781, text: "Публикация 'Критики чистого разума' Канта" },
      {
        year: 1848,
        text: "Публикация 'Коммунистического манифеста' Маркса и Энгельса",
      },
      { year: 1883, text: "Смерть Карла Маркса" },
      { year: 1927, text: "Публикация 'Бытия и времени' Хайдеггера" },
      { year: 1943, text: "Публикация 'Бытия и ничто' Сартра" },
    ],
  },
]

const root = document.getElementById("root")
if (!root) {
  throw new Error("root not found")
}

const container = createRoot(root)

const router = createBrowserRouter([
  {
    path: "/",
    element: <App data={MOCK_DATA} />,
  },
])

container.render(<RouterProvider router={router} />)
