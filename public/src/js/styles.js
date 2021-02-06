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

    var minPriceSlider = document.getElementById("minPriceRangeSlider");
    var minSliderOutput = document.getElementById("minPriceSliderOutput");
    minSliderOutput.innerHTML = `min price: $${minPriceSlider.value}`; // Display the default slider value

    var maxPriceSlider = document.getElementById("maxPriceRangeSlider");
    var maxSliderOutput = document.getElementById("maxPriceSliderOutput");
    maxSliderOutput.innerHTML = `max price: $${minPriceSlider.value}`; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
    // TODO: Add functions to listen for mouse up -> trigger filter
    minPriceSlider.oninput = function() {
        minSliderOutput.innerHTML = `min price: $${this.value}`;
    }

    maxPriceSlider.oninput = function() {
        maxSliderOutput.innerHTML = `max price: $${this.value}`;
    }

});

