import PropTypes from 'prop-types';

export const productType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  oldPrice: PropTypes.number,
  icon: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  stock: PropTypes.number.isRequired,
});

export const cartItemType = PropTypes.shape({
  productId: PropTypes.number.isRequired,
  quantity: PropTypes.number.isRequired,
});

export const reviewType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  productId: PropTypes.number.isRequired,
  author: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  rating: PropTypes.number.isRequired,
  date: PropTypes.string.isRequired,
});
