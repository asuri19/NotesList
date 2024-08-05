//переменные
const calendarArea = document.querySelector('.diary__calendar-days');
const notesList = document.querySelector('.diary-note-body__notes');

const monthName = document.querySelector('.diary__calendar-select-title');
const lastMonthButton = document.querySelector('#last-month');
const nextMonthButton = document.querySelector('#next-month');

const dateMark = document.querySelector('.diary-note__datemark')
const addNewNoteButton = document.querySelector('#add-button');
const clearNotesListButton = document.querySelector('#clear-button');
const messageNoNotes = document.querySelector('.diary-note__clear-wrap');

const popup = document.querySelector('.diary__popup')
const saveButton = popup.querySelector('#save-button');
const canselButton = popup.querySelector('#cansel-button');
const cleanPopupImages = document.querySelector('#clean-images')
const popupIdBox = popup.querySelector('.diary__popup-id')

const popupTitle = popup.querySelector('.diary__popup-title')
const popupText = popup.querySelector('.diary__popup-text')
const addPopupImageButton = document.querySelector('#add-img');

const monthsList = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь',]
let intDate = new Date();

class Page {
    constructor(dataId, index, notes) {
        this.date = dataId;
        this.listId = this.createId(this.date);
        this.bookmark = this.createBookmark(this.date)
        this.notes = notes;
    }

    createId(date) {
        date = date.split('');
        date = date[0] + date[1] + date[3] + date[4] + date[6] + date[7] + date[8] + date[9];
        return date
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
createCalendar({type: '', isFirstCreation: true})
setActiveDay(new Date())

// работа с заметками
lastMonthButton.addEventListener('click', () => createCalendar({type: 'last', isFirstCreation: false}));
nextMonthButton.addEventListener('click', () => createCalendar({type: 'next', isFirstCreation: false}));
addNewNoteButton.addEventListener('click', () => createNote());
clearNotesListButton.addEventListener('click', () => clearNotesList());

// функции
// создание календаря месяца
function createCalendar({type, isFirstCreation}) {
    calendarArea.innerHTML = '';
    if (type === 'last') {
        intDate = intDate.setMonth(intDate.getMonth() - 1);
    } else if (type === 'next') {
        intDate = intDate.setMonth(intDate.getMonth() + 1);
    }
    intDate = new Date(intDate)

    const params = getCalendarParameters(intDate)
    createDays({
        firstDayWeek: params.firstDayWeek,
        daysInMonth: params.daysInMonth,
        daysInLastMonth: params.daysInLastMonth,
        monthNumber: setCurrentMonth(intDate),
        isFirstCreation
    })
}

// получаем все нужные для создания календаря параметры
function getCalendarParameters(date) {
    let firstDayWeek = new Date(date.setDate(1)).getDay();
    if (firstDayWeek === 0) {
        firstDayWeek = 7
    }
    let daysInMonth = 32 - new Date(date.getFullYear(), date.getMonth(), 32).getDate();
    date = new Date(date.setMonth(date.getMonth() - 1));
    let daysInLastMonth = 32 - new Date(date.getFullYear(), date.getMonth(), 32).getDate();
    intDate = new Date(date.setMonth(date.getMonth() + 1));
    return {
        firstDayWeek,
        daysInMonth,
        daysInLastMonth
    }
}

function createDays({firstDayWeek, daysInMonth, daysInLastMonth, monthNumber, isFirstCreation}) {
    const lastMonthDaysAmount = firstDayWeek - 1;
    const nextMonthDaysAmount = 7 - ((lastMonthDaysAmount + daysInMonth) % 7);
    const newDay = document.createElement('div');
    newDay.classList.add('diary__calendar-item');

    createLastMonthDays({daysInLastMonth, newDay, lastMonthDaysAmount})
    createCurrentMonthDays({daysInMonth, newDay, monthNumber, isFirstCreation})
    delete newDay.dataset.id
    createNextMonthDays({newDay, nextMonthDaysAmount})
// исправить код ниже с использованием делегирования
    let daysList = document.querySelectorAll('.diary__calendar-item');
    daysList.forEach(item => {
        if (item.querySelector('span').classList.contains('dif-month')) {
            return
        }
        item.addEventListener('click', () => {
            daysList.forEach(element => {
                element.classList.remove('day-active')
            })
            item.classList.add('day-active')
            let dayId = item.dataset.id;
            createPage(dayId, 1)
        });
    })
}

// отрисовка дней в календаре
function createLastMonthDays({daysInLastMonth, newDay, lastMonthDaysAmount}) {
    for (let i = lastMonthDaysAmount; i > 0; i--) {
        newDay.innerHTML = `<span class="dif-month">${daysInLastMonth - i}</span>`;
        calendarArea.appendChild(newDay.cloneNode(true))
    }
}

function createCurrentMonthDays({daysInMonth, newDay, monthNumber, isFirstCreation}) {
    for (let i = 1; i <= daysInMonth; i++) {
        let index = correctingData(i)
        newDay.dataset.id = `${index}.${monthNumber}`;
        newDay.innerHTML = `<span>${i}</span>`;
        calendarArea.appendChild(newDay.cloneNode(true))

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
}

function createNextMonthDays({newDay, nextMonthDaysAmount}) {
    if (nextMonthDaysAmount === 7) {
        return
    }
    for (let i = 1; i <= nextMonthDaysAmount; i++) {
        newDay.innerHTML = `<span class="dif-month">${i}</span>`;
        calendarArea.appendChild(newDay.cloneNode(true))
    }
}

// отображение названия текущего месяца
function setCurrentMonth(date) {
    let monthNumber = date.getMonth();
    const year = date.getFullYear();
    const month = stringMonthName(monthNumber);
    monthName.innerText = `${month} ${year}`;

    monthNumber = correctingData(monthNumber + 1);
    return `${monthNumber}.${year}`;
}

function stringMonthName(monthNumber) {
    let monthName = monthsList[monthNumber];
    monthName = monthName.split('')
    monthName[0] = monthName[0].toUpperCase();
    return monthName.join('')
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

// сохранение нового массива заметок на странице
function saveNotes() {
    let activeDayId = document.querySelector('.day-active').dataset.id;
    const arrayPages = getPagesLS();
    const arrayNotes = getNotesLS();

    activeDayId = deleteDots(activeDayId)
    let pageIndex = arrayPages.findIndex(page => page.listId === activeDayId);
    if (pageIndex === -1) {
        return;
    }
    arrayPages[pageIndex].notes = arrayNotes;
    setPagesLS(arrayPages)
}

// создание заметки
function createNote() {
    let title = 'Заголовок'
    let note = 'Это твоя заметка и ее можно писать прямо тут!'
    const arrayNotes = getNotesLS();
    arrayNotes.push({
        id: generateUniqueId(),
        photoUrl: [],
        title,
        time: getCreationNoteTime(),
        note,
    });

    setNotesLS(arrayNotes)
    updateNotesList()
    saveNotes()
}

// сохранение изменений в заметке
function saveNoteChanges(temporaryPopupData) {

    const arrayNotesLS = getNotesLS()
    const index = arrayNotesLS.findIndex(note => note.id === temporaryPopupData.noteId);

    if (index === -1) return;
    console.log(temporaryPopupData.noteId)
    arrayNotesLS[index].photoUrl = temporaryPopupData.noteImagesUrl
    arrayNotesLS[index].title = popupTitle.innerText
    arrayNotesLS[index].note = popupText.innerText

    setNotesLS(arrayNotesLS)
    updateNotesList()
    saveNotes()
}

// открытие и заполнение попапа актуальным контентом заметки
function createPopup({evt, note, title, id, url}) {
    if (evt.target.className === 'del-btn') return
    popup.classList.remove('none')

    let temporaryPopupData = {
        noteId: id,
        noteTitle: title,
        noteText: note,
        noteImagesUrl: url,
        popupImagesContainer: document.querySelector('.diary__popup-content-image')
    }
    updatePopupContent(temporaryPopupData, '')

    const updatePopupContentWithParams = () => updatePopupContent(temporaryPopupData, 'cleanImages')
    const addPopupImageWithParams = () => addPopupImage(temporaryPopupData)
    const savePopupWithParams = () => savePopup(temporaryPopupData)

    addPopupImageButton.addEventListener('change', addPopupImageWithParams)
    cleanPopupImages.addEventListener('click', updatePopupContentWithParams)

    canselButton.addEventListener('click', () => {
        popup.classList.add('none')
        cleanPopupImages.removeEventListener('click', updatePopupContentWithParams)
        addPopupImageButton.removeEventListener('change', addPopupImageWithParams)
    })
    saveButton.addEventListener('click', savePopupWithParams)

    function savePopup(temporaryPopupData) {
        popup.classList.add('none')
        cleanPopupImages.removeEventListener('click', updatePopupContentWithParams)
        addPopupImageButton.removeEventListener('change', addPopupImageWithParams)
        saveNoteChanges(temporaryPopupData)
        saveButton.removeEventListener('click', savePopupWithParams)
    }
}

function changeImage(image, index, changeImageInput, imageArray) {
    let imageURL = createImageUrl(changeImageInput)
    image.style.backgroundImage = `url("${imageURL}")`;
    imageArray[index] = imageURL
}

function deleteImage(image, index, temporaryPopupData) {
    image.remove()
    temporaryPopupData.noteImagesUrl.splice(index, 1);
    updatePopupContent(temporaryPopupData, '')
    if (temporaryPopupData.noteImagesUrl.length === 1) {
        document.querySelector('.diary__popup-clean-images').classList.add('none')
    }
}

function updatePopupContent(popupData, operation) {
    if (operation === 'cleanImages') {
        popupData.noteImagesUrl = [];
        document.querySelector('.diary__popup-clean-images').classList.add('none')
    }
    if (popupData.noteImagesUrl.length > 1) {
        document.querySelector('.diary__popup-clean-images').classList.remove('none')
    }
    popupIdBox.innerText = popupData.noteId;
    popupTitle.innerText = popupData.noteTitle;
    popupText.innerText = popupData.noteText;
    insertPopupImage(popupData)
}

function addPopupImage(popupData) {
    if (popupData.noteImagesUrl.length > 4) {
        alert('Невозможно добавить более 5 изображений')
        return
    }
    let imageURL = createImageUrl(addPopupImageButton)
    popupData.noteImagesUrl.push(imageURL);
    insertPopupImage(popupData)
    if (popupData.noteImagesUrl.length > 1) {
        document.querySelector('.diary__popup-clean-images').classList.remove('none')
    }
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
function createImageUrl(fileInput) {
    const file = fileInput.files[0];
    const imageURL = URL.createObjectURL(file);
    fileInput.value = null;
    return imageURL
}

function correctingData(data) {
    if (data < 10) {
        data = '0' + data;
    }
    return data;
}

function generateUniqueId() {
    return Math.floor((Math.random() + Math.random()) * 100000);
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
    renderNotes(getNotesLS());
}


function renderNotes(notes) {
    if (notes.length === 0) {
        messageNoNotes.classList.remove('none')
        return
    }
    messageNoNotes.classList.add('none')

    notes.forEach(value => {
        const {id, title, time, note, photoUrl} = value;
        let item =
            `<div class="diary-note-body__note" id="${id}">
                <div class="diary-note-body__image-wrap"></div>
                <div class="diary-note-body__title-wrap">
                    <div class="diary-note-body__title">${title}</div>
                </div>
                <div class="diary-note-body__wrap">
                    <div class="diary-note-body__time">${time}</div>
                    <div class="diary-note-body__text">${note}</div>
                    <div class="diary-note-body__del">
                        <img src="https://i.postimg.cc/ydwt9JwD/del.png" class="del-btn">
                    </div>
                </div>
            </div>`

        notesList.insertAdjacentHTML('beforeend', item);
        const appendedNote = document.getElementById(id);
        const noteImageWrapper = appendedNote.querySelector('.diary-note-body__image-wrap');
        insertImageItems({repetitions: photoUrl.length, srcArray: photoUrl, body: noteImageWrapper})
        appendedNote.addEventListener('click', (evt) => createPopup({evt, note, title, id, url: photoUrl}))

        const delButton = appendedNote.querySelector('.diary-note-body__del');
        delButton.addEventListener('click', () => delNote(delButton))
    })

}

function deleteDots(string) {
    return string = string[0] + string[1] + string[3] + string[4] + string[6] + string[7] + string[8] + string[9]
}

function insertImageItems({repetitions, srcArray, body}) {
    for (let i = 0; i < repetitions; i++) {
        let imageItem =
            `<div class="diary-note-body__image">
                <img src="${srcArray[i]}" class="note-img">
            </div>`

        body.insertAdjacentHTML('beforeend', imageItem);
    }
}

function insertPopupImage(temporaryPopupData) {
    let body = temporaryPopupData.popupImagesContainer
    body.innerHTML = ''
    for (let i = 0; i < temporaryPopupData.noteImagesUrl.length; i++) {
        let imageItem =
            `<div class="diary__popup-image" id="image-${i + 1}">
                <div class="diary__popup-panel none">
                    <div class="diary__popup-edit-btn">
                        <input type="file" id="edit-img-${i + 1}" accept="image/*" hidden/>
                        <label for="edit-img-${i + 1}">
                            <img src="https://i.postimg.cc/qMRPZkYP/edite.png"/>
                        </label>
                    </div>

                    <div class="diary__popup-del-btn" id="delete-img-${i + 1}">
                        <img src="https://i.postimg.cc/ydwt9JwD/del.png"/>
                    </div>
                </div>
            </div>`

        body.insertAdjacentHTML('beforeend', imageItem);
        let image = document.getElementById(`image-${i + 1}`)
        image.style.backgroundImage = `url(${temporaryPopupData.noteImagesUrl[i]})`

        const panel = image.querySelector('.diary__popup-panel');
        const changeImageInput = document.getElementById(`edit-img-${i + 1}`)
        const deleteImageButton = document.getElementById(`delete-img-${i + 1}`)

        const changeImageWithParams = () => changeImage(image, i, changeImageInput, temporaryPopupData.noteImagesUrl)
        const deleteImageWithParams = () => deleteImage(image, i, temporaryPopupData)

        image.addEventListener('mouseenter', () => {
            panel.classList.remove('none');
            changeImageInput.addEventListener('change', changeImageWithParams)
            deleteImageButton.addEventListener('click', deleteImageWithParams)
        })
        image.addEventListener('mouseleave', () => {
            panel.classList.add('none');
            changeImageInput.removeEventListener('change', changeImageWithParams)
            deleteImageButton.removeEventListener('click', deleteImageWithParams)
        })
    }
}