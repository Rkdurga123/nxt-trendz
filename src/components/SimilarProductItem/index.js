// Write your code here
import './index.css'

const SimilarProductItem = props => {
  const {productDetails} = props
  const {id, imageUrl, title, brand, rating, price} = productDetails

  return (
    <li className="similar-products">
      <img
        src={imageUrl}
        alt={`similar product ${title}`}
        className="similar-image"
      />
      <h1 className="similar-heading">{title}</h1>
      <p className="brand-name">{brand}</p>
      <div className="bottom-div">
        <p className="price-bottom">Rs {price}/-</p>
        <p className="rating-bottom">
          <span>{rating}</span>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="star"
          />
        </p>
      </div>
    </li>
  )
}
export default SimilarProductItem
