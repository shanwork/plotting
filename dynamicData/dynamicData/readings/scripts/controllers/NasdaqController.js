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
                $scope.interval = 500;
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
                   // console.log($scope.stockList[i].stockPrice);
                   // console.log($localStorage.stockList[i].stockPrice);
                    //  $scope.stockList[i].stockDelta  = delta;

                }

                $scope.showGraph();
            },
            $scope.interval);
            $scope.graphable = 1;
        };
        $scope.stopRead = function () {
            if (angular.isDefined(stop)) {
                $interval.cancel(stop);
                stop = undefined;
                $localStorage.graphList = [];
         //       alert($localStorage.graphList.length);
            }
        }
        $scope.stopServer = function () {
            NasdaqService.stopRead();
            $scope.stopRead();
        }
        $scope.startServer = function () {
            NasdaqService.startRead();
            $scope.readStock();
        }
        $scope.flush = function () {
            $localStorage.stockList=[];
            $scope.getStockList();
        }
        $scope.addStock = function()
        {
            var restart = false ;
            if (angular.isDefined(stop)) {
                restart = true;
                $scope.stopRead();
            }
            var newStock =
                {
                    companyName: $scope.newCompany,
                    stockSymbol: $scope.newSymbol,
                    originalStockPrice: parseFloat($scope.newPrice),
                    stockPrice: parseFloat($scope.newPrice),
                    stockPriceConverted: parseFloat($scope.newPrice),
                    sharesBought: parseFloat($scope.newUnits),
                    stockDelta: 0.00,
                    changeSinceBuy: 0.00
                };
            $localStorage.stockList.push(newStock);
      //      $scope.stockList.push(newStock);// = $localStorage.stockList;//NasdaqService.getStockList();
            if (restart == true)
                $scope.readStock();
        }

        $scope.showGraph = function () {
            if ($scope.maxValues == null || isNaN($scope.maxValues))
                $scope.maxValues = 10;
            var config = {};
            config.bindto = '#chart';
            config.data = {};
            config.data.columns = [];

            if ($scope.graphList == undefined || $scope.graphList.length == 0 ) {
                $scope.graphList = [];
                for (k = 0 ; k < $scope.stockList.length; k++) {
                    var stockElement = [];
                    stockElement.push($scope.stockList[k].stockSymbol);
                    $scope.graphList.push(stockElement);
                }
            }
            if ($scope.graphList.length < $scope.stockList.length)
            {
                for (remGraph = $scope.graphList.length; remGraph < $scope.stockList.length; remGraph++)
                {
                    var newStockElement = [];
                    newStockElement.push($scope.stockList[remGraph].stockSymbol);
                    $scope.graphList.push(newStockElement);
                }
            }
            for (stIndex = 0 ; stIndex < $scope.graphList.length; stIndex++) {

                if (stIndex >  ($scope.stockList.length-1))
                {
                    var newStockElement = [];
                    newStockElement.push($scope.stockList[stIndex].stockSymbol);
                    $scope.graphList.push(newStockElement);
                    console.log('added' + $scope.stockList[stIndex].stockSymbol);
                 }
                if ($scope.graphList[stIndex].length < $scope.maxValues) {
                    $scope.graphList[stIndex].push($scope.stockList[stIndex].stockPrice);
                }
                else {
                    for (subIndex = 1 ; subIndex < $scope.maxValues - 1 ; subIndex++) {
                        $scope.graphList[stIndex][subIndex] = $scope.graphList[stIndex][subIndex + 1];
                   //     console.log($scope.graphList[stIndex][subIndex + 1]);
                    }
                         $scope.graphList[stIndex][$scope.maxValues - 1] = $scope.stockList[stIndex].stockPrice
                }
                if ($scope.stockList[stIndex].graphIt == true)
                    config.data.columns.push($scope.graphList[stIndex]);
            }
           
            var chart = c3.generate(config);
            var configSummary = {};
            configSummary.bindto = '#chart2';
            configSummary.data = {};
            configSummary.data.columns = [];
            if ($scope.summaryGraphList == undefined || $scope.summaryGraphList.length == 0) {
                $scope.summaryGraphList = [];
                
                    var totalWealth = ['Wealth (in 1000s)'];
                    $scope.summaryGraphList.push(totalWealth);
                    var totalChange = ['Change (in 100s)'];
                    $scope.summaryGraphList.push(totalChange);
          
            }
            var totalWealth = 0.0, totalDelta = 0.0;

            //            stockPriceConverted: 33.99,
            //            sharesBought: 890,
            //            stockDelta: 0.00,
            for (totalStocks = 0 ; totalStocks < $scope.stockList.length; totalStocks++)
            {
                totalWealth += ($scope.stockList[totalStocks].stockPriceConverted * $scope.stockList[totalStocks].sharesBought);
                totalDelta += ($scope.stockList[totalStocks].stockDelta * $scope.stockList[totalStocks].sharesBought);
            }
            if ($scope.summaryGraphList[0].length < $scope.maxValues) {
                $scope.summaryGraphList[0].push(totalWealth);
                $scope.summaryGraphList[1].push(totalDelta);
            }
            else {
                for (subIndex = 1 ; subIndex < $scope.maxValues - 1 ; subIndex++) {
                    $scope.summaryGraphList[0][subIndex] = $scope.graphList[0][subIndex + 1];
                    $scope.summaryGraphList[1][subIndex] = $scope.graphList[1][subIndex + 1];
                    //     console.log($scope.graphList[stIndex][subIndex + 1]);
                }
                $scope.summaryGraphList[0][$scope.maxValues - 1] = totalWealth / 1000.00;
                $scope.summaryGraphList[1][$scope.maxValues - 1] = totalDelta / 100.00;
            }
            configSummary.data.columns.push($scope.summaryGraphList[0]);
            configSummary.data.columns.push($scope.summaryGraphList[1]);
         

            var chart2 = c3.generate(configSummary);
            
            //$scope.chart2 = c3.generate({
            //    bindto: '#chart2',
            //    data: {
            //        columns: [
            //          ['data1', 30, 200, 100, 400, 150, 250],
            //          ['data2', 50, 20, 10, 40, 15, 25]
            //        ]
            //    }
            //});
        }
        $scope.showGraphLocalStorage = function () {
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
