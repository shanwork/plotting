(function() {
    var NasdaqController = function ($scope, $interval, $localStorage, NasdaqService) {
        $scope.stockList = [];
        $scope.stockList = NasdaqService.getStockList();
    //    alert($scope.stockList.length);
        $scope.googlePrice = 1010.25;
        $scope.count = 0;
        $scope.delta = 0;
        var stop;

        $scope.readStock = function () {
            if (angular.isDefined(stop))
                return;
           // NasdaqService.getStockList();
        
            stop = $interval(
            function () {
                $scope.stockList = $localStorage.stockList;
                //var delta = 0;
                //if ($scope.count % 3 == 0)
                //    delta = 12.25;
                //else if ($scope.count % 4 == 0)
                //    delta = -30.25;
                //else if ($scope.count % 5 == 0)
                //     delta = 22.25;
                //else if ($scope.count % 6 == 0)
                //    delta -= -2.25;
                //for (i = 0 ; i < $scope.stockList.length; i++)
                //{
                //    $scope.stockList[i].stockDelta = delta;
                //    if (i == 0 || i % 2 == 0)
                //        $scope.stockList[i].stockDelta *= 1.5;
                //    else if (i%5==0)
                //        $scope.stockList[i].stockDelta *= -3.5;
                //    $scope.stockList[i].stockPrice += $scope.stockList[i].stockDelta;
                //  //  $scope.stockList[i].stockDelta  = delta;

                //}
                //$scope.googlePrice += delta;
                //$scope.delta = delta;
                //$scope.count++;
            },
            500);
        };
        $scope.stopRead = function () {
            if (angular.isDefined(stop)) {
                $interval.cancel(stop);
                stop = undefined;
            }
        }
        $scope.addStock = function()
        {
            var newStock =
                {
                    companyName: $scope.newCompany,
                    stockSymbol: $scope.newSymbol,
                    stockPrice: parseFloat($scope.newPrice),
                    stockDelta: 0.00
                };
            $scope.stockList.push(newStock);
        }
    }
    NasdaqController.$inject = ['$scope', '$interval', '$localStorage', 'NasdaqService'];

    angular.module('readings_app')
  .controller('NasdaqController', NasdaqController);
    
}());
