(function () {
    const params = new URLSearchParams(window.location.search);
    const guests = Math.max(1, Math.min(4, parseInt(params.get('guests'), 10) || 1));
    const date = params.get('date') || '';
    const timeSlot = params.get('time') || 'lunch';

    const UNIT_PRICE = 4500;

    function mealLabel(time) {
        return time === 'dinner' ? 'Dinner' : 'Lunch';
    }

    function formatMoney(amount) {
        return `${amount.toLocaleString('en-US')} L.E`;
    }

    function formatHeading(dateStr, time) {
        if (!dateStr) return `Reservation for <span class="receipt-guest-count">${guests}</span> guests`;

        const d = new Date(`${dateStr}T12:00:00`);
        if (Number.isNaN(d.getTime())) {
            return `Reservation for <span class="receipt-guest-count">${guests}</span> guests`;
        }

        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December',
        ];
        const clock = time === 'dinner' ? '8:00 PM' : '2:00 PM';

        return `${days[d.getDay()]} ${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} at ${clock} for <span class="receipt-guest-count">${guests}</span> guests`;
    }

    function buildOrder() {
        const lineTotal = UNIT_PRICE * guests;

        return {
            description: mealLabel(timeSlot),
            quantity: guests,
            unitPrice: UNIT_PRICE,
            lineTotal,
        };
    }

    function render() {
        const heading = document.getElementById('receiptHeading');
        const tableBody = document.getElementById('receiptTableBody');

        if (!heading || !tableBody) return;

        const order = buildOrder();

        heading.innerHTML = formatHeading(date, timeSlot);

        tableBody.innerHTML = `
            <tr>
                <td>${order.description}</td>
                <td>${order.quantity}</td>
                <td>${formatMoney(order.unitPrice)}</td>
                <td>${formatMoney(order.lineTotal)}</td>
            </tr>`;
    }

    function getPaymentParams() {
        const order = buildOrder();
        const paymentParams = new URLSearchParams(window.location.search);
        paymentParams.set('total', String(order.lineTotal));
        return paymentParams;
    }

    document.getElementById('receiptPayBtn')?.addEventListener('click', () => {
        window.location.href = `payment.html?${getPaymentParams().toString()}`;
    });

    if (!params.get('guests') || !params.get('date') || !params.get('time')) {
        window.location.href = 'booking.html';
        return;
    }

    render();
})();
