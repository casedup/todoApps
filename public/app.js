

$(document).ready(function(){
    $.getJSON("/api/todos")
    .then(addTodos)

    $('#todoInput').keypress(function(event) {
        if(event.which === 13) {
            createTodo()
        }
    });

    $('.list').on('click', 'li', function(){
        updateTodo($(this));
        // console.log();
    })
    $('.list').on('click', 'span', function(event) {
        event.stopPropagation();
        removeTodo($(this).parent());
    })
});



function addTodos(todos) {
    todos.forEach(todo => {
        addTodo(todo);
    });
};

function createTodo() {
    let usrInput = $('#todoInput').val(); 
    $.post('/api/todos', {name: usrInput})
    .then(function(newTodo) {
        addTodo(newTodo);
        $('#todoInput').val('');
    })
    .catch(function(err) {
        console.log(err);
    })
}

function addTodo(todo) {
    let newTodo = $('<li>' + todo.name + '<span>X<span></li>');
    newTodo.data('id', todo._id);
    newTodo.data('completed', todo.completed);
    newTodo.addClass('task');
    if(todo.completed) {
        newTodo.addClass('done');
    }
    $('.list').append(newTodo);
}

function removeTodo(todo) {
    let clickedID = todo.data('id');
    let deleteUrl = '/api/todos/'+clickedID;
    $.ajax({
        method: 'DELETE',
        url: deleteUrl
    })
    .then(function (msg) {
        todo.remove();
    })
    .catch(function (error) {
        console.log(error);
    })  
}

function updateTodo(todo) {
    // console.log(todo.data('completed'));
    let updateUrl = '/api/todos/'+todo.data('id');
    let isDone = !todo.data('completed');
    let updateData = {completed: isDone};

    $.ajax({
        method: 'PUT',
        url: updateUrl,
        data: updateData

    })
    .then(function(updatedTodo) {
        todo.toggleClass('done');
        todo.data('completed', isDone);
    })

}