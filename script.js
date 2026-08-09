/* =====================================
   TODO APP
===================================== */


// =====================================
// DATA
// =====================================

let tasks =
    JSON.parse(
        localStorage.getItem("iphoneTodoTasks")
    ) || {};


// Current calendar month

let currentDate = new Date();


// Selected date

let selectedDate = new Date();


// Currently dragged task

let draggedTask = null;


// =====================================
// ELEMENTS
// =====================================

const calendar =
    document.getElementById("calendar");

const monthYear =
    document.getElementById("monthYear");

const selectedDateElement =
    document.getElementById("selectedDate");

const taskList =
    document.getElementById("taskList");

const taskCount =
    document.getElementById("taskCount");

const taskInput =
    document.getElementById("taskInput");

const addTaskButton =
    document.getElementById("addTaskButton");

const previousMonth =
    document.getElementById("previousMonth");

const nextMonth =
    document.getElementById("nextMonth");

const todayButton =
    document.getElementById("todayButton");

const calendarButton =
    document.getElementById("calendarButton");

const focusButton =
    document.getElementById("focusButton");


// =====================================
// DATE KEY
// =====================================

function dateKey(date) {

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            date.getDate()
        ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


// =====================================
// FORMAT DATE
// =====================================

function formatDate(date) {

    return date.toLocaleDateString(
        "en-US",
        {
            weekday: "long",
            month: "long",
            day: "numeric"
        }
    );
}


// =====================================
// SAVE
// =====================================

function saveTasks() {

    localStorage.setItem(
        "iphoneTodoTasks",
        JSON.stringify(tasks)
    );

}


// =====================================
// CALENDAR
// =====================================

function renderCalendar() {

    calendar.innerHTML = "";


    const year =
        currentDate.getFullYear();

    const month =
        currentDate.getMonth();


    monthYear.textContent =
        currentDate.toLocaleDateString(
            "en-US",
            {
                month: "long",
                year: "numeric"
            }
        );


    const firstDay =
        new Date(
            year,
            month,
            1
        ).getDay();


    const daysInMonth =
        new Date(
            year,
            month + 1,
            0
        ).getDate();


    const daysPreviousMonth =
        new Date(
            year,
            month,
            0
        ).getDate();


    // =================================
    // PREVIOUS MONTH
    // =================================

    for (
        let i = firstDay - 1;
        i >= 0;
        i--
    ) {

        const day =
            daysPreviousMonth - i;

        const date =
            new Date(
                year,
                month - 1,
                day
            );

        createCalendarDay(
            date,
            true
        );

    }


    // =================================
    // CURRENT MONTH
    // =================================

    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {

        const date =
            new Date(
                year,
                month,
                day
            );

        createCalendarDay(
            date,
            false
        );

    }


    // =================================
    // NEXT MONTH
    // =================================

    while (
        calendar.children.length < 42
    ) {

        const day =
            calendar.children.length -
            firstDay -
            daysInMonth +
            1;

        const date =
            new Date(
                year,
                month + 1,
                day
            );

        createCalendarDay(
            date,
            true
        );

    }

}


// =====================================
// CALENDAR DAY
// =====================================

function createCalendarDay(
    date,
    otherMonth
) {

    const day =
        document.createElement("div");


    day.className =
        "calendar-day";


    day.textContent =
        date.getDate();


    if (otherMonth) {

        day.classList.add(
            "other-month"
        );

    }


    // =================================
    // TODAY
    // =================================

    if (
        dateKey(date) ===
        dateKey(new Date())
    ) {

        day.classList.add(
            "today"
        );

    }


    // =================================
    // SELECTED
    // =================================

    if (
        dateKey(date) ===
        dateKey(selectedDate)
    ) {

        day.classList.add(
            "selected"
        );

    }


    // =================================
    // TASK INDICATOR
    // =================================

    const key =
        dateKey(date);


    if (
        tasks[key] &&
        tasks[key].length > 0
    ) {

        day.classList.add(
            "has-task"
        );

    }


    // =================================
    // CLICK
    // =================================

    day.addEventListener(
        "click",
        () => {

            selectedDate =
                new Date(date);

            renderCalendar();

            renderTasks();

        }
    );


    // =================================
    // DESKTOP DRAGOVER
    // =================================

    day.addEventListener(
        "dragover",
        event => {

            event.preventDefault();

            day.classList.add(
                "drop-target"
            );

        }
    );


    day.addEventListener(
        "dragleave",
        () => {

            day.classList.remove(
                "drop-target"
            );

        }
    );


    // =================================
    // DESKTOP DROP
    // =================================

    day.addEventListener(
        "drop",
        event => {

            event.preventDefault();

            day.classList.remove(
                "drop-target"
            );


            if (
                !draggedTask
            ) {
                return;
            }


            moveTaskToDate(
                draggedTask.date,
                draggedTask.index,
                dateKey(date)
            );


            draggedTask =
                null;

        }
    );


    calendar.appendChild(day);

}


// =====================================
// TASKS
// =====================================

function renderTasks() {

    const key =
        dateKey(selectedDate);


    selectedDateElement.textContent =
        formatDate(selectedDate);


    taskList.innerHTML = "";


    const dayTasks =
        tasks[key] || [];


    taskCount.textContent =
        dayTasks.length;


    // =================================
    // EMPTY
    // =================================

    if (
        dayTasks.length === 0
    ) {

        taskList.innerHTML = `

            <div class="empty">

                <div class="empty-icon">
                    📝
                </div>

                <p>
                    No tasks for this day
                </p>

            </div>

        `;

        return;

    }


    // =================================
    // CREATE TASKS
    // =================================

    dayTasks.forEach(
        (task, index) => {

            createTaskElement(
                task,
                index,
                key
            );

        }
    );

}


// =====================================
// CREATE TASK ELEMENT
// =====================================

function createTaskElement(
    task,
    index,
    date
) {

    const item =
        document.createElement("div");


    item.className =
        "task-item";


    item.draggable = true;


    item.dataset.index =
        index;


    item.dataset.date =
        date;


    if (
        task.completed
    ) {

        item.classList.add(
            "completed"
        );

    }


    item.innerHTML = `

        <div class="drag-handle">
            ⋮⋮
        </div>

        <button
            class="check-button"
            type="button"
        ></button>

        <div class="task-text">
            ${escapeHTML(task.text)}
        </div>

        <button
            class="delete-button"
            type="button"
        >
            ×
        </button>

    `;


    // =================================
    // COMPLETE
    // =================================

    item.querySelector(
        ".check-button"
    ).addEventListener(
        "click",
        event => {

            event.stopPropagation();


            task.completed =
                !task.completed;


            saveTasks();

            renderTasks();

            renderCalendar();

        }
    );


    // =================================
    // DELETE
    // =================================

    item.querySelector(
        ".delete-button"
    ).addEventListener(
        "click",
        event => {

            event.stopPropagation();


            tasks[date].splice(
                index,
                1
            );


            if (
                tasks[date].length === 0
            ) {

                delete tasks[date];

            }


            saveTasks();

            renderTasks();

            renderCalendar();

        }
    );


    // =================================
    // DESKTOP DRAG START
    // =================================

    item.addEventListener(
        "dragstart",
        event => {

            draggedTask = {

                date: date,

                index: index

            };


            item.classList.add(
                "dragging"
            );


            event.dataTransfer.effectAllowed =
                "move";


            event.dataTransfer.setData(
                "text/plain",
                `${date}|${index}`
            );

        }
    );


    // =================================
    // DESKTOP DRAG END
    // =================================

    item.addEventListener(
        "dragend",
        () => {

            item.classList.remove(
                "dragging"
            );


            document
                .querySelectorAll(
                    ".drag-over"
                )
                .forEach(
                    element => {

                        element.classList.remove(
                            "drag-over"
                        );

                    }
                );

        }
    );


    // =================================
    // DESKTOP REORDER
    // =================================

    item.addEventListener(
        "dragover",
        event => {

            event.preventDefault();

            item.classList.add(
                "drag-over"
            );

        }
    );


    item.addEventListener(
        "dragleave",
        () => {

            item.classList.remove(
                "drag-over"
            );

        }
    );


    item.addEventListener(
        "drop",
        event => {

            event.preventDefault();

            item.classList.remove(
                "drag-over"
            );


            if (
                !draggedTask
            ) {
                return;
            }


            reorderTask(
                draggedTask.date,
                draggedTask.index,
                date,
                index
            );


            draggedTask =
                null;

        }
    );


    // =================================
    // TOUCH DRAG
    // =================================

    addTouchDragging(
        item,
        date,
        index
    );


    taskList.appendChild(item);

}


// =====================================
// TOUCH DRAGGING
// =====================================

function addTouchDragging(
    element,
    date,
    index
) {

    let startX = 0;

    let startY = 0;

    let isDragging = false;

    let clone = null;


    element.addEventListener(
        "pointerdown",
        event => {

            if (
                event.target.closest(
                    "button"
                )
            ) {

                return;

            }


            startX =
                event.clientX;

            startY =
                event.clientY;


            isDragging = false;


            element.setPointerCapture(
                event.pointerId
            );

        }
    );


    element.addEventListener(
        "pointermove",
        event => {

            const distance =
                Math.sqrt(
                    Math.pow(
                        event.clientX - startX,
                        2
                    ) +
                    Math.pow(
                        event.clientY - startY,
                        2
                    )
                );


            if (
                distance < 10
            ) {

                return;

            }


            if (
                !isDragging
            ) {

                isDragging = true;


                draggedTask = {

                    date: date,

                    index: index

                };


                element.classList.add(
                    "dragging"
                );


                clone =
                    element.cloneNode(true);


                clone.style.position =
                    "fixed";

                clone.style.zIndex =
                    "9999";

                clone.style.width =
                    element.offsetWidth + "px";

                clone.style.pointerEvents =
                    "none";

                clone.style.opacity =
                    ".85";


                document.body.appendChild(
                    clone
                );

            }


            if (clone) {

                clone.style.left =
                    (
                        event.clientX -
                        element.offsetWidth / 2
                    ) + "px";


                clone.style.top =
                    (
                        event.clientY -
                        30
                    ) + "px";

            }


            // Find calendar date

            const target =
                document.elementFromPoint(
                    event.clientX,
                    event.clientY
                );


            document
                .querySelectorAll(
                    ".drop-target"
                )
                .forEach(
                    el => {

                        el.classList.remove(
                            "drop-target"
                        );

                    }
                );


            const calendarDay =
                target?.closest(
                    ".calendar-day"
                );


            if (
                calendarDay
            ) {

                calendarDay.classList.add(
                    "drop-target"
                );

            }

        }
    );


    element.addEventListener(
        "pointerup",
        event => {

            if (
                !isDragging
            ) {

                return;

            }


            isDragging = false;


            if (clone) {

                clone.remove();

                clone = null;

            }


            element.classList.remove(
                "dragging"
            );


            const target =
                document.elementFromPoint(
                    event.clientX,
                    event.clientY
                );


            // =================================
            // DROP ON CALENDAR
            // =================================

            const calendarDay =
                target?.closest(
                    ".calendar-day"
                );


            if (
                calendarDay
            ) {

                const allDays =
                    Array.from(
                        document.querySelectorAll(
                            ".calendar-day"
                        )
                    );


                const dayIndex =
                    allDays.indexOf(
                        calendarDay
                    );


                if (
                    dayIndex >= 0
                ) {

                    const year =
                        currentDate.getFullYear();

                    const month =
                        currentDate.getMonth();


                    const firstDay =
                        new Date(
                            year,
                            month,
                            1
                        ).getDay();


                    let newDate;


                    if (
                        dayIndex < firstDay
                    ) {

                        const previousDay =
                            dayIndex -
                            firstDay + 1;


                        newDate =
                            new Date(
                                year,
                                month - 1,
                                previousDay
                            );

                    } else {

                        const dayNumber =
                            dayIndex -
                            firstDay + 1;


                        const daysInMonth =
                            new Date(
                                year,
                                month + 1,
                                0
                            ).getDate();


                        if (
                            dayNumber >
                            daysInMonth
                        ) {

                            newDate =
                                new Date(
                                    year,
                                    month + 1,
                                    dayNumber -
                                    daysInMonth
                                );

                        } else {

                            newDate =
                                new Date(
                                    year,
                                    month,
                                    dayNumber
                                );

                        }

                    }


                    moveTaskToDate(
                        date,
                        index,
                        dateKey(newDate)
                    );

                }

            }


            document
                .querySelectorAll(
                    ".drop-target"
                )
                .forEach(
                    el => {

                        el.classList.remove(
                            "drop-target"
                        );

                    }
                );


            draggedTask =
                null;

        }
    );

}


// =====================================
// MOVE TASK TO ANOTHER DATE
// =====================================

function moveTaskToDate(
    oldDate,
    oldIndex,
    newDate
) {

    if (
        !tasks[oldDate] ||
        !tasks[oldDate][oldIndex]
    ) {

        return;

    }


    const task =
        tasks[oldDate].splice(
            oldIndex,
            1
        )[0];


    if (
        !tasks[newDate]
    ) {

        tasks[newDate] = [];

    }


    tasks[newDate].push(
        task
    );


    if (
        tasks[oldDate].length === 0
    ) {

        delete tasks[oldDate];

    }


    selectedDate =
        createDateFromKey(
            newDate
        );


    currentDate =
        new Date(
            selectedDate
        );


    saveTasks();

    renderCalendar();

    renderTasks();

}


// =====================================
// REORDER TASKS
// =====================================

function reorderTask(
    oldDate,
    oldIndex,
    newDate,
    newIndex
) {

    if (
        !tasks[oldDate]
    ) {

        return;

    }


    const task =
        tasks[oldDate].splice(
            oldIndex,
            1
        )[0];


    if (
        oldDate === newDate &&
        oldIndex < newIndex
    ) {

        newIndex--;

    }


    if (
        !tasks[newDate]
    ) {

        tasks[newDate] = [];

    }


    tasks[newDate].splice(
        newIndex,
        0,
        task
    );


    if (
        tasks[oldDate].length === 0
    ) {

        delete tasks[oldDate];

    }


    saveTasks();

    renderTasks();

    renderCalendar();

}


// =====================================
// CREATE DATE FROM KEY
// =====================================

function createDateFromKey(
    key
) {

    const parts =
        key.split("-");


    return new Date(
        Number(parts[0]),
        Number(parts[1]) - 1,
        Number(parts[2])
    );

}


// =====================================
// ESCAPE HTML
// =====================================

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text;


    return div.innerHTML;

}


// =====================================
// ADD TASK
// =====================================

function addTask() {

    const text =
        taskInput.value.trim();


    if (!text) {

        taskInput.focus();

        return;

    }


    const key =
        dateKey(selectedDate);


    if (
        !tasks[key]
    ) {

        tasks[key] = [];

    }


    tasks[key].push({

        id:
            Date.now(),

        text:
            text,

        completed:
            false

    });


    taskInput.value = "";


    saveTasks();

    renderTasks();

    renderCalendar();


    taskInput.focus();

}


// =====================================
// ENTER KEY
// =====================================

taskInput.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter"
        ) {

            addTask();

        }

    }
);


// =====================================
// ADD BUTTON
// =====================================

addTaskButton.addEventListener(
    "click",
    addTask
);


// =====================================
// PREVIOUS MONTH
// =====================================

previousMonth.addEventListener(
    "click",
    () => {

        currentDate.setMonth(
            currentDate.getMonth() - 1
        );


        renderCalendar();

    }
);


// =====================================
// NEXT MONTH
// =====================================

nextMonth.addEventListener(
    "click",
    () => {

        currentDate.setMonth(
            currentDate.getMonth() + 1
        );


        renderCalendar();

    }
);


// =====================================
// TODAY
// =====================================

todayButton.addEventListener(
    "click",
    () => {

        const today =
            new Date();


        selectedDate =
            new Date(today);


        currentDate =
            new Date(today);


        renderCalendar();

        renderTasks();

    }
);


// =====================================
// CALENDAR BUTTON
// =====================================

calendarButton.addEventListener(
    "click",
    () => {

        document
            .querySelector(
                ".calendar-card"
            )
            .scrollIntoView({
                behavior: "smooth"
            });

    }
);


// =====================================
// TASK BUTTON
// =====================================

focusButton.addEventListener(
    "click",
    () => {

        document
            .querySelector(
                ".tasks-area"
            )
            .scrollIntoView({
                behavior: "smooth"
            });

    }
);


// =====================================
// START
// =====================================

renderCalendar();

renderTasks();