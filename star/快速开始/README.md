自定义服务

1.  3种创建自定义服务的方式。 
    Factory
    Service
    Provider
2.  大家应该知道，AngularJS是后台人员在工作之余发明的，他主要应用了后台早就存在的分层思想。所以我们得了解下分层的作用，如果你是前端人员不了解什么是分层，那么你最好问问你后台的小伙伴。 
    dao层：就是Model层，在后台时，这一层的作用，就要是写与数据库交互数据的一层，在angularJS里就主要是写ajax的。 
    service层：主查写逻辑代码的，但在angularJS里也可以持久化数据（充当数据容器），以供不同的controller高用。 
    controller层：即控制层，在angularJS里就是写控制器的。控制器里尽量不要写那些不必要的逻辑，尽量写在service层里。 
    所以，就有了创建自定义服务的三种方式。
    
    
一、factory

    factory方式创建的服务，作用就是返回一个有属性有方法的对象。相当于：var f = myFactory();

    <!DOCTYPE html>
    <html>
    <head>
    <meta charset="utf-8">
    <script src="http://apps.bdimg.com/libs/angular.js/1.4.6/angular.min.js"></script>
    </head>
    <body>
    <div ng-app="myApp" ng-controller="myCtrl">
        <p>{{r}}</p>
    </div>

    <script>
        //创建模型
        var app = angular.module('myApp', []);

        //通过工厂模式创建自定义服务
        app.factory('myFactory', function() {
            var service = {};//定义一个Object对象'
            service.name = "张三";
            var age;//定义一个私有化的变量
            //对私有属性写getter和setter方法
            service.setAge = function(newAge){
                age = newAge;
            }
            service.getAge = function(){
                return age; 
            }
            return service;//返回这个Object对象
        });
        //创建控制器
        app.controller('myCtrl', function($scope, myFactory) {
            myFactory.setAge(20);
            $scope.r =myFactory.getAge();
            alert(myFactory.name);
        });
    </script>
    </body>
    </html>

    在自定义服务里注入服务示例，但不能注入$scope作用域对象。

    <script>
        var app = angular.module('myApp', []);
        app.factory('myFactory', function($http,$q) {
            var service = {};
            service.name = "张三";
            //请求数据
            service.getData = function(){
                var d = $q.defer();
                $http.get("url")//读取数据的函数。
                .success(function(response) {
                    d.resolve(response);
                })
                .error(function(){
                    d.reject("error");
                });
                return d.promise;
            }       
            return service;
        });
        app.controller('myCtrl', function($scope, myFactory) {
            //alert(myFactory.name);
            myFactory.getData().then(function(data){
                console.log(data);//正确时走这儿
            },function(data){
                alert(data)//错误时走这儿
            });;
        });
    </script>

二、 service

    通过service方式创建自定义服务，相当于new的一个对象：var s = new myService();，只要把属性和方法添加到this上才可以在controller里调用。

    <div ng-app="myApp" ng-controller="myCtrl">
        <h1>{{r}}</h1>
    </div>
    <script>
        var app = angular.module('myApp', []);

        app.service('myService', function($http,$q) {
            this.name = "service";
            this.myFunc = function (x) {
                return x.toString(16);//转16进制
            }
            this.getData = function(){
                var d = $q.defer();
                $http.get("ursl")//读取数据的函数。
                    .success(function(response) {
                    d.resolve(response);
                })
                    .error(function(){
                    alert(0)
                    d.reject("error");
                });
                return d.promise;
            }
        });
        app.controller('myCtrl', function($scope, myService) {
            $scope.r = myService.myFunc(255);
            myService.getData().then(function(data){
                console.log(data);//正确时走这儿
            },function(data){
                alert(data)//错误时走这儿
            });
        });
    </script>

三、provder

    只有provder是能传 .config() 函数的 service。如果想在 service 对象启用之前，先进行模块范围的配置，那就应该选择 provider。需要注意的是：在config函数里注入provider时，名字应该是：providerName+Provider. 
    使用Provider的优点就是，你可以在Provider对象传递到应用程序的其他部分之前在app.config函数中对其进行修改。 
    当你使用Provider创建一个service时，唯一的可以在你的控制器中访问的属性和方法是通过$get()函数返回内容。

    <body>
    <div ng-app="myApp" ng-controller="myCtrl">
    </div>

    <script>
        var app = angular.module('myApp', []);

        //需要注意的是：在注入provider时，名字应该是：providerName+Provider   
        app.config(function(myProviderProvider){
            myProviderProvider.setName("大圣");       
        });
        app.provider('myProvider', function() {
            var name="";
            var test={"a":1,"b":2};
            //注意的是，setter方法必须是(set+变量首字母大写)格式
            this.setName = function(newName){
                name = newName  
            }

            this.$get =function($http,$q){
                return {
                    getData : function(){
                        var d = $q.defer();
                        $http.get("url")//读取数据的函数。
                            .success(function(response) {
                                d.resolve(response);
                            })
                            .error(function(){
                                d.reject("error");
                            });
                        return d.promise;
                    },
                    "lastName":name,
                    "test":test
                }   
            }

        });
        app.controller('myCtrl', function($scope,myProvider) {
            alert(myProvider.lastName);
            alert(myProvider.test.a)
            myProvider.getData().then(function(data){
                //alert(data)
            },function(data){
                //alert(data)
            });
        });
    </script>
    </body>

    4.在过滤器中注入自定义服务

    <body>
    <div ng-app="myApp">
        在过滤器中使用服务:
        <h1>{{255 | myFormat}}</h1>
    </div>

    <script>
        var app = angular.module('myApp', []);
        app.service('hexafy', function() {
            this.myFunc = function (x) {
                return x.toString(16);
            }
        });
        app.filter('myFormat',['hexafy', function(hexafy) {
            return function(x) {
                return hexafy.myFunc(x);
            };
        }]);
    </script>
    </body>
