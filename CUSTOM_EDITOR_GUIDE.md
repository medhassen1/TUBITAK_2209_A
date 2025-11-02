# 🎨 Custom Body Editor Guide

## New Feature Added!

You can now **manually configure** the mass, velocity, and position of each body!

## How to Use

### Method 1: Manual Input (Precise Control)

1. **Enable Custom Mode**
   - Click the "🎨 Enable Custom Mode" button in the control panel
   - The custom editor panel will expand

2. **Set Properties for Each Body**
   - **Mass**: How heavy the body is (affects gravitational pull)
   - **Position X, Y**: Where the body starts on the canvas
   - **Velocity X, Y**: Initial speed and direction

3. **Apply Configuration**
   - Click "✓ Apply Configuration" to load your custom setup
   - The simulation will reset with your values

### Method 2: Click to Place (Visual & Easy)

1. **Enable Custom Mode** (if not already)

2. **Click "🖱️ Click to Place Bodies"**
   - The canvas border will glow blue
   - Cursor changes to crosshair

3. **Click on the Canvas**
   - Click to place Body 1
   - Click again to place Body 2
   - Click once more to place Body 3
   - Positions are automatically set!

4. **Adjust Velocities and Masses**
   - Fine-tune the velocity and mass values in the input fields
   - Click "✓ Apply Configuration" when done

5. **Start the Simulation**
   - Click "▶️ Play" to see your custom configuration in action!

## Example Configurations

### Circular Orbit
```
Body 1: Mass=3.0, X=0, Y=0, Vx=0, Vy=0 (center star)
Body 2: Mass=1.0, X=1.5, Y=0, Vx=0, Vy=1.2 (orbiting)
Body 3: Mass=1.0, X=-1.5, Y=0, Vx=0, Vy=-1.2 (orbiting)
```

### Linear Collision
```
Body 1: Mass=1.0, X=-2, Y=0, Vx=0.5, Vy=0
Body 2: Mass=1.0, X=0, Y=0, Vx=0, Vy=0 (stationary)
Body 3: Mass=1.0, X=2, Y=0, Vx=-0.5, Vy=0
```

### Triangle Formation
```
Body 1: Mass=1.0, X=0, Y=1, Vx=0.5, Vy=0
Body 2: Mass=1.0, X=-0.87, Y=-0.5, Vx=0, Vy=0.5
Body 3: Mass=1.0, X=0.87, Y=-0.5, Vx=-0.5, Vy=0
```

### Heavy Center with Satellites
```
Body 1: Mass=5.0, X=0, Y=0, Vx=0, Vy=0 (massive center)
Body 2: Mass=0.5, X=2, Y=0, Vx=0, Vy=1.5
Body 3: Mass=0.5, X=-2, Y=0, Vx=0, Vy=-1.5
```

## Tips & Tricks

### Understanding Coordinates
- **X**: Horizontal position (negative = left, positive = right)
- **Y**: Vertical position (negative = down, positive = up)
- **Origin (0,0)**: Center of the canvas

### Understanding Velocity
- **Vx**: Horizontal speed (negative = left, positive = right)
- **Vy**: Vertical speed (negative = down, positive = up)
- **Speed**: sqrt(Vx² + Vy²)

### Mass Effects
- **Larger mass** = stronger gravitational pull
- **Equal masses** = more chaotic, symmetric behavior
- **One large + two small** = stable orbits possible

### Creating Stable Orbits
For a circular orbit around a massive body:
- Orbital velocity ≈ sqrt(G × M / r)
- In our simulation: V ≈ sqrt(mass / distance)
- Example: Mass=4, Distance=2 → Velocity≈1.4

### Experiment Ideas
1. **Equal masses in a line** - Watch them collapse together
2. **High-speed collision** - Set high velocities pointing at each other
3. **Extreme mass difference** - One massive body with tiny satellites
4. **Perfect symmetry** - Equal masses, velocities, and spacing
5. **Random chaos** - Mix different masses and random velocities

## Real-Time Updates

The editor supports **real-time updates**:
- Change any value in the input fields
- Click "Apply Configuration" to see changes immediately
- Experiment with different values quickly!

## Keyboard Shortcuts (Planned)

Future updates may include:
- Arrow keys to adjust selected body position
- Number keys to quick-select bodies
- Ctrl+C / Ctrl+V to copy configurations

## Switching Back to Presets

Click any preset button to:
- Exit custom mode automatically
- Load the preset configuration
- Continue exploring pre-made scenarios

## Share Your Configurations

Found an interesting configuration? Share the values:
```
Body 1: Mass=X, Pos=(X,Y), Vel=(Vx,Vy)
Body 2: Mass=X, Pos=(X,Y), Vel=(Vx,Vy)
Body 3: Mass=X, Pos=(X,Y), Vel=(Vx,Vy)
```

## Troubleshooting

**Bodies disappear off screen?**
- Use mouse wheel to zoom out
- Click "Reset" to recenter
- Check position values aren't too large

**Simulation seems wrong?**
- Verify all values are filled in
- Check for extreme velocities (>10)
- Ensure masses are positive

**Bodies move too fast/slow?**
- Adjust the "Simulation Speed" slider
- Modify velocity values
- Consider changing masses

**Want to start over?**
- Click "Reset" button
- Or click any preset button
- Or reload the page

---

**Have fun creating your own three-body systems!** 🌌✨
