        const canvas = document.getElementById('simulationCanvas');
        const ctx = canvas.getContext('2d');
        const stats = document.getElementById('stats');
        const startBtn = document.getElementById('startBtn');
        const resetBtn = document.getElementById('resetBtn');
        const spreadRateSlider = document.getElementById('spreadRate');
        const spreadRateValue = document.getElementById('spreadRateValue');
        const factCheckerRateSlider = document.getElementById('factCheckerRate');
        const factCheckerRateValue = document.getElementById('factCheckerRateValue');
        const decayRateSlider = document.getElementById('decayRate');
        const decayRateValue = document.getElementById('decayRateValue');

        let isRunning = false;
        let people = [];
        const numPeople = 2000;
        let spreadRate = 0.5;
        let factCheckerRate = 0.1;
        let decayRate = 0.1;

        class Person {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.hasInfo = false;
                this.isFactChecker = Math.random() < factCheckerRate;
                this.hasTruth = false;
                this.connections = [];
                this.infoStrength = 0;
                this.truthStrength = 0;
            }

            spread() {
                if (this.hasInfo && !this.isFactChecker) {
                    this.connections.forEach(person => {
                        if (!person.hasTruth && Math.random() < spreadRate * this.infoStrength) {
                            if (person.isFactChecker) {
                                person.hasTruth = true;
                                person.truthStrength = 1;
                                person.hasInfo = false;
                                person.infoStrength = 0;
                            } else {
                                person.hasInfo = true;
                                person.infoStrength = 1;
                            }
                        }
                    });
                }
                if (this.hasTruth) {
                    this.connections.forEach(person => {
                        if (Math.random() < spreadRate * 0.1 * this.truthStrength) {
                            person.hasTruth = true;
                            person.truthStrength = 1;
                            person.hasInfo = false;
                            person.infoStrength = 0;
                        }
                    });
                }
            }

            decay() {
                if (this.hasInfo) {
                    this.infoStrength -= decayRate;
                    if (this.infoStrength <= 0) {
                        this.hasInfo = false;
                        this.infoStrength = 0;
                    }
                }
                if (this.hasTruth) {
                    this.truthStrength -= decayRate;
                    if (this.truthStrength <= 0) {
                        this.hasTruth = false;
                        this.truthStrength = 0;
                    }
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
                if (this.isFactChecker) {
                    ctx.fillStyle = this.hasTruth ? `rgba(0, 255, 0, ${this.truthStrength})` : 'yellow';
                } else if (this.hasTruth) {
                    ctx.fillStyle = `rgba(0, 255, 0, ${this.truthStrength})`;
                } else if (this.hasInfo) {
                    ctx.fillStyle = `rgba(255, 0, 0, ${this.infoStrength})`;
                } else {
                    ctx.fillStyle = 'blue';
                }
                ctx.fill();
            }
        }

        function initializePeople() {
            people = [];
            for (let i = 0; i < numPeople; i++) {
                people.push(new Person(Math.random() * canvas.width, Math.random() * canvas.height));
            }

            // Create connections
            people.forEach(person => {
                for (let i = 0; i < 5; i++) {
                    const randomPerson = people[Math.floor(Math.random() * numPeople)];
                    if (randomPerson !== person && !person.connections.includes(randomPerson)) {
                        person.connections.push(randomPerson);
                        randomPerson.connections.push(person);
                    }
                }
            });

            // Seed initial fake news
            const initialInfected = Math.floor(numPeople * 0.01);
            for (let i = 0; i < initialInfected; i++) {
                people[i].hasInfo = true;
                people[i].infoStrength = 1;
            }
        }

        function drawConnections() {
            ctx.strokeStyle = 'rgba(200, 200, 200, 0.1)';
            ctx.beginPath();
            people.forEach(person => {
                person.connections.forEach(connection => {
                    ctx.moveTo(person.x, person.y);
                    ctx.lineTo(connection.x, connection.y);
                });
            });
            ctx.stroke();
        }

        function updateSimulation() {
            people.forEach(person => {
                person.spread();
                person.decay();
            });
        }

        function drawSimulation() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawConnections();
            people.forEach(person => person.draw());
        }

        function updateStats() {
            const informed = people.filter(person => person.hasInfo).length;
            const factCheckers = people.filter(person => person.isFactChecker).length;
            const truthHolders = people.filter(person => person.hasTruth).length;
            stats.innerHTML = `
                People with fake news: ${informed} / ${numPeople} (${(informed / numPeople * 100).toFixed(2)}%)<br>
                Fact checkers: ${factCheckers} / ${numPeople} (${(factCheckers / numPeople * 100).toFixed(2)}%)<br>
                People with truth: ${truthHolders} / ${numPeople} (${(truthHolders / numPeople * 100).toFixed(2)}%)
            `;
        }

        function animate() {
            if (isRunning) {
                updateSimulation();
                drawSimulation();
                updateStats();
            }
            requestAnimationFrame(animate);
        }

        startBtn.addEventListener('click', () => {
            isRunning = !isRunning;
            startBtn.textContent = isRunning ? 'Stop' : 'Start';
        });

        resetBtn.addEventListener('click', () => {
            isRunning = false;
            startBtn.textContent = 'Start';
            initializePeople();
            drawSimulation();
            updateStats();
        });

        spreadRateSlider.addEventListener('input', (e) => {
            spreadRate = e.target.value / 100;
            spreadRateValue.textContent = `${e.target.value}%`;
        });

        factCheckerRateSlider.addEventListener('input', (e) => {
            factCheckerRate = e.target.value / 100;
            factCheckerRateValue.textContent = `${e.target.value}%`;
        });

        decayRateSlider.addEventListener('input', (e) => {
            decayRate = e.target.value / 100;
            decayRateValue.textContent = `${e.target.value}%`;
        });

        initializePeople();
        drawSimulation();
        updateStats();
        animate();
