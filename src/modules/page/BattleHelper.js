const BattleHelper = {
    cmds: ['battlel', 'fight'],
    settings: [{ key: 'BattleHelper_EnableGraph', label: 'Enable Fight Graph', default: true }],
    init: function() {
        const settings = Utils.getSettings();
        if (settings?.BattleHelper_EnableGraph === false) return;

        const fightDisplay = document.getElementById('fightDisplay');
        const fightDisplayButton = document.getElementById('fightDisplayButton');
        if (!fightDisplay || !fightDisplayButton) return;
        const wrapper = document.createElement('span');
        wrapper.style.marginLeft = '10px';

        const btn = document.createElement('a');
        btn.href = 'javascript:void(0);';
        btn.textContent = 'show graph';

        wrapper.appendChild(document.createTextNode('['));
        wrapper.appendChild(btn);
        wrapper.appendChild(document.createTextNode(']'));

        fightDisplay.parentElement.insertBefore(wrapper, fightDisplay);
        btn.addEventListener('click', () => {
            this.showGraph(fightDisplay);
        });
    },
    showGraph: function(fightDisplay) {
        // Find fighters
        const fighters = [];
        const headerBolds = fightDisplay.parentElement.querySelectorAll('b > a[href*="cmd=player"]');
        headerBolds.forEach(a => {
            let clone = a.cloneNode(true);
            let span = clone.querySelector('span');
            if (span) span.remove();
            // Handle if there's no span, or if there's other tags
            let fName = clone.textContent.trim();
            if(fName && !fighters.includes(fName)) fighters.push(fName);
        });
        // Fallback for NPCs or missing names maybe?
        if (fighters.length < 2) {
            fighters.push('Fighter 1');
            fighters.push('Fighter 2'); // Dummy names if parsing fails
        }
        let hpTracker = { [fighters[0]]: [], [fighters[1]]: [] };
        let dmgTracker = { [fighters[0]]: [], [fighters[1]]: [] };
        let lines = fightDisplay.innerHTML.split(/<br\s*\/?>/i);
        const getRecipient = (htmlLine, fighters) => {
            let div = document.createElement('div');
            div.innerHTML = htmlLine;
            let plain = div.textContent;
            let parenIdx = plain.indexOf('(');
            if (parenIdx === -1) parenIdx = plain.length;
            let maxIdx = -1;
            let rec = null;
            for (let f of fighters) {
                let fIdx = plain.lastIndexOf(f, parenIdx);
                if (fIdx > maxIdx) {
                    maxIdx = fIdx;
                    rec = f;
                }
            }
            return rec;
        };
        lines.forEach(line => {
            let match = line.match(/([\d,]+)(?:<\/font>)?(?:<\/b>)?\s+(?:life(?:\.)?|damage).*?\((?:<font[^>]*>)?([\d,]+)(?:<\/font>)?\s+life\)/i);
            if (match) {
                let change = parseFloat(match[1].replace(/,/g, ''));
                let hp = parseFloat(match[2].replace(/,/g, ''));
                let receiver = getRecipient(line, fighters);
                if (!receiver) {
                    receiver = fighters[0]; // arbitrary fallback
                }
                hpTracker[receiver].push(hp);
                dmgTracker[receiver].push(change);

                let other = receiver === fighters[0] ? fighters[1] : fighters[0];
                let lastOther = hpTracker[other].length > 0 ? hpTracker[other][hpTracker[other].length - 1] : null;
                hpTracker[other].push(lastOther);
                dmgTracker[other].push(0);
            }
        });
        // Clean up nulls at start
        for (let i = 0; i < hpTracker[fighters[0]].length; i++) {
            if (hpTracker[fighters[0]][i] === null) {
                let firstVal = hpTracker[fighters[0]].find(v => v !== null) || 0;
                hpTracker[fighters[0]][i] = firstVal;
            }
            if (hpTracker[fighters[1]][i] === null) {
                let firstVal = hpTracker[fighters[1]].find(v => v !== null) || 0;
                hpTracker[fighters[1]][i] = firstVal;
            }
        }
        this.renderJqPlotPanel(fighters[0], hpTracker[fighters[0]], fighters[1], hpTracker[fighters[1]], dmgTracker[fighters[0]], dmgTracker[fighters[1]]);
    },
    renderJqPlotPanel: function(name1, hp1, name2, hp2, dmg1, dmg2) {
        if (document.getElementById('fightGraphPanel')) {
            document.getElementById('fightGraphPanel').remove();
        }

        const settings = Utils.getSettings();
        let pageWidth = 660; // Default HoboWars width
        if (settings?.DisplayHelper_WidenPage === true) {
            pageWidth = parseInt(settings?.DisplayHelper_PageWidth || 660, 10);
        }
        const panelWidth = pageWidth + 300;
        const canvasWidth = panelWidth - 40;

        const panel = document.createElement('div');
        panel.id = 'fightGraphPanel';
        panel.style.position = 'fixed';
        panel.style.top = '10%';
        panel.style.left = '50%';
        panel.style.transform = 'translate(-50%, 0)';
        panel.style.backgroundColor = '#fff';
        panel.style.border = '2px solid #000';
        panel.style.padding = '10px';
        panel.style.zIndex = '9999';
        panel.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
        panel.style.width = panelWidth + 'px';

        const closeDiv = document.createElement('div');
        closeDiv.style.textAlign = 'right';
        closeDiv.style.marginBottom = '5px';
        const closeBtn = document.createElement('a');
        closeBtn.href = 'javascript:void(0);';
        closeBtn.className = 'btn';
        closeBtn.style.padding = '2px 6px';
        closeBtn.textContent = 'Close';
        closeBtn.onclick = () => panel.remove();
        closeDiv.appendChild(closeBtn);
        panel.appendChild(closeDiv);

        const chartContainer = document.createElement('div');

        const chartDivHP = document.createElement('div');
        chartDivHP.id = 'fightGraphCanvasHP';
        chartDivHP.style.width = canvasWidth + 'px';
        chartDivHP.style.height = '35vh';
        chartDivHP.style.marginBottom = '20px';
        chartContainer.appendChild(chartDivHP);

        const chartDivDmg = document.createElement('div');
        chartDivDmg.id = 'fightGraphCanvasDmg';
        chartDivDmg.style.width = canvasWidth + 'px';
        chartDivDmg.style.height = '35vh';
        chartContainer.appendChild(chartDivDmg);

        panel.appendChild(chartContainer);

        document.body.appendChild(panel);

        const loadScript = (url, callback) => {
            const script = document.createElement('script');
            script.src = url;
            script.type = 'text/javascript';
            script.onload = callback;
            document.head.appendChild(script);
        };

        const drawChart = () => {
            let jqPlotCss = document.createElement('link');
            jqPlotCss.rel = 'stylesheet';
            jqPlotCss.href = '/js/jqplot/jquery.jqplot.min.css';
            document.head.appendChild(jqPlotCss);

            setTimeout(() => {
                if (typeof $ === 'undefined' || !$.jqplot) return;

                $.jqplot('fightGraphCanvasHP', [hp1, hp2], {
                    title: 'Health Remaining',
                    seriesDefaults: {
                        renderer: $.jqplot.BarRenderer,
                        rendererOptions: { barPadding: 2, barMargin: 2 }
                    },
                    axes: {
                        xaxis: { pad: 1.05, label: 'Round' },
                        yaxis: { min: 0, label: 'HP' }
                    },
                    series: [
                        { label: name1, color: '#8888ff' },
                        { label: name2, color: '#ff8888' }
                    ],
                    legend: { show: true, location: 'ne', placement: 'inside' },
                    cursor: { show: true, zoom: true, showTooltip: false }
                });

                $.jqplot('fightGraphCanvasDmg', [dmg2, dmg1], {
                    title: 'Damage Dealt',
                    axes: {
                        xaxis: { pad: 1.05, label: 'Round' },
                        yaxis: { min: 0, label: 'Damage' }
                    },
                    series: [
                        { label: name1, color: 'blue' },
                        { label: name2, color: 'red' }
                    ],
                    legend: { show: true, location: 'ne', placement: 'inside' },
                    cursor: { show: true, zoom: true, showTooltip: false }
                });
            }, 100);
        };

        const ensureDependencies = () => {
            if (typeof $ !== 'undefined' && $.jqplot && $.jqplot.BarRenderer) {
                drawChart();
            } else if (typeof $ !== 'undefined' && $.jqplot) {
                loadScript('/js/jqplot/plugins/jqplot.barRenderer.min.js', () => {
                    drawChart();
                });
            } else {
                loadScript('/js/jqplot/jquery.jqplot.min.js', () => {
                    loadScript('/js/jqplot/plugins/jqplot.cursor.min.js', () => {
                        loadScript('/js/jqplot/plugins/jqplot.barRenderer.min.js', () => {
                            drawChart();
                        });
                    });
                });
            }
        };
        ensureDependencies();
    }
};
