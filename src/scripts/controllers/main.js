var app = angular.module('app', ['pubnub.angular.service']);

app.controller('ChatCtrl', ['$scope', 'Pubnub', function($scope, Pubnub) {
        $scope.messages = [];
        $scope.channel = 'messages-channel';

        $scope.messageContent = '';
        // Generating a random uuid between 1 and 100 using utility function from lodash library.
        $scope.uuid = _.random(1000000).toString();

        // Please signup to PubNub to use your own keys: https://admin.pubnub.com/
        Pubnub.init({
            publish_key: 'pub-c-ce5cadc7-7cff-4cb0-b21b-0b4972d3b0a6',
            subscribe_key: 'sub-c-29091c72-509d-11e6-bfbb-02ee2ddab7fe',
            uuid: $scope.uuid
        });

        // Fetching a uniq random avatar from the robohash.org service.
        $scope.avatarUrl = function(uuid) {
            return 'http://robohash.org/' + uuid + '?set=set2&bgset=bg2&size=70x70';
        };

        // Send the messages over PubNub Network
        $scope.sendMessage = function() {
            // Don't send an empty message
            if (!$scope.messageContent ||
                $scope.messageContent === '') {
                return;
            }
            Pubnub.publish({
                channel: $scope.channel,
                message: {
                    content: $scope.messageContent,
                    sender_uuid: $scope.uuid,
                    date: new Date()
                },
                callback: function(m) {
                    console.log(m);
                }
            });
            // Reset the messageContent input
            $scope.messageContent = '';

        }

        // Subscribe to messages channel
        Pubnub.subscribe({
            channel: $scope.channel,
            triggerEvents: ['callback']
        });

        // Make it possible to scrollDown to the bottom of the messages container
        $scope.scrollDown = function(time) {
            var $elem = $('.collection');
            $('body').animate({
                scrollTop: $elem.height()
            }, time);
        };
        $scope.scrollDown(400);
// Listenning to messages sent.
        $scope.$on(Pubnub.getMessageEventNameFor($scope.channel), function(ngEvent, m) {
            $scope.$apply(function() {
                $scope.messages.push(m)
            });
            $scope.scrollDown(400);
        });
    }]);

app.directive('backImg', function(){
    return function(scope, element, attrs){
        attrs.$observe('backImg', function(value) {
            element.css({
                'background-image': 'url(' + value +')',
                'background-size' : 'cover'
            });
        });
    };
});
