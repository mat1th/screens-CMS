var slideshow = slideshow || {};

slideshow.helper = (function() {
    var select = function(selector) {
            return document.querySelector(selector);
        },
        selectAll = function(selector) {
            return document.querySelectorAll(selector);
        };

    return {
        select: select,
        selectAll: selectAll
    };
})();


slideshow.start = (function() {
    var slides = slideshow.helper.selectAll('.slideshow .slide');
    var body = slideshow.helper.select('body');
    var i = 0;
    var animationTime = 3;
    var windowWidth = window.innerWidth,
        windowHeight = window.innerHeight;
    var slider = new TimelineMax({
        paused: false,
        repeat: -1,
        ease: Sine.easeOut
    });

    var init = function() {
            start();
        },
        start = function functionName() {
            for (i = 0; i < slides.length; i++) {
                var element = slides[i],
                    animation = slides[i].getAttribute('data-animation'),
                    type = slides[i].getAttribute('data-type'),
                    id = slides[i].getAttribute('data-id'),
                    color = slides[i].getAttribute('data-color'),
                    duration = JSON.parse(slides[i].getAttribute('data-duration')),
                    prevEment;

                if (i !== 0) {
                    var a = i - 1;
                    prevEment = slides[a];
                }

                animate(element, prevEment, animation, duration, type, color, id);
            }
        },
        animate = function(element, prevEment, animation, duration, type, color, id) {
          if (prevEment !== undefined) {
              slider.to(prevEment, 2, {
                  opacity: 0
              },'animation' + id);
          }
            if (animation === 'left-push') {
                slider.set(element, {
                        onComplete: slideshow.vimeo.play,
                        onCompleteParams: [type],
                        x: 0,
                        opacity: 0
                    })
                    .to(body, animationTime, {
                        backgroundColor: color
                    }, 'animation' + id).to(element, animationTime, {
                        x: windowWidth,
                        opacity: 1,
                        ease: Power4.easeIn
                    }, 'animation' + id + '-=1')
                    .to(element, animationTime, {
                        // x: windowWidth * 2,
                        // opacity: 0,
                        // ease: Power4.easeIn,
                        delay: duration,
                        onComplete: slideshow.vimeo.pauze,
                        onCompleteParams: [type]
                    }, '-=' + animationTime);
            } else if (animation === 'top-push') {
                slider.to(body, animationTime, {
                        backgroundColor: color
                    }, 'animation' + id).yoyo(false).set(element, {
                        onComplete: slideshow.vimeo.play,
                        onCompleteParams: [type],
                        y: 0,
                        opacity: 0
                    }, 'animation' + id + '-=1')
                    .to(element, animationTime, {
                        y: windowHeight,
                        opacity: 1,
                        ease: Power4.easeIn
                    })
                    .to(element, animationTime, {
                        // x: windowHeight * 2,
                        // opacity: 0,
                        // ease: Power4.easeIn,
                        delay: duration,
                        onComplete: slideshow.vimeo.pauze,
                        onCompleteParams: [type]
                    }, '-=' + animationTime);
            } else if (animation === 'pop') {
                slider.to(body, animationTime, {
                        backgroundColor: color
                    }, 'animation' + id)
                    .fromTo(element, animationTime, {
                        onComplete: slideshow.vimeo.play,
                        onCompleteParams: [type],
                        opacity: 0,
                        scale: 0,
                        rotation: -180
                    }, {
                        opacity: 1,
                        scale: 1,
                        rotation: 0
                    }, 'animation' + id + '-=1')
                    .to(element, animationTime, {
                        // opacity: 0,
                        // scale: 0,
                        // rotation: -180,
                        delay: duration,
                        onComplete: slideshow.vimeo.pauze,
                        onCompleteParams: [type]
                    }, '-=' + animationTime);
            } else if (animation === 'fadein') {
                slider.to(body, animationTime, {
                        backgroundColor: color
                    }, 'animation' + id)
                    .fromTo(element, animationTime, {
                        onComplete: slideshow.vimeo.play,
                        onCompleteParams: [type],
                        opacity: 0
                    }, {
                        opacity: 1
                    }, 'animation' + id + '-=1')
                    .to(element, animationTime, {
                        delay: duration,
                        onComplete: slideshow.vimeo.pauze,
                        onCompleteParams: [type]
                    }, '-=' + animationTime);
                // .to(element, 1, {
                //     opacity: 0
                // }, '+=10');
            }
        };
    return {
        init: init
    };
})();

slideshow.vimeo = (function() {
    var play = function(type) {
            if (type === 'vimeo') {
                console.log('play', type);
                var player = $f(document.querySelector('#player1'));
                player.api('play');
            }
        },
        pauze = function(type) {
            if (type === 'vimeo') {
                console.log('stop', type);
                var player = $f(document.querySelector('#player1'));
                player.api('pause');
            }
        };
    return {
        play: play,
        pauze: pauze
    };
})();

slideshow.start.init();
