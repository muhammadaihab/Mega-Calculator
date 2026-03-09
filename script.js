const MODULES = [
    { id: 1, name: "Standard Calculator", emoji: "🔢", section_id: "standard" },
    { id: 2, name: "Scientific Calculator", emoji: "🧮", section_id: "scientific" },
    { id: 3, name: "Age Calculator", emoji: "🎂", section_id: "age" },
    { id: 4, name: "Currency Converter", emoji: "💱", section_id: "currency" },
    { id: 5, name: "Unit Converter", emoji: "📐", section_id: "unit" },
    { id: 6, name: "BMI Calculator", emoji: "📊", section_id: "bmi" },
    { id: 7, name: "Loan / EMI", emoji: "💰", section_id: "loan" },
    { id: 8, name: "Date Calculator", emoji: "📅", section_id: "date" },
    { id: 9, name: "Base Converter", emoji: "🔢", section_id: "base" },
    { id: 10, name: "Expression Solver", emoji: "📝", section_id: "expression" },
    { id: 11, name: "Percentage calc", emoji: "📏", section_id: "percentage" },
    { id: 12, name: "Time Calculator", emoji: "⏱️", section_id: "time" }
];

let activePanelId = 'standard';
let currentResultText = ''; // For global copy button

// Initialize App
function initApp() {
    buildNavigation();
    buildOtherPanels();
    setupThemeToggle();
    setupGlobalCopy();

    // Show initial panel
    showPanel(activePanelId);

    // Keyboard event listeners
    document.addEventListener('keydown', handleKeyboard);
}

function buildNavigation() {
    const sidebar = document.getElementById('sidebar');
    sidebar.innerHTML = '';

    MODULES.forEach(mod => {
        const navBtn = document.createElement('div');
        navBtn.className = 'nav-item';
        if (mod.section_id === activePanelId) navBtn.classList.add('active');
        navBtn.innerHTML = mod.emoji;
        navBtn.setAttribute('data-id', mod.section_id);
        navBtn.setAttribute('data-tooltip', mod.name);

        navBtn.addEventListener('click', () => {
            showPanel(mod.section_id);
            // Mobile: scroll into view smooth
            if (window.innerWidth <= 768) {
                navBtn.scrollIntoView({ behavior: 'smooth', inline: 'center' });
            }
        });

        sidebar.appendChild(navBtn);
    });
}

function buildOtherPanels() {
    const container = document.getElementById('panels-container');

    MODULES.slice(5).forEach(mod => {
        const panel = document.createElement('section');
        panel.className = 'calculator-panel';
        panel.id = mod.section_id;

        let contentHTML = '';

        if (mod.section_id === 'bmi') {
            contentHTML = `
                <div class="input-group">
                    <label>Weight (kg)</label>
                    <input type="number" id="bmi-weight" value="70" oninput="calculateBMI()">
                </div>
                <div class="input-group">
                    <label>Height (cm)</label>
                    <input type="number" id="bmi-height" value="170" oninput="calculateBMI()">
                </div>
                <div class="display-screen" style="text-align: center;">
                    <div class="expression">Your BMI</div>
                    <div class="result" id="bmi-result" style="font-size: 3rem;">24.2</div>
                    <div id="bmi-category" style="margin-top: 10px; font-weight: 600; font-size: 1.2rem; color: var(--bmi-normal);">Normal Weight</div>
                </div>
            `;
        } else if (mod.section_id === 'loan') {
            contentHTML = `
                <div class="input-group">
                    <label>Loan Amount ($)</label>
                    <input type="number" id="loan-amount" value="10000" oninput="calculateLoan()">
                </div>
                <div class="input-group">
                    <label>Interest Rate (% per year)</label>
                    <input type="number" id="loan-rate" value="5" oninput="calculateLoan()">
                </div>
                <div class="input-group">
                    <label>Loan Tenure (Years)</label>
                    <input type="number" id="loan-years" value="5" oninput="calculateLoan()">
                </div>
                <div class="display-screen">
                    <div class="expression">Monthly EMI</div>
                    <div class="result" id="loan-emi" style="color: var(--accent-color);">188.71</div>
                    <hr style="border-color: var(--glass-border); margin: 15px 0;">
                    <div style="display: flex; justify-content: space-between; font-size: 0.9rem;">
                        <span>Total Interest: <br><strong id="loan-interest" style="color: var(--bmi-obese);">1322.74</strong></span>
                        <span>Total Payment: <br><strong id="loan-total">11322.74</strong></span>
                    </div>
                </div>
            `;
        } else if (mod.section_id === 'date') {
            contentHTML = `
                <div style="display: flex; gap: 5px; margin-bottom: 15px;">
                    <button class="unit-tab active" onclick="switchDateTab('diff', this)">Difference</button>
                    <button class="unit-tab" onclick="switchDateTab('add', this)">Add/Subtract</button>
                </div>
                <div id="date-diff-view">
                    <div class="input-group">
                        <label>Start Date</label>
                        <input type="date" id="date-start" onchange="calculateDateDiff()">
                    </div>
                    <div class="input-group">
                        <label>End Date</label>
                        <input type="date" id="date-end" onchange="calculateDateDiff()">
                    </div>
                    <div class="display-screen" style="text-align: left;">
                        <div class="expression">Difference</div>
                        <div class="result" id="date-diff-res" style="font-size: 1.5rem;">0 Days</div>
                    </div>
                </div>
                <div id="date-add-view" style="display: none;">
                    <div class="input-group">
                        <label>Base Date</label>
                        <input type="date" id="date-base" onchange="calculateDateAdd()">
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 15px;">
                        <div class="input-group"><label>Years</label><input type="number" id="date-add-y" value="0" oninput="calculateDateAdd()"></div>
                        <div class="input-group"><label>Months</label><input type="number" id="date-add-m" value="0" oninput="calculateDateAdd()"></div>
                        <div class="input-group"><label>Days</label><input type="number" id="date-add-d" value="0" oninput="calculateDateAdd()"></div>
                    </div>
                    <div class="display-screen" style="text-align: left;">
                        <div class="expression">Result Date</div>
                        <div class="result" id="date-add-res" style="font-size: 1.5rem; color: var(--accent-color);">-</div>
                    </div>
                </div>
            `;
        } else if (mod.section_id === 'base') {
            contentHTML = `
                <div class="input-group">
                    <label>Number</label>
                    <input type="text" id="base-num" value="255" oninput="calculateBase()">
                </div>
                <div style="display: flex; gap: 10px; margin-bottom: 20px;">
                    <div class="input-group" style="flex: 1;">
                        <label>From Base</label>
                        <select id="base-from" onchange="calculateBase()">
                            <option value="2">Binary (2)</option>
                            <option value="8">Octal (8)</option>
                            <option value="10" selected>Decimal (10)</option>
                            <option value="16">Hexadecimal (16)</option>
                        </select>
                    </div>
                    <div class="input-group" style="flex: 1;">
                        <label>To Base</label>
                        <select id="base-to" onchange="calculateBase()">
                            <option value="2">Binary (2)</option>
                            <option value="8">Octal (8)</option>
                            <option value="10">Decimal (10)</option>
                            <option value="16" selected>Hexadecimal (16)</option>
                        </select>
                    </div>
                </div>
                <div class="display-screen" style="text-align: right;">
                    <div class="expression">Converted Base</div>
                    <div class="result" id="base-res" style="font-size: 2rem; color: var(--accent-color);">FF</div>
                </div>
                <div style="font-size: 0.8rem; color: var(--text-muted); text-align: center;">Supports bases 2 through 36.</div>
            `;
        } else if (mod.section_id === 'expression') {
            contentHTML = `
                <div class="input-group">
                    <label>Enter Math Expression</label>
                    <textarea id="expr-input" rows="3" placeholder="e.g. 5 * (10 + 2) / sin(30)" oninput="solveExpression()"></textarea>
                </div>
                <div class="display-screen" style="text-align: right; min-height: 100px; display: flex; flex-direction: column; justify-content: flex-end;">
                    <div class="result" id="expr-res" style="font-size: 2rem; color: var(--accent-color); word-break: break-all;">= 0</div>
                </div>
                <div style="font-size: 0.8rem; color: var(--text-muted);">
                    <strong>Supported:</strong> +, -, *, /, %, ^, sqrt, sin, cos, tan, log, ln, pi, e
                </div>
            `;
        } else if (mod.section_id === 'percentage') {
            contentHTML = `
                <div style="display: flex; gap: 5px; margin-bottom: 15px; overflow-x: auto; padding-bottom: 5px;">
                    <button class="unit-tab active" onclick="switchPercTab(1, this)" style="white-space: nowrap;">X% of Y</button>
                    <button class="unit-tab" onclick="switchPercTab(2, this)" style="white-space: nowrap;">X is what % of Y</button>
                    <button class="unit-tab" onclick="switchPercTab(3, this)" style="white-space: nowrap;">Increase/Decrease</button>
                </div>
                
                <!-- Mode 1 -->
                <div id="perc-m1" style="display: block;">
                    <div style="display: flex; gap: 10px; align-items: center;">
                        <input type="number" id="perc-1-x" placeholder="X" oninput="calcPerc1()" style="width: 80px;">
                        <span>% of</span>
                        <input type="number" id="perc-1-y" placeholder="Y" oninput="calcPerc1()">
                    </div>
                    <div class="display-screen" style="margin-top: 20px;">
                        <div class="result" id="perc-1-res" style="color: var(--accent-color);">0</div>
                    </div>
                </div>

                <!-- Mode 2 -->
                <div id="perc-m2" style="display: none;">
                    <div style="display: flex; gap: 10px; align-items: center;">
                        <input type="number" id="perc-2-x" placeholder="X" oninput="calcPerc2()" style="width: 80px;">
                        <span>is what % of</span>
                        <input type="number" id="perc-2-y" placeholder="Y" oninput="calcPerc2()">
                    </div>
                    <div class="display-screen" style="margin-top: 20px;">
                        <div class="result" id="perc-2-res" style="color: var(--accent-color);">0%</div>
                    </div>
                </div>

                <!-- Mode 3 -->
                <div id="perc-m3" style="display: none;">
                    <div class="input-group">
                        <label>Original Value</label>
                        <input type="number" id="perc-3-v1" placeholder="From" oninput="calcPerc3()">
                    </div>
                    <div class="input-group">
                        <label>New Value</label>
                        <input type="number" id="perc-3-v2" placeholder="To" oninput="calcPerc3()">
                    </div>
                    <div class="display-screen" style="margin-top: 20px;">
                        <div class="result" id="perc-3-res" style="color: var(--accent-color);">0%</div>
                        <div id="perc-3-desc" style="font-size: 0.9rem; color: var(--text-muted);">Change</div>
                    </div>
                </div>
            `;
        } else if (mod.section_id === 'time') {
            contentHTML = `
                <div style="display: flex; gap: 5px; margin-bottom: 15px;">
                    <button class="unit-tab active" onclick="switchTimeTab('clock', this)">World Clock</button>
                    <button class="unit-tab" onclick="switchTimeTab('calc', this)">Time Calc</button>
                </div>
                
                <!-- World Clock -->
                <div id="time-clock-view">
                    <div class="input-group">
                        <label>Select Timezone</label>
                        <select id="time-tz" onchange="updateWorldClock()">
                            <option value="UTC">UTC</option>
                            <option value="America/New_York">New York (EST/EDT)</option>
                            <option value="Europe/London">London (GMT/BST)</option>
                            <option value="Europe/Paris">Paris (CET/CEST)</option>
                            <option value="Asia/Dubai">Dubai (GST)</option>
                            <option value="Asia/Karachi" selected>Karachi (PKT)</option>
                            <option value="Asia/Tokyo">Tokyo (JST)</option>
                            <option value="Australia/Sydney">Sydney (AEST/AEDT)</option>
                        </select>
                    </div>
                    <div class="display-screen" style="text-align: center; padding: 30px;">
                        <div class="expression" id="time-date-disp">YYYY-MM-DD</div>
                        <div class="result" id="time-clock-disp" style="font-size: 3rem; color: var(--accent-color);">00:00:00</div>
                    </div>
                </div>

                <!-- Time Calc -->
                <div id="time-calc-view" style="display: none;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                        <div>
                            <label style="font-size:0.8rem; color:var(--text-muted);">Time 1 (HH:MM:SS)</label>
                            <input type="time" id="time-t1" step="2" oninput="calcTimeDiff()">
                        </div>
                        <div>
                            <label style="font-size:0.8rem; color:var(--text-muted);">Time 2 (HH:MM:SS)</label>
                            <input type="time" id="time-t2" step="2" oninput="calcTimeDiff()">
                        </div>
                    </div>
                    <div class="display-screen" style="margin-top: 20px;">
                        <div class="expression">Difference</div>
                        <div class="result" id="time-diff-disp" style="font-size: 2rem;">0h 0m 0s</div>
                    </div>
                </div>
            `;
        } else {
            contentHTML = `<div style="text-align:center; padding: 40px; color: var(--text-muted);">Coming Soon</div>`;
        }

        panel.innerHTML = `
            <div class="panel-container">
                <div class="panel-header">
                    <h2>${mod.emoji} ${mod.name}</h2>
                </div>
                <div id="${mod.section_id}-content">
                    ${contentHTML}
                </div>
            </div>
        `;
        container.appendChild(panel);
    });

    // Initialize initial values for created panels
    setTimeout(() => {
        if (document.getElementById('date-start')) {
            const today = new Date().toISOString().split("T")[0];
            document.getElementById('date-start').value = today;
            document.getElementById('date-end').value = today;
            document.getElementById('date-base').value = today;
        }
        if (document.getElementById('bmi-weight')) calculateBMI();
        if (document.getElementById('loan-amount')) calculateLoan();
    }, 100);
}

function showPanel(id) {
    // Update active nav
    document.querySelectorAll('.nav-item').forEach(el => {
        el.classList.toggle('active', el.getAttribute('data-id') === id);
    });

    // Update active panel
    document.querySelectorAll('.calculator-panel').forEach(el => {
        el.classList.toggle('active', el.id === id);
    });

    activePanelId = id;
    currentResultText = ''; // Reset copy text when switching
}

function setupThemeToggle() {
    const btn = document.getElementById('theme-toggle');
    btn.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
    });
}

function setupGlobalCopy() {
    const btn = document.getElementById('global-copy-btn');
    btn.addEventListener('click', () => {
        if (currentResultText) {
            navigator.clipboard.writeText(currentResultText).then(() => {
                const originalText = btn.innerHTML;
                btn.innerHTML = '✅ Copied!';
                setTimeout(() => btn.innerHTML = originalText, 2000);
            });
        } else {
            // Try to find a '.result' in active panel
            const activePanel = document.getElementById(activePanelId);
            const resultEl = activePanel.querySelector('.result');
            if (resultEl && resultEl.innerText) {
                navigator.clipboard.writeText(resultEl.innerText).then(() => {
                    const originalText = btn.innerHTML;
                    btn.innerHTML = '✅ Copied!';
                    setTimeout(() => btn.innerHTML = originalText, 2000);
                });
            }
        }
    });
}

// Run
document.addEventListener('DOMContentLoaded', initApp);

// Utility: shake error
function showError(element) {
    element.classList.remove('error-shake');
    void element.offsetWidth; // trigger reflow
    element.classList.add('error-shake');
    setTimeout(() => {
        element.classList.remove('error-shake');
    }, 500);
}

// Utility: set copy result
function setCopyResult(val) {
    currentResultText = val;
}

// --- Standard Calculator Logic ---
let stdExpression = '';

function stdCalc(cmd) {
    const exprEl = document.getElementById('std-expr');
    const resEl = document.getElementById('std-result');

    try {
        if (cmd === 'C') {
            stdExpression = '';
            resEl.innerText = '0';
            exprEl.innerText = '';
        } else if (cmd === 'BACK') {
            stdExpression = stdExpression.slice(0, -1);
        } else if (cmd === '=') {
            if (stdExpression) {
                let finalExpr = stdExpression.replace(/×/g, '*').replace(/−/g, '-').replace(/÷/g, '/');
                const result = Function('"use strict";return (' + finalExpr + ')')();
                const formatted = Number.isInteger(result) ? result : parseFloat(result.toFixed(8));
                resEl.innerText = formatted;
                exprEl.innerText = stdExpression + ' =';
                stdExpression = formatted.toString();
                setCopyResult(formatted.toString());
            }
        } else if (cmd === 'sqrt') {
            stdExpression = `Math.sqrt(${stdExpression || 0})`;
            stdCalc('=');
        } else if (cmd === 'sq') {
            stdExpression = `Math.pow(${stdExpression || 0}, 2)`;
            stdCalc('=');
        } else if (cmd === 'inv') {
            stdExpression = `1/(${stdExpression || 0})`;
            stdCalc('=');
        } else if (cmd === 'plusminus') {
            if (stdExpression.startsWith('-')) stdExpression = stdExpression.substring(1);
            else stdExpression = '-' + stdExpression;
        } else {
            // Append normal chars
            if (cmd === '*') cmd = '×';
            if (cmd === '-') cmd = '−';
            if (cmd === '/') cmd = '÷';
            stdExpression += cmd;
        }

        if (cmd !== '=' && cmd !== 'C') {
            resEl.innerText = stdExpression || '0';
        }
    } catch (e) {
        resEl.innerText = 'Error';
        showError(resEl);
        stdExpression = '';
    }
}

// --- Scientific Calculator Logic ---
let sciExpression = '';
let sciMode = 'DEG'; // DEG or RAD
let memory = 0;

function toggleSciMode() {
    sciMode = sciMode === 'DEG' ? 'RAD' : 'DEG';
    document.getElementById('sci-deg-rad').innerText = sciMode;
}

function factorial(n) {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    let res = 1;
    for (let i = 2; i <= n; i++) res *= i;
    return res;
}

function sciCalc(cmd) {
    const exprEl = document.getElementById('sci-expr');
    const resEl = document.getElementById('sci-result');

    try {
        if (cmd === 'C') {
            sciExpression = '';
            resEl.innerText = '0';
            exprEl.innerText = '';
        } else if (cmd === 'BACK') {
            sciExpression = sciExpression.slice(0, -1);
        } else if (['M+', 'M-', 'MR', 'MC'].includes(cmd)) {
            const currentVal = parseFloat(resEl.innerText) || 0;
            if (cmd === 'M+') memory += currentVal;
            if (cmd === 'M-') memory -= currentVal;
            if (cmd === 'MR') { sciExpression += memory; }
            if (cmd === 'MC') memory = 0;
        } else if (cmd === '=') {
            if (sciExpression) {
                let finalExpr = sciExpression
                    .replace(/×/g, '*')
                    .replace(/−/g, '-')
                    .replace(/÷/g, '/');

                // Parse trigs and constants
                const tokens = {
                    'sin': sciMode === 'DEG' ? '(x => Math.sin(x * Math.PI / 180))' : 'Math.sin',
                    'cos': sciMode === 'DEG' ? '(x => Math.cos(x * Math.PI / 180))' : 'Math.cos',
                    'tan': sciMode === 'DEG' ? '(x => Math.tan(x * Math.PI / 180))' : 'Math.tan',
                    'asin': sciMode === 'DEG' ? '(x => Math.asin(x) * 180 / Math.PI)' : 'Math.asin',
                    'acos': sciMode === 'DEG' ? '(x => Math.acos(x) * 180 / Math.PI)' : 'Math.acos',
                    'atan': sciMode === 'DEG' ? '(x => Math.atan(x) * 180 / Math.PI)' : 'Math.atan',
                    'log': 'Math.log10',
                    'ln': 'Math.log',
                    'sqrt': 'Math.sqrt',
                    'pi': 'Math.PI',
                    'e': 'Math.E',
                    'abs': 'Math.abs'
                };

                for (const [key, val] of Object.entries(tokens)) {
                    // Regex replace whole words
                    finalExpr = finalExpr.replace(new RegExp('\\b' + key + '\\b', 'g'), val);
                }

                // Handle custom operators
                finalExpr = finalExpr.replace(/(\d+|\([^)]+\))\s*mod\s*(\d+|\([^)]+\))/g, '($1 % $2)');
                finalExpr = finalExpr.replace(/(\d+|\([^)]+\))\s*xʸ\s*(\d+|\([^)]+\))/g, 'Math.pow($1, $2)');

                const result = Function('"use strict";return (' + finalExpr + ')')();
                const formatted = Number.isInteger(result) ? result : parseFloat(result.toFixed(8));
                resEl.innerText = formatted;
                exprEl.innerText = sciExpression + ' =';
                sciExpression = formatted.toString();
                setCopyResult(formatted.toString());
            }
        } else if (cmd === 'fact') {
            sciExpression = `factorial(${sciExpression || 0})`;
            sciCalc('=');
        } else if (cmd === 'epower') {
            sciExpression += 'Math.E**';
        } else if (cmd === '10power') {
            sciExpression += '10**';
        } else if (cmd === 'power') {
            sciExpression += ' xʸ '; // special parsing rule handled in =
        } else if (cmd === 'mod') {
            sciExpression += ' mod '; // special parsing rule handled in =
        } else {
            // Append normal chars
            if (cmd === '*') cmd = '×';
            if (cmd === '-') cmd = '−';
            if (cmd === '/') cmd = '÷';
            // Auto-add parens for functions
            const funcs = ['sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'log', 'ln', 'sqrt', 'abs'];
            if (funcs.includes(cmd)) {
                sciExpression += cmd + '(';
            } else {
                sciExpression += cmd;
            }
        }

        if (cmd !== '=' && cmd !== 'C' && !['M+', 'M-', 'MR', 'MC'].includes(cmd)) {
            resEl.innerText = sciExpression || '0';
        }
    } catch (e) {
        resEl.innerText = 'Error';
        showError(resEl);
        sciExpression = '';
    }
}

// --- Keyboard Support ---
function handleKeyboard(e) {
    // Ignore if focus is in an input field (for other calculators)
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

    const key = e.key;
    let mappedCmd = null;

    if (/[0-9\.\+\-\*\/%]/.test(key)) {
        mappedCmd = key;
        // prevent default browser actions for /
        if (key === '/') e.preventDefault();
    } else if (key === 'Enter' || key === '=') {
        mappedCmd = '=';
        e.preventDefault();
    } else if (key === 'Backspace') {
        mappedCmd = 'BACK';
    } else if (key === 'Escape') {
        mappedCmd = 'C';
    }

    if (mappedCmd) {
        if (activePanelId === 'standard') {
            stdCalc(mappedCmd);
        } else if (activePanelId === 'scientific') {
            sciCalc(mappedCmd);
        }
    }
}

// --- Age Calculator Logic ---
let ageInterval;
function calculateAge() {
    const dobInput = document.getElementById('age-dob').value;
    if (!dobInput) return;
    const dob = new Date(dobInput);
    const now = new Date();

    if (dob > now) {
        showError(document.getElementById('age-dob'));
        return;
    }

    // Years, Months, Days
    let years = now.getFullYear() - dob.getFullYear();
    let months = now.getMonth() - dob.getMonth();
    let days = now.getDate() - dob.getDate();

    if (days < 0) {
        months--;
        const tempDate = new Date(now.getFullYear(), now.getMonth(), 0);
        days += tempDate.getDate();
    }
    if (months < 0) {
        years--;
        months += 12;
    }

    document.getElementById('age-ymd').innerText = `${years} Y, ${months} M, ${days} D`;

    // Next Birthday
    let nextBday = new Date(now.getFullYear(), dob.getMonth(), dob.getDate());
    if (nextBday < now || (nextBday.getTime() === now.getTime() && now.getDate() > dob.getDate())) {
        nextBday.setFullYear(now.getFullYear() + 1);
    }
    const diffNext = Math.ceil((nextBday - now) / (1000 * 60 * 60 * 24));
    document.getElementById('age-next').innerText = diffNext === 0 ? "Today! 🎉" : `${diffNext} days`;

    // Day of Week
    const daysArr = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    document.getElementById('age-dow').innerText = daysArr[dob.getDay()];

    // Totals
    const totalMs = now - dob;
    const totalDays = Math.floor(totalMs / (1000 * 60 * 60 * 24));
    const totalHours = Math.floor(totalMs / (1000 * 60 * 60));
    document.getElementById('age-days').innerText = totalDays.toLocaleString();
    document.getElementById('age-hours').innerText = totalHours.toLocaleString();

    // Live minutes ticking
    const updateMins = () => {
        const ms = new Date() - dob;
        document.getElementById('age-mins').innerText = Math.floor(ms / (1000 * 60)).toLocaleString();
    };
    updateMins();
    if (ageInterval) clearInterval(ageInterval);
    ageInterval = setInterval(updateMins, 60000);

    setCopyResult(`Age: ${years}Y ${months}M ${days}D | Next B-Day: ${diffNext} days`);
}

// Set max date for Age calc
document.getElementById('age-dob').max = new Date().toISOString().split("T")[0];

// --- Currency Converter Logic ---
const currencies = [
    { code: "USD", flag: "🇺🇸", rate: 1 },
    { code: "EUR", flag: "🇪🇺", rate: 0.92 },
    { code: "GBP", flag: "🇬🇧", rate: 0.79 },
    { code: "PKR", flag: "🇵🇰", rate: 278.50 },
    { code: "INR", flag: "🇮🇳", rate: 82.90 },
    { code: "JPY", flag: "🇯🇵", rate: 150.20 },
    { code: "AED", flag: "🇦🇪", rate: 3.67 },
    { code: "SAR", flag: "🇸🇦", rate: 3.75 },
    { code: "CAD", flag: "🇨🇦", rate: 1.35 },
    { code: "AUD", flag: "🇦🇺", rate: 1.53 },
    { code: "CHF", flag: "🇨🇭", rate: 0.88 },
    { code: "CNY", flag: "🇨🇳", rate: 7.20 },
    { code: "BDT", flag: "🇧🇩", rate: 109.50 },
    { code: "MYR", flag: "🇲🇾", rate: 4.70 },
    { code: "SGD", flag: "🇸🇬", rate: 1.34 },
    { code: "KWD", flag: "🇰🇼", rate: 0.31 },
    { code: "QAR", flag: "🇶🇦", rate: 3.64 },
    { code: "TRY", flag: "🇹🇷", rate: 31.50 },
    { code: "ZAR", flag: "🇿🇦", rate: 19.10 },
    { code: "BRL", flag: "🇧🇷", rate: 4.97 },
    { code: "MXN", flag: "🇲🇽", rate: 17.05 },
    { code: "RUB", flag: "🇷🇺", rate: 91.50 },
    { code: "KRW", flag: "🇰🇷", rate: 1330.00 },
    { code: "THB", flag: "🇹🇭", rate: 35.80 },
    { code: "IDR", flag: "🇮🇩", rate: 15650.00 },
    { code: "HKD", flag: "🇭🇰", rate: 7.82 },
    { code: "NOK", flag: "🇳🇴", rate: 10.50 },
    { code: "SEK", flag: "🇸🇪", rate: 10.35 },
    { code: "DKK", flag: "🇩🇰", rate: 6.85 },
    { code: "NZD", flag: "🇳🇿", rate: 1.62 }
];

function initCurrency() {
    const fromSelect = document.getElementById('curr-from');
    const toSelect = document.getElementById('curr-to');

    let optionsHTML = currencies.map(c => `<option value="${c.code}">${c.flag} ${c.code}</option>`).join('');
    fromSelect.innerHTML = optionsHTML;
    toSelect.innerHTML = optionsHTML;

    fromSelect.value = 'USD';
    toSelect.value = 'EUR';
}

function calculateCurrency() {
    const amount = parseFloat(document.getElementById('curr-amount').value) || 0;
    const fromCode = document.getElementById('curr-from').value;
    const toCode = document.getElementById('curr-to').value;

    const fromData = currencies.find(c => c.code === fromCode);
    const toData = currencies.find(c => c.code === toCode);

    // Convert to base (USD), then to target
    const baseAmount = amount / fromData.rate;
    const finalAmount = baseAmount * toData.rate;

    document.getElementById('curr-result').innerText = finalAmount.toFixed(2);
    document.getElementById('curr-expr').innerText = `${amount} ${fromCode} =`;
    setCopyResult(`${finalAmount.toFixed(2)} ${toCode}`);

    // Remove shimmer to indicate loaded
    document.getElementById('curr-status').classList.remove('loading-shimmer');
    document.getElementById('curr-status').innerText = 'Rates static';
}

function swapCurrency() {
    const fromSelect = document.getElementById('curr-from');
    const toSelect = document.getElementById('curr-to');
    const temp = fromSelect.value;
    fromSelect.value = toSelect.value;
    toSelect.value = temp;
    calculateCurrency();
}

// --- Unit Converter Logic ---
const unitCategories = {
    Length: {
        base: 'm',
        units: {
            'mm': 0.001, 'cm': 0.01, 'm': 1, 'km': 1000,
            'inch': 0.0254, 'foot': 0.3048, 'yard': 0.9144, 'mile': 1609.34, 'nautical mile': 1852
        }
    },
    Weight: {
        base: 'kg',
        units: {
            'mg': 0.000001, 'g': 0.001, 'kg': 1, 'lb': 0.453592, 'oz': 0.0283495, 'ton (metric)': 1000, 'stone': 6.35029
        }
    },
    Area: {
        base: 'm²',
        units: {
            'mm²': 0.000001, 'cm²': 0.0001, 'm²': 1, 'km²': 1000000, 'ft²': 0.092903, 'yd²': 0.836127, 'acre': 4046.86, 'hectare': 10000
        }
    },
    Volume: {
        base: 'L',
        units: {
            'ml': 0.001, 'cl': 0.01, 'L': 1, 'fl oz': 0.0295735, 'cup': 0.236588, 'pint': 0.473176, 'quart': 0.946353, 'gallon': 3.78541
        }
    },
    Speed: {
        base: 'm/s',
        units: {
            'm/s': 1, 'km/h': 0.277778, 'mph': 0.44704, 'knots': 0.514444, 'ft/s': 0.3048
        }
    },
    Data: {
        base: 'byte',
        units: {
            'bit': 0.125, 'byte': 1, 'KB': 1024, 'MB': 1048576, 'GB': 1073741824, 'TB': 1099511627776, 'PB': 1125899906842624
        }
    },
    Temperature: {
        base: 'Celsius',
        // Specialized conversion functions due to offsets
        special: true,
        units: ['Celsius', 'Fahrenheit', 'Kelvin']
    }
};

let currentUnitCat = 'Length';

function initUnitConverter() {
    const tabsContainer = document.getElementById('unit-tabs');
    tabsContainer.innerHTML = '';

    Object.keys(unitCategories).forEach(cat => {
        const tab = document.createElement('div');
        tab.className = 'unit-tab' + (cat === currentUnitCat ? ' active' : '');
        tab.innerText = cat;
        tab.onclick = () => {
            document.querySelectorAll('.unit-tab').forEach(el => el.classList.remove('active'));
            tab.classList.add('active');
            currentUnitCat = cat;
            populateUnitDropdowns();
        };
        tabsContainer.appendChild(tab);
    });

    populateUnitDropdowns();
}

function populateUnitDropdowns() {
    const sel1 = document.getElementById('unit-type-1');
    const sel2 = document.getElementById('unit-type-2');

    let html = '';
    const catData = unitCategories[currentUnitCat];
    if (catData.special) {
        catData.units.forEach(u => html += `<option value="${u}">${u}</option>`);
    } else {
        Object.keys(catData.units).forEach(u => html += `<option value="${u}">${u}</option>`);
    }

    sel1.innerHTML = html;
    sel2.innerHTML = html;

    // Set different defaults if possible
    if (sel1.options.length > 1) {
        sel1.selectedIndex = 0;
        sel2.selectedIndex = 1;
    }

    calculateUnit(1);
}

// Temperature conversions
function convertTemp(val, from, to) {
    if (from === to) return val;
    let c;
    if (from === 'Celsius') c = val;
    else if (from === 'Fahrenheit') c = (val - 32) * 5 / 9;
    else if (from === 'Kelvin') c = val - 273.15;

    if (to === 'Celsius') return c;
    else if (to === 'Fahrenheit') return c * 9 / 5 + 32;
    else if (to === 'Kelvin') return c + 273.15;
}

function calculateUnit(sourceNum) {
    const targetNum = sourceNum === 1 ? 2 : 1;

    const vSource = parseFloat(document.getElementById(`unit-val-${sourceNum}`).value);
    if (isNaN(vSource)) {
        document.getElementById(`unit-val-${targetNum}`).value = '';
        return;
    }

    const tSource = document.getElementById(`unit-type-${sourceNum}`).value;
    const tTarget = document.getElementById(`unit-type-${targetNum}`).value;

    let result;
    const catData = unitCategories[currentUnitCat];

    if (catData.special) {
        result = convertTemp(vSource, tSource, tTarget);
    } else {
        // to base, then to target
        const baseVal = vSource * catData.units[tSource];
        result = baseVal / catData.units[tTarget];
    }

    // format
    let decimals = 6;
    if (result > 1000) decimals = 2;
    else if (result < 0.001 && result > 0) decimals = 8;

    const formatted = Number.isInteger(result) ? result : parseFloat(result.toFixed(decimals));
    document.getElementById(`unit-val-${targetNum}`).value = formatted;

    setCopyResult(`${formatted} ${tTarget}`);
}

// Initialize the new converters
document.addEventListener('DOMContentLoaded', () => {
    initCurrency();
    initUnitConverter();
});

// --- BMI Calculator Logic ---
function calculateBMI() {
    const weight = parseFloat(document.getElementById('bmi-weight').value);
    const heightCm = parseFloat(document.getElementById('bmi-height').value);

    if (!weight || !heightCm) return;

    const heightM = heightCm / 100;
    const bmi = weight / (heightM * heightM);
    const resultEl = document.getElementById('bmi-result');
    const catEl = document.getElementById('bmi-category');

    resultEl.innerText = bmi.toFixed(1);

    let category = '';
    let colorVar = '';

    if (bmi < 18.5) {
        category = 'Underweight';
        colorVar = 'var(--bmi-under)';
    } else if (bmi >= 18.5 && bmi < 24.9) {
        category = 'Normal Weight';
        colorVar = 'var(--bmi-normal)';
    } else if (bmi >= 25 && bmi < 29.9) {
        category = 'Overweight';
        colorVar = 'var(--bmi-over)';
    } else {
        category = 'Obese';
        colorVar = 'var(--bmi-obese)';
    }

    catEl.innerText = category;
    catEl.style.color = colorVar;

    setCopyResult(`BMI: ${bmi.toFixed(1)} (${category})`);
}

// --- Loan / EMI Calculator Logic ---
function calculateLoan() {
    const amount = parseFloat(document.getElementById('loan-amount').value);
    const rateYear = parseFloat(document.getElementById('loan-rate').value);
    const years = parseFloat(document.getElementById('loan-years').value);

    if (!amount || !rateYear || !years) return;

    const r = (rateYear / 100) / 12; // monthly interest rate
    const n = years * 12; // number of months

    let emi = 0;
    let totalPayment = 0;
    let totalInterest = 0;

    if (r === 0) {
        emi = amount / n;
        totalPayment = amount;
    } else {
        emi = (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        totalPayment = emi * n;
        totalInterest = totalPayment - amount;
    }

    document.getElementById('loan-emi').innerText = emi.toFixed(2);
    document.getElementById('loan-interest').innerText = totalInterest.toFixed(2);
    document.getElementById('loan-total').innerText = totalPayment.toFixed(2);

    setCopyResult(`EMI: $${emi.toFixed(2)}/mo | Total: $${totalPayment.toFixed(2)}`);
}

// --- Date Calculator Logic ---
function switchDateTab(tab, btn) {
    document.querySelectorAll('#date-content .unit-tab').forEach(el => el.classList.remove('active'));
    btn.classList.add('active');

    if (tab === 'diff') {
        document.getElementById('date-diff-view').style.display = 'block';
        document.getElementById('date-add-view').style.display = 'none';
    } else {
        document.getElementById('date-diff-view').style.display = 'none';
        document.getElementById('date-add-view').style.display = 'block';
    }
}

function calculateDateDiff() {
    const start = document.getElementById('date-start').value;
    const end = document.getElementById('date-end').value;

    if (!start || !end) return;

    const d1 = new Date(start);
    const d2 = new Date(end);

    const diffTime = Math.abs(d2 - d1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    document.getElementById('date-diff-res').innerText = `${diffDays} Days`;

    let relStr = d2 > d1 ? 'after' : (d2 < d1 ? 'before' : 'same day');
    if (diffDays === 0) setCopyResult('0 Days difference');
    else setCopyResult(`${diffDays} Days ${relStr}`);
}

function calculateDateAdd() {
    const base = document.getElementById('date-base').value;
    if (!base) return;

    const y = parseInt(document.getElementById('date-add-y').value) || 0;
    const m = parseInt(document.getElementById('date-add-m').value) || 0;
    const d = parseInt(document.getElementById('date-add-d').value) || 0;

    const date = new Date(base);
    date.setFullYear(date.getFullYear() + y);
    date.setMonth(date.getMonth() + m);
    date.setDate(date.getDate() + d);

    const resStr = date.toDateString();
    document.getElementById('date-add-res').innerText = resStr;
    setCopyResult(resStr);
}

// --- Number Base Converter Logic ---
function calculateBase() {
    const numInput = document.getElementById('base-num').value.trim();
    if (!numInput) return;

    const fromBase = parseInt(document.getElementById('base-from').value);
    const toBase = parseInt(document.getElementById('base-to').value);
    const resEl = document.getElementById('base-res');

    try {
        // parseInt interprets the string per fromBase
        const decimalValue = parseInt(numInput, fromBase);

        if (isNaN(decimalValue)) {
            resEl.innerText = "Invalid Inpt";
            showError(resEl);
            return;
        }

        const converted = decimalValue.toString(toBase).toUpperCase();
        resEl.innerText = converted;
        setCopyResult(converted);
    } catch (e) {
        resEl.innerText = "Error";
        showError(resEl);
    }
}

// --- Expression Solver Logic ---
function solveExpression() {
    const input = document.getElementById('expr-input').value;
    const resEl = document.getElementById('expr-res');

    if (!input.trim()) {
        resEl.innerText = "= 0";
        return;
    }

    try {
        let finalExpr = input.toLowerCase()
            .replace(/×/g, '*')
            .replace(/−/g, '-')
            .replace(/÷/g, '/');

        // Regex replace words with Math equivs
        const tokens = {
            'sin': 'Math.sin',
            'cos': 'Math.cos',
            'tan': 'Math.tan',
            'log': 'Math.log10',
            'ln': 'Math.log',
            'sqrt': 'Math.sqrt',
            'pi': 'Math.PI',
            'e': 'Math.E'
        };

        for (const [key, val] of Object.entries(tokens)) {
            finalExpr = finalExpr.replace(new RegExp('\\b' + key + '\\b', 'g'), val);
        }

        finalExpr = finalExpr.replace(/\^/g, '**');

        const result = Function('"use strict";return (' + finalExpr + ')')();

        if (isNaN(result) || !isFinite(result)) {
            resEl.innerText = "= Error";
        } else {
            const formatted = Number.isInteger(result) ? result : parseFloat(result.toFixed(8));
            resEl.innerText = `= ${formatted}`;
            setCopyResult(formatted.toString());
        }
    } catch (e) {
        resEl.innerText = "= ...";
    }
}

// --- Percentage Calculator Logic ---
function switchPercTab(mode, btn) {
    document.querySelectorAll('#percentage-content .unit-tab').forEach(el => el.classList.remove('active'));
    btn.classList.add('active');

    for (let i = 1; i <= 3; i++) {
        document.getElementById(`perc-m${i}`).style.display = (i === mode) ? 'block' : 'none';
    }
}

function calcPerc1() {
    const x = parseFloat(document.getElementById('perc-1-x').value);
    const y = parseFloat(document.getElementById('perc-1-y').value);
    if (isNaN(x) || isNaN(y)) return;
    const res = (x / 100) * y;
    document.getElementById('perc-1-res').innerText = res.toFixed(2);
    setCopyResult(res.toFixed(2));
}

function calcPerc2() {
    const x = parseFloat(document.getElementById('perc-2-x').value);
    const y = parseFloat(document.getElementById('perc-2-y').value);
    if (isNaN(x) || isNaN(y) || y === 0) return;
    const res = (x / y) * 100;
    document.getElementById('perc-2-res').innerText = `${res.toFixed(2)}%`;
    setCopyResult(`${res.toFixed(2)}%`);
}

function calcPerc3() {
    const v1 = parseFloat(document.getElementById('perc-3-v1').value);
    const v2 = parseFloat(document.getElementById('perc-3-v2').value);
    if (isNaN(v1) || isNaN(v2) || v1 === 0) return;
    const diff = v2 - v1;
    const percent = (diff / v1) * 100;

    document.getElementById('perc-3-res').innerText = `${Math.abs(percent).toFixed(2)}%`;
    const descEl = document.getElementById('perc-3-desc');
    descEl.innerText = percent > 0 ? 'Increase' : (percent < 0 ? 'Decrease' : 'No Change');
    descEl.style.color = percent > 0 ? 'var(--bmi-normal)' : (percent < 0 ? 'var(--bmi-obese)' : 'var(--text-muted)');

    setCopyResult(`${Math.abs(percent).toFixed(2)}% ${descEl.innerText}`);
}

// --- Time Calculator Logic ---
let worldClockInterval;

function switchTimeTab(tab, btn) {
    document.querySelectorAll('#time-content .unit-tab').forEach(el => el.classList.remove('active'));
    btn.classList.add('active');

    if (tab === 'clock') {
        document.getElementById('time-clock-view').style.display = 'block';
        document.getElementById('time-calc-view').style.display = 'none';
        updateWorldClock();
    } else {
        document.getElementById('time-clock-view').style.display = 'none';
        document.getElementById('time-calc-view').style.display = 'block';
        if (worldClockInterval) clearInterval(worldClockInterval);
    }
}

function updateWorldClock() {
    const tz = document.getElementById('time-tz').value;

    const tick = () => {
        try {
            const now = new Date();
            const timeStr = now.toLocaleTimeString('en-US', { timeZone: tz, hour12: false });
            const dateStr = now.toLocaleDateString('en-US', { timeZone: tz, year: 'numeric', month: 'long', day: 'numeric' });

            document.getElementById('time-clock-disp').innerText = timeStr;
            document.getElementById('time-date-disp').innerText = dateStr;
            // dont update copy clipboard every second
        } catch (e) {
            console.warn("Timezone error", e);
        }
    };

    tick();
    if (worldClockInterval) clearInterval(worldClockInterval);
    worldClockInterval = setInterval(tick, 1000);
}

function calcTimeDiff() {
    const t1 = document.getElementById('time-t1').value;
    const t2 = document.getElementById('time-t2').value;

    if (!t1 || !t2) return;

    // Create dummy dates to parse time strings easily
    const d1 = new Date(`2000-01-01T${t1}`);
    const d2 = new Date(`2000-01-01T${t2}`);

    let diffMs = d2 - d1;
    // Handle overnight if t2 < t1
    if (diffMs < 0) {
        diffMs += 24 * 60 * 60 * 1000;
    }

    const h = Math.floor(diffMs / 3600000);
    const m = Math.floor((diffMs % 3600000) / 60000);
    const s = Math.floor((diffMs % 60000) / 1000);

    const str = `${h}h ${m}m ${s}s`;
    document.getElementById('time-diff-disp').innerText = str;
    setCopyResult(str);
}
