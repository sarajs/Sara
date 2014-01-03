var Sara = require('sara')

// Load angular
Sara.Controller = require('sara-angular')

module.exports = new Sara.Controller('Todo', function TodoController($scope) {
  var Todo = require('../models/todo')

  $scope.Todo = Todo
 
  $scope.addTodo = function () {
    var todo = new Todo({ title: $scope.title, completed: false })
    todo.save()
    $scope.title = ''
  }
   
  $scope.archive = function() {
    angular.forEach(Todo.completed(), function (todo) {
      todo.destroy()
    })
  }

  // Hide prerendered HTML
  $scope.$evalAsync(function () {
    var prerendered = document.querySelectorAll("[data-prerendered]")
    for (var i = prerendered.length; i--;) {
      prerendered[i].parentNode.removeChild(prerendered[i])
    }
  })
})