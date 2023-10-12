// menu burger toggle
let menuIcon = document.querySelector(".menu-icon");
let navlist = document.querySelector(".navlist")
menuIcon.addEventListener("click",()=>{
    menuIcon.classList.toggle("active");
    navlist.classList.toggle("active");
    document.body.classList.toggle("open");
});

// remove navlist
navlist.addEventListener("click",()=>{
    navlist.classList.remove("active");
    menuIcon.classList.remove("active");
    document.body.classList.remove("open");
});

// portfolio filter with mixitup 

var mixer = mixitup('.skills-gallery',{
    selectors: {
        target: '.skills-box'
    },
    animation: {
        duration: 500
    }
});

// Initialize swiper js 

var swiper = new Swiper(".mySwiper", {
    slidesPerView: 1,
    spaceBetween: 30,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    autoplay:{
        delay:3000,
        disableOnInteraction:false,
    },

    breakpoints: {
        576:{
            slidesPerView:2,
            spaceBetween:10,
        },
        1200:{
            slidesPerView:3,
            spaceBetween:20,
        },
    }
  });

// side progress bar 

let calcScrollValue = ()=>{
    let scrollProgress = document.getElementById("progress");
    let pos = document.documentElement.scrollTop;

    let calcHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    let scrollValue = Math.round((pos * 100)/calcHeight);
    
    if(pos > 100){
        scrollProgress.style.display = "grid";
    }else{
        scrollProgress.style.display = "none";
    }

    scrollProgress.addEventListener("click",()=>{
        document.documentElement.scrollTop = 0;
    });

    scrollProgress.style.background = `conic-gradient(#fff ${scrollValue}%,#5EC4BC ${scrollValue}%)`;
};

window.onscroll = calcScrollValue;
window.onload = calcScrollValue;


// active menu 

let menuLi = document.querySelectorAll("header ul li a");
let section = document.querySelectorAll('section');

function activeMenu() {
    const currentPosition = window.scrollY + 97;
    
   // Iterate through the sections to find the first visible section
    let activeSectionIndex = -1;
    section.forEach((sec, index) => {
        if (currentPosition >= sec.offsetTop) {
            activeSectionIndex = index;
        }
    });
    // Add the "active" class to the corresponding menu element
    menuLi.forEach((sec) => sec.classList.remove("active"));
    if (activeSectionIndex >= 0) {
        menuLi[activeSectionIndex].classList.add("active");
    }
}
activeMenu();
window.addEventListener("scroll",activeMenu);