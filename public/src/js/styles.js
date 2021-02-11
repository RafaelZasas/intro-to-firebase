document.addEventListener('DOMContentLoaded', () => {

    // Get all "navbar-burger" elements
    const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

    // Check if there are any navbar burgers
    if ($navbarBurgers.length > 0) {

        // Add a click event on each of them
        $navbarBurgers.forEach(el => {
            el.addEventListener('click', () => {

                // Get the target from the "data-target" attribute
                const target = el.dataset.target;
                const $target = document.getElementById(target);

                // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
                el.classList.toggle('is-active');
                $target.classList.toggle('is-active');

            });
        });
    }

    // DOM elements for the sliders

    const minPriceSlider = document.getElementById("minPriceRangeSlider");
    const minSliderOutput = document.getElementById("minPriceSliderOutput");
    const minPriceLabel = document.getElementById("minPriceLabel");
    if (minSliderOutput) {
        minSliderOutput.innerHTML = `min price: $${minPriceSlider.value}`; // Display the default slider value
    }

    const maxPriceSlider = document.getElementById("maxPriceRangeSlider");
    const maxSliderOutput = document.getElementById("maxPriceSliderOutput");
    const maxPriceLabel =document.getElementById("maxPriceLabel");
    if (maxSliderOutput) {
        maxSliderOutput.innerHTML = `max price: $${maxPriceSlider.value}`; // Display the default slider value
    }

    // Update the current slider value (each time you drag the slider handle)
    if (minPriceSlider) {
        minPriceSlider.oninput = function() {
            let minPrice = this.value
            maxPriceSlider.value =  Math.max(maxPriceSlider.value, minPrice);
            minPriceLabel.innerHTML = '$'+minPrice;
            minSliderOutput.innerHTML = `min price: $${minPrice}`;
        }
    }

    if (maxPriceSlider) {
        maxPriceSlider.oninput = function() {
            let maxPrice = this.value
            maxPriceLabel.innerHTML = '$'+maxPrice
            minPriceSlider.value =  Math.min(minPriceSlider.value, maxPrice);
            maxSliderOutput.innerHTML = `max price: $${this.value}`;
        }
    }
});

/**
 * Triggers the function to repopulate the screen with products filtered by max price
 * @param {String} productType
 * @param {String} value The sliders current value
 * @return {Promise<void>}
 */
 async function filterByMaxPrice (productType, value) { // when user stops slider
     let maxPrice = parseInt(value);
    await getProducts(productType, {
        priceFilter: {maxPrice: maxPrice},
        sortByPrice: {desc: false},
        sortByName: null
    })
}

/**
 * Triggers the function to repopulate the screen with products filtered by max price
 * @param {String} productType
 * @param {String} value The sliders current value
 * @return {Promise<void>}
 */
async function filterByMinPrice (productType, value){ // when user stops slider
    let minPrice = parseInt(value);
    await getProducts(productType, {
        priceFilter: {minPrice: minPrice},
        sortByPrice: {desc: false},
        sortByName: null
    })
}
