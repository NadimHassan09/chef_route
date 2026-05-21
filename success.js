(function () {
    const params = new URLSearchParams(window.location.search);
    const total = parseInt(params.get('total'), 10) || 0;
    const el = document.getElementById('successTotal');

    if (el && total) {
        el.textContent = `Amount paid: ${total.toLocaleString('en-US')} L.E`;
    }
})();
