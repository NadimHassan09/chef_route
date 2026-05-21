(function () {
    const params = new URLSearchParams(window.location.search);
    const total = parseInt(params.get('total'), 10) || 0;

    if (!params.get('guests') || !params.get('date') || !params.get('time') || !total) {
        window.location.href = 'booking.html';
        return;
    }

    function formatMoney(amount) {
        return `${amount.toLocaleString('en-US')} L.E`;
    }

    function buildQueryString() {
        return params.toString();
    }

    function updateAmountDisplay() {
        const formatted = formatMoney(total);
        const amountEl = document.getElementById('paymentAmountDisplay');
        const totalLine = document.getElementById('paymentTotalLine');
        if (amountEl) amountEl.textContent = formatted;
        if (totalLine) totalLine.textContent = `Total payment: ${formatted}`;
    }

    function updateCardPreview() {
        const first = document.getElementById('firstName')?.value.trim() || 'YOUR NAME';
        const last = document.getElementById('lastName')?.value.trim() || '';
        const number = document.getElementById('cardNumber')?.value.trim() || '•••• •••• •••• ••••';
        const expiry = document.getElementById('cardExpiry')?.value.trim() || 'MM/YY';

        const holder = document.getElementById('previewCardHolder');
        const num = document.getElementById('previewCardNumber');
        const exp = document.getElementById('previewCardExpiry');

        if (holder) holder.textContent = `${first} ${last}`.trim().toUpperCase() || 'YOUR NAME';
        if (num) num.textContent = number;
        if (exp) exp.textContent = expiry;
    }

    function prefillFromBooking() {
        const name = params.get('name') || '';
        const parts = name.trim().split(/\s+/);
        const firstName = document.getElementById('firstName');
        const lastName = document.getElementById('lastName');
        if (firstName && parts[0]) firstName.value = parts[0];
        if (lastName && parts.length > 1) lastName.value = parts.slice(1).join(' ');
    }

    document.getElementById('paymentCancel')?.addEventListener('click', () => {
        window.location.href = `receipt.html?${buildQueryString()}`;
    });

    document.getElementById('paymentContinue')?.addEventListener('click', () => {
        window.location.href = `success.html?${buildQueryString()}`;
    });

    ['firstName', 'lastName', 'cardNumber', 'cardExpiry'].forEach((id) => {
        document.getElementById(id)?.addEventListener('input', updateCardPreview);
    });

    prefillFromBooking();
    updateAmountDisplay();
    updateCardPreview();
})();
