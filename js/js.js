var app = angular.module('angular-application', [])
    .controller('output-controller', function ($scope, imgur) {
        $scope.thumbnails = imgur.getImages();
        $scope.$on('reloadImage', function () {
            $scope.$apply();
        });
    })
    .factory('imgur', function ($http, $rootScope) {
        return {
            getImages: function () {
                this.reload = arguments[0];

                var arr = this.images;
                for (var i = 0; i < 102; i++) {
                    arr.push(this.getImage());
                }
                return arr;
            },
            getImage: function () {

                var img = new Image();
                var arr = this.images;
                var th = this;

                img.addEventListener('load', function () {
                    var index = arr.indexOf(this);

                    if (this.width === 161) {
                        if (index !== -1) {
                            arr[index] = th.getImage();
                        }
                    } else {
                        $rootScope.$broadcast('reloadImage');
                    }
                });

                img.addEventListener('error', function () {
                    var index = arr.indexOf(this);
                    arr[index] = th.getImage();
                });

                img.src = this.getRandomUrl();

                return img;
            },
            getRandomUrl: function () {
                var chars = '01234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghiklmnopqrstuvwxyz';
                var stringlength = 5; /* could be 6 or 7, but takes forever because there are lots of dead images */
                var text = '';
                for (var i = 0; i < stringlength; i++) {
                    var rnum = Math.floor(Math.random() * chars.length);
                    text += chars.substring(rnum, rnum + 1);
                }

                var source = 'http://i.imgur.com/' + text + '.jpg';
                return source;
            },
            images: [],
            reload: undefined
        }
    });

function isFunction(f) {
    return typeof f === 'function';
}