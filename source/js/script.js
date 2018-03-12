'use strict';

(function () {
    var CARD = {
        itself: 'card',
        disabled: 'card--disabled',
        wrapper: 'card__wrapper',
        clicked: 'card--clicked',
        selected: 'card--selected',
        bottomLink: 'card__link'
    };
    var MAX_WIDTH = '(max-width: 800px)';

    var cards = document.querySelectorAll('.' + CARD.wrapper);
    var links = document.querySelectorAll('.' + CARD.bottomLink);
    var mediaQuery = window.matchMedia(MAX_WIDTH);

    for (var i = 0; i < cards.length; i++) {
        if (!cards[i].parentNode.classList.contains(CARD.disabled)) {
            cards[i].addEventListener('click', cardClickHandler)
        }
    }

    for (var k = 0; k < links.length; k++) {
        links[k].addEventListener('click', linkClickHandler)
    }

    function cardClickHandler(evt) {
        var cardWrapper = evt.target.closest('.' + CARD.wrapper);
        var card = cardWrapper.parentNode;

        if (card.classList.contains(CARD.clicked)) {
            card.classList.remove(CARD.clicked);
            card.classList.remove(CARD.selected);
        }
        else {
            card.classList.add(CARD.clicked);
            // prevents adding mouseout handler for tablets and phones (at least for some of them)
            if (!mediaQuery.matches) {
                cardWrapper.addEventListener('mouseleave', cardMouseLeaveHandler);
            }
        }

        function cardMouseLeaveHandler(evt) {
            // relatedTarget used because of Chrome bug (https://stackoverflow.com/questions/47649442/click-event-effects-mouseenter-and-mouseleave-on-chrome-is-it-a-bug)
            if (evt.relatedTarget && card.classList.contains(CARD.clicked)) {
                card.classList.add(CARD.selected);
            }
            cardWrapper.removeEventListener('mouseleave', cardMouseLeaveHandler);
        }
    }

    function linkClickHandler(evt) {
        var card = evt.target.closest('.' + CARD.itself);

        if (card.classList.contains(CARD.clicked)) {
            card.classList.remove(CARD.clicked);
            card.classList.remove(CARD.selected);
        }
        else {
            card.classList.add(CARD.clicked);
            card.classList.add(CARD.selected);
        }
    }

    // region polyfill for #Element.closest
    if (typeof Element.prototype.matches !== 'function') {
        Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.webkitMatchesSelector || function matches(selector) {
            var element = this;
            var elements = (element.document || element.ownerDocument).querySelectorAll(selector);
            var index = 0;
            while (elements[index] && elements[index] !== element) {
                ++index;
            }
            return Boolean(elements[index]);
        };
    }
    if (typeof Element.prototype.closest !== 'function') {
        Element.prototype.closest = function closest(selector) {
            var element = this;
            while (element && element.nodeType === 1) {
                if (element.matches(selector)) {
                    return element;
                }

                element = element.parentNode;
            }
            return null;
        };
    }
    // endregion

})();
