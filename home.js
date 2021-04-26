let options = {
    root: null,
    rootMargin: "10% 0%",
    threshold: 1

}

let callback = (entries, observer) => {
    entries.forEach(entry => {
        if(entry.isIntersecting === true) {
            entry.target.style.animation = "zoom-in 1000ms ease forwards"
        }
        if(entry.isVisible === false && entry.isIntersecting === false) {
            entry.target.style.animation = ""
        }
    })
}

let observer = new IntersectionObserver(callback, options);




observer.observe(document.querySelector(".values"))