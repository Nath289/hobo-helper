const SoupKitchenHelper = {
    cmds: 'soup_kitchen',
    init: function() {

        const contentArea = document.querySelector('.content-area');
        if (!contentArea) return;

        const settings = Utils.getSettings();
        if (settings['SoupKitchenHelper'] === false) return;

        const isSoupLine = window.location.search.includes('action=line') ||
                           Array.from(contentArea.querySelectorAll('a')).some(a => a.href.includes('action=bowl'));

        if (isSoupLine) {
            this.initSoupLine();
        }
        else {
            this.initSoupLine();
        }
    },

    initSoupLine: function() {
        const contentArea = document.querySelector('.content-area');
        if (!contentArea) return;

        const hoboAgeDays = localStorage.getItem('hw_helper_hobo_age_days');
        if (hoboAgeDays) {
            this.renderAgeDisplay(contentArea, hoboAgeDays);
        }

        this.renderSoupTable(contentArea);
    },

    renderAgeDisplay: function(contentArea, hoboAgeDays) {
        const ageContainer = document.createElement('div');
        ageContainer.style.cssText = 'margin-top: 15px; margin-bottom: 15px; font-size: 14px; font-weight: bold; text-align: center; color: #333; border: 1px solid #ccc; background: #fdfdfd; padding: 10px; border-radius: 4px; width: 60%; margin-left: auto; margin-right: auto;';
        ageContainer.innerHTML = `Your Hobo is currently <span style="color: #d9534f;">${hoboAgeDays}</span> days old!`;

        const firstLink = contentArea.querySelector('a[href*="action=bowl"]');
        if (firstLink && firstLink.previousElementSibling && firstLink.previousElementSibling.tagName === 'BR') {
            contentArea.insertBefore(ageContainer, firstLink.previousElementSibling);
        } else if (firstLink) {
            contentArea.insertBefore(ageContainer, firstLink);
        } else {
            contentArea.appendChild(ageContainer);
        }
    },

    renderSoupTable: function(contentArea) {
        const soups = [
            { img: 'Beef-Mushroom-Stew.gif', name: 'Beef Mushroom Stew', stats: '+12T<br>+1 Strength', endsIn: [0, 5] },
            { img: 'Texas-Fajita-Soup.gif', name: 'Texas Fajita Soup', stats: '+12T<br>+1 Speed', endsIn: [1, 6] },
            { img: 'Cream-of-Okra-Soup.gif', name: 'Cream of Okra Soup', stats: '+12T<br>+1 Power', endsIn: [2, 7] },
            { img: 'Garlic-Salmon-Bisque.gif', name: 'Garlic Salmon Bisque', stats: '+12T<br>+1 Intelligence', endsIn: [3, 8] },
            { img: 'Beggar%27s-Bouillon.gif', name: "Beggar's Bouillon", stats: '+12T<br>+0.5 Begging', endsIn: [4, 9] }
        ];

        const tableContainer = document.createElement('div');
        tableContainer.style.cssText = 'margin-top: 20px; font-size: 12px; width: 100%; display: flex; justify-content: center;';

        let html = `
            <table style="border-collapse: collapse; background: #fff; border: 1px solid #ccc; width: 80%;">
                <thead>
                    <tr style="background: #e0e0e0; text-align: center;">
                        <th style="padding: 5px; border: 1px solid #ccc;" colspan="2">Soup</th>
                        <th style="padding: 5px; border: 1px solid #ccc;">Stats</th>
                        <th style="padding: 5px; border: 1px solid #ccc;">Age Ends In</th>
                    </tr>
                </thead>
                <tbody>
        `;

        soups.forEach(soup => {
            html += `
                <tr style="background: #fff; text-align: center; border-bottom: 1px solid #eee;">
                    <td style="padding: 5px; border: 1px solid #ccc; width: 40px;">
                        <img src="/images/items/gifs/${soup.img}" width="30" height="30" alt="${soup.name}">
                    </td>
                    <td style="padding: 5px; border: 1px solid #ccc;">${soup.name}</td>
                    <td style="padding: 5px; border: 1px solid #ccc;">${soup.stats}</td>
                    <td style="padding: 5px; border: 1px solid #ccc;">${soup.endsIn.join(' or ')}</td>
                </tr>
            `;
        });

        html += `
                </tbody>
            </table>
        `;

        tableContainer.innerHTML = html;
        contentArea.appendChild(tableContainer);
    }
};

