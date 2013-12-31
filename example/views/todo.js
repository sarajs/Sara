var app = require('../app')
  , fs = require('fs')
  , SaraAngular = require('sara-angular')

exports.render = function () {
  return SaraAngular(fs.readFileSync(app.root + '/templates/index.html').toString(), function TodoView($scope) {
    $scope.todos = [
      { title:'learn angular', complete: true },
      { title:'build an angular app', complete: false }
    ];
   
    $scope.addTodo = function() {
      $scope.todos.push({ title: $scope.todo.title, complete: false });
      $scope.todo.title = '';
    };
    
    $scope.$evalAsync(function() {
      var prerendered = document.querySelectorAll("[data-prerendered]")
      for (var content = prerendered.length; content--;) {
        prerendered[content].parentNode.removeChild(prerendered[content])
      }
    })
   
    $scope.active = function() {
      var count = 0;
      angular.forEach($scope.todos, function(todo) {
        count += todo.complete ? 0 : 1;
      });
      return count;
    };
   
    $scope.archive = function() {
      var oldTodos = $scope.todos;
      $scope.todos = [];
      angular.forEach(oldTodos, function(todo) {
        if (!todo.complete) $scope.todos.push(todo);
      });
    };
  })
}