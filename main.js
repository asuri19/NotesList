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
const addNewImageButton = document.querySelector('#add-image-input');
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
        this.lists = 1;
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
addNewImageButton.addEventListener('change', () => createImageNote());
addNewNoteButton.addEventListener('click', () => createNote());
clearNotesListButton.addEventListener('click', () => clearNotesList());
// newListButton.addEventListener('click', () => newList());


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

function newList() {
    // let dateId = document.querySelector('.day-active').dataset.id;
    // let arrayPagesLS = getPagesLS();
    // let pageIndexLS = arrayPagesLS.findIndex(page => page.date === dateId)
    //
    // let newListNumber = arrayPagesLS[pageIndexLS].lists + 1;
    // if (newListNumber > 10) {
    //     return
    // }
    //
    // createPage(dateId, newListNumber)
    // arrayPagesLS = getPagesLS();
    // arrayPagesLS.forEach(item => {
    //     if (item.date === dateId) {
    //         item.lists = item.lists + 1
    //     }
    // })
    // setPagesLS(arrayPagesLS)
    // console.log(dateId, newListNumber);


    // let marksBody = document.querySelector('.diary-note__pages-num');
    // const arrayPages = getPagesLS();
    // let dateId = document.querySelector('.day-active').dataset.id;
    // let pageIndexes = []
    // while (arrayPages.findIndex(page => page.date === dateId) !== -1) {
    //     pageIndexes.push(arrayPages.findIndex(page => page.date === dateId));
    // }
    // pageIndexes.forEach(item => {
    //     arrayPages[item].lists += 1
    // })
    // let lists = arrayPages[pageIndexes[0]].lists


    // arrayPages[pageIndex].lists += 1
    // let lists = arrayPages[pageIndex].lists
    // setListsMarks(lists)

    // if (pageIndex !== -1) {
    //     arrayPages[pageIndex].lists += 1;
    //     setPagesLS(arrayPages)
    // }

    // let dateId = deleteDots(document.querySelector('.day-active').dataset.id);
    // let listButtons = marksBody.querySelectorAll('.diary-note__page');
    // let lastListNumber = listButtons.length;
    // printPageNotes(arrayPages[pageIndex].notes)
    //
    // let div = document.createElement('div');
    // div.classList.add('diary-note__page')
    // div.innerText = listButtons.length + 1;
    // marksBody.appendChild(div.cloneNode(true));
    // if (lastListNumber === 9) {
    //     newListButton.classList.add('none');
    // }
    //
    // listButtons = marksBody.querySelectorAll('.diary-note__page');
    //
    // listButtons.forEach(item => {
    //     item.addEventListener('click', () => {
    //         listButtons.forEach(item => {
    //             item.classList.remove('page-active')
    //         })
    //         item.classList.add('page-active')
    //         let indexOnButton = item.innerText
    //         createPage(dateId, indexOnButton)
    //     });
    // })
}

// function saveListMarks() {
//     let activeDay = document.querySelector('.day-active');
//     const arrayPages = getPagesLS();
//     let activeId = activeDay.dataset.id + listIndex;
//     let pageIndex = arrayPages.findIndex(page => page.date === activeId);
//
//     const arrayNotes = getNotesLS();
//     if (pageIndex !== -1) {
//         arrayPages[pageIndex].notes = arrayNotes;
//     } else {
//         return
//     }
//     setPagesLS(arrayPages)
// }

// кнопка сохранить
function saveNotes(listIndex) {
    let activeDay = document.querySelector('.day-active');
    const arrayPages = getPagesLS();
    let activeId = activeDay.dataset.id + listIndex;

    activeId = deleteDots(activeId)
    let pageIndex = arrayPages.findIndex(page => page.listId === activeId);
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
    let listIndex = document.querySelector('.page-active').innerText;
    const arrayNotes = getNotesLS();
    arrayNotes.push({
        id: generateUniqueId(),
        title: title,
        time: getCreationNoteTime(),
        note: note,
        type: 'text'
    });

    setNotesLS(arrayNotes)
    updateNotesList()
    saveNotes(listIndex)
}

function createImageNote() {
    const file = addNewImageButton.files[0];
    const imageURL = URL.createObjectURL(file);
    addNewImageButton.value = null;
    let note = 'Ты можешь добавить описание к фото тут!'
    let listIndex = document.querySelector('.page-active').innerText;
    const arrayNotes = getNotesLS();
    arrayNotes.push({
        id: generateUniqueId(),
        photoUrl: imageURL,
        time: getCreationNoteTime(),
        note: note,
        type: 'photo'
    });
    setNotesLS(arrayNotes)
    updateNotesList()
    saveNotes(listIndex)
}

// сохранение изменений в заметке
function editedNote(element, type) {

    const note = element.closest('.diary-note-body__note')
    const id = (+note.id);
    const arrayNotesLS = getNotesLS()
    const index = arrayNotesLS.findIndex(note => note.id === id);
    let listIndex = document.querySelector('.page-active').innerText;

    if (index === -1) return;
    if (type === 'title') {
        arrayNotesLS[index].title = element.innerText
    } else if (type === 'text'){
        arrayNotesLS[index].note = element.innerText
    } else if (type === 'photo'){
        const file = element.files[0];
        const newImageURL = URL.createObjectURL(file);
        element.value = null;
        arrayNotesLS[index].photoUrl = newImageURL
    }
    setNotesLS(arrayNotesLS)
    updateNotesList()
    saveNotes(listIndex)
}

// удаление одной заметки
function delNote(element) {
    const note = element.closest('.diary-note-body__note')
    const id = (+note.id);
    const arrayNotesLS = getNotesLS()
    const newArrayNotesLS = arrayNotesLS.filter(note => note.id !== id);
    let listIndex = document.querySelector('.page-active').innerText;

    setNotesLS(newArrayNotesLS)
    updateNotesList()
    saveNotes(listIndex)
}

//удаление всех заметок
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
    // setListsMarks(page.lists, page.listId)
    setNotesLS(page.notes)
    renderNotes(page.notes);
}

function updateNotesList() {
    notesList.innerText = '';
    const arrayNotesLS = getNotesLS();
    renderNotes(arrayNotesLS);
}

function setListsMarks(lists, active) {
    let marksBody = document.querySelector('.diary-note__pages-num');
    marksBody.innerHTML = '';

    let div = document.createElement('div');
    div.classList.add('diary-note__page')
    for (let i = 0; i < +lists; i++) {
        div.innerText = i + 1;
        if (div.innerText === active) {
            div.classList.add('page-active');
        }
        marksBody.appendChild(div.cloneNode(true));
    }
}

function renderNotes(notes) {
    if (!notes || !notes.length) {
        messageNoNotes.classList.remove('none')
        return
    }
    messageNoNotes.classList.add('none')
    notes.forEach(value => {
        const {id, title, time, note, type, photoUrl} = value;
        let item = '';

        if (type === 'text') {
            item = `<div class="diary-note-body__note" id="${id}">
                <div class="diary-note-body__title-wrap">
                    <div class="diary-note-body__title" contenteditable="true">
                        ${title}
                    </div>
                </div>
                <div class="diary-note-body__wrap">
                    <div class="diary-note-body__time">${time}</div>
                    <div class="diary-note-body__text" contenteditable="true">${note}</div>
                    <div class="diary-note-body__del">
                        <img src="https://i.postimg.cc/ydwt9JwD/del.png">
                    </div>
                </div>
            </div>`
        } else {
            item = `<div class="diary-note-body__note" id="${id}">
                <div class="diary-note-body__title-wrap">
                    <div class="diary-note-body__image" contenteditable="false">
                        <img src="${photoUrl}">
                        <div class="diary-note-body__edit none">
                            <input type="file" id="input-${id}" accept="image/*" hidden/>
                            <label for="input-${id}">
                                <img src="https://i.postimg.cc/qMRPZkYP/edite.png" />
                            </label>
                        </div>
                    </div>
                </div>
                <div class="diary-note-body__wrap">
                    <div class="diary-note-body__time">${time}</div>
                    <div class="diary-note-body__text" contenteditable="true">${note}</div>
                    <div class="diary-note-body__del">
                        <img src="https://i.postimg.cc/ydwt9JwD/del.png">
                    </div>
                </div>
            </div>
            `
        }
        notesList.insertAdjacentHTML('beforeend', item);
        let appendedNote = document.getElementById(id);

        if (type === 'text') {
            let noteTitle = appendedNote.querySelector('.diary-note-body__title');
            noteTitle.addEventListener('blur', () => editedNote(noteTitle, 'title'))
        } else {
            let image = appendedNote.querySelector('.diary-note-body__image');
            let input = document.getElementById(`input-${id}`);
            image.addEventListener('mouseenter', () => {
                appendedNote.querySelector('.diary-note-body__edit').classList.remove('none');
            })
            image.addEventListener('mouseleave', () => {
                appendedNote.querySelector('.diary-note-body__edit').classList.add('none');
            })
            input.addEventListener('change', () => editedNote(input, 'photo'))
        }
        let noteText = appendedNote.querySelector('.diary-note-body__text');
        let delButton = appendedNote.querySelector('.diary-note-body__del');

        noteText.addEventListener('blur', () => editedNote(noteText, 'text'))
        delButton.addEventListener('click', () => delNote(delButton))
    })
}

function deleteDots(string) {
    return string = string[0] + string[1] + string[3] + string[4] + string[6] + string[7] + string[8] + string[9] + string[10]
}