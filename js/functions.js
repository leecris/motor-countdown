;(function($){
    var ItemsArr = [];
	
    $(document).ready(function() {
        // Get number from param
        var noItems = getParameterByName('no') !== null ? getParameterByName('no') : 6;
        var noItems = $("#select-quantity").val();
        var $listContainer = $(".list-content");
        var itemHmtl = $listContainer.find('.item').clone().html();
        generateHtml(noItems);
        $(".btn-quantity").on('click',function(){
            var noItems = $("#select-quantity").val();
            console.log('generate');
            // Remove all item
            generateHtml(noItems);
        });

        function generateHtml(noItems) {
            $listContainer.empty();
            for (var i=0;i<noItems;i++) {
                $listContainer.append("<div class='item' data-key='"+i+"'>"+itemHmtl+"</div>")
                $listContainer.find('.item').eq(i).find('.no-of-item').html(i+1);
                var $item = $listContainer.find('.item').eq(i);
                var clock = new FlipClock($item.find('.clock-cd'),0,{
                    countdown: true,
                    autoStart: false,
                    callbacks: {
                        init: function() {

                        }

                    }
                });
                ItemsArr.push(clock);
            }
        }
		
		// implements playsound in queue
		var playQueue = [];
		var playInterval = -1;
		
		function playSound(custom) {
			responsiveVoice.speak("Xin mời quý khách "+custom.name+" có xe với biển số "+custom.motorNo+" đến quầy thu ngân làm thủ tục nhận xe", "Vietnamese Male", {
				volume: 1
			});
		}
		
		function addToPlayQueue(customer) {
			playQueue.push(customer);
			
			if (playInterval < 0 && playQueue.length == 1) {
				var customFirst = playQueue.shift();
				playSound(customFirst);
				
				playInterval = setInterval(function() {
					var custom = playQueue.shift();
					playSound(custom);
					
					if (playQueue.length == 0) {
						clearInterval(playInterval);
						playInterval = -1;
					}
				}, 20000);
			}
		}

        $listContainer.delegate('.btn-start','click',function(){
            var $item = $(this).parents('.item');
            var key = $item.data('key');
            var inputTime = $item.find('.input-time').val() * 60;
            var name = $item.find(".repairer").val();
            var motorNo = $item.find(".motor-no").val().replace(/-|_| /gi,"").split('').join(' ');
            var clock = new FlipClock($item.find('.clock-cd'),inputTime,{countdown: true});
			
			var playSoundTimer = $(this).data('play-sound');
			if (playSoundTimer) {
				clearTimeout(playSoundTimer);
			}
			
			if (responsiveVoice.voiceSupport()) {
				playSoundTimer = setTimeout(function() {
					addToPlayQueue({name: name, motorNo: motorNo});
					$(this).data('play-sound', undefined);
				}, inputTime*1000);
				$(this).data('play-sound', playSoundTimer);
			}	
        })
        $listContainer.delegate('.btn-stop','click',function(){
            var $item = $(this).parents('.item');
            var key = $item.data('key');
            var name = $item.find(".repairer").val();
            var motorNo = $item.find(".motor-no").val();
            var clock = new FlipClock($item.find('.clock-cd'),0,{
                countdown: true,
                callbacks: {
                    init: function() {

                    },
                    stop: function () {

                    }
                }
            });
        })

        // Show/hide setting
        $(".btn-toggle").click(function(){
            // Check current data display
            var $header = $('.header-stick');
            $header.slideToggle();
        })
        var messageInterval;
        // Run sound notication
        $(".btn-noti").click(function(e) {
            e.preventDefault();
            var message = $("#noti-text").val();
            var interval = $("#noti-time").val();
            if (responsiveVoice.voiceSupport()) {
                responsiveVoice.speak(message, "Vietnamese Male", {
                    volume: 1
                });
            }
            messageInterval = setInterval(function(){
                if (responsiveVoice.voiceSupport()) {
                    responsiveVoice.speak(message, "Vietnamese Male", {
                        volume: 1
                    });
                }
            },interval*60*1000);

        })
        $(".btn-stop-noti").click(function(e) {
            e.preventDefault();
            clearInterval(messageInterval);

        })
    });
    function getParameterByName(name, url) {
        if (!url) {
            url = window.location.href;
        }
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
})(jQuery);




























