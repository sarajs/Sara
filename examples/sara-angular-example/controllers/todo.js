var Sara = require('sara')

module.exports = new Sara.Controller('Todo', function TodoController($scope) {
  var Todo = require('../models/todo')

  $scope.Todo = Todo
 
  $scope.new = function () {
    if ($scope.title) {
      new Todo({ title: $scope.title, completed: false }).save()
      $scope.title = ''
    }
  }
  
  $scope.archive = function() {
    Todo.completed().forEach(function (todo) {
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