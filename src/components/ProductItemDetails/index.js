// Write your code here
import {Component} from 'react'
import {Link} from 'react-router-dom'
import {Loader} from 'react-loader-spinner'
import {BsDashSquare, BsPlusSquare} from 'react-icons/bs'
import Cookies from 'js-cookie'

import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'Failure',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    productsList: [],
    quantity: 1,
    similarProductsData: [],
  }

  componentDidMount() {
    this.getDetails()
  }

  getFormattedData = data => ({
    avialabilty: data.availability,
    id: data.id,
    description: data.description,
    brand: data.brand,
    imageUrl: data.image_url,
    price: data.price,
    rating: data.rating,
    title: data.title,
    totalReviews: data.total_reviews,
  })

  getDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')

    const option = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(`https://apis.ccbp.in/products/${id}`, option)
    if (response.ok) {
      const data = await response.json()
      const updatedData = this.getFormattedData(data)
      const updatedSimilarProductsData = updatedData.similar_products.map(
        eachSimilarProduct => this.getFormattedData(eachSimilarProduct),
      )
      this.setState({
        apiStatus: apiStatusConstants.success,
        productsList: updatedData,
        similarProductsData: updatedSimilarProductsData,
      })
    }
    if (response.status === 404) {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  increment = () => {
    const {quantity} = this.state
    this.setState(prevState => ({quantity: prevState.quantity + 1}))
  }

  decrement = () => {
    const {quantity} = this.state
    if (quantity > 1) {
      this.setState(prevState => ({quantity: prevState.quantity - 1}))
    }
  }

  renderSuccessDetails = () => {
    const {similarProductsData, productsList, quantity} = this.state
    const {
      imageUrl,
      title,
      id,
      brand,
      totalReviews,
      rating,
      availability,
      price,
      description,
    } = productsList

    return (
      <div className="success-container">
        <div className="first-container">
          <img src={imageUrl} alt="product" className="image" />
          <div className="first-content">
            <h1 className="heading">{title}</h1>
            <p className="price">Rs {price} /-</p>
            <div className="rating-holder">
              <div className="rating">
                <p className="para">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star"
                />
              </div>
              <p className="review">{totalReviews} Reviews</p>
            </div>
            <p className="first-para">{description}</p>
            <p className="review">
              <span className="first-bold">Available: {availability}</span>
            </p>
            <p className="review">
              <span className="first-bold">Brand: {brand}</span>
            </p>
            <hr />
            <div className="quantity-holder">
              <button
                type="button"
                className="btn"
                onClick={this.decrement}
                data-testid="minus"
              >
                <BsDashSquare className="btn-icons" />
                <p>-</p>
              </button>
              <p className="review">{quantity}</p>
              <button
                type="button"
                className="btn"
                onClick={this.increment}
                data-testid="plus"
              >
                <BsPlusSquare className="btn-icon" />
                <p>+</p>
              </button>
            </div>
            <button type="button" className="add-btn">
              ADD TO CART
            </button>
          </div>
        </div>
        <h1 className="heading">Similar Products</h1>
        <ul className="list-items">
          {similarProductsData.map(eachProduct => (
            <SimilarProductItem
              productDetails={eachProduct}
              key={eachProduct.id}
            />
          ))}
        </ul>
      </div>
    )
  }

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="error view"
        className="failure"
      />
      <h1 className="heading">Product Not Found</h1>
      <Link to="/products">
        <button type="button" className="failure-btn">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  renderLoaderView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={50} widtg={50} />
    </div>
  )

  renderProductDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessDetails()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoaderView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="products-container">{this.renderProductDetails()}</div>
      </>
    )
  }
}
export default ProductItemDetails
