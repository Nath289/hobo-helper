const NewsHelper = {
    cmds: 'news',
    staff: false,
    group: 'General',
    settings: [
        { key: 'NewsHelper_Filter', label: 'News Archive Filter', default: true },
        { key: 'NewsHelper_TypeButtons', label: 'News Archive Type Buttons', default: true },
        { key: 'NewsHelper_FormatSearch', label: 'Format Search Form', default: true }
    ],
    init: function() {
        const savedSettings = Utils.getSettings();

        if (savedSettings?.NewsHelper_Filter !== false) {
            this.initNewsFilter();
        }

        if (savedSettings?.NewsHelper_TypeButtons !== false) {
            this.initTypeButtons();
        }

        if (savedSettings?.NewsHelper_FormatSearch !== false) {
            this.initSearchForm();
        }
    },

    initSearchForm: function() {
        const urlParams = new URLSearchParams(window.location.search);
        const doParam = urlParams.get('do');
        if (doParam !== 'archive') return;

        const form = document.querySelector('form[name="form1"]');
        if (!form) return;

        form.style.cssText = 'padding: 10px; background: #fdfdfd; border: 1px solid #ccc; border-radius: 4px; display: inline-block; line-height: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);';

        const b = form.querySelector('b');
        if (b && b.textContent.includes('Search')) {
            b.style.display = 'block';
            b.style.marginBottom = '5px';
            b.style.borderBottom = '1px dashed #bbb';
            b.style.paddingBottom = '3px';
            b.style.color = '#444';
        }

        // Convert the loose text nodes into fixed-width spans to enforce alignment
        Array.from(form.childNodes).forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                let text = node.textContent.trim();
                if (text === 'Player ID:' || text === 'News Text:') {
                    let span = document.createElement('span');
                    span.style.display = 'inline-block';
                    span.style.width = '70px';
                    span.textContent = text;
                    form.replaceChild(span, node);
                }
            }
        });

        const textInputs = form.querySelectorAll('input[type="text"]');
        textInputs.forEach(input => {
            input.style.padding = '3px 5px';
            input.style.border = '1px solid #aaa';
            input.style.borderRadius = '3px';
            input.style.marginLeft = '5px';
            input.style.width = '120px';
            input.style.boxSizing = 'border-box';
        });

        const submitBtn = form.querySelector('input[type="submit"]');
        if (submitBtn) {
            submitBtn.className = 'btn';
            submitBtn.style.marginTop = '8px';
            submitBtn.style.width = '100%';
            submitBtn.style.display = 'block';
            submitBtn.style.boxSizing = 'border-box';
        }
    },

    initTypeButtons: function() {
        const urlParams = new URLSearchParams(window.location.search);
        const doParam = urlParams.get('do');
        if (doParam !== 'archive') return;

        const selectElement = document.querySelector('select[name="type"]');
        if (!selectElement) return;

        const container = selectElement.parentElement;
        if (!container) return;

        const options = Array.from(selectElement.querySelectorAll('option'));
        if (options.length === 0) return;

        const buttonWrapper = document.createElement('div');
        buttonWrapper.style.cssText = 'display: flex; flex-wrap: wrap; gap: 4px; justify-content: flex-end; margin-top: 5px;';

        const currentType = urlParams.get('type') || '';

        options.forEach(opt => {
            const btn = document.createElement('button');
            const text = opt.textContent.trim();
            btn.textContent = text;
            btn.className = 'btn';

            // Extract the 'type' value from the URL in the option's value
            let optTypeMatch = opt.value.match(/type=([^&]+)/);
            let optType = optTypeMatch ? optTypeMatch[1] : '';

            // Check if this option is the currently active one
            if (currentType === optType) {
                btn.style.backgroundColor = '#1b9eff';
                btn.style.color = '#fff';
            }

            btn.style.margin = '0';
            btn.style.fontSize = '11px';
            btn.style.padding = '3px 8px';
            btn.style.userSelect = 'none';
            btn.style.webkitUserSelect = 'none';

            btn.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = opt.value;
            });

            buttonWrapper.appendChild(btn);
        });

        // Hide the original strong tag and select
        const strongTag = container.querySelector('strong');
        if (strongTag && strongTag.textContent.includes('View by Type')) {
            strongTag.style.display = 'none';
        }
        selectElement.style.display = 'none';

        // Check if there is a target table to place the buttons above
        let targetTable = Array.from(document.querySelectorAll('table')).find(t => t.querySelector('tr[bgcolor="#F3F3F3"]'));

        if (targetTable) {
            buttonWrapper.style.justifyContent = 'center';
            buttonWrapper.style.marginBottom = '10px';
            targetTable.parentNode.insertBefore(buttonWrapper, targetTable);
        } else {
            container.appendChild(buttonWrapper);
        }
    },

    initNewsFilter: function() {
        const urlParams = new URLSearchParams(window.location.search);
        const doParam = urlParams.get('do');
        if (doParam !== 'archive') return;

        // Find the main news content table natively using the known row background colors
        let targetTable = Array.from(document.querySelectorAll('table')).find(t => t.querySelector('tr[bgcolor="#F3F3F3"]'));

        if (!targetTable) return;

        const rows = Array.from(targetTable.querySelectorAll('tr')).filter(r => {
            return r.getAttribute('bgcolor') === '#F3F3F3' || r.querySelector('input[type="checkbox"]');
        });

        if (rows.length === 0) return;

        const filterContainer = document.createElement('div');
        filterContainer.style.cssText = 'margin: 10px 0; padding: 10px; background: #f0f5ff; border: 1px solid #cce0ff; border-radius: 4px; display: flex; flex-wrap: wrap; align-items: center; justify-content: flex-start; gap: 10px;';

        const label = document.createElement('span');
        label.style.fontWeight = 'bold';
        label.textContent = 'Filter News:';
        filterContainer.appendChild(label);

        const textInput = document.createElement('input');
        textInput.type = 'text';
        textInput.placeholder = 'Type to filter news...';
        textInput.style.cssText = 'padding: 3px 6px; font-size: 13px; border: 1px solid #ccc; border-radius: 3px; flex-grow: 1; max-width: 300px;';

        const updateFilters = () => {
            const query = textInput.value.trim().toLowerCase();
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                if (query === '' || text.includes(query)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        };

        textInput.addEventListener('input', updateFilters);
        filterContainer.appendChild(textInput);

        const clearBtn = document.createElement('button');
        clearBtn.textContent = 'Clear';
        clearBtn.className = 'btn';
        clearBtn.style.margin = '0';
        clearBtn.style.userSelect = 'none';
        clearBtn.style.webkitUserSelect = 'none';
        clearBtn.addEventListener('click', (e) => {
            e.preventDefault();
            textInput.value = '';
            updateFilters();
        });
        filterContainer.appendChild(clearBtn);

        targetTable.parentNode.insertBefore(filterContainer, targetTable);
    }
};
