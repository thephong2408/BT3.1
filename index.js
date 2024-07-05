// Function to fetch random dog images and update elements
async function fetchRandomDogImages() {
  try {
    const responses = await Promise.all([
      fetch("https://dog.ceo/api/breeds/image/random"),
      fetch("https://dog.ceo/api/breeds/image/random"),
      fetch("https://dog.ceo/api/breeds/image/random"),
    ]);

    const data = await Promise.all(
      responses.map((response) => response.json())
    );

    const [activeData, nextData, prevData] = data;

    // Update active item
    updateBackground(".item.active", activeData.message);

    // Update next item
    updateBackground(".item.next", nextData.message);

    // Update previous item
    updateBackground(".item.prev", prevData.message);

    // Update items background
    if (items) {
      items.style.backgroundImage = `url('${activeData.message}')`;
    } else {
      console.error('Element with class "items" not found');
    }
  } catch (error) {
    console.error("Error fetching random dog images:", error);
  }
}

// Function to update background image of specified element
function updateBackground(selector, imageUrl) {
  const element = document.querySelector(selector);
  if (element) {
    element.style.backgroundImage = `url('${imageUrl}')`;
  } else {
    console.error(`Element with selector "${selector}" not found`);
  }
}

// Initial fetch and update
fetchRandomDogImages();

// Selecting elements
const slides = document.querySelectorAll(".item");
const items = document.querySelector(".items");
const buttons = document.querySelectorAll(".button");
let current = 0;

// Event listeners for buttons
buttons.forEach((button, index) => {
  button.addEventListener("click", () => {
    if (index === 0) {
      gotoPrev();
    } else {
      gotoNext();
    }
  });
});

// Function to navigate to previous slide
const gotoPrev = () => {
  current = (current - 1 + slides.length) % slides.length;
  updateSlideClasses();
};

// Function to navigate to next slide
const gotoNext = () => {
  current = (current + 1) % slides.length;
  updateSlideClasses();
};

// Function to update slide classes based on current index
const updateSlideClasses = () => {
  slides.forEach((slide, index) => {
    slide.classList.remove("active", "prev", "next");

    // Xóa các thẻ box__left và box__right cũ nếu có
    const existingBoxLeft = slide.querySelector(".box__left");
    if (existingBoxLeft) {
      existingBoxLeft.remove();
    }
    const existingBoxRight = slide.querySelector(".box__right");
    if (existingBoxRight) {
      existingBoxRight.remove();
    }

    // Reset transform style
    slide.style.transform = "";

    if (index === current) {
      slide.classList.add("active");

      // Tạo và thêm các phần tử box__left và box__right mới
      const boxLeft = document.createElement("div");
      boxLeft.className = "box__left";
      const boxRight = document.createElement("div");
      boxRight.className = "box__right";
      slide.appendChild(boxLeft);
      slide.appendChild(boxRight);

      // Thêm sự kiện hover cho box__left và box__right
      boxLeft.addEventListener("mouseenter", () => {
        slide.style.transform = "translate(-50%, -50%) rotateY(-20deg)";
      });
      boxLeft.addEventListener("mouseleave", () => {
        slide.style.transform = "";
      });

      boxRight.addEventListener("mouseenter", () => {
        slide.style.transform = "translate(-50%, -50%) rotateY(20deg)";
      });
      boxRight.addEventListener("mouseleave", () => {
        slide.style.transform = "";
      });
    } else if (index === (current - 1 + slides.length) % slides.length) {
      slide.classList.add("prev");
    } else if (index === (current + 1) % slides.length) {
      slide.classList.add("next");
    }
  });

  // Update items background image based on current active slide
  const activeSlide = document.querySelector(".item.active");
  if (activeSlide) {
    const imageUrlSlide = window.getComputedStyle(activeSlide).backgroundImage;
    if (items) {
      items.style.backgroundImage = imageUrlSlide;
    } else {
      console.error('Element with class "items" not found');
    }
  } else {
    console.error('Element with class "item active" not found');
  }
};

// Gọi hàm cập nhật slide ban đầu
updateSlideClasses();
