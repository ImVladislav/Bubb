document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('contractModal');
    const buyButton = document.getElementById('buyButton');

    // Show modal
    function showContractModal() {
        modal.style.display = 'block';
        
        // Auto close after 2 seconds
        setTimeout(() => {
            modal.style.display = 'none';
        }, 2000);
    }

    // Copy contract to clipboard
    function copyContract() {
        const contractText = document.querySelector('.contract-text').textContent;
        navigator.clipboard.writeText(contractText)
            .then(() => {
                showContractModal();
            })
            .catch(err => {
                console.error('Failed to copy contract: ', err);
            });
    }

    // Event listener for buy button
    if (buyButton) {
        buyButton.addEventListener('click', (e) => {
            e.preventDefault();
            copyContract();
        });
    }
});
