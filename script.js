let notes = [];
let noteEditing = null;

function openNoteDialog(noteID = null) {
    const dialog = document.getElementById('note-dialog');
    const titleInput = document.getElementById('note-title');
    const contentInput = document.getElementById('note-content');

    if (noteID) {
        const noteToEdit = notes.find(note => note.id === noteID);
        noteEditing = noteToEdit;
        document.getElementById('dialog-title').textContent = 'Edit Note'
        titleInput.value = noteToEdit.title;
        contentInput.value = noteToEdit.content;
        } 
    else {
        noteEditing = null;
        document.getElementById('dialog-title').textContent = 'Add New Note'
    }
    dialog.showModal();
    titleInput.focus();
    addEventListener('keydown',(event)=>{
        if(event.key === 'Enter'){
            contentInput.focus();
        }
    })
}

function closeNoteDialog(clear){
    document.getElementById('note-dialog').close();
    clear?clearNoteAdd():null;
}
function clearNoteAdd(){
        document.getElementById('note-title').value = '';
        document.getElementById('note-content').value = '';
}

function saveNote(event){
    event.preventDefault();

    const title = document.getElementById('note-title').value.trim();
    const contentInput = document.getElementById('note-content').value.trim();
    
    if(noteEditing){
        const indexNote = notes.findIndex(note => note.id === noteEditing.id);
        notes[indexNote] = {
            ...notes[indexNote],
            title:title,
            content:contentInput
        }

    }
    else{ 
        notes.unshift({
        id:Date.now().toString(),
        title:title,
        content:contentInput
    })}
    
    localStorage.setItem('quickNotes',JSON.stringify(notes));
    closeNoteDialog(true);
    renderNote();
}

function deleteNote(n){
    notes = notes.filter(i=>i.id!==n);
    localStorage.setItem('quickNotes',JSON.stringify(notes));
    renderNote();
}

function renderNote(){
    const main = document.getElementById('notes-container');
    if(notes.length === 0){ 
        main.innerHTML=`<div class="empty-state">
                            <h2>no notes yet</h2>
                            <p>creat your first note</p>
                            <button class="add-note-btn" onclick="openNoteDialog()">+ Add Note</button>
                        </div>` ;
        return
    }
    main.innerHTML = notes.map(note =>` <div class="note-card">
                                            <h3 class="note-title">${note.title}</h3>
                                            <p class="note-content">${note.content}</p>
                                            <div class="note-actions">
                                                <button class="edit-btn" onclick="openNoteDialog('${note.id}')" title="Edit Note">
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                                                    </svg>
                                                </button>
                                                <button class="delete-btn" onclick="deleteNote('${note.id}')" title="Delete Note">
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.88c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z"/>
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>`).join('');

}

function themToggle(){
    const isDark = document.body.classList.toggle('dark-theme')
    document.getElementById('dark-mode').textContent = isDark? '☀️':'🌙';
    localStorage.setItem('them',isDark?'dark':'light')
}

function applythem(){
    if(localStorage.getItem('them') === 'dark'){
        document.body.classList.toggle('dark-theme')
        document.getElementById('dark-mode').textContent = '☀️';
    }
}

document.addEventListener("DOMContentLoaded",function(){
    applythem();
    notes =  localStorage.getItem('quickNotes') ? JSON.parse(localStorage.getItem('quickNotes')):[];                                             
    renderNote();
    document.getElementById('note-form').addEventListener('submit',saveNote);
    document.getElementById('note-dialog').addEventListener('click',function(event){
        event.target === this?closeNoteDialog(false):null;})
});