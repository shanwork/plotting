(function() {
    var NasdaqController = function ($scope, $interval, $localStorage, NasdaqService) {
        $scope.stockList = [];
        $scope.stockList = NasdaqService.getStockList();
        //    alert($scope.stockList.length);
        $scope.googlePrice = 1010.25;
        $scope.count = 0;
        $scope.delta = 0;
        $scope.selectedOption = {
            Name: 'USD',
            value: 1

        };
        $scope.currencyList =
            [
                {
                    Name: 'USD',
                    value: 1

                },
                {
                    Name: 'INR',
                    value: 62.65

                }
            ];
        var stop;

        $scope.readStock = function () {
            if ($scope.interval == null || isNaN($scope.interval))
                $scope.interval = 10;
            if (angular.isDefined(stop))
                return;
            // NasdaqService.getStockList();
            
            stop = $interval(
            function () {
                var conversion = 1.00
                if ($scope.selectedOption != undefined)
                    conversion = $scope.selectedOption.value;
                //       $scope.stockList = $localStorage.stockList;
                for (i = 0 ; i < $scope.stockList.length; i++) {
                    $scope.stockList[i].stockDelta = $localStorage.stockList[i].stockDelta * conversion;
                    $scope.stockList[i].stockPrice = $localStorage.stockList[i].stockPrice * conversion;
                    $scope.stockList[i].changeSinceBuy = $localStorage.stockList[i].changeSinceBuy * conversion;
                    console.log($scope.stockList[i].stockPrice);
                    console.log($localStorage.stockList[i].stockPrice);
                    //  $scope.stockList[i].stockDelta  = delta;

                }
                $scope.showGraph();
            },
            $scope.interval);
        };
        $scope.stopRead = function () {
            if (angular.isDefined(stop)) {
                $interval.cancel(stop);
                stop = undefined;
                $localStorage.graphList = [];
                alert($localStorage.graphList.length);
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
            $localStorage.stockList.push(newStock);
            $scope.stockList = $localStorage.stockList;//NasdaqService.getStockList();
        }
        $scope.showGraph = function () {
            if ($scope.maxValues == null || isNaN($scope.maxValues))
                $scope.maxValues = 10;
            var config = {};
            config.bindto = '#chart';
            config.data = {};
            config.data.columns = [];
            
            if ($localStorage.graphList == undefined || $localStorage.graphList.length==0)
            {
                $localStorage.graphList = [];
                for (k = 0 ; k < $localStorage.stockList.length; k++)
                {
                    var stockElement = [];
                    stockElement.push($localStorage.stockList[k].stockSymbol);
                    $localStorage.graphList.push(stockElement);
                }
            }
            for (stIndex = 0 ; stIndex < $localStorage.graphList.length; stIndex++) {
                
                if ($localStorage.graphList[stIndex].length < $scope.maxValues )
                {
                    $localStorage.graphList[stIndex].push($localStorage.stockList[stIndex].stockPrice);
                }
                else
                    {
                    for (subIndex = 1 ; subIndex < $scope.maxValues-1 ; subIndex++)
                    {
                        $localStorage.graphList[stIndex][subIndex] = $localStorage.graphList[stIndex][subIndex + 1];
                    }
              //      $localStorage.graphList[stIndex][$scope.maxValues - 1] = $localStorage.stockList[stIndex].stockPrice
                }
                
                config.data.columns.push($localStorage.graphList[stIndex]);
            }
            //var data1 = ['data1', 30, 200, 100, 400, 150, 250];
            //config.data.columns.push(data1);
            //var data2 = ['data2', 1250, 20, 10, 40, 15, 25];
            //config.data.columns.push(data2);
            var chart = c3.generate(config);
            //var chart = c3.generate({
            //    bindto: '#chart',
            //    data: {
            //        columns: [
            //          ['data1', 30, 200, 100, 400, 150, 250],
            //          ['data2', 50, 20, 10, 40, 15, 25]
            //        ]
            //    }
            //});
            //$scope.chart = c3.generate({
            //    bindto: '#chart',
            //    data: {
            //        columns: [
            //          ['data1', 30, 200, 100, 400, 150, 250],
            //          ['data2', 50, 20, 10, 40, 15, 25]
            //        ]
            //    }
            //});
        }
    }
    NasdaqController.$inject = ['$scope', '$interval', '$localStorage', 'NasdaqService'];

    angular.module('readings_app')
  .controller('NasdaqController', NasdaqController);
    
}());
