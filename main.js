//переменные
const calendarArea = document.querySelector('.diary__calendar-days');
const openDateSelect = document.querySelector('.diary__calendar-select-icon');
const selectWindow = document.querySelector('.selector');

const selectYear = document.querySelector('.selector-year')
const selectYearOptions = document.querySelector('.selector-year__options')
const selectYearButton = document.querySelector('.selector-year__open');

const selectMonth = document.querySelector('.selector-month')
const selectMonthOptions = document.querySelector('.selector-month__options')
const selectMonthButton = document.querySelector('.selector-month__open');
const notesList = document.querySelector('.diary-note-body__notes');

const monthName = document.querySelector('.diary__calendar-select-title p');
const lastMonthButton = document.querySelector('#last-month');
const nextMonthButton = document.querySelector('#next-month');

const dateMark = document.querySelector('.diary-note__datemark')
const addNewNoteButton = document.querySelector('#add-button');
const clearNotesListButton = document.querySelector('#clear-button');
const newListButton = document.querySelector('#new-list');
const messageNoNotes = document.querySelector('.diary-note__clear-wrap');

let monthsList = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь',]

let intDate = new Date();
let params = []

class Page {
    constructor(dataId, index, notes) {
        this.date = dataId;
        this.listIndex = index;
        this.listId = this.createId(this.date, this.listIndex);
        this.bookmark = this.createBookmark(this.date)
        this.notes = notes;
    }

    createId(date, index) {
        date = date.split('');
        date = date[0] + date[1] + date[3] + date[4] + date[6] + date[7] + date[8] + date[9];
        return date = date + index
    }

    createBookmark(date) {
        date = date.split('');
        let day = date[0] + date[1];
        let month = date[3] + date[4];
        month = month.split('');
        if (month[0] === '0') {
            month = month[1]
        } else {
            month = month[0] + month[1]
        }
        month = monthsList[month - 1]
        return `${day}` + ` ${month}`;
    }
}

// script body
createCalendar('', true)
setActiveDay(new Date())

// работа с календарем
openDateSelect.addEventListener('click', () => togglingNone(selectWindow))
// фильтры внутри календаря (вернусь потом)
// selectYearButton.addEventListener('click', () => togglingNone(selectYearOptions))
// selectMonthButton.addEventListener('click', () => togglingNone(selectMonthOptions))
// selectOption(selectYear, selectYearOptions)
// selectOption(selectMonth, selectMonthOptions)

// работа с заметками
lastMonthButton.addEventListener('click', () => createCalendar('last', false));
nextMonthButton.addEventListener('click', () => createCalendar('next', false));
addNewNoteButton.addEventListener('click', () => createNote());
clearNotesListButton.addEventListener('click', () => clearNotesList());


// функции
// создание календаря месяца
function createCalendar(type, isFirstCreation) {
    calendarArea.innerHTML = '';
    if (type === 'last') {
        intDate = intDate.setMonth(intDate.getMonth() - 1);
    } else if (type === 'next') {
        intDate = intDate.setMonth(intDate.getMonth() + 1);
    }
    intDate = new Date(intDate)

    let currentMonthNumber = setCurrentMonth(intDate)
    getParameters(intDate)
    createDays(params[0], params[1], params[2], currentMonthNumber, isFirstCreation)
}

// получаем все нужные для создания календаря параметры
function getParameters(date) {
    let firstDayWeek = new Date(date.setDate(1)).getDay();
    if (firstDayWeek === 0) {
        firstDayWeek = 7
    }
    let daysInMonth = 32 - new Date(date.getFullYear(), date.getMonth(), 32).getDate();
    date = new Date(date.setMonth(date.getMonth() - 1));
    let daysInLastMonth = 32 - new Date(date.getFullYear(), date.getMonth(), 32).getDate();
    intDate = new Date(date.setMonth(date.getMonth() + 1));
    params = [firstDayWeek, daysInMonth, daysInLastMonth]
    return params
}

function createDays(firstDayWeek, daysInMonth, daysInLastMonth, monthNumber, isFirstCreation) {
    let counter = 0;
    let newDay = document.createElement('div');
    newDay.classList.add('diary__calendar-item');

    for (let i = firstDayWeek - 2; i >= 0; i--) {
        newDay.innerHTML = `<span class="dif-month">${daysInLastMonth - i}</span>`;
        calendarArea.appendChild(newDay.cloneNode(true))
        counter += 1;
    }

    for (let i = 1; i <= daysInMonth; i++) {
        let index = i
        if (index < 10) {
            index = '0' + index
        }
        newDay.dataset.id = `${index}.${monthNumber}`;
        newDay.innerHTML = `<span>${i}</span>`;
        calendarArea.appendChild(newDay.cloneNode(true))
        counter += 1;

        if (newDay.dataset.id === `01.${monthNumber}`) {
            let currentMonthYear = `${correctingData(new Date().getMonth() + 1)}.${new Date().getFullYear()}`;

            if (monthNumber !== currentMonthYear || !isFirstCreation) {
                let dayId = newDay.dataset.id;
                document.querySelector(`.diary__calendar-item[data-id="${dayId}"]`).classList.add('day-active')
                createPage(dayId, 1)
                isFirstCreation = false
            }
        }
    }

    delete newDay.dataset.id
    counter = 7 - counter % 7;
    if (counter !== 7) {
        for (let i = 1; i <= counter; i++) {
            newDay.innerHTML = `<span class="dif-month">${i}</span>`;
            calendarArea.appendChild(newDay.cloneNode(true))
        }
    }

    let daysList = document.querySelectorAll('.diary__calendar-item');
    daysList.forEach(item => {
        if (item.querySelector('span').classList.contains('dif-month')) {
            return
        }
        item.addEventListener('click', () => {
            daysList.forEach(item => {
                item.classList.remove('day-active')
            })
            item.classList.add('day-active')
            let dayId = item.dataset.id;
            createPage(dayId, 1)
        });
    })
}

// отображение названия текущего месяца
function setCurrentMonth(date) {
    let monthNumber = date.getMonth()

    let year = date.getFullYear()
    let month = stringMonthName(monthNumber)
    monthName.innerText = `${month} ${year}`
    // часть для data-id
    monthNumber += 1
    monthNumber = correctingData(monthNumber)
    return `${monthNumber}.${year}`
}

function stringMonthName(monthNumber) {
    let monthName = monthsList[monthNumber];
    monthName = monthName.split('')
    monthName[0] = monthName[0].toUpperCase();
    return monthName.join('')
}

// для селекторов внутри селектора даты
function selectOption(select, options) {
    let selectedOption = select.querySelector('p');
    let selectList = select.querySelectorAll('.selector__option')
    selectList.forEach(item => {
        item.addEventListener('click', () => {
            selectedOption.innerText = item.innerText
            options.classList.add('none')
        })
    })
}

// установка активного класса на сегодняшний день
function setActiveDay(date) {
    let day = correctingData(date.getDate());
    let month = correctingData(date.getMonth() + 1);
    let year = date.getFullYear();
    let fullDate = `${day}.${month}.${year}`
    let currentDateItem = document.querySelector(`.diary__calendar-item[data-id="${fullDate}"]`);
    currentDateItem.classList.add('day-active')
    createPage(fullDate, 1)
}


// создание или отрисовка новой страницы
function createPage(dateId, index) {
    let page = new Page(dateId, index, [])
    let id = page.listId
    dateMark.innerText = page.bookmark
    const arrayPagesLS = getPagesLS();

    let pageIndexLS = arrayPagesLS.findIndex(page => page.listId === id)
    if (pageIndexLS === -1) {
        arrayPagesLS.push(page);
        setNotesLS([])
        updateNotesList()
        setPagesLS(arrayPagesLS)
    } else {
        printPageNotes(arrayPagesLS[pageIndexLS])
    }
}

// кнопка сохранить
function saveNotes() {
    let activeDay = document.querySelector('.day-active');
    let activeId = activeDay.dataset.id;
    const arrayPages = getPagesLS();
    let pageIndex = arrayPages.findIndex(page => page.date === activeId);

    const arrayNotes = getNotesLS();
    if (pageIndex !== -1) {
        arrayPages[pageIndex].notes = arrayNotes;
    } else {
        return
    }
    setPagesLS(arrayPages)
}

// создание заметки
function createNote() {
    let title = 'Заголовок'
    let note = 'Это твоя заметка и ее можно писать прямо тут!'
    const arrayNotes = getNotesLS();
    arrayNotes.push({
        id: generateUniqueId(),
        title: title,
        time: getCreationNoteTime(),
        note: note
    });
    setNotesLS(arrayNotes)
    updateNotesList()
    saveNotes()
}

// сохранение изменений в заметке !!не работает
function editedNote(element, type) {
    const note = element.closest('.diary-note-body__note')
    const id = (+note.id);
    const arrayNotesLS = getNotesLS()
    const index = arrayNotesLS.findIndex(note => note.id === id);

    if (index === -1) return;
    if (type === 'title') {
        arrayNotesLS[index].title = element.innerText
    } else {
        arrayNotesLS[index].note = element.innerText
    }
    setNotesLS(arrayNotesLS)
    updateNotesList()
    saveNotes()
}

// удаление одной заметки
function delNote(element) {
    const note = element.closest('.diary-note-body__note')
    const id = (+note.id);
    const arrayNotesLS = getNotesLS()
    const newArrayNotesLS = arrayNotesLS.filter(note => note.id !== id);

    setNotesLS(newArrayNotesLS)
    updateNotesList()
    saveNotes()
}

//удаление всех заметок !!не работает
function clearNotesList() {
    let activeDay = document.querySelector('.day-active');
    let activeId = activeDay.dataset.id;
    const arrayPages = getPagesLS();
    let pageIndex = arrayPages.findIndex(page => page.date === activeId);

    if (pageIndex !== -1) {
        arrayPages[pageIndex].notes = [];
    } else {
        return
    }
    // messageNoNotes.classList.remove('none')
    setPagesLS(arrayPages)
    setNotesLS([])
    updateNotesList()
}

//время создания заметки
function getCreationNoteTime() {
    return `${correctingData(new Date().getHours())}:${correctingData(new Date().getMinutes())}`
}

//служебные функции
function togglingNone(elem) {
    elem.classList.toggle('none')
}

function correctingData(data) {
    if (data < 10) {
        data = '0' + data;
    }
    return data;
}

function generateUniqueId() {
    let randomOne = Math.floor(Math.random() * 100000);
    let randomTwo = Math.floor(Math.random() * 100000);
    return randomOne + randomTwo;
}

function getPagesLS() {
    const pagesJSON = localStorage.getItem('pages');
    if (pagesJSON) {
        return JSON.parse(pagesJSON);
    } else return [];
}

function setPagesLS(pages) {
    localStorage.setItem('pages', JSON.stringify(pages));
}

function getNotesLS() {
    const notesJSON = localStorage.getItem('notes');
    if (notesJSON) {
        return JSON.parse(notesJSON);
    } else return [];
}

function setNotesLS(notes) {
    localStorage.setItem('notes', JSON.stringify(notes));
}

function printPageNotes(page) {
    notesList.innerText = '';
    setNotesLS(page.notes)
    renderNotes(page.notes);
}

function updateNotesList() {
    notesList.innerText = '';
    const arrayNotesLS = getNotesLS();
    renderNotes(arrayNotesLS);
}

function renderNotes(notes) {
    if (!notes || !notes.length) {
        messageNoNotes.classList.remove('none')
        return
    }

    messageNoNotes.classList.add('none')
    notes.forEach(value => {
        const {id, title, time, note} = value;
        const item =
            `<div class="diary-note-body__note" id="${id}">
                <div class="diary-note-body__title-wrap">
                    <div class="diary-note-body__title" contenteditable="true">
                        ${title}
                    </div>
                    <div class="diary-note-body__del">
                        <img src="https://i.postimg.cc/ydwt9JwD/del.png">
                    </div>
                </div>
                <div class="diary-note-body__wrap">
                    <div class="diary-note-body__time">${time}</div>
                    <div class="diary-note-body__text" contenteditable="true">${note}</div>
                </div>
            </div>`
        notesList.insertAdjacentHTML('beforeend', item);
        let appendedNote = document.getElementById(id);
        let noteTitle = appendedNote.querySelector('.diary-note-body__title');
        let noteText = appendedNote.querySelector('.diary-note-body__text');
        let delButton = appendedNote.querySelector('.diary-note-body__del');

        noteTitle.addEventListener('blur', () => editedNote(noteTitle, 'title'))
        noteText.addEventListener('blur', () => editedNote(noteText, 'text'))
        delButton.addEventListener('click', () => delNote(delButton))
    })
}