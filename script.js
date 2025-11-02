// ============================================
// THREE-BODY PROBLEM SIMULATOR
// ============================================

// ============================================
// PHYSICS ENGINE
// ============================================

class Body {
    constructor(x, y, vx, vy, mass, color, name) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.mass = mass;
        this.color = color;
        this.name = name;
        this.trail = [];
        this.ax = 0;
        this.ay = 0;
    }

    addTrailPoint() {
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > simulation.trailLength) {
            this.trail.shift();
        }
    }

    clearTrail() {
        this.trail = [];
    }
}

class Simulation {
    constructor() {
        this.bodies = [];
        this.time = 0;
        this.dt = 0.001; // Time step for integration
        this.G = 1; // Gravitational constant (normalized)
        this.paused = true;
        this.speed = 1.0;
        this.trailLength = 500;
        this.showTrails = true;
        this.showVelocity = false;
        this.followCenterOfMass = true;
        this.initialEnergy = 0;
    }

    addBody(x, y, vx, vy, mass, color, name) {
        this.bodies.push(new Body(x, y, vx, vy, mass, color, name));
    }

    clearBodies() {
        this.bodies = [];
        this.time = 0;
    }

    calculateAccelerations() {
        // Reset accelerations
        for (let body of this.bodies) {
            body.ax = 0;
            body.ay = 0;
        }

        // Calculate gravitational forces between all pairs
        for (let i = 0; i < this.bodies.length; i++) {
            for (let j = i + 1; j < this.bodies.length; j++) {
                const body1 = this.bodies[i];
                const body2 = this.bodies[j];

                const dx = body2.x - body1.x;
                const dy = body2.y - body1.y;
                const distSq = dx * dx + dy * dy;
                const dist = Math.sqrt(distSq);

                // Softening parameter to avoid singularities
                const softening = 0.01;
                const force = (this.G * body1.mass * body2.mass) / (distSq + softening * softening);

                const fx = force * dx / dist;
                const fy = force * dy / dist;

                // Apply force to both bodies (Newton's third law)
                body1.ax += fx / body1.mass;
                body1.ay += fy / body1.mass;
                body2.ax -= fx / body2.mass;
                body2.ay -= fy / body2.mass;
            }
        }
    }

    // Runge-Kutta 4th order integration method
    step() {
        const bodies = this.bodies;
        const n = bodies.length;
        
        // Store initial states
        const initialStates = bodies.map(b => ({
            x: b.x, y: b.y, vx: b.vx, vy: b.vy
        }));

        // k1
        this.calculateAccelerations();
        const k1 = bodies.map(b => ({
            vx: b.vx, vy: b.vy, ax: b.ax, ay: b.ay
        }));

        // k2
        for (let i = 0; i < n; i++) {
            bodies[i].x = initialStates[i].x + k1[i].vx * this.dt / 2;
            bodies[i].y = initialStates[i].y + k1[i].vy * this.dt / 2;
            bodies[i].vx = initialStates[i].vx + k1[i].ax * this.dt / 2;
            bodies[i].vy = initialStates[i].vy + k1[i].ay * this.dt / 2;
        }
        this.calculateAccelerations();
        const k2 = bodies.map(b => ({
            vx: b.vx, vy: b.vy, ax: b.ax, ay: b.ay
        }));

        // k3
        for (let i = 0; i < n; i++) {
            bodies[i].x = initialStates[i].x + k2[i].vx * this.dt / 2;
            bodies[i].y = initialStates[i].y + k2[i].vy * this.dt / 2;
            bodies[i].vx = initialStates[i].vx + k2[i].ax * this.dt / 2;
            bodies[i].vy = initialStates[i].vy + k2[i].ay * this.dt / 2;
        }
        this.calculateAccelerations();
        const k3 = bodies.map(b => ({
            vx: b.vx, vy: b.vy, ax: b.ax, ay: b.ay
        }));

        // k4
        for (let i = 0; i < n; i++) {
            bodies[i].x = initialStates[i].x + k3[i].vx * this.dt;
            bodies[i].y = initialStates[i].y + k3[i].vy * this.dt;
            bodies[i].vx = initialStates[i].vx + k3[i].ax * this.dt;
            bodies[i].vy = initialStates[i].vy + k3[i].ay * this.dt;
        }
        this.calculateAccelerations();
        const k4 = bodies.map(b => ({
            vx: b.vx, vy: b.vy, ax: b.ax, ay: b.ay
        }));

        // Final update using weighted average
        for (let i = 0; i < n; i++) {
            bodies[i].x = initialStates[i].x + (k1[i].vx + 2*k2[i].vx + 2*k3[i].vx + k4[i].vx) * this.dt / 6;
            bodies[i].y = initialStates[i].y + (k1[i].vy + 2*k2[i].vy + 2*k3[i].vy + k4[i].vy) * this.dt / 6;
            bodies[i].vx = initialStates[i].vx + (k1[i].ax + 2*k2[i].ax + 2*k3[i].ax + k4[i].ax) * this.dt / 6;
            bodies[i].vy = initialStates[i].vy + (k1[i].ay + 2*k2[i].ay + 2*k3[i].ay + k4[i].ay) * this.dt / 6;
        }

        this.time += this.dt;
    }

    update() {
        if (this.paused) return;

        const steps = Math.ceil(this.speed * 10);
        for (let i = 0; i < steps; i++) {
            this.step();
        }

        // Update trails
        for (let body of this.bodies) {
            body.addTrailPoint();
        }
    }

    calculateEnergy() {
        let kineticEnergy = 0;
        let potentialEnergy = 0;

        // Calculate kinetic energy
        for (let body of this.bodies) {
            const v2 = body.vx * body.vx + body.vy * body.vy;
            kineticEnergy += 0.5 * body.mass * v2;
        }

        // Calculate potential energy
        for (let i = 0; i < this.bodies.length; i++) {
            for (let j = i + 1; j < this.bodies.length; j++) {
                const body1 = this.bodies[i];
                const body2 = this.bodies[j];
                const dx = body2.x - body1.x;
                const dy = body2.y - body1.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                potentialEnergy -= (this.G * body1.mass * body2.mass) / dist;
            }
        }

        return kineticEnergy + potentialEnergy;
    }

    getCenterOfMass() {
        let totalMass = 0;
        let cx = 0;
        let cy = 0;

        for (let body of this.bodies) {
            cx += body.x * body.mass;
            cy += body.y * body.mass;
            totalMass += body.mass;
        }

        return { x: cx / totalMass, y: cy / totalMass };
    }

    clearTrails() {
        for (let body of this.bodies) {
            body.clearTrail();
        }
    }
}

// ============================================
// PRESET SCENARIOS
// ============================================

const PRESETS = {
    figure8: {
        name: "Figure-8 Orbit",
        description: "Famous stable periodic orbit discovered by Moore (1993). Stable with 4th body mass 0.001-0.01",
        bodies: [
            { x: -1, y: 0, vx: 0.347111, vy: 0.532728, mass: 1, color: '#ff6b6b', name: 'Body 1' },
            { x: 1, y: 0, vx: 0.347111, vy: 0.532728, mass: 1, color: '#4ecdc4', name: 'Body 2' },
            { x: 0, y: 0, vx: -2 * 0.347111, vy: -2 * 0.532728, mass: 1, color: '#ffe66d', name: 'Body 3' }
        ]
    },
    butterflyI: {
        name: "Butterfly-I Orbit",
        description: "Šuvakov-Dmitrašinović (2013). Unstable - sensitive to perturbations",
        bodies: [
            { x: -1, y: 0, vx: 0.306893, vy: 0.125507, mass: 1, color: '#ff6b6b', name: 'Body 1' },
            { x: 1, y: 0, vx: 0.306893, vy: 0.125507, mass: 1, color: '#4ecdc4', name: 'Body 2' },
            { x: 0, y: 0, vx: -2 * 0.306893, vy: -2 * 0.125507, mass: 1, color: '#ffe66d', name: 'Body 3' }
        ]
    },
    butterflyII: {
        name: "Butterfly-II Orbit",
        description: "Šuvakov-Dmitrašinović (2013). Stable with 4th body mass 0.001-0.0019",
        bodies: [
            { x: -1, y: 0, vx: 0.392955, vy: 0.097579, mass: 1, color: '#ff6b6b', name: 'Body 1' },
            { x: 1, y: 0, vx: 0.392955, vy: 0.097579, mass: 1, color: '#4ecdc4', name: 'Body 2' },
            { x: 0, y: 0, vx: -2 * 0.392955, vy: -2 * 0.097579, mass: 1, color: '#ffe66d', name: 'Body 3' }
        ]
    },
    bumblebee: {
        name: "Bumblebee Orbit",
        description: "Šuvakov-Dmitrašinović (2013). Stable with 4th body mass 0.001-0.0031",
        bodies: [
            { x: -1, y: 0, vx: 0.184279, vy: 0.587188, mass: 1, color: '#ff6b6b', name: 'Body 1' },
            { x: 1, y: 0, vx: 0.184279, vy: 0.587188, mass: 1, color: '#4ecdc4', name: 'Body 2' },
            { x: 0, y: 0, vx: -2 * 0.184279, vy: -2 * 0.587188, mass: 1, color: '#ffe66d', name: 'Body 3' }
        ]
    },
    dragonfly: {
        name: "Dragonfly Orbit",
        description: "Šuvakov-Dmitrašinović (2013). Stable with 4th body mass 0.001-0.0021",
        bodies: [
            { x: -1, y: 0, vx: 0.080584, vy: 0.588836, mass: 1, color: '#ff6b6b', name: 'Body 1' },
            { x: 1, y: 0, vx: 0.080584, vy: 0.588836, mass: 1, color: '#4ecdc4', name: 'Body 2' },
            { x: 0, y: 0, vx: -2 * 0.080584, vy: -2 * 0.588836, mass: 1, color: '#ffe66d', name: 'Body 3' }
        ]
    },
    goggles: {
        name: "Goggles Orbit",
        description: "Šuvakov-Dmitrašinović (2013). Unstable - very sensitive to perturbations",
        bodies: [
            { x: -1, y: 0, vx: 0.083300, vy: 0.127889, mass: 1, color: '#ff6b6b', name: 'Body 1' },
            { x: 1, y: 0, vx: 0.083300, vy: 0.127889, mass: 1, color: '#4ecdc4', name: 'Body 2' },
            { x: 0, y: 0, vx: -2 * 0.083300, vy: -2 * 0.127889, mass: 1, color: '#ffe66d', name: 'Body 3' }
        ]
    },
    mothI: {
        name: "Moth-I Orbit",
        description: "Šuvakov-Dmitrašinović (2013). Stable with 4th body mass 0.001-0.0041",
        bodies: [
            { x: -1, y: 0, vx: 0.464445, vy: 0.396060, mass: 1, color: '#ff6b6b', name: 'Body 1' },
            { x: 1, y: 0, vx: 0.464445, vy: 0.396060, mass: 1, color: '#4ecdc4', name: 'Body 2' },
            { x: 0, y: 0, vx: -2 * 0.464445, vy: -2 * 0.396060, mass: 1, color: '#ffe66d', name: 'Body 3' }
        ]
    },
    mothII: {
        name: "Moth-II Orbit",
        description: "Šuvakov-Dmitrašinović (2013). Very unstable - only stable at masses 0.0011, 0.0012",
        bodies: [
            { x: -1, y: 0, vx: 0.439166, vy: 0.452968, mass: 1, color: '#ff6b6b', name: 'Body 1' },
            { x: 1, y: 0, vx: 0.439166, vy: 0.452968, mass: 1, color: '#4ecdc4', name: 'Body 2' },
            { x: 0, y: 0, vx: -2 * 0.439166, vy: -2 * 0.452968, mass: 1, color: '#ffe66d', name: 'Body 3' }
        ]
    },
    lagrange: {
        name: "Lagrange Equilateral Triangle",
        description: "Stable configuration discovered by Lagrange in 1772",
        bodies: [
            { x: 0, y: 0, vx: 0, vy: 0, mass: 3, color: '#ff6b6b', name: 'Body 1' },
            { x: 1.5, y: 0, vx: 0, vy: 0.8, mass: 1, color: '#4ecdc4', name: 'Body 2' },
            { x: 0.75, y: 1.3, vx: -0.7, vy: 0.4, mass: 1, color: '#ffe66d', name: 'Body 3' }
        ]
    },
    binary: {
        name: "Binary System with Planet",
        description: "Two massive stars with a smaller body orbiting",
        bodies: [
            { x: -0.5, y: 0, vx: 0, vy: -0.5, mass: 2, color: '#ff6b6b', name: 'Star 1' },
            { x: 0.5, y: 0, vx: 0, vy: 0.5, mass: 2, color: '#4ecdc4', name: 'Star 2' },
            { x: 0, y: 1.5, vx: 1.2, vy: 0, mass: 0.5, color: '#ffe66d', name: 'Planet' }
        ]
    },
    chaotic: {
        name: "Chaotic System",
        description: "Highly sensitive to initial conditions",
        bodies: [
            { x: 1, y: 0, vx: 0, vy: 0.5, mass: 1, color: '#ff6b6b', name: 'Body 1' },
            { x: -1, y: 0, vx: 0, vy: -0.5, mass: 1, color: '#4ecdc4', name: 'Body 2' },
            { x: 0, y: 1.732, vx: -0.5, vy: 0, mass: 1, color: '#ffe66d', name: 'Body 3' }
        ]
    },
    random: {
        name: "Random Configuration",
        description: "Randomly generated initial conditions",
        generate: () => {
            const bodies = [];
            for (let i = 0; i < 3; i++) {
                const angle = (i / 3) * 2 * Math.PI + Math.random() * 0.5;
                const radius = 0.8 + Math.random() * 0.4;
                const x = radius * Math.cos(angle);
                const y = radius * Math.sin(angle);
                const speed = 0.3 + Math.random() * 0.4;
                const vAngle = angle + Math.PI / 2 + (Math.random() - 0.5) * 0.5;
                const colors = ['#ff6b6b', '#4ecdc4', '#ffe66d'];
                bodies.push({
                    x, y,
                    vx: speed * Math.cos(vAngle),
                    vy: speed * Math.sin(vAngle),
                    mass: 0.8 + Math.random() * 0.4,
                    color: colors[i],
                    name: `Body ${i + 1}`
                });
            }
            return { bodies };
        }
    }
};

// ============================================
// RENDERER
// ============================================

class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.scale = 100;
        this.offsetX = 0;
        this.offsetY = 0;
        this.targetScale = this.scale;
        this.targetOffsetX = 0;
        this.targetOffsetY = 0;
        
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
    }

    clear() {
        this.ctx.fillStyle = '#1e293b';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw grid
        this.drawGrid();
    }

    drawGrid() {
        const ctx = this.ctx;
        const centerX = this.canvas.width / 2 + this.offsetX;
        const centerY = this.canvas.height / 2 + this.offsetY;
        
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        
        const gridSize = this.scale;
        const startX = centerX % gridSize;
        const startY = centerY % gridSize;
        
        // Vertical lines
        for (let x = startX; x < this.canvas.width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, this.canvas.height);
            ctx.stroke();
        }
        
        // Horizontal lines
        for (let y = startY; y < this.canvas.height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(this.canvas.width, y);
            ctx.stroke();
        }
        
        // Draw axes
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 2;
        
        // X axis
        ctx.beginPath();
        ctx.moveTo(0, centerY);
        ctx.lineTo(this.canvas.width, centerY);
        ctx.stroke();
        
        // Y axis
        ctx.beginPath();
        ctx.moveTo(centerX, 0);
        ctx.lineTo(centerX, this.canvas.height);
        ctx.stroke();
    }

    worldToScreen(x, y) {
        return {
            x: this.canvas.width / 2 + x * this.scale + this.offsetX,
            y: this.canvas.height / 2 - y * this.scale + this.offsetY
        };
    }

    screenToWorld(x, y) {
        return {
            x: (x - this.canvas.width / 2 - this.offsetX) / this.scale,
            y: -(y - this.canvas.height / 2 - this.offsetY) / this.scale
        };
    }

    drawBody(body) {
        const pos = this.worldToScreen(body.x, body.y);
        const radius = Math.max(5, Math.sqrt(body.mass) * 8);
        
        const ctx = this.ctx;
        
        // Draw glow
        const gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, radius * 2);
        gradient.addColorStop(0, body.color + '80');
        gradient.addColorStop(1, body.color + '00');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, radius * 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw body
        ctx.fillStyle = body.color;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw border
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    drawTrail(body) {
        if (!simulation.showTrails || body.trail.length < 2) return;
        
        const ctx = this.ctx;
        ctx.strokeStyle = body.color;
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        for (let i = 0; i < body.trail.length; i++) {
            const point = body.trail[i];
            const pos = this.worldToScreen(point.x, point.y);
            
            if (i === 0) {
                ctx.moveTo(pos.x, pos.y);
            } else {
                ctx.lineTo(pos.x, pos.y);
            }
            
            // Fade out older parts of the trail
            const alpha = i / body.trail.length;
            ctx.globalAlpha = alpha * 0.6;
        }
        
        ctx.stroke();
        ctx.globalAlpha = 1.0;
    }

    drawVelocityVector(body) {
        if (!simulation.showVelocity) return;
        
        const pos = this.worldToScreen(body.x, body.y);
        const vel = {
            x: body.vx * this.scale * 0.5,
            y: -body.vy * this.scale * 0.5
        };
        
        const ctx = this.ctx;
        ctx.strokeStyle = body.color;
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        ctx.lineTo(pos.x + vel.x, pos.y + vel.y);
        ctx.stroke();
        
        // Arrow head
        const angle = Math.atan2(vel.y, vel.x);
        const arrowSize = 10;
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(pos.x + vel.x, pos.y + vel.y);
        ctx.lineTo(
            pos.x + vel.x - arrowSize * Math.cos(angle - Math.PI / 6),
            pos.y + vel.y - arrowSize * Math.sin(angle - Math.PI / 6)
        );
        ctx.moveTo(pos.x + vel.x, pos.y + vel.y);
        ctx.lineTo(
            pos.x + vel.x - arrowSize * Math.cos(angle + Math.PI / 6),
            pos.y + vel.y - arrowSize * Math.sin(angle + Math.PI / 6)
        );
        ctx.stroke();
    }

    render() {
        // Smooth camera transitions
        this.scale += (this.targetScale - this.scale) * 0.1;
        this.offsetX += (this.targetOffsetX - this.offsetX) * 0.1;
        this.offsetY += (this.targetOffsetY - this.offsetY) * 0.1;
        
        // Adjust for center of mass
        if (simulation.followCenterOfMass && simulation.bodies.length > 0) {
            const com = simulation.getCenterOfMass();
            const comScreen = this.worldToScreen(com.x, com.y);
            const centerX = this.canvas.width / 2;
            const centerY = this.canvas.height / 2;
            this.targetOffsetX -= (comScreen.x - centerX) * 0.05;
            this.targetOffsetY -= (comScreen.y - centerY) * 0.05;
        }
        
        this.clear();
        
        // Draw trails first
        for (let body of simulation.bodies) {
            this.drawTrail(body);
        }
        
        // Draw bodies
        for (let body of simulation.bodies) {
            this.drawBody(body);
            this.drawVelocityVector(body);
        }
    }

    zoom(delta, mouseX, mouseY) {
        const zoomFactor = 1.1;
        const oldScale = this.targetScale;
        
        if (delta > 0) {
            this.targetScale *= zoomFactor;
        } else {
            this.targetScale /= zoomFactor;
        }
        
        this.targetScale = Math.max(10, Math.min(500, this.targetScale));
        
        // Zoom towards mouse position
        const worldPos = this.screenToWorld(mouseX, mouseY);
        const newScreenPos = this.worldToScreen(worldPos.x, worldPos.y);
        this.targetOffsetX += mouseX - newScreenPos.x;
        this.targetOffsetY += mouseY - newScreenPos.y;
    }

    pan(dx, dy) {
        this.targetOffsetX += dx;
        this.targetOffsetY += dy;
    }
}

// ============================================
// UI CONTROLLER
// ============================================

class UIController {
    constructor() {
        this.setupEventListeners();
        this.lastFrameTime = performance.now();
        this.frameCount = 0;
        this.fps = 60;
        this.customEditorMode = false;
        this.clickPlaceMode = false;
        this.placementStep = 0; // 0 = body1 pos, 1 = body1 vel, 2 = body2 pos, etc.
        this.tempPositions = [];
    }

    setupEventListeners() {
        // Play/Pause button
        document.getElementById('playPauseBtn').addEventListener('click', () => {
            simulation.paused = !simulation.paused;
            this.updatePlayPauseButton();
        });

        // Reset button
        document.getElementById('resetBtn').addEventListener('click', () => {
            this.loadPreset(currentPreset);
        });

        // Clear trails button
        document.getElementById('clearTrailsBtn').addEventListener('click', () => {
            simulation.clearTrails();
        });

        // Speed slider
        const speedSlider = document.getElementById('speedSlider');
        speedSlider.addEventListener('input', (e) => {
            simulation.speed = parseFloat(e.target.value);
            document.getElementById('speedValue').textContent = simulation.speed.toFixed(1);
        });

        // Trail length slider
        const trailSlider = document.getElementById('trailLengthSlider');
        trailSlider.addEventListener('input', (e) => {
            simulation.trailLength = parseInt(e.target.value);
            document.getElementById('trailLengthValue').textContent = simulation.trailLength;
        });

        // Checkboxes
        document.getElementById('showTrailsCheckbox').addEventListener('change', (e) => {
            simulation.showTrails = e.target.checked;
        });

        document.getElementById('showVelocityCheckbox').addEventListener('change', (e) => {
            simulation.showVelocity = e.target.checked;
        });

        document.getElementById('centerOfMassCheckbox').addEventListener('change', (e) => {
            simulation.followCenterOfMass = e.target.checked;
        });

        // Preset buttons
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const preset = btn.getAttribute('data-preset');
                this.loadPreset(preset);
                this.disableCustomEditor();
            });
        });

        // Custom editor toggle
        document.getElementById('toggleEditorBtn').addEventListener('click', () => {
            this.toggleCustomEditor();
        });

        // Apply custom configuration
        document.getElementById('applyCustomBtn').addEventListener('click', () => {
            this.applyCustomConfiguration();
        });

        // Click to place mode
        document.getElementById('clickPlaceBtn').addEventListener('click', () => {
            this.toggleClickPlaceMode();
        });

        // Input change listeners to update in real-time
        const inputs = ['mass1', 'x1', 'y1', 'vx1', 'vy1', 
                       'mass2', 'x2', 'y2', 'vx2', 'vy2',
                       'mass3', 'x3', 'y3', 'vx3', 'vy3'];
        inputs.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('change', () => {
                    if (this.customEditorMode) {
                        this.applyCustomConfiguration();
                    }
                });
            }
        });

        // Canvas mouse interactions
        this.setupCanvasInteractions();
    }

    setupCanvasInteractions() {
        const canvas = renderer.canvas;
        let isDragging = false;
        let lastX, lastY;

        canvas.addEventListener('mousedown', (e) => {
            if (this.clickPlaceMode) {
                this.handleCanvasClick(e);
                return;
            }
            isDragging = true;
            lastX = e.clientX;
            lastY = e.clientY;
        });

        canvas.addEventListener('mousemove', (e) => {
            if (isDragging && !this.clickPlaceMode) {
                const dx = e.clientX - lastX;
                const dy = e.clientY - lastY;
                renderer.pan(dx, dy);
                lastX = e.clientX;
                lastY = e.clientY;
            }
        });

        canvas.addEventListener('mouseup', () => {
            isDragging = false;
        });

        canvas.addEventListener('mouseleave', () => {
            isDragging = false;
        });

        canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            renderer.zoom(e.deltaY, mouseX, mouseY);
        });

        // Touch support
        let touchDistance = 0;
        canvas.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                isDragging = true;
                lastX = e.touches[0].clientX;
                lastY = e.touches[0].clientY;
            } else if (e.touches.length === 2) {
                const dx = e.touches[0].clientX - e.touches[1].clientX;
                const dy = e.touches[0].clientY - e.touches[1].clientY;
                touchDistance = Math.sqrt(dx * dx + dy * dy);
            }
        });

        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (e.touches.length === 1 && isDragging) {
                const dx = e.touches[0].clientX - lastX;
                const dy = e.touches[0].clientY - lastY;
                renderer.pan(dx, dy);
                lastX = e.touches[0].clientX;
                lastY = e.touches[0].clientY;
            } else if (e.touches.length === 2) {
                const dx = e.touches[0].clientX - e.touches[1].clientX;
                const dy = e.touches[0].clientY - e.touches[1].clientY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const delta = distance - touchDistance;
                const centerX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
                const centerY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
                const rect = canvas.getBoundingClientRect();
                renderer.zoom(-delta, centerX - rect.left, centerY - rect.top);
                touchDistance = distance;
            }
        });

        canvas.addEventListener('touchend', () => {
            isDragging = false;
        });
    }

    handleCanvasClick(e) {
        const rect = renderer.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const worldPos = renderer.screenToWorld(mouseX, mouseY);

        if (this.placementStep < 3) {
            // Placing positions
            const bodyNum = this.placementStep + 1;
            document.getElementById(`x${bodyNum}`).value = worldPos.x.toFixed(3);
            document.getElementById(`y${bodyNum}`).value = worldPos.y.toFixed(3);
            this.placementStep++;
            
            if (this.placementStep === 3) {
                // All bodies placed, apply and exit
                this.applyCustomConfiguration();
                this.toggleClickPlaceMode();
                alert('✓ All 3 bodies placed! You can now adjust their velocities and masses, or click Play to start.');
            } else {
                alert(`✓ Body ${bodyNum} placed! Click to place Body ${bodyNum + 1}`);
            }
        }
    }

    toggleCustomEditor() {
        this.customEditorMode = !this.customEditorMode;
        const panel = document.getElementById('customEditorPanel');
        const btn = document.getElementById('toggleEditorBtn');
        
        if (this.customEditorMode) {
            panel.style.display = 'block';
            btn.textContent = '🎨 Disable Custom Mode';
            btn.classList.add('editor-active');
            // Load current values into editor
            this.loadCurrentValuesToEditor();
        } else {
            panel.style.display = 'none';
            btn.textContent = '🎨 Enable Custom Mode';
            btn.classList.remove('editor-active');
            this.disableClickPlaceMode();
        }
    }

    disableCustomEditor() {
        this.customEditorMode = false;
        const panel = document.getElementById('customEditorPanel');
        const btn = document.getElementById('toggleEditorBtn');
        panel.style.display = 'none';
        btn.textContent = '🎨 Enable Custom Mode';
        btn.classList.remove('editor-active');
        this.disableClickPlaceMode();
    }

    toggleClickPlaceMode() {
        this.clickPlaceMode = !this.clickPlaceMode;
        const btn = document.getElementById('clickPlaceBtn');
        const canvas = renderer.canvas;
        
        if (this.clickPlaceMode) {
            canvas.classList.add('click-place-active');
            btn.textContent = '❌ Cancel Placement';
            btn.classList.add('editor-active');
            this.placementStep = 0;
            alert('Click on the canvas to place Body 1');
        } else {
            this.disableClickPlaceMode();
        }
    }

    disableClickPlaceMode() {
        this.clickPlaceMode = false;
        const btn = document.getElementById('clickPlaceBtn');
        const canvas = renderer.canvas;
        canvas.classList.remove('click-place-active');
        btn.textContent = '🖱️ Click to Place Bodies';
        btn.classList.remove('editor-active');
        this.placementStep = 0;
    }

    loadCurrentValuesToEditor() {
        if (simulation.bodies.length >= 3) {
            for (let i = 0; i < 3; i++) {
                const body = simulation.bodies[i];
                const num = i + 1;
                document.getElementById(`mass${num}`).value = body.mass.toFixed(2);
                document.getElementById(`x${num}`).value = body.x.toFixed(3);
                document.getElementById(`y${num}`).value = body.y.toFixed(3);
                document.getElementById(`vx${num}`).value = body.vx.toFixed(3);
                document.getElementById(`vy${num}`).value = body.vy.toFixed(3);
            }
        }
    }

    applyCustomConfiguration() {
        // Read values from inputs
        const bodies = [];
        const colors = ['#ff6b6b', '#4ecdc4', '#ffe66d'];
        
        for (let i = 1; i <= 3; i++) {
            const mass = parseFloat(document.getElementById(`mass${i}`).value) || 1.0;
            const x = parseFloat(document.getElementById(`x${i}`).value) || 0;
            const y = parseFloat(document.getElementById(`y${i}`).value) || 0;
            const vx = parseFloat(document.getElementById(`vx${i}`).value) || 0;
            const vy = parseFloat(document.getElementById(`vy${i}`).value) || 0;
            
            bodies.push({
                x, y, vx, vy, mass,
                color: colors[i - 1],
                name: `Body ${i}`
            });
        }

        // Apply to simulation
        simulation.clearBodies();
        simulation.clearTrails();
        simulation.time = 0;
        simulation.paused = true;
        this.updatePlayPauseButton();

        for (let bodyData of bodies) {
            simulation.addBody(
                bodyData.x, bodyData.y,
                bodyData.vx, bodyData.vy,
                bodyData.mass,
                bodyData.color,
                bodyData.name
            );
        }

        simulation.initialEnergy = simulation.calculateEnergy();
        this.updateBodyConfig();
        
        // Reset camera
        renderer.targetScale = 100;
        renderer.targetOffsetX = 0;
        renderer.targetOffsetY = 0;

        currentPreset = 'custom';
    }

    updatePlayPauseButton() {
        const btn = document.getElementById('playPauseBtn');
        if (simulation.paused) {
            btn.textContent = '▶️ Play';
            btn.classList.remove('active');
        } else {
            btn.textContent = '⏸️ Pause';
            btn.classList.add('active');
        }
    }

    loadPreset(presetName) {
        currentPreset = presetName;
        simulation.clearBodies();
        simulation.clearTrails();
        simulation.time = 0;
        simulation.paused = true;
        this.updatePlayPauseButton();

        let preset = PRESETS[presetName];
        if (presetName === 'random' && preset.generate) {
            preset = preset.generate();
        }

        for (let bodyData of preset.bodies) {
            simulation.addBody(
                bodyData.x, bodyData.y,
                bodyData.vx, bodyData.vy,
                bodyData.mass,
                bodyData.color,
                bodyData.name
            );
        }

        simulation.initialEnergy = simulation.calculateEnergy();
        this.updateBodyConfig();
        
        // Reset camera
        renderer.targetScale = 100;
        renderer.targetOffsetX = 0;
        renderer.targetOffsetY = 0;
    }

    updateBodyConfig() {
        const container = document.getElementById('bodyConfig');
        container.innerHTML = '';

        simulation.bodies.forEach((body, index) => {
            const bodyItem = document.createElement('div');
            bodyItem.className = 'body-item';
            bodyItem.innerHTML = `
                <div class="body-header">
                    <div class="body-color" style="background: ${body.color};"></div>
                    <div class="body-name">${body.name}</div>
                </div>
                <div class="body-properties">
                    <div class="property-row">
                        <span class="property-label">Mass:</span>
                        <span class="property-value">${body.mass.toFixed(2)}</span>
                    </div>
                    <div class="property-row">
                        <span class="property-label">Position:</span>
                        <span class="property-value">(${body.x.toFixed(2)}, ${body.y.toFixed(2)})</span>
                    </div>
                    <div class="property-row">
                        <span class="property-label">Velocity:</span>
                        <span class="property-value">${Math.sqrt(body.vx**2 + body.vy**2).toFixed(2)}</span>
                    </div>
                </div>
            `;
            container.appendChild(bodyItem);
        });
    }

    updateInfo() {
        // Update time display
        document.getElementById('timeDisplay').textContent = simulation.time.toFixed(2);

        // Update energy display
        const energy = simulation.calculateEnergy();
        const energyChange = simulation.initialEnergy !== 0 
            ? ((energy - simulation.initialEnergy) / simulation.initialEnergy * 100).toFixed(2)
            : 0;
        document.getElementById('energyDisplay').textContent = 
            `${energy.toFixed(2)} (Δ${energyChange}%)`;

        // Update FPS
        this.frameCount++;
        const now = performance.now();
        if (now - this.lastFrameTime >= 1000) {
            this.fps = Math.round(this.frameCount * 1000 / (now - this.lastFrameTime));
            document.getElementById('fpsDisplay').textContent = this.fps;
            this.frameCount = 0;
            this.lastFrameTime = now;
        }
    }
}

// ============================================
// MAIN LOOP
// ============================================

let simulation;
let renderer;
let uiController;
let currentPreset = 'figure8';

function init() {
    const canvas = document.getElementById('simulationCanvas');
    simulation = new Simulation();
    renderer = new Renderer(canvas);
    uiController = new UIController();

    // Load initial preset
    uiController.loadPreset('figure8');

    // Start animation loop
    animate();
}

function animate() {
    simulation.update();
    renderer.render();
    uiController.updateInfo();
    requestAnimationFrame(animate);
}

// Start the application when the page loads
window.addEventListener('load', init);
