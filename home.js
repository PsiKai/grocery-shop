let options = {
    root: null,
    rootMargin: "-10% 0%",
    threshold: 1
}

let options2 = {
    root: null,
    rootMargin: "-10% 0%",
    threshold: 0.8
}

console.log("this is the testimonial branch")


let valuesCallback = (entries, observer) => {
    entries.forEach(entry => {
        if(entry.isIntersecting === true) {
            entry.target.style.animation = "zoom-in 1000ms ease forwards"
        }
        // if(entry.isVisible === false && entry.isIntersecting === false) {
        //     entry.target.style.animation = ""
        // }
    })
}

let values = new IntersectionObserver(valuesCallback, options);


values.observe(document.querySelector(".values"))


// let valueTextCallback = (entries) => {
//     entries.forEach(entry => {
//         if(entry.isIntersecting === true) {
//             entry.target.style.animation = "slide-from-right 1000ms ease forwards"
//         }
//         if(entry.isVisible === false && entry.isIntersecting === false) {
//             entry.target.style.animation = "fade-in 500ms ease reverse"
//         }
//     })
// }

// let valueImgCallback = (entries) => {
//     entries.forEach(entry => {
//         if(entry.isIntersecting === true) {
//             entry.target.style.animation = "slide-from-left 1000ms ease forwards"
//         }
//         if(entry.isVisible === false && entry.isIntersecting === false) {
//             entry.target.style.animation = "fade-in 500ms ease reverse"
//         }
//     })
// }

const valueCardCallback = (entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting === true) {
            entry.target.children[0].style.animation = "slide-from-left 1000ms ease forwards"
            entry.target.children[1].style.animation = "slide-from-right 1000ms ease forwards"
        }
        if(entry.isVisible === false && entry.isIntersecting === false) {
            var children = Array.from(entry.target.children)
            children.forEach(child => {
                child.style.animation = "fade-in 1500ms ease reverse"
            })
        }
    })
}

// const valueImgs = Array.from(document.querySelectorAll(".img--container"))
// let valueImg = new IntersectionObserver(valueImgCallback, options2)

// valueImgs.forEach(img => {valueImg.observe(img)})

// const valueTexts = Array.from(document.querySelectorAll(".introduction--card-text"))
// let valueText = new IntersectionObserver(valueTextCallback, options2)

// valueTexts.forEach(text => {valueText.observe(text)})

const valueCards = Array.from(document.querySelectorAll(".introduction--card"))
const valueCard = new IntersectionObserver(valueCardCallback, options2)
valueCards.forEach(card => valueCard.observe(card))