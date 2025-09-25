const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const list = document.getElementById('task-list');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');

let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');

function saveTasks(){ localStorage.setItem('tasks', JSON.stringify(tasks)); }

function renderTasks(){
  list.innerHTML = '';
  if(tasks.length === 0){
    const li = document.createElement('li');
    li.className = 'empty';
    li.textContent = 'No tasks yet — add one!';
    list.appendChild(li);
    updateProgress();
    return;
  }

  tasks.forEach(task => {
    const li = document.createElement('li');
    li.className = 'task-item';

    const text = document.createElement('span');
    text.textContent = task.text;
    if(task.done) text.classList.add('done');
    li.appendChild(text);

    const controls = document.createElement('div');
    controls.className = 'controls';

    const doneBtn = document.createElement('button');
    doneBtn.textContent = task.done ? 'Undo' : 'Done';
    doneBtn.addEventListener('click', () => toggleDone(task.id));
    controls.appendChild(doneBtn);

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', () => editTask(task.id));
    controls.appendChild(editBtn);

    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.addEventListener('click', () => deleteTask(task.id));
    controls.appendChild(delBtn);

    li.appendChild(controls);
    list.appendChild(li);
  });

  updateProgress();
}

function addTask(text){
  tasks.unshift({ id: Date.now(), text: text.trim(), done: false });
  saveTasks(); renderTasks();
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const val = input.value;
  if(!val.trim()) return;
  addTask(val);
  input.value = '';
  input.focus();
});

function toggleDone(id){
  tasks = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
  saveTasks(); renderTasks();
}

function editTask(id){
  const t = tasks.find(x => x.id === id);
  const newText = prompt('Edit task', t.text);
  if(newText === null) return;
  if(newText.trim() === '') { alert("Task can't be empty"); return; }
  t.text = newText.trim();
  saveTasks(); renderTasks();
}

function deleteTask(id){
  if(!confirm('Delete this task?')) return;
  tasks = tasks.filter(t => t.id !== id);
  saveTasks(); renderTasks();
}

function updateProgress(){
  const total = tasks.length;
  const done = tasks.filter(t => t.done).length;
  const pct = total === 0 ? 0 : Math.round((done/total) * 100);
  progressBar.style.width = pct + '%';
  progressText.textContent = pct + '%';
}

renderTasks();
