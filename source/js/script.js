'use strict';

(function () {

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

    var cards = document.querySelectorAll('.card__wrapper');
    var links = document.querySelectorAll('.card__link');
    var mediaQuery = window.matchMedia('(max-width: 800px)');

    for (var i = 0; i < cards.length; i++) {
        if (!cards[i].parentNode.classList.contains('card--disabled')) {
            cards[i].addEventListener('click', cardClickHandler)
        }
    }

    for (var k = 0; k < links.length; k++) {
        links[k].addEventListener('click', linkClickHandler)
    }

    function cardClickHandler(evt) {
            var cardWrapper = evt.target.closest('.card__wrapper');
            var card = cardWrapper.parentNode;

            if (card.classList.contains('card--clicked')) {
                card.classList.remove('card--clicked');
                card.classList.remove('card--selected');
            }
            else {
                card.classList.add('card--clicked');
                // prevents adding mouseout handler for tablets and phones (at least for some of them)
                if (!mediaQuery.matches) {
                    cardWrapper.addEventListener('mouseout', cardMouseOutHandler);
                }
            }

        function cardMouseOutHandler() {
            if (card.classList.contains('card--clicked')) {
                card.classList.add('card--selected');
            }
            cardWrapper.removeEventListener('mouseout', cardMouseOutHandler);
        }
    }

    function linkClickHandler(evt) {
        var card = evt.target.closest('.card');

        if (card.classList.contains('card--clicked')) {
            card.classList.remove('card--clicked');
            card.classList.remove('card--selected');
        }
        else {
            card.classList.add('card--clicked');
            card.classList.add('card--selected');
        }
    }
})();
