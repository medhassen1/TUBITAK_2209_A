# 🌌 Three-Body Problem Simulator

A beautiful, interactive web-based simulator for exploring the famous **Three-Body Problem** in physics. Watch as three celestial bodies interact through gravity, creating mesmerizing and chaotic orbital patterns.

![Three-Body Problem](https://img.shields.io/badge/Physics-Simulation-blue)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)
![License](https://img.shields.io/badge/License-MIT-green)

## 🎯 Features

- **Real-time Physics Simulation** - Uses the Runge-Kutta 4th order (RK4) numerical integration method for accurate calculations
- **Interactive Visualization** - Beautiful HTML5 Canvas rendering with trails and glow effects
- **Multiple Preset Scenarios** - Explore famous solutions like the Figure-8 orbit, Butterfly orbit, and Lagrange configurations
- **Full Camera Controls** - Zoom, pan, and follow the center of mass
- **Customizable Settings** - Adjust simulation speed, trail length, and visual preferences
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **Educational** - Real-time display of energy conservation and system properties

## 📚 What is the Three-Body Problem?

The **Three-Body Problem** is a classical physics problem that asks:

> Given three celestial bodies with known initial positions, velocities, and masses, can we predict their future motions as they interact through gravity?

### Key Insights

1. **No General Solution** - Unlike the two-body problem (which has an exact analytical solution), the three-body problem is generally unsolvable with simple formulas.

2. **Chaotic Behavior** - The system exhibits **deterministic chaos**, meaning tiny changes in initial conditions can lead to vastly different outcomes, making long-term predictions impossible.

3. **Historical Significance** - Henri Poincaré proved in the late 1800s that the three-body problem is non-integrable for most initial conditions, which laid the foundation for chaos theory.

4. **Special Solutions** - While no general solution exists, mathematicians have discovered specific initial conditions that produce stable, periodic orbits.

## 🎮 How to Use

### Getting Started

1. **Open the Simulator** - Simply open `index.html` in any modern web browser
2. **No Installation Required** - Pure HTML/CSS/JavaScript, no dependencies!

### Controls

#### Simulation Controls
- **Play/Pause** - Start or stop the simulation
- **Reset** - Return to the initial configuration
- **Clear Trails** - Remove the trajectory trails
- **Speed Slider** - Adjust simulation speed (0.1x to 5x)
- **Trail Length** - Control how long the orbital trails appear

#### Visual Options
- **Show Trails** - Toggle orbital trajectory trails
- **Show Velocity Vectors** - Display velocity direction and magnitude
- **Follow Center of Mass** - Keep the system centered as it evolves

#### Camera Controls
- **Mouse Wheel** - Zoom in/out
- **Click & Drag** - Pan the view
- **Touch Gestures** - Pinch to zoom, drag to pan (mobile)

### Preset Scenarios

#### 🔢 Figure-8 Orbit
The famous periodic orbit discovered by Cris Moore in 1993. Three equal masses chase each other along a figure-eight path.

**Why it's special**: This was one of the first numerically stable periodic solutions found, demonstrating that order can exist within chaos.

#### 🦋 Butterfly Orbit
Another beautiful periodic solution where bodies trace elegant butterfly-like patterns.

**Why it's special**: Shows the diversity of stable periodic orbits possible in the three-body system.

#### 📐 Lagrange Equilateral Triangle
Based on Lagrange's discovery from 1772. The bodies form an equilateral triangle configuration.

**Why it's special**: One of the few analytically known stable solutions, used in real space mission planning.

#### ⚛️ Binary + Planet
Two massive stars orbit each other while a smaller planet orbits both.

**Why it's special**: Represents real astronomical systems like binary star systems with exoplanets.

#### 🌀 Chaotic System
A highly chaotic configuration extremely sensitive to initial conditions.

**Why it's special**: Demonstrates the unpredictable nature that makes the three-body problem so fascinating.

#### 🎲 Random
Randomly generated initial conditions for exploration.

**Why it's special**: Each simulation is unique - you might discover your own interesting patterns!

## 🔬 The Physics Behind It

### Newton's Law of Universal Gravitation

The gravitational force between two bodies is:

$$F = G \frac{m_1 m_2}{r^2}$$

Where:
- $F$ = gravitational force
- $G$ = gravitational constant (normalized to 1 in our simulation)
- $m_1, m_2$ = masses of the two bodies
- $r$ = distance between the bodies

### Equations of Motion

For each body $i$, we calculate its acceleration due to all other bodies:

$$\vec{a}_i = \sum_{j \neq i} G \frac{m_j (\vec{r}_j - \vec{r}_i)}{|\vec{r}_j - \vec{r}_i|^3}$$

### Numerical Integration (RK4 Method)

Since there's no analytical solution, we use the **Runge-Kutta 4th order method** to numerically integrate the equations of motion:

1. Calculate four intermediate slopes (k₁, k₂, k₃, k₄)
2. Combine them with weights: (k₁ + 2k₂ + 2k₃ + k₄)/6
3. Update positions and velocities

**Why RK4?** 
- High accuracy (4th order error)
- Good stability
- Widely used in physics simulations
- Better than simple Euler method

### Energy Conservation

The total energy should remain constant (in theory):

$$E_{total} = E_{kinetic} + E_{potential}$$

$$E_{kinetic} = \sum_i \frac{1}{2} m_i v_i^2$$

$$E_{potential} = -\sum_{i<j} G \frac{m_i m_j}{r_{ij}}$$

In practice, numerical integration introduces small errors. The energy display shows how well the simulation conserves energy - smaller changes indicate better accuracy!

## � Docker Deployment

### Quick Start with Docker

The easiest way to deploy the simulator for others is using Docker!

#### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop) installed on your system
- Basic familiarity with command line

#### Option 1: Using Docker Compose (Recommended)

```powershell
# Build and start the container
docker-compose up -d --build

# Access the simulator at http://localhost:8080

# View logs
docker-compose logs -f

# Stop the container
docker-compose down
```

#### Option 2: Using PowerShell Deployment Script

We've included an interactive deployment script for Windows:

```powershell
# Run the deployment script
.\deploy.ps1
```

The script provides options to:
1. Build and run with Docker Compose
2. Build Docker image only
3. Run existing image
4. Stop and remove container
5. View logs

#### Option 3: Manual Docker Commands

```powershell
# Build the image
docker build -t three-body-simulator:latest .

# Run the container
docker run -d -p 8080:80 --name three-body-simulator three-body-simulator:latest

# Stop the container
docker stop three-body-simulator
docker rm three-body-simulator
```

#### Deploying to Cloud Platforms

**Docker Hub:**
```bash
# Tag your image
docker tag three-body-simulator:latest yourusername/three-body-simulator:latest

# Push to Docker Hub
docker push yourusername/three-body-simulator:latest
```

**Azure Container Instances:**
```bash
az container create --resource-group myResourceGroup \
  --name three-body-simulator \
  --image yourusername/three-body-simulator:latest \
  --dns-name-label three-body-sim \
  --ports 80
```

**AWS ECS / Google Cloud Run:**
Both platforms support Docker images. Simply push to their respective container registries and deploy!

### Configuration

#### Changing the Port

Edit `docker-compose.yml`:
```yaml
ports:
  - "8080:80"  # Change 8080 to your preferred port
```

#### Resource Limits

The container is configured with reasonable defaults:
- CPU: 0.5 cores max
- Memory: 256MB max

Adjust in `docker-compose.yml` if needed.

## �🛠️ Technical Details

### Technologies Used
- **HTML5 Canvas** - For rendering graphics
- **Pure JavaScript (ES6+)** - No frameworks or libraries
- **CSS3** - Modern styling with gradients and animations
- **Nginx** - Web server for Docker deployment
- **Docker** - Containerization for easy deployment

### File Structure
```
three-body-simulator/
│
├── index.html          # Main HTML structure
├── styles.css          # Styling and responsive design
├── script.js           # Physics engine and visualization
├── README.md          # This file
│
├── Dockerfile          # Docker container configuration
├── docker-compose.yml  # Docker Compose setup
├── nginx.conf         # Nginx web server configuration
├── .dockerignore      # Docker build exclusions
└── deploy.ps1         # Windows deployment script
```

### Code Architecture

#### Classes

**`Body`** - Represents a celestial body
- Properties: position, velocity, mass, color, trail
- Methods: trail management

**`Simulation`** - Physics engine
- Handles gravitational calculations
- Implements RK4 integration
- Manages simulation state and time

**`Renderer`** - Visualization engine
- Canvas rendering
- Camera transformations (zoom, pan)
- Trail and effect drawing

**`UIController`** - User interface
- Event handling
- Preset loading
- Information display updates

### Performance Optimization

- **Efficient rendering** - Only draws what's needed
- **Trail length limiting** - Prevents memory buildup
- **Smooth animations** - 60 FPS target with requestAnimationFrame
- **Responsive design** - Adapts to different screen sizes

## 🎓 Educational Value

This simulator is perfect for:

- **Physics Students** - Visualize orbital mechanics and chaos theory
- **Educators** - Demonstrate complex concepts interactively
- **Enthusiasts** - Explore one of physics' most fascinating problems
- **Developers** - Learn numerical methods and Canvas API

### Learning Objectives

1. **Understand gravitational interactions** between multiple bodies
2. **Observe chaotic dynamics** and sensitivity to initial conditions
3. **Appreciate numerical methods** for solving differential equations
4. **Explore stable periodic orbits** in chaotic systems
5. **Visualize conservation laws** (energy, momentum)

## 🚀 Future Enhancements

Potential features for future versions:

- [ ] Add more bodies (4-body, 5-body problems)
- [ ] Custom initial conditions editor
- [ ] Export/import configurations
- [ ] Animation recording (GIF/video export)
- [ ] 3D visualization option
- [ ] Collision detection
- [ ] Relativistic effects
- [ ] Real astronomical data (Sun-Earth-Moon, etc.)
- [ ] Performance mode for slower devices
- [ ] Dark/light theme toggle

## 📖 References

### Historical Papers
- Moore, C. (1993). "Braids in classical dynamics"
- Lagrange, J. L. (1772). "Essai sur le problème des trois corps"
- Poincaré, H. (1890). "Sur le problème des trois corps"

### Modern Research
- Šuvakov, M., & Dmitrašinović, V. (2013). "Three Classes of Newtonian Three-Body Planar Periodic Orbits" - Physical Review Letters

### Online Resources
- [Three-Body Problem on Wikipedia](https://en.wikipedia.org/wiki/Three-body_problem)
- [Scholarpedia Article on N-Body Problem](http://www.scholarpedia.org/article/N-body_simulations)
- [NASA on Lagrange Points](https://solarsystem.nasa.gov/resources/754/what-is-a-lagrange-point/)

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## 📝 License

MIT License - Feel free to use this code for educational or personal projects!

## 👨‍💻 Author

Ibrahim E. EL-Serwy
Mohamed Zeyadne
Kirubeal Kassa
ALi Adeel
Nour Eddine 

## 🙏 Acknowledgments

- Chris Moore for discovering the Figure-8 orbit
- Joseph-Louis Lagrange for his groundbreaking work on the three-body problem
- Henri Poincaré for his contributions to chaos theory
- The open-source community for inspiration

---

**Enjoy exploring the beautiful chaos of the Three-Body Problem!** 🌌

If you find this simulator helpful or interesting, please consider giving it a star ⭐

