﻿(function () {
    angular.module('readings_app').service('NasdaqService', function ($interval, $localStorage) {
        this.stop;
        $localStorage.count = 0.0;
        this.stockList =
            [
                {
                    graphIt: true,
                    companyName: 'Company1',
                    stockSymbol: 'COM1',
                    originalStockPrice: 23.33,
                    stockPrice: 23.33,
                    stockPriceConverted: 23.33,
                    sharesBought: 10000,
                    stockDelta: 0.00,
                    changeSinceBuy: 0.00
                },
                {
                    graphIt:true,
                    companyName: 'Company2',
                    stockSymbol: 'COM2',
                    originalStockPrice: 33.99,
                    stockPrice: 33.99,
                    stockPriceConverted: 33.99,
                    sharesBought: 890,
                    stockDelta: 0.00,
                    changeSinceBuy: 0.00
                },
                {
                    graphIt: true,
                    companyName: 'Company3',
                    stockSymbol: 'COM3',
                    originalStockPrice: 75.01,
                    stockPrice: 75.01,
                    stockPriceConverted: 75.01,
                    sharesBought: 200,
                    stockDelta: 0.00,
                    changeSinceBuy: 0.00
                },
                {
                    graphIt: true,
                    companyName: 'Company4',
                    stockSymbol: 'COM4',
                    originalStockPrice: 175.01,
                    stockPrice: 175.01,
                    stockPriceConverted: 175.01,
                    sharesBought: 250,
                    stockDelta: 0.00,
                    changeSinceBuy: 0.00
                }
            ];
        this.serverStopped ;

        this.getStockList = function () {
            if ($localStorage.stockList == null || $localStorage.stockList == undefined || $localStorage.stockList.length == 0)
            {
                $localStorage.stockList = this.stockList;
            }
            else
            {
                this.stockList = $localStorage.stockList
            }
            if (!angular.isDefined(this.stop))
            {
                this.readStock(this.count);
            }
            return $localStorage.stockList ;
        };
        this.stopRead = function () {
            if (angular.isDefined(this.stop)) {
                $interval.cancel(this.stop);
                console.log('stoped');
                this.stop = undefined;
                this.serverStopped = true;
                //$localStorage.graphList = [];
                //       alert($localStorage.graphList.length);
            }
        }
        this.startRead = function () {
            
                this.stop = undefined;
                this.serverStopped = false;
                this.readStock();
            
        }
        this.readStock = function (stockList, count) {
            if (angular.isDefined(this.stop))
                return;
            if (this.serverStopped == true) {
                console.log('serverStopped');
                return;
            }
            else
                this.serverStopped = false;
            this.stop = $interval(
            function (stockList ) {
                var delta = 0;
                count = $localStorage.count;
                
                if ( count % 3 == 0)
                    delta = 12.25;
                else if ( count % 4 == 0)
                    delta = -30.25;
                else if ( count % 5 == 0)
                    delta = 22.25;
                else if  (count % 6 == 0)
                    delta -= -2.25;
                else if (count % 9 == 0)
                    delta -= -102.25;
                for (i = 0 ; i <  $localStorage.stockList.length; i++)
                {
                    $localStorage.stockList[i].stockDelta = delta;
                    if (i == 0 || i % 2 == 0)
                        $localStorage.stockList[i].stockDelta *= 1.5;
                    else if (i%5==0)
                        $localStorage.stockList[i].stockDelta *= -3.5;
                    $localStorage.stockList[i].stockPrice += $localStorage.stockList[i].stockDelta;
                    $localStorage.stockList[i].changeSinceBuy += $localStorage.stockList[i].stockDelta;
               //     console.log($localStorage.stockList[0].stockPrice);

                    //  $scope.stockList[i].stockDelta  = delta;

                }
            //    $scope.googlePrice += delta;
               // $scope.delta = delta;
                $localStorage.count++;
            },
            500, 0, false, this.stockList, new Date().getMilliseconds() );
        //    console.log(this.stop);
        };
    });
}());