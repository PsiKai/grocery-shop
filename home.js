console.log("O HAI THERE");


const body = document.querySelector("body")

let options = {
    root: null,
    rootMargin: "0% 0% -20% 0%",
    threshold: 1
}

let options2 = {
    root: null,
    rootMargin: "0% 0% -10% 0%",
    threshold: 0.8
}

const isMobile = () => parseFloat(window.getComputedStyle(body).width) < 700

const animationType = (heading) => {
    if (heading === "reviewers") return "grow-up 500ms ease forwards"
    if (heading === "values") return "zoom-in 1000ms ease forwards"
}


let headingsCallback = (entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            const {value} = entry.target.classList
            entry.target.style.animation = animationType(value)
        }
    })
}

let headingsObserver = new IntersectionObserver(headingsCallback, options);
headingsObserver.observe(document.querySelector(".values"))


const valueCardCallback = (entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting === true) {
            entry.target.children[0].style.animation = "slide-from-left 1000ms ease forwards"
            entry.target.children[1].style.animation = "slide-from-right 1000ms ease forwards 1200ms"
        }
    })
}

const valueCards = Array.from(document.querySelectorAll(".introduction--card"))
const valueCard = new IntersectionObserver(valueCardCallback, options2)
valueCards.forEach(card => valueCard.observe(card))


const testimonialCallback = (entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            if(!isMobile()) {
                testimonialCards.forEach((card, i) => {
                    card.style.animation = `fade-in 1000ms ease forwards ${i * 500 + 100}ms`
                })
            } else {
                entry.target.style.animation = "fade-in 1000ms ease forwards"
            }
        }
    }) 
}


const testimonials = document.querySelector(".testimonials")
const testimonialCards = Array.from(testimonials.children)
const testimonialHeader = document.querySelector("h1.reviewers")

const testimonialsObeserver = new IntersectionObserver(testimonialCallback, options2)

testimonialsObeserver.observe(testimonials)
headingsObserver.observe(testimonialHeader)
testimonialCards.forEach(card => {
    testimonialsObeserver.observe(card)
})
