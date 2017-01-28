(function() {

    angular.module('inpacker', []);

    angular.module('inpacker')
           .controller('MainController', MainController);

    MainController.$inject = ['$http'];

    function MainController($http) {
        var vm = this;

        vm.search = search;

        vm.showNotFound = showNotFound;
        vm.closeUserNotFoundMessage = closeUserNotFoundMessage;
        vm.createZip = createZip;
        vm.show = {
            search: false,
            info: false,
            pack: false
        };

        activate();

        function activate() {
            showSearch();
        }

        // controlling views
        function showSearch() {
            vm.show.search = true;
            vm.show.info = false;
            vm.show.pack = false;
        }

        function showInfo() {
            vm.show.search = false;
            vm.show.info = true;
            vm.show.pack = false;
        }

        function showPack() {
            vm.show.search = false;
            vm.show.info = false;
            vm.show.pack = true;

            vm.showDownloadUrl = false;
            vm.downloadUrl = '/zip/' + vm.userInfo.username + '.zip';
        }
        // -----------------------

        // controlling search view
        function search() {
            if (!isValidSearchInput()) return;
            getUserInfo();
        }

        function isValidSearchInput() {
            return vm.searchInput && vm.searchInput !== '';
        }

        function showUserNotFound() {
            vm.userNotFoundMessage = 'User ' + vm.searchInput + ' not found';
        }

        function showNotFound() {
            return vm.userNotFoundMessage && vm.userNotFoundMessage !== '';
        }

        function closeUserNotFoundMessage() {
            vm.userNotFoundMessage = '';
        }
        // -----------------------------

        // controlling info view
        function getUserInfo() {
            $http.get('/api/user/' + vm.searchInput)
                .then((resp) => {
                    vm.userInfo = resp.data;
                    showInfo();
                }, (resp) => {
                    showUserNotFound();
                });
        }

        function createZip() {
            showPack();
            $http.post('/api/zip/' + vm.userInfo.username)
                .then((resp) => {
                    console.log('success: ' + resp.status);
                    console.log(resp.data.message);
                    if (resp.data.message === 'created') {
                        showDownloadUrl();
                    }
                }, (resp) => {
                    console.log('error: ' + resp.status);
                });
        }

        function showDownloadUrl() {
            vm.showDownloadUrl = true;
        }
        // -----------------------------

    }

})()