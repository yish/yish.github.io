document.addEventListener('DOMContentLoaded', function() {
    const slider = document.getElementById('slider');
    const image2 = document.getElementById('image2');

    slider.addEventListener('input', function() {
        image2.style.opacity = this.value / 100;
    });
});
