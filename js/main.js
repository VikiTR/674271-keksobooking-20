'use strict';

var NUMBER = 8;
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;


var adverts = [];

var getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var TYPES_ROOM = [
  'palace',
  'flat',
  'house',
  'bungalo'
];
var CHECK_TIMES = [
  '12:00',
  '13:00',
  '14:00'
];
var FEATURES = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'
];
var PHOTOS_URL = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];

var shuffleArray = function (a) {
  var j;
  var x;
  var i;
  for (i = a.lenght - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
};

var addPlace = function () {
  for (var i = 0; i < NUMBER; i++) {
    adverts.push({
      'author': {
        'avatar': 'img/avatars/user0' + (i + 1) + '.png'
      },
      'offer': {
        'title': 'Жилье',
        'address': getRandomInt(1, 600) + ', ' + getRandomInt(1, 350),
        'price': getRandomInt(1, 15000),
        'type': TYPES_ROOM[getRandomInt(0, TYPES_ROOM.length - 1)],
        'rooms': getRandomInt(1, 5),
        'guests': getRandomInt(1, 10),
        'checkin': CHECK_TIMES[getRandomInt(0, CHECK_TIMES.length - 1)],
        'checkout': CHECK_TIMES[getRandomInt(0, CHECK_TIMES.length - 1)],
        'features': shuffleArray(FEATURES).slice(0, getRandomInt(0, FEATURES.length)),
        'description': 'Описание',
        'photos': PHOTOS_URL[getRandomInt(0, PHOTOS_URL.length - 1)]
      },
      'location': {
        'x': getRandomInt(0, 1200),
        'y': getRandomInt(130, 630)
      }
    });
  }
};
addPlace();

var map = document.querySelector('.map');

var pluralize = function (value, n1, n2, n5) {
  var num = Math.abs(value);
  num %= 100;
  if (num >= 5 && num <= 20) {
    return n5;
  }
  num %= 10;
  if (num === 1) {
    return n1;
  }
  return num >= 2 && num <= 4 ? n2 : n5;
};

var renderCard = function (offer) {
  var cardTemplate = document.querySelector('#card');
  var cardElement = cardTemplate.content.querySelector('.map__card').cloneNode(true);
  var cardTitle = cardElement.querySelector('.popup__title');
  if (cardTitle) {
    cardTitle.innerText = offer.title;
  }
  var cardAddress = cardElement.querySelector('.popup__text--address');
  cardAddress.innerText = offer.address;
  var cardPrice = cardElement.querySelector('.popup__text--price');
  cardPrice.innerText = offer.price + ' ₽/ночь';

  var cardType = cardElement.querySelector('.popup__type');
  switch (offer.type) {
    case 'flat':
      cardType.innerText = 'Квартира';
      break;
    case 'bungalo':
      cardType.innerText = 'Бунгало';
      break;
    case 'house':
      cardType.innerText = 'Дом';
      break;
    case 'palace':
      cardType.innerText = 'Дворец';
      break;
    default: cardType.innerText = '...';
  }

  var cardCapacity = cardElement.querySelector('.popup__text--capacity');
  cardCapacity.innerText = offer.rooms + ' комнат' + pluralize(offer.rooms, 'ы', '', '') + ' для ' +
                           offer.guests + ' гост' + pluralize(offer.guests, 'я', 'ей', 'ей');

  var cardTime = cardElement.querySelector('.popup__text--time');
  cardTime.innerText = 'Заезд после ' + offer.checkin + ', выезд до ' + offer.checkout;

  var cardFeatures = cardElement.querySelector('.popup__features');
  cardFeatures.innerHTML = '';

  var appendFeature = function (feature) {
    var cardFeature = document.createElement('li');
    cardFeature.classList.add('popup__feature');
    cardFeature.classList.add('popup__feature--' + feature);
    cardFeatures.appendChild(cardFeature);
  };

  for (var feature in offer.features) {
    if (offer.features[feature]) {
      appendFeature(offer.features[feature]);
    }
  }

  var cardDescription = cardElement.querySelector('.popup__description');
  if (cardDescription) {
    cardDescription.innerText = offer.description;
  }

  var cardPhotos = cardElement.querySelector('.popup__photos');

  var cardPhoto = cardPhotos.querySelector('.popup__photo');
  cardPhotos.innerHTML = '';

  var renderPhoto = function (photo) {
    var photoElement = cardPhoto.cloneNode(true);
    photoElement.src = photo;
    cardPhotos.appendChild(photoElement);
  };

  if (cardPhotos && cardPhoto) {
    if (typeof offer.photos === 'string') {
      renderPhoto(offer.photos);
    } else {
      for (var photo in offer.photos) {
        if (offer.photos[photo]) {
          renderPhoto(offer.photos[photo]);
        }
      }
    }
  }

  // Здесь пишет, что author не определен, не могу понять, почему?
  /* var avatar = cardElement.querySelector('.popup__avatar');
  if (avatar) {
    avatar.src = author.avatar;
  } */

  // так тоже не работает
  var avatar = document.querySelector('.popup__avatar');
  if (avatar) {
    avatar.src = author.avatar;
  }

  var cardCloseButton = cardElement.querySelector('.popup__close');
  var closeCard = function () {
    var cardParent = cardElement.parentNode;
    if (cardParent) {
      cardCloseButton.removeEventListener('mousedown', closeCard);
      cardParent.removeChild(cardElement);
    }
  };
  if (cardCloseButton) {
    cardCloseButton.addEventListener('mousedown', closeCard);
  }

  map.appendChild(cardElement);
};

var mapActivation = function (evt) {
  evt.preventDefault();

  if (evt.button !== 0 && evt.key !== 'Enter') {
    return;
  }

  map.classList.remove('map--faded');

  var similarListElement = document.querySelector('.map__pins');
  var pinTemplate = document.querySelector('#pin')
        .content
        .querySelector('.map__pin');

  var renderPin = function (pin) {
    var pinElement = pinTemplate.cloneNode(true);
    var img = pinElement.querySelector('img');
    img.src = pin.author.avatar;
    img.alt = pin.offer.title;
    pinElement.style.left = pin.location.x - PIN_WIDTH + 'px';
    pinElement.style.top = pin.location.y - PIN_HEIGHT + 'px';
    pinElement.addEventListener('mousedown', function () {
      renderCard(pin.offer);
    });

    return pinElement;
  };

  var renderPins = function () {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < adverts.length; i++) {

      fragment.appendChild(renderPin(adverts[i]));
    }
    similarListElement.appendChild(fragment);
  };
  renderPins();

  activeMap.removeEventListener('mousedown', mapActivation);
  activeMap.removeEventListener('keydown', mapActivation);
};

var activeMap = document.querySelector('.map__pin--main');
activeMap.addEventListener('mousedown', mapActivation);
activeMap.addEventListener('keydown', mapActivation);
