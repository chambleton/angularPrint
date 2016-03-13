'use strict';
(function(){
    var lowercase = function(string){return (typeof string === 'string') ? string.toLowerCase() : string;};
    function toBoolean(value) {
      if (typeof value === 'function') {
        value = true;
      } else if (value && value.length !== 0) {
        var v = lowercase('' + value);
        value = !(v == 'f' || v == '0' || v == 'false' || v == 'no' || v == 'n' || v == '[]');
      } else {
        value = false;
      }
      return value;
    }
    var AngularPrint = angular.module('AngularPrint',[]);
    AngularPrint.directive('printSection', function(){
            return {
                restrict: 'A',
                link: function(scope, element){
                        element[0].classList.add('printSection');
                    }
            };
        });
    AngularPrint.directive('printHide', function(){
            return {
                restrict: 'A',
                link: function(scope, element){
                        element[0].classList.add('printHide');
                    }
            };
        });
    AngularPrint.directive('printRemove', function(){
            return {
                restrict: 'A',
                link: function(scope, element){
                        element[0].classList.add('printRemove');
                    }
            };
        });
    AngularPrint.directive('printOnly', function(){
            return {
                restrict: 'A',
                link: {
                    post: function(scope, element){
                        element[0].classList.add('printOnly');
                    }
                }
            };
        });
    AngularPrint.directive('printAvoidBreak', function(){
            return {
                restrict: 'A',
                link: function(scope, element){
                        element[0].classList.add('avoidPageBreak');
                    }
            };
        });
    AngularPrint.directive('printBtn',['$window', function($window){
        return {
            restrict: 'A',
            link: function(scope, element){
                element.on('click', function(){
                    $window.print();
                });
            }
        };
    }]);
    AngularPrint.directive('printIf', ['$animate', function($animate) {
        return function(scope, element, attr) {
          scope.$watch(attr.printIf, function applyPrint(value){
            if('printOnly' in attr){
                $animate[toBoolean(value) ? 'removeClass' : 'addClass'](element, 'printRemove');
            }
            else{
                $animate[toBoolean(value) ? 'addClass' : 'removeClass'](element, 'printSection');
            }
          });
        };
    }]);
    AngularPrint.directive('printAdfWidget',['$window', function($window){
        return {
            restrict: 'A',
            link: function(scope, element){
                element.on('click', function(){
                    // get all the adf widget root elements                    
                    var matches = document.querySelectorAll('[adf-widget-type]');
                    
                    // only print the selected widget
                    for (var i=0; i<matches.length; i++) {                        
                        if(matches[i].contains(element[0])) {
                            matches[i].classList.add('printSection');
                        }
                        else {
                            matches[i].classList.add('printRemove');    
                        }                        
                    }
                                        
                    $window.print();
                    
                    // cleanup - remove all the classes we added
                    for (var i=0; i<matches.length; i++) {
                        if(matches[i].contains(element[0])) {
                            matches[i].classList.remove('printSection');
                        }
                        else {
                            matches[i].classList.remove('printRemove');    
                        }
                    }                    
                });
            }
        };
    }]);
    AngularPrint.directive('printAdfAllWidgets',['$window', function($window){
        return {
            restrict: 'A',
            link: function(scope, element){
                element.on('click', function(){
                    // get all the adf widget root elements and add print class           
                    var matches = document.querySelectorAll('[adf-widget-type]');
                    
                    for (var i=0; i<matches.length; i++) {
                        matches[i].classList.add('printSection');
                    }
                                        
                    $window.print();
                    
                    // cleanup - remove all the classes we added
                    for (var i=0; i<matches.length; i++) {
                        matches[i].classList.remove('printSection');
                    }
                });
            }
        };
    }]);
    AngularPrint.directive('printLandscape',function(){
        return {
            restrict: 'A',
            link: function(){
                var sheet = (function() {
                    var style = document.createElement('style');
                    style.appendChild(document.createTextNode(''));
                    document.head.appendChild(style);
                    return style.sheet;
                })();
                sheet.insertRule('@page{size:landscape;}', 0);
            }
        };
    });
    AngularPrint.directive('printTable', function(){
        return function(scope, element, attr) {
            scope.$watch(attr.printTable, function makeTable(value){
                setTimeout(function(){
                    if(value == null) return;
                    var elem = element[0];
                    elem.classList.add('printSection');
                    elem.id = 'print-table';
                    var tds = elem.getElementsByTagName('td');
                    for(var i = 0, content, div; i < tds.length; i++){
                        content = tds[i].innerHTML;
                        tds[i].innerHTML = '';
                        div = document.createElement('div');
                        div.className = 'avoidPageBreak';
                        div.innerHTML = content;
                        tds[i].appendChild(div);
                    }
                    element[0] = elem;
                },1000);
            });
        };
    });
})();
