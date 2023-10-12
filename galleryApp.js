// Import the createModal function from an external module
import createModal from './createModal.js'
// Call the createModal function to create the modal element
createModal();

// Global variables for selecting elements
const modalableImages = document.querySelectorAll('[data-modal="true"]');
const modalContainer = document.querySelector('.modal-container');
const modalTrack = document.querySelector('.modal__image-container');
const indicatorContainer = document.querySelector('.modal__indicator-container');
// Variables for managing galleries
// all galleries shared
let transitionSpeed;
let galleries;
// for each gallery
let modalImages;
let modalIndicators;
let currentIndex;
let lastIndex;
let isMoving = false;

// Class to manage the modal
class Modal {
    constructor(modal) {
      this.modal = modal;
      this.attachEventListeners();
    }
  
    openModal() {
      this.disableBodyScroll();
      this.modal.removeAttribute('hidden');
      this.modal.classList.add('active');
    }
  
    closeModal() {
      this.enableBodyScroll();
      modalTrack.style.transition = 'none';
      isMoving = false;
      this.modal.setAttribute('hidden', 'true');
      this.modal.classList.remove('active');
    }
  
    attachEventListeners() {
      this.modal.addEventListener('click', (e) => {
        e.target === e.currentTarget || e.target.classList.contains('modal__close')
          ? this.closeModal()
          : null;
      });
    }
  
    disableBodyScroll() {
      const body = document.body;
      body.classList.add('modal-open');
    }
  
    enableBodyScroll() {
      const body = document.body;
      body.classList.remove('modal-open');
    }
  }
// Create an instance of the Modal class 
  const modal = new Modal(modalContainer);
  
// Function to update the active indicator in the modal
function showActiveIndicator(){
  modalIndicators.forEach((i) => i.classList.remove('active'));
  switch(currentIndex){
    case 0:
      modalIndicators[modalIndicators.length - 1].classList.add('active');
      break;
    case lastIndex - 1:
      modalIndicators[0].classList.add('active');
      break;
    default:
      modalIndicators.find((i) => i.dataset.index == currentIndex - 1).classList.add('active');
      break;
  }
}
// Function to move the image gallery within the modal
function moveGallery(){
  modalTrack.style.transform = `translateX(${currentIndex * -100}%)`;
  showActiveIndicator();
}
// Function to add images and indicators to the gallery
function addImagesAndIndicatorsToGallery(arrayOfImages){
  // add images to Gallery 
  modalTrack.innerHTML = [arrayOfImages[arrayOfImages.length -1],...arrayOfImages, arrayOfImages[0]]
  .map((img) => `<img class="modal__image" src="${img.src}" alt="${img.alt}">`).join('')
  // add indicators to Gallery
  indicatorContainer.innerHTML = arrayOfImages.map((i, index) => `<button class="modal__indicator" data-index="${index}"></button>`).join('');
  // return both for destructuring
  return [[...document.querySelectorAll('.modal__image')], [...document.querySelectorAll('.modal__indicator')]];
}
// Function to update the gallery when a gallery button is clicked
function updateGallery(galleryImages){
  [modalImages, modalIndicators] = addImagesAndIndicatorsToGallery(galleryImages);
  currentIndex = 1;
  lastIndex = modalImages.length;
  moveGallery();
}

// Event listeners for opening galleries
function attachOpenGalleryEventListeners(){
  modalableImages.forEach((btn) => {
    btn.addEventListener('mouseenter', () => {
      updateGallery(galleries.find((g) => g.name === btn.dataset.gallery).images)
    })
    btn.addEventListener('click', () => {
      updateGallery(galleries.find((g) => g.name === btn.dataset.gallery).images)
      modal.openModal();
    })
  })
}
// Event listeners for navigating between images
function attachArrowEventListeners(){
  document.querySelectorAll('.modal__arrow').forEach((arrow) => arrow.addEventListener('click', (e) => {
    if(isMoving === true){return};
    isMoving = true;
    modalTrack.style.transition = `transform ${transitionSpeed}ms cubic-bezier(0.82, 0.02, 0.39, 1.01)`;
    e.target.id === 'right' ? currentIndex++ : currentIndex--;
    moveGallery();
  }))
}
// Event listeners for clicking on indicators
function attachIndicatorEventListeners(){
  indicatorContainer.addEventListener('click', (e) => {
    if(e.currentTarget === e.target){return}
    if(isMoving === true){return};
    isMoving = true;
    modalTrack.style.transition = `transform ${transitionSpeed}ms cubic-bezier(0.82, 0.02, 0.39, 1.01)`;
    currentIndex = Number(e.target.dataset.index) + 1;
    moveGallery();
  })
}
// Event listener for the end of transition (image change)
function attachTransitionEndListener() {
  modalTrack.addEventListener('transitionend', () => {
    isMoving = false;
    console.log(currentIndex);
    if(currentIndex === 0){
      modalTrack.style.transition = 'none';
      currentIndex = lastIndex - 2;
      moveGallery();
    }
    if(currentIndex === lastIndex - 1){
      modalTrack.style.transition = 'none';
      currentIndex = 1;
      moveGallery();
    }
  })
}
// Event listener to close the modal on pressing the Escape key
window.addEventListener('keyup', (e) => {
  if(e.key === "Escape" && modalContainer.classList.contains('active')){
    modal.closeModal();
  }
})

// Export an async function to initialize the gallery
export default async function initGallery(endpoint, options) {
    await fetch(endpoint)
    .then((response) => {
      if (!response.ok) {
      throw new Error('La réponse du réseau n\'était pas valide');
      }
      return response.json();
    })
    .then((data) => {
      galleries = data;
      [modalImages, modalIndicators] = addImagesAndIndicatorsToGallery(
        data.map((gallery) => gallery.images[0]));
      transitionSpeed = options?.speed || 250;
      attachOpenGalleryEventListeners();
      attachArrowEventListeners();
      attachIndicatorEventListeners();
      attachTransitionEndListener();
    })
    .catch((error) => {
      console.error('Cela indique généralement un problème avec votre opération de récupération :', error);
    });
  }


















