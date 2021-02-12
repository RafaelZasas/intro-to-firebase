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
    const maxPriceLabel = document.getElementById("maxPriceLabel");
    if (maxSliderOutput) {
        maxSliderOutput.innerHTML = `max price: $${maxPriceSlider.value}`; // Display the default slider value
    }

    window.filterByPrice = async (productType) => {
        const minPrice = parseInt(minPriceSlider.value)
        const maxPrice = parseInt(maxPriceSlider.value)
        await getProducts(productType, {
            priceFilter: { minPrice, maxPrice }
        })
    }

    // Update the current slider value (each time you drag the slider handle)
    if (minPriceSlider) {
        minPriceSlider.oninput = function() {
            let minPrice = this.value
            maxPriceSlider.value =  Math.max(maxPriceSlider.value, minPrice);
            minPriceLabel.innerHTML = '$'+minPrice;
            maxPriceLabel.innerHTML = '$'+maxPriceSlider.value;
            minSliderOutput.innerHTML = `min price: $${minPrice}`;
        }
    }

    if (maxPriceSlider) {
        maxPriceSlider.oninput = function() {
            let maxPrice = this.value
            minPriceSlider.value =  Math.min(minPriceSlider.value, maxPrice);
            maxPriceLabel.innerHTML = '$'+maxPrice
            minPriceLabel.innerHTML = '$'+minPriceSlider.value
            maxSliderOutput.innerHTML = `max price: $${this.value}`;
        }
    }
});