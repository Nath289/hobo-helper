const FoodHelper = {
    init: function() {
        const settings = Utils.getSettings();
        if (settings?.FoodHelper?.enabled === false) return;

        // Ensure we are either on the food page or living area page
        const urlParams = new URLSearchParams(window.location.search);
        const isFoodMenu = window.location.search.includes('cmd=food');
        const isLivingArea = !urlParams.has('cmd') || window.location.search.includes('cmd=living_area');

        if (!isFoodMenu && !isLivingArea) return;

        this.observeFood();
    },

    observeFood: function() {
        const bindButtons = () => {
            const throwBtn = document.getElementById('throw');
            if (!throwBtn || throwBtn.hasAttribute('data-fh-injected')) return;

            throwBtn.setAttribute('data-fh-injected', 'true');

            // inject "Select Crap" and "Mark as Crap" buttons next to the throw button
            const btnMark = document.createElement('input');
            btnMark.type = 'button';
            btnMark.value = 'Mark as Crap';
            btnMark.style.marginLeft = '10px';
            btnMark.onclick = (e) => {
                e.preventDefault();
                this.markAsCrap(e.target);
            };

            const btnSelect = document.createElement('input');
            btnSelect.type = 'button';
            btnSelect.value = 'Select Crap';
            btnSelect.style.marginLeft = '10px';
            btnSelect.onclick = (e) => {
                e.preventDefault();
                this.selectCrap();
            };

            // Insert after throwBtn (in reverse order because we rely on nextSibling)
            throwBtn.parentNode.insertBefore(btnMark, throwBtn.nextSibling);
            throwBtn.parentNode.insertBefore(btnSelect, throwBtn.nextSibling);
        };

        let timeout = null;
        const observer = new MutationObserver(() => {
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(bindButtons, 250);
        });

        // The UI might be inside a #foodTab container (living area) or the main document body
        const targetNode = document.getElementById('foodTab') ? document.getElementById('foodTab') : document.body;
        if (targetNode) {
            observer.observe(targetNode, { childList: true, subtree: true });
        }

        // Initial run
        bindButtons();
    },

    getFoodNameFromCheckbox: function(checkbox) {
        // The food name is usually in the title of the image within the next <a> element
        const nextLink = checkbox.nextElementSibling;
        if (nextLink && nextLink.tagName === 'A') {
            const img = nextLink.querySelector('img');
            if (img && img.title) {
                return img.title.trim();
            }
            // Fallback: extract text directly
            return nextLink.innerText.trim();
        }
        return null;
    },

    selectCrap: function() {
        const crapList = JSON.parse(localStorage.getItem('hw_helper_food_crap') || '[]');
        const checkboxes = document.querySelectorAll('.checkMe');

        checkboxes.forEach(cb => {
            const foodName = this.getFoodNameFromCheckbox(cb);
            if (foodName && crapList.includes(foodName)) {
                cb.checked = true;
            } else {
                cb.checked = false;
            }
        });
    },

    markAsCrap: function(btn) {
        const checkboxes = document.querySelectorAll('.checkMe');
        const newCrap = [];

        checkboxes.forEach(cb => {
            if (cb.checked) {
                const foodName = this.getFoodNameFromCheckbox(cb);
                if (foodName && !newCrap.includes(foodName)) {
                    newCrap.push(foodName);
                }
            }
        });

        localStorage.setItem('hw_helper_food_crap', JSON.stringify(newCrap));
        if (btn) {
            btn.value = `✅ Marked ${newCrap.length} items`;
            setTimeout(() => { btn.value = 'Mark as Crap'; }, 3000);
        }
    }
};



