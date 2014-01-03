var Sara = require('sara')

// Load angular
Sara.Controller = require('sara-angular')

var TodoController = module.exports = new Sara.Controller('Todo', function TodoController($scope) {
  var app = require('../app')
    , Todo = require('../models/todo')

  $scope.Todo = Todo
 
  $scope.addTodo = function () {
    new Todo({ title: $scope.title, completed: false }).save()
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
    for (var content = prerendered.length; content--;) {
      prerendered[content].parentNode.removeChild(prerendered[content])
    }
  })
})