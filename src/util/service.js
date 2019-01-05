const formatOfferData = (obj) => {
  return ({
    'author': {
      'name': obj.name,
      'avatar': obj.avatar
    },
    'offer': {
      'title': obj.title,
      'address': obj.address,
      'price': obj.price,
      'type': obj.type,
      'rooms': obj.rooms,
      'guests': obj.guests,
      'checkin': obj.checkin,
      'checkout': obj.checkout,
      'features': obj.features,
      'description': obj.description,
      'photos': obj.photos
    },
    'location': obj.location,
    'date': obj.date
  });
};

module.exports = {formatOfferData};
