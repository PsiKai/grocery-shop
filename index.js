const inventory = [
    {item: "Apples", imgSrc: "./images/apples.jpg", price: .99, discount: {quantity: 2, price: .79}},
    {item: "Bananas", imgSrc: "./images/bananas.jpg", price: .99},
    {item: "Oranges", imgSrc: "./images/oranges.jpg", price: .99},
    {item: "Onions", imgSrc: "./images/onions.jpg", price: .99, discount: {quantity: 4, price: .79}},
    {item: "Carrots", imgSrc: "./images/carrots.jpg", price: .99},
    {item: "Celery", imgSrc: "./images/celery.jpg", price: .99}
]

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

const createHeading = (text, klass = "") => {
    const heading = document.createElement("h2")
    heading.className = klass
    heading.innerHTML = text
    return heading
}

const createP = (text, klass = "") => {
    const p = document.createElement("p")
    p.className = klass
    p.innerHTML = text
    return p 
}

const createImg = (src, alt) => {
    const img = document.createElement("img")
    img.src = src
    img.alt = alt
    return img
}

const createInput = (item) => {
    const input = document.createElement("input")
    input.type = "number"
    input.id = item
    return input
}

const createLabel = (text, htmlFor) => {
    const label = document.createElement("label")
    label.for = htmlFor
    label.innerHTML = text
    return label
}

const createButton = (text, item = null) => {
    button = document.createElement("button")
    button.innerHTML = text
    button.addEventListener("click", () => {
        item ? addToCart(item) : completeCheckout()
    })
    return button
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

    backdrop.addEventListener("click", (e) => {
        e.target === backdrop && body.removeChild(backdrop)
        setTabIndex(true)
    })

    

    const modal = createDiv("modal")
    const textWrapper = createDiv("modal-text-wrapper")
    const modalItem = createHeading(item)
    const modalItemImg = createImg(imgSrc, item)
    const priceDiv = createDiv("price--wrapper")
    const priceLabel = createLabel("Price: ", item)
    const itemPrice = createP("$" + price)
    const quantityLabel = createLabel("How many?", item)
    const input = createInput(item)
    const inputDiv = createDiv("input--wrapper")
    const button = createButton("Add to Cart", item)

    // input.setAttribute("tabindex", "1") 
    // button.setAttribute("tabindex", "1")

    priceDiv.append(priceLabel)
    priceDiv.append(itemPrice)

    inputDiv.append(quantityLabel)
    inputDiv.append(input)

    textWrapper.append(modalItem)
    textWrapper.append(priceDiv)
    textWrapper.append(inputDiv)
    textWrapper.append(button)
    textWrapper.append(onSale(foodItem))

    modal.append(modalItemImg)
    modal.append(textWrapper)

    backdrop.append(modal)
    body.append(backdrop)
}

inventory.forEach(foodItem => {
    const {item, imgSrc} = foodItem
    var div = createDiv("item--container")
    var p = createP(item, "item--description")

    var img = createImg(imgSrc, item)
    
    div.setAttribute('tabIndex', "2")
    div.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            if(e.target === document.activeElement) e.target.click()
        }
    })
    
    div.append(p)
    div.append(img)

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
    const itemTotal = createP(`$` + price, 'item-price')
    return itemTotal
}

const createCartItem = (item, amount) => {
    let currentCart = Array.from(document.querySelectorAll(".cart-item"));
    const alreadyInCart = currentCart.find(cartItem => cartItem.children[0].innerHTML === item)
    
    if (alreadyInCart) {
        oldPrice = alreadyInCart.children[4]
        alreadyInCart.children[2].innerHTML = +alreadyInCart.children[2].innerHTML + +amount
        newPrice = generatePrice(item, +alreadyInCart.children[2].innerHTML)
        alreadyInCart.replaceChild(newPrice, oldPrice)
    } else {
        const cartItem = createDiv("cart-item")
        const quantityLabel = createLabel("Quantity: ", item)
        const cartItemName = createHeading(item)
        const priceLabel = createLabel("Price: ")
        const numberOfItems = createP(amount, "cart-quantity")
        const price = generatePrice(item, +amount)

        cartItem.append(cartItemName)
        cartItem.append(quantityLabel)
        cartItem.append(numberOfItems)
        cartItem.append(priceLabel)
        cartItem.append(price)
        return cartItem
    } 

}

const createToast = (msg) => {
    const toast = createDiv("toast-message")
    const toastMsg = createP(msg)
    const modal = document.querySelector(".modal")
    toast.append(toastMsg)
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
    console.log(cart);
    if(cart) {
        cart = [...cart, {item, quantity}]
        localStorage.setItem("cart", JSON.stringify(cart)) 
    } else {
        cart = [{item, quantity}]
        console.log(cart);
        localStorage.setItem("cart", JSON.stringify(cart))
    }
    
        


    body.removeChild(document.querySelector(".modal-backdrop"))
    updatePrice()
    updateSavings()
}


const updatePrice = () => {
    const cartPrices = Array.from(document.querySelectorAll(".item-price"))
    let total = document.querySelector(".total")
    newTotal = cartPrices.reduce((accum, curr) => {
        const price = curr.innerHTML.slice(1)
        accum += +price
        return accum
    }, 0)

    total.innerHTML = "$" + roundToNearestPenny(newTotal)
}

const updateSavings = () => {
    const savings = document.querySelector(".savings")
    if(totalDiscounts) savings.innerHTML = "$" + roundToNearestPenny(totalDiscounts)
}

const onSale = (item) => {
    if(item.discount) {
        const {quantity, price} = item.discount
        const deal = createDiv("special-deal")
        const sale = createP(`${quantity} for <br> $${price}!`)
        deal.append(sale)
        return deal
    } else {
        return ""
    } 
}

// const openCheckout = () => {
//     const quantities = Array.from(document.querySelectorAll(".cart-quantity"))
//     const backdrop = createDiv("modal-backdrop")
//     setTabIndex(false)

//     backdrop.addEventListener("click", (e) => {
//         e.target === backdrop && body.removeChild(backdrop)
//     })

//     const modal = createDiv("modal checkout")
//     const price = createHeading("Total")
//     const total = createP(document.querySelector(".total").innerHTML)
//     const quantity = createHeading("Items in Cart")
//     const itemsInCart = quantities.reduce((accum, curr) => {
//         accum += +curr.innerHTML
//         return accum
//     }, 0)
//     const amount = createP(itemsInCart)

//     const button = createButton("Confirm Order")

//     modal.append(price)
//     modal.append(total)
//     modal.append(quantity)
//     modal.append(amount)
//     modal.append(button)

//     backdrop.append(modal)
//     body.append(backdrop)

// }

const closeModal = (e) => {
    const backdrop = document.querySelector(".modal-backdrop")
    e.target === backdrop && body.removeChild(backdrop)
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
                <div class="price--wrapper">
                    <label>Total:</label>
                    <p>${total}</p>
                </div>
                <div class="price--wrapper">
                    <label>Items in Cart:</label>
                    <p>${itemsInCart}</p>
                </div>
                <div class="special-deal">
                    ${totalDiscounts > 0 && 
                        `<p>You saved 
                            <br> 
                            $${roundToNearestPenny(totalDiscounts)}!</p>`}
                </div>
            </div>
            <button onclick=completeCheckout()>Confirm Order</button>
            
        </div>`
    
    setTabIndex(false)
    
    body.append(checkoutModal)
}

const completeCheckout = () => {
    console.log(body);
    body.removeChild(document.querySelector(".modal-backdrop"))
    cartSection.innerHTML = ""
    localStorage.clear()
    updatePrice()
    updateSavings()
}