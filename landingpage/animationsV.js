

let tl = gsap.timeline({
    repeat: 0,
})

tl.to('.img-centro', {
    delay: 1,
    duration: 0.5,
    scale: 0.6,
    y: -100,
})
console.log(document.querySelector('.img-centro'));