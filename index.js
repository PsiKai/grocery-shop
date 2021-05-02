// const inventory = [
//     {item: "Apples", imgSrc: "./images/apples.jpg", price: .99, discount: {quantity: 2, price: .79}},
//     {item: "Bananas", imgSrc: "./images/bananas.jpg", price: .99},
//     {item: "Oranges", imgSrc: "./images/oranges.jpg", price: .99},
//     {item: "Onions", imgSrc: "./images/onions.jpg", price: .99, discount: {quantity: 4, price: .79}},
//     {item: "Carrots", imgSrc: "./images/carrots.jpg", price: .99},
//     {item: "Celery", imgSrc: "./images/celery.jpg", price: .99}
// ]


const shoppingSection = document.querySelector(".inventory")
const cartSection = document.querySelector(".cart")
const body = document.querySelector("body")
let totalDiscounts = 0

window.addEventListener("load", () => {
    var cart = JSON.parse(localStorage.getItem("cart"))
    cart && cart.forEach(cartItem => {
        const newItem = createCartItem(cartItem.item, +cartItem.quantity)
        newItem && cartSection.append(newItem)
        updateSavings()
        updatePrice()
    })
})

window.addEventListener("keydown", (e) => {
    const backdrop = document.querySelector(".modal-backdrop")
    if(e.key === "Escape") {
        backdrop && body.removeChild(backdrop)
        setTabIndex(true)
    }
})

const createDiv = (klass) => {
    const div = document.createElement("div")
    div.className = klass
    return div
}


const roundToNearestPenny = (num) => num.toFixed(2)
// Math.round((num + Number.EPSILON) * 100) / 100

const setTabIndex = (toggle) => {
    itemCard = document.querySelectorAll(".item--container")
    checkoutButton = document.querySelector("button")
    link = document.querySelector("a")
    focusableItems = [...itemCard, checkoutButton, link]

    focusableItems.forEach(item => {
        toggle ? 
            item.setAttribute("tabindex", "1") 
            : 
            item.setAttribute("tabindex", "-1")  
    })
}


const openModal = (foodItem) => {
    const {item, imgSrc, price} = foodItem
    setTabIndex(false)

    const backdrop = createDiv("modal-backdrop")
    backdrop.addEventListener("click", closeModal)

    backdrop.innerHTML = 
        `<div class="modal">
            <img src=${imgSrc} alt=${item} />
            <div class="modal-text-wrapper">
                <h3>${item}</h3>
                <div class="price--wrapper">
                    <label>Price: </label>
                    <p>$${price}</p>
                </div>
                <div class="input--wrapper">
                    <label>How Many?</label>
                    <input type="number" />
                </div>
                <button>Add to Cart</button>
                ${onSale(foodItem)}
            </div>
        </div>`

    body.append(backdrop)

    const button = backdrop.querySelector("button")
    button.addEventListener("click", () => {addToCart(item)})
}


inventory.forEach(foodItem => {
    const {item, imgSrc} = foodItem
    var div = createDiv("item--container")

    div.innerHTML = 
        `<p class="item--description"> ${item}</p>
        <img src=${imgSrc} alt=${item} />`
    
    div.setAttribute('tabIndex', "2")
    div.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            if(e.target === document.activeElement) e.target.click()
        }
    })

    div.addEventListener("click", () => openModal(foodItem))
    shoppingSection.append(div)
})

const generatePrice = (foodItem, amount) => {
    const itemData = inventory.find(food => food.item === foodItem)
    let price
    if(!!itemData.discount && amount >= itemData.discount.quantity) {
        price = itemData.discount.price * amount
        const discount = itemData.price * amount - price
        totalDiscounts += discount
    } else {
        price = itemData.price * amount
    }
    price = roundToNearestPenny(price)
    return price
}

const createCartItem = (item, amount) => {
    let currentCart = Array.from(document.querySelectorAll(".cart-item"));
    const alreadyInCart = currentCart.find(cartItem => cartItem.children[0].innerHTML === item)
    
    if (alreadyInCart) {
        oldPrice = alreadyInCart.querySelector(".item-price")
        oldQuantity = alreadyInCart.querySelector(".cart-quantity")
        newQuantity = +oldQuantity.innerHTML + +amount
        newPrice = generatePrice(item, newQuantity)
        oldQuantity.innerHTML = newQuantity
        oldPrice.innerHTML = `$${newPrice}`
    } else {
        const cartItem = createDiv("cart-item")
        cartItem.innerHTML = 
            `<h3>${item}</h3>
            <label>Quantity: </label>
            <p class="cart-quantity">${amount}</p>
            <label>Price: </label>
            <p class="item-price">$${generatePrice(item, +amount)}</p>
            `
        return cartItem
    } 

}

const createToast = (msg) => {
    const toast = createDiv("toast-message")
    toast.innerHTML = `<p>${msg}</p>`
    const modal = document.querySelector(".modal")
    modal.append(toast)

    setTimeout(() => {
        modal.removeChild(toast)
    }, 5000)
}


const addToCart = (item, quantity = 0) => {
    quantity = document.querySelector("input").value
    if (quantity <= 0) {
        createToast("Please select an amount greater than zero")
        return
    }

    const cartItem = createCartItem(item, quantity)
    cartItem && cartSection.append(cartItem)

    var cart = JSON.parse(localStorage.getItem("cart"))

    if(cart) {
        cart = [...cart, {item, quantity}]
        localStorage.setItem("cart", JSON.stringify(cart)) 
    } else {
        cart = [{item, quantity}]
        localStorage.setItem("cart", JSON.stringify(cart))
    }
    
    body.removeChild(document.querySelector(".modal-backdrop"))
    updatePrice()
    updateSavings()
}



const updatePrice = () => {
    const cartPrices = Array.from(document.querySelectorAll(".item-price"))
    let total = document.querySelector(".total")
    const newTotal = cartPrices.reduce((accum, curr) => {
        const price = curr.innerHTML.slice(1)
        accum += +price
        return accum
    }, 0)
    newTotal ?
        total.innerHTML = "$" + roundToNearestPenny(newTotal)
        :
        total.innerHTML = "$0"
}

const updateSavings = () => {
    const savings = document.querySelector(".savings")
    if(totalDiscounts) savings.innerHTML = "$" + roundToNearestPenny(totalDiscounts)
}

const resetDiscount = () => {
    const savings = document.querySelector(".savings")
    savings.innerHTML = "$0"
    totalDiscounts = 0
}

const onSale = (item) => {
    if(item.discount) {
        const {quantity, price} = item.discount
        const deal = 
            `<div class="special-deal">
                <p>${quantity} for <br> $${price.toFixed(2) * quantity}!</p>
            </div>`
        return deal
    } else {
        return ""
    } 
}


const closeModal = (e) => {
    const backdrop = document.querySelector(".modal-backdrop")
    if(e) {
        e.target === backdrop && body.removeChild(backdrop)
    } else {
        body.removeChild(backdrop)
    }
    
    setTabIndex(true)
}

const openCheckout = () => {
    const total = document.querySelector(".total").innerHTML
    const quantities = Array.from(document.querySelectorAll(".cart-quantity"))
    const itemsInCart = quantities.reduce((accum, curr) => {
            accum += +curr.innerHTML
            return accum
        }, 0)

    const checkoutModal = createDiv("modal-backdrop")
    checkoutModal.addEventListener("click", closeModal)
    checkoutModal.innerHTML = 
        `<div class="modal checkout">
            <div class="modal-text-wrapper">
                <h3>Checkout</h3>
                <div class="price--wrapper">
                    <label>Total:</label>
                    <p>${total}</p>
                </div>
                <div class="price--wrapper">
                    <label>Items in Cart:</label>
                    <p>${itemsInCart}</p>
                </div>
                ${totalDiscounts > 0 ?
                    `<div class="special-deal">
                        <p>You saved 
                            <br> 
                            $${roundToNearestPenny(totalDiscounts)}!</p>
                    </div>` : ""
                }
            </div>
            <button onclick=completeCheckout()>Confirm Order</button>
        </div>`
    
    setTabIndex(false)
    
    body.append(checkoutModal)
}

const completeCheckout = () => {
    closeModal()
    cartSection.innerHTML = ""
    localStorage.clear()
    updatePrice()
    resetDiscount()
}

// body.style.overflowY = "hidden"
// setTimeout(() => {
//     body.style.overflowY = "initial"
// }, 2200)