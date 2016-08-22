/*global angular*/
'use strict';

/**
 * module contains the logic for generating tables.
 *
 * Dependencies: templates(third party), app.input, app.filters
 *
 * @module app.table
 * @main
 */
angular.module('app.table', ['app.input', 'app.filters', 'ui.select'])
/**
 * A controller that contains the main logic for the table directive.
 *
 * @class TableCtrl
 */
.controller('TableCtrl', [function() {
}])
/**
 * A directive that contains the main logic for creating tables.
 *
 * @class appTable
 * @param {Object} $timeout
 *  Angular wrapper around SetTimeout
 * @param {Object} filterFilter
 *  angular filter for filtering ng-repeat. Slow and we should remove ng-repeat
 */
.directive('appTable', ['$timeout', '_', function($timeout, _) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: './../../views/util/appTable.html',
        controller: 'TableCtrl',
        scope: {
            tableConfig: '=',
            selectablePageSize: '=?'
        },
        /**
         * Initializes the table, put logic here instead of in the controller
         *
         * @method link
         * @param {Object} $scope
         *  The isolate $scope of the directive
         * @param {Object} element
         *  The compiled element of the directive
         * @return none
         */
        link: function($scope, element) {
            var filterInputElem,
                elem = $(element),
                tbody,
                trows,
                tcols = {},
                rowHeight,
                visibleStartRowMargin = 0.85,
                visibleEndRowMargin = 0.3,
                currFilterCol,
                safeApply = function($scope, fn) {
                    var phase = $scope.$root.$$phase;
                    if(phase === '$apply' || phase === '$digest') {
                        $scope.$eval(fn);
                    } else {
                        $scope.$apply(fn);
                    }
                };

            function initTableData() {
                if ($scope.tableData && $scope.tableData.length) {
                    if($scope.tableConfig.columns) {
                        $scope.tableColumns = $scope.tableConfig.columns;
                    } else {
                        $scope.tableColumns = [];
                        _.each($scope.tableData[0], function(value, key) {
                            if(!$scope.tableConfig.ignoredData || $scope.tableConfig.ignoredData.indexOf(key) === -1) {
                                $scope.tableColumns.push(key);
                            }
                        });
                    }
                    $scope.filterColumns = ['All'].concat($scope.tableColumns);
                    $scope.filter.column = $scope.filterColumns[0];
                    currFilterCol = $scope.filterColumns[0];
                    $scope.filterObject = {
                        currFilterCol: ''
                    };

                    $scope.predicate = [sanitizePredicate($scope.tableColumns[0])];
                    $scope.reverse = true;

                    tbody = elem.find('.app-tbody');
                    trows = tbody.find('.app-tr');
                    _.each($scope.tableColumns, function(value) {
                        tcols[value] = tbody.find(".app-td[data-col-header='" + value + "']");
                    });

                    $timeout(function() {
                        rowHeight = parseInt(trows.outerHeight());
                        calculateVisibleRows();
                        $scope.rowCount = trows.length;
                        $scope.visibleRowCount = $scope.rowCount;
                        $scope.calculatePageCount($scope.pager.pageSize.value);

                        $scope.pager.availPageSizes = [];
                        for(var i = $scope.pager.minPageSize; i <= $scope.pager.maxPageSize; ++i) {
                            $scope.pager.availPageSizes.push(i);
                        }

                        tbody.on('scroll', calculateVisibleRows);
                        $(window).on('resize', function() {
                            $scope.calculatePageCount();
                            calculateVisibleRows();
                        });

                        filterInputElem = $(element).find('.filter-input > input');
                        filterInputElem.on('input', $scope.handleFilterChange);

                        elem.find('.app-table').removeClass('loading');
                    }, 0);
                }
            }

            /**
             * Sanitizes sorting predicates to be used with angular.
             *
             * @method sanitizePredicate
             * @param {String} predicate
             *  The name of the predicate we want to use for sorting.
             * @param {Boolean} reverse
             *  Whether or not we are sorting in Asc or Desc order.
             * @return {String} Sanitized predicate.
             */
            function sanitizePredicate(predicate, reverse) {
                var ret = "'";

                if (reverse) {
                    ret = '-' + ret;
                }

                ret += predicate.replace(["'", '-'], '') + "'";

                return ret;
            }

            /**
             * Angular filtering rewrites everything in the table on the DOM,
             * this is incredibly slow. Our sort simply adds a class that hides
             * any filtered objects and is much faster.
             *
             * @method filterScrollableTable
             * @return none
             */
            function filterScrollableTable() {

                $scope.visibleRowCount = 0;
                $scope.filteredRowCount = 0;
                _.each (trows, function(row) {
                    var rowElem = $(row),
                        containsVal = false;

                    _.each($scope.filterObject, function(filterVal, filterCol) {
                        var rowValue = rowElem.find(".app-td[data-col-header='" + filterCol + "'] > .cell-data").html();
                        if (!filterVal || rowValue.toLowerCase().indexOf(filterVal.toLowerCase()) !== -1) {
                            containsVal = true;
                            return false;
                        }
                    });

                    if (containsVal) {
                        ++$scope.visibleRowCount;
                        rowElem.removeClass('filtered');
                    } else {
                        rowElem.addClass('filtered');
                        ++$scope.filteredRowCount;
                    }
                });
            }

            /**
             * Calculates the number of visible rows on a scrollable table using
             * the properties of the table and rows
             *
             * @method calculateVisibleRows
             * @return none
             */
            function calculateVisibleRows() {
                var containerHeight = tbody.innerHeight(),
                    containerScroll = tbody.scrollTop();
                $scope.visibleRowsStartIndex = parseInt(containerScroll / rowHeight + visibleStartRowMargin) + 1;
                $scope.visibleRowsEndIndex = parseInt((containerScroll + containerHeight) / rowHeight + visibleEndRowMargin);
                $scope.pager.currentPage = parseInt($scope.visibleRowsStartIndex / $scope.pager.pageSize.value);
                safeApply($scope);
            }

            /**
            * used to determine the ng-class of our headers, to show what is
            * being used to sort the table and in what direction
            *
            * @method $scope.isSortingBy
            * @param {String} col
            *  The name of the column being checked
            * @return {Integer} 0 for not sorted, 1 for Asc sort, -1 for Desc
            */
            $scope.isSortingBy = function(col) {
                var sanitizedCol = sanitizePredicate(col),
                    sanitizedReverseCol = sanitizePredicate(col, true);

                if ($scope.predicate === sanitizedCol) {
                    return 1;
                } else if ($scope.predicate === sanitizedReverseCol) {
                    return -1;
                }

                return 0;
            };

            /**
             * Generates a sorting predicate for angular to base its sort on
             *
             * @method $scope.sortTableBy
             * @param {String} predicate
             *  The name of the new column to sort by
             * @return none
             */
            $scope.sortTableBy = function(predicate) {
                var currIndex        = $scope.predicate.indexOf(sanitizePredicate(predicate)),
                    currReverseIndex = $scope.predicate.indexOf(sanitizePredicate(predicate, true)),
                    reverse = false;

                if (currIndex !== -1 && currReverseIndex === -1) {
                    reverse = true;
                }

                $scope.predicate = sanitizePredicate(predicate, reverse);
            };


            /**
             * Determines if enough filter values are set to filter our table
             *
             * @method $scope.handleFilterChange
             * @param {String} [item]
             *  The name of a column selected by the dropdown, possibly null
             * @return none
             */
            $scope.handleFilterChange = function() {
                var column = $scope.filter.column,
                    input = $scope.filter.input.value;

                $scope.filterObject = {};
                if (column === 'All') {
                    _.each($scope.tableColumns, function(tableCol) {
                        $scope.filterObject[tableCol] = input;
                    });
                } else {
                    $scope.filterObject[column] = input;
                }

                $timeout(function() {
                    filterScrollableTable();
                }, 0);
            };

            /**
             * Calculates the number of pages depending on the page size
             *
             * @method $scope.calculatePageCount
             * @param {Integer} [newSize]
             *  A new page size passed in from the dropdown, possibly null
             * @return none
             */
            $scope.calculatePageCount = function () {
                var rowCount,
                    pageSize = $scope.pager.pageSize.value,
                    remainder;

                $scope.pager.pageSize.value = $scope.visibleRowsEndIndex - $scope.visibleRowsStartIndex + 1;
                pageSize = $scope.pager.pageSize.value;

                rowCount = $scope.visibleRowCount;
                remainder = (rowCount % pageSize) ? 1 : 0;

                $scope.pager.pageCount = (rowCount / pageSize) + remainder;
            };

            /**
             * Changes the table to the newly selected page
             *
             * @method $scope.selectPage
             * @param {Integer} pageNumber
             *  The index of the page we need to switch to
             * @return none
             */
            $scope.selectPage = function(pageNumber) {
                var pageSize = $scope.pager.pageSize.value;
                $scope.pager.currentPage = pageNumber;
                $scope.pager.currentIndex = pageNumber * pageSize;

                tbody.animate({
                    scrollTop: pageNumber * pageSize * rowHeight
                }, 1000);
            };

            $scope.filter = {
                column:  '',
                input: {
                    value: ''
                }
            };

            $scope.pager = {
                minPageSize: 5,
                maxPageSize: 15,
                pageSize: {
                    value: 8
                },
                currentIndex: 0,
                currentPage: 0
            };

            if ($scope.minPageSize) {
                $scope.pager.minPageSize = $scope.minPageSize;
            } else {
                $scope.pager.minPageSize = 5;
            }
            if ($scope.maxPageSize) {
                $scope.pager.maxPageSize = $scope.maxPageSize;
            } else {
                $scope.pager.maxPageSize = 15;
            }

            if ($scope.tableConfig && $scope.tableConfig.tableData) {
                $timeout(function() {
                    initTableData();
                }, 0);
            }

            $scope.$watch('tableConfig', function() {
                if ($scope.tableConfig.tableData && $scope.tableConfig.tableData.length) {
                    $scope.tableData = $scope.tableConfig.tableData;
                }

                $timeout(function() {
                    initTableData();
                }, 0);
            }, true);
        }
    };
}]);
