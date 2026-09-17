'use strict';
/**
 * scripts/build_categories_data.js
 * Generates the complete 96 Background Categories dataset with 100 sub-categories each (total 9,600 subcategories).
 */

const fs = require('fs');
const path = require('path');

const CATEGORY_DEFINITIONS = [
  {
    num: 1,
    id: 'abstract_bg',
    name: 'Abstract Background',
    icon: '🎨',
    group: 'abstract',
    desc: 'Fluid, experimental, dynamic flow fields, non-representational generative forms and chaotic aesthetic ribbons.',
    patternTypes: ['abstractLine', 'abstractTextile', 'vectorFlowField', 'fluidTurbulence', 'strangeAttractor', 'marble', 'wave'],
    baseColors: ['#0f172a', '#6366f1', '#ec4899', '#f8fafc'],
    tags: ['abstract', 'fluid', 'generative', 'flow', 'modern', 'artistic', 'creative', 'backdrop', 'wallpaper'],
    subThemes: ['Fluid Flow', 'Geometric Chaos', 'Chromatic Distortion', 'Morphing Gradient', 'Generative Mesh', 'Splatter Dynamics', 'Linear Tension', 'Cosmic Acrylic', 'Vector Vortex', 'Prismatic Waves']
  },
  {
    num: 2,
    id: 'gradient_bg',
    name: 'Gradient Background',
    icon: '🌈',
    group: 'abstract',
    desc: 'Smooth multi-stop chromatic blends, mesh gradients, vibrant transitions, and atmospheric spectrum sweeps.',
    patternTypes: ['gradient', 'meshWireframe', 'minimalLine', 'auroraBorealis', 'plasmaDischarge'],
    baseColors: ['#4f46e5', '#06b6d4', '#ec4899', '#fbbf24'],
    tags: ['gradient', 'blend', 'spectrum', 'chromatic', 'smooth', 'mesh', 'colorway', 'linear', 'radial'],
    subThemes: ['Sunset Spectrum', 'Pastel Haze', 'Neon Duotone', 'Cyberpunk Fusion', 'Deep Sea Oceanic', 'Nordic Mist', 'Warm Aura', 'Ethereal Vapor', 'Electric Citrus', 'Velvet Midnight']
  },
  {
    num: 3,
    id: 'blur_bg',
    name: 'Blur Background',
    icon: '🌫️',
    group: 'abstract',
    desc: 'Soft focal falloffs, Gaussian diffuse orbs, dreamy chromatic hazes, and smooth luminous backdrop blurs.',
    patternTypes: ['plasmaDischarge', 'gradient', 'auroraBorealis', 'fluidTurbulence'],
    baseColors: ['#1e1b4b', '#4338ca', '#a855f7', '#ec4899'],
    tags: ['blur', 'gaussian', 'soft', 'defocus', 'diffuse', 'dreamy', 'ambient', 'atmospheric', 'smooth'],
    subThemes: ['Gaussian Glow', 'Soft Atmospheric', 'Prismatic Haze', 'Dreamy Diffuse', 'Ambient Light Orbs', 'Silk Smooth Blur', 'Cosmic Vapor Blur', 'Frosted Softness', 'Chromatic Falloff', 'Midnight Glow Blur']
  },
  {
    num: 4,
    id: 'bokeh_bg',
    name: 'Bokeh Background',
    icon: '✨',
    group: 'light',
    desc: 'Cinematic optical out-of-focus light orbs, hexagonal aperture glints, and shimmering romantic disco specks.',
    patternTypes: ['polkaDot', 'quantumDots', 'supernovaBurst', 'matrixRain'],
    baseColors: ['#09090b', '#f59e0b', '#fbbf24', '#fef3c7'],
    tags: ['bokeh', 'light orbs', 'cinematic', 'aperture', 'glint', 'sparkle', 'shimmer', 'lens flare', 'night lights'],
    subThemes: ['Golden Hour Bokeh', 'City Night Lights', 'Fairy Tale Sparkle', 'Hexagonal Aperture', 'Emerald Forest Bokeh', 'Romantic Rose Bokeh', 'Cyberpunk Neon Bokeh', 'Champagne Luxury Bokeh', 'Prismatic Particle Orbs', 'Deep Blue Starlight']
  },
  {
    num: 5,
    id: 'mesh_bg',
    name: 'Mesh Background',
    icon: '🕸️',
    group: 'abstract',
    desc: 'Topological wireframe lattices, undulating parametric meshes, gradient warp grids, and 3D polygon nets.',
    patternTypes: ['meshWireframe', 'isometric', 'topographicIso', 'grid', 'crossStripe'],
    baseColors: ['#0f172a', '#38bdf8', '#818cf8', '#f8fafc'],
    tags: ['mesh', 'wireframe', 'lattice', 'topological', 'grid', 'parametric', '3d net', 'warp', 'digital'],
    subThemes: ['Topological Distortion', 'Gradient Warp Mesh', 'Isometric Net', 'Cyber Wireframe', 'Fluid Poly Net', 'Hyperbolic Lattice', 'Neon Spatial Mesh', 'Minimalist Mono Grid', 'Triangulated Terrain', 'Vortex Wireframe']
  },
  {
    num: 6,
    id: 'liquid_bg',
    name: 'Liquid Background',
    icon: '💧',
    group: 'abstract',
    desc: 'Viscous fluid pours, acrylic marble swirls, turbulent dynamic splashes, and glossy organic flows.',
    patternTypes: ['marble', 'fluidTurbulence', 'wave', 'organicFlow'],
    baseColors: ['#0c4a6e', '#0284c7', '#38bdf8', '#e0f2fe'],
    tags: ['liquid', 'pour', 'viscous', 'splash', 'fluid', 'glossy', 'wet', 'swirl', 'acrylic marble'],
    subThemes: ['Molten Gold Liquid', 'Deep Ocean Splash', 'Chromatic Viscous Flow', 'Acrylic Marbling', 'Mercury Liquid Metal', 'Glossy Bubble Fluid', 'Cosmic Liquid Swirl', 'Pastel Milk Swirl', 'Neon Toxic Fluid', 'Pure Spring Ripple']
  },
  {
    num: 7,
    id: 'fluid_bg',
    name: 'Fluid Background',
    icon: '🌊',
    group: 'abstract',
    desc: 'Hydrodynamic flow fields, turbulent velocity vectors, smooth smoke-liquid transitions, and continuous currents.',
    patternTypes: ['fluidTurbulence', 'vectorFlowField', 'wave', 'marble', 'organicFlow'],
    baseColors: ['#1e1b4b', '#7c3aed', '#06b6d4', '#fdf4ff'],
    tags: ['fluid', 'hydrodynamics', 'turbulence', 'flow field', 'currents', 'stream', 'waves', 'organic', 'motion'],
    subThemes: ['Turbulent Velocity', 'Laminar Streamlines', 'Prismatic Fluid Waves', 'Cosmic Plasma Drift', 'Neon Stream Ribbon', 'Ethereal Vapor Flow', 'Deep Trench Current', 'Hyper-fluid Swirls', 'Liquid Crystal Stream', 'Bioluminescent Flow']
  },
  {
    num: 8,
    id: 'wave_bg',
    name: 'Wave Background',
    icon: '〰️',
    group: 'abstract',
    desc: 'Harmonic sine oscillations, multi-frequency wave layers, dynamic undulating ripples, and ocean swells.',
    patternTypes: ['wave', 'opArtWave', 'sineLattice', 'chladniPlate'],
    baseColors: ['#082f49', '#0ea5e9', '#38bdf8', '#f0f9ff'],
    tags: ['wave', 'sine', 'harmonic', 'undulation', 'oscillation', 'ripple', 'crest', 'frequency', 'marine'],
    subThemes: ['Harmonic Sine Layers', 'Ocean Swell Ripple', 'Soundwave Matrix', 'Gold Foil Dunes', 'Neon Pulse Wave', 'Gradient Ribbon Wave', 'Minimal Contour Wave', 'Sub-bass Interference', 'Retro Synthwave Crest', 'Cosmic Radio Wave']
  },
  {
    num: 9,
    id: 'curve_bg',
    name: 'Curve Background',
    icon: '➰',
    group: 'abstract',
    desc: 'Graceful bezier arcs, sweeping architectural ribbons, parabolic contours, and smooth geometric trajectories.',
    patternTypes: ['roseCurve', 'minimalLine', 'abstractLine', 'vectorFlowField'],
    baseColors: ['#18181b', '#f43f5e', '#fb7185', '#fafafa'],
    tags: ['curve', 'bezier', 'arc', 'trajectory', 'ribbon', 'contour', 's-curve', 'sweep', 'flow'],
    subThemes: ['Architectural Sweep', 'Minimalist S-Curve', 'Ribbon Intertwine', 'Golden Ratio Arc', 'Neon Track Curve', 'Dynamic Horizon Curve', 'Parabolic Contour', 'Silk Ribbon Sweep', 'Elegance Monoline Arc', 'Futuristic Speed Curve']
  },
  {
    num: 10,
    id: 'spiral_bg',
    name: 'Spiral Background',
    icon: '🌀',
    group: 'abstract',
    desc: 'Mathematical logarithmic spirals, Fibonacci golden ratios, hypnotic spiral arms, and Archimedean vortexes.',
    patternTypes: ['spiral', 'goldSpiral', 'archimedeanSpiral', 'logarithmicSpiral', 'fermatSpiral', 'theodorusSpiral'],
    baseColors: ['#0f172a', '#f59e0b', '#fbbf24', '#fef3c7'],
    tags: ['spiral', 'fibonacci', 'golden ratio', 'archimedean', 'vortex', 'hypnotic', 'logarithmic', 'cycloid'],
    subThemes: ['Fibonacci Golden Coil', 'Archimedean Precision', 'Hypnotic Deep Vortex', 'Galactic Starlight Spiral', 'Nautilus Shell Curve', 'Neon Laser Spiral', 'Gold Wire Spiral', 'Dual Interlocking Spiral', 'Cosmic Singularity', 'Pastel Dream Spiral']
  },
  {
    num: 11,
    id: 'swirl_bg',
    name: 'Swirl Background',
    icon: '💫',
    group: 'abstract',
    desc: 'Dynamic centripetal twirls, confectionery twists, whirlpool momentum, and vibrant centrifugal loops.',
    patternTypes: ['spiral', 'fluidTurbulence', 'marble', 'opArtTunnel'],
    baseColors: ['#3b0764', '#d946ef', '#06b6d4', '#ffffff'],
    tags: ['swirl', 'twirl', 'whirlpool', 'twist', 'centrifugal', 'momentum', 'dynamic', 'vortex', 'colorful'],
    subThemes: ['Chromatic Whirlpool', 'Candy Cane Twirl', 'Deep Space Nebula Swirl', 'Liquid Chrome Twirl', 'Vibrant Aura Swirl', 'Centrifugal Burst', 'Gold Dust Cyclone', 'Psychedelic Optical Swirl', 'Velvet Smoke Swirl', 'Bioluminescent Eddy']
  },
  {
    num: 12,
    id: 'smoke_bg',
    name: 'Smoke Background',
    icon: '💨',
    group: 'space',
    desc: 'Ethereal drifting plumes, incense tendrils, dense volumetric fog trails, and mysterious cinematic vapor.',
    patternTypes: ['fluidTurbulence', 'strangeAttractor', 'auroraBorealis', 'plasmaDischarge'],
    baseColors: ['#09090b', '#71717a', '#a1a1aa', '#f4f4f5'],
    tags: ['smoke', 'plume', 'vapor', 'incense', 'tendrils', 'mysterious', 'cinematic', 'fog trail', 'ethereal'],
    subThemes: ['Volumetric Studio Smoke', 'Colored Incense Tendrils', 'Cinematic Noir Haze', 'Neon Backlit Vapor', 'Gold Dust Smoke Plume', 'Silk Ribbon Smoke', 'Midnight Mystery Drift', 'Prismatic Holy Smoke', 'Cyberpunk Toxic Vapor', 'Frosted Ice Smoke']
  },
  {
    num: 13,
    id: 'fog_bg',
    name: 'Fog Background',
    icon: '🌁',
    group: 'space',
    desc: 'Dense atmospheric mists, morning dew hazes, mystic mountain cloud banks, and cinematic diffusion.',
    patternTypes: ['gridNoise', 'plasmaDischarge', 'gradient', 'auroraBorealis'],
    baseColors: ['#18181b', '#52525b', '#a1a1aa', '#e4e4e7'],
    tags: ['fog', 'dense', 'mist', 'haze', 'atmospheric', 'morning dew', 'diffuse', 'mystery', 'cinematic'],
    subThemes: ['Mystic Mountain Fog', 'London Street Mist', 'Neon Cyber Fog', 'Morning Valley Haze', 'Forest Canopy Fog', 'Dark Horizon Fog', 'Pastel Sunset Mist', 'Gothic Cemetery Fog', 'Minimalist White Fog', 'High Altitude Cloud Bank']
  },
  {
    num: 14,
    id: 'mist_bg',
    name: 'Mist Background',
    icon: '🌧️',
    group: 'space',
    desc: 'Delicate water vapor suspensions, waterfall sprays, soft ambient moisture, and dewy atmospheric hazes.',
    patternTypes: ['plasmaDischarge', 'gridNoise', 'auroraBorealis', 'minimalLine'],
    baseColors: ['#0f172a', '#38bdf8', '#94a3b8', '#f8fafc'],
    tags: ['mist', 'vapor', 'spray', 'dew', 'waterfall', 'delicate', 'ambient', 'atmospheric', 'soft'],
    subThemes: ['Waterfall Cascade Spray', 'Zen Garden Morning Mist', 'Alpine Lake Vapor', 'Soft Blue Atmospheric Mist', 'Emerald Rain Mist', 'Golden Sunbeam Mist', 'Ethereal Dream Mist', 'Coastal Sea Spray', 'Volcanic Thermal Mist', 'Frosted Winter Mist']
  },
  {
    num: 15,
    id: 'cloud_bg',
    name: 'Cloud Background',
    icon: '☁️',
    group: 'space',
    desc: 'Fluffy cumulus formations, dramatic sunset cirrus streaks, stormy stormheads, and ethereal dreamscapes.',
    patternTypes: ['cellularAutomata', 'fluidTurbulence', 'plasmaDischarge', 'organic'],
    baseColors: ['#0284c7', '#38bdf8', '#bae6fd', '#ffffff'],
    tags: ['cloud', 'cumulus', 'cirrus', 'sky', 'stormhead', 'fluffy', 'sunset', 'dreamy', 'heavenly'],
    subThemes: ['Golden Sunset Cirrus', 'Fluffy Dream Cumulus', 'Stormy Thunderhead', 'Pastel Cotton Clouds', 'Moonlit Midnight Clouds', 'Anime Sky Cloudscape', 'Iridescent Mother-of-Pearl', 'Dramatic Horizon Cloud', 'Silver Lining Cloud', 'Dawn Heavenly Sky']
  },
  {
    num: 16,
    id: 'sky_bg',
    name: 'Sky Background',
    icon: '🌤️',
    group: 'space',
    desc: 'Vast atmospheric horizons, twilight gradients, clear azure daytimes, and radiant sunrise vistas.',
    patternTypes: ['gradient', 'auroraBorealis', 'plasmaDischarge', 'minimalLine'],
    baseColors: ['#0369a1', '#38bdf8', '#f59e0b', '#fef08a'],
    tags: ['sky', 'horizon', 'twilight', 'azure', 'daytime', 'sunrise', 'sunset', 'open air', 'atmosphere'],
    subThemes: ['Pure Azure Noon', 'Deep Twilight Gradient', 'Radiant Sunrise Glow', 'Golden Hour Skyline', 'Midnight Starry Blue', 'Vibrant Coral Dusk', 'Moody Overcast Skyline', 'Cyberpunk Neon Sky', 'Minimal Pale Horizon', 'Polar Twilight']
  },
  {
    num: 17,
    id: 'galaxy_bg',
    name: 'Galaxy Background',
    icon: '🌌',
    group: 'space',
    desc: 'Deep galactic spiral disks, Milky Way stellar arms, star cluster cores, and vast cosmic expanses.',
    patternTypes: ['supernovaBurst', 'spiral', 'goldSpiral', 'quantumDots'],
    baseColors: ['#050510', '#3b0764', '#06b6d4', '#fdf4ff'],
    tags: ['galaxy', 'milky way', 'stellar', 'spiral arms', 'star cluster', 'deep space', 'universe', 'astronomy', 'cosmic'],
    subThemes: ['Milky Way Central Core', 'Andromeda Spiral Arms', 'Sombrero Galaxy Glow', 'Deep Space Cluster', 'Neon Cosmic Dust', 'Bioluminescent Starfield', 'Hyper-speed Warp Galaxy', 'Ancient Star Cradle', 'Black Hole Accretion Disk', 'Vibrant Magenta Galaxy']
  },
  {
    num: 18,
    id: 'cosmic_bg',
    name: 'Cosmic Background',
    icon: '🪐',
    group: 'space',
    desc: 'Interstellar radiation fields, gravitational lenses, dark matter filaments, and celestial majesty.',
    patternTypes: ['strangeAttractor', 'supernovaBurst', 'plasmaDischarge', 'matrixRain'],
    baseColors: ['#030712', '#4338ca', '#ec4899', '#38bdf8'],
    tags: ['cosmic', 'interstellar', 'gravitational', 'dark matter', 'celestial', 'astral', 'outer space', 'radiation'],
    subThemes: ['Interstellar Warp Field', 'Gravitational Lens Arc', 'Cosmic Microwave Horizon', 'Dark Matter Web', 'Quasar Radiation Jet', 'Super-massive Void', 'Astral Plane Shimmer', 'Cosmic Ray Showers', 'Pulsar Timing Array', 'Extragalactic Vista']
  },
  {
    num: 19,
    id: 'star_bg',
    name: 'Star Background',
    icon: '⭐',
    group: 'space',
    desc: 'Glittering stellar constellations, twinkling distant suns, binary star systems, and diamond starfields.',
    patternTypes: ['hexStar', 'supernovaBurst', 'quantumDots', 'polkaDot'],
    baseColors: ['#020617', '#1e293b', '#38bdf8', '#ffffff'],
    tags: ['star', 'constellation', 'starfield', 'twinkle', 'stellar', 'astronomy', 'night sky', 'diamond stars'],
    subThemes: ['Diamond Starfield Grid', 'Zodiac Constellation Web', 'Binary Star Flare', 'Distant Galaxy Pinpoints', 'Golden Starlight Glow', 'Cross Star Diffraction', 'Hyper-dense Stellar Cluster', 'Shooting Star Trails', 'Cyber Starlight Grid', 'Deep Velvet Star Void']
  },
  {
    num: 20,
    id: 'nebula_bg',
    name: 'Nebula Background',
    icon: '🔮',
    group: 'space',
    desc: 'Ionized interstellar gas clouds, stellar nurseries, emission nebulae, and vibrant cosmic color dust.',
    patternTypes: ['fluidTurbulence', 'plasmaDischarge', 'supernovaBurst', 'strangeAttractor'],
    baseColors: ['#020617', '#9333ea', '#06b6d4', '#f43f5e'],
    tags: ['nebula', 'interstellar gas', 'stellar nursery', 'emission', 'cosmic dust', 'orion', 'carina', 'pillars of creation'],
    subThemes: ['Orion Cosmic Nursery', 'Carina Pillar of Dust', 'Horsehead Dark Silhouette', 'Crab Supernova Remnant', 'Helix Eye Nebula', 'Eagle Pillars of Creation', 'Vibrant Butterfly Gas', 'Cyber Nebula Glow', 'Emerald Ghost Nebula', 'Rainbow Emission Dust']
  },
  {
    num: 21,
    id: 'space_bg',
    name: 'Space Background',
    icon: '🚀',
    group: 'space',
    desc: 'Deep infinite void, planetary orbital paths, satellite horizons, and futuristic deep-space frontiers.',
    patternTypes: ['matrixRain', 'supernovaBurst', 'isometric', 'grid'],
    baseColors: ['#020617', '#0f172a', '#3b82f6', '#e2e8f0'],
    tags: ['space', 'infinite', 'void', 'orbital', 'planetary', 'outer space', 'deep space', 'astronaut', 'frontier'],
    subThemes: ['Planetary Orbital Path', 'Deep Space Void', 'Sci-Fi Station Viewport', 'Lunar Horizon Shadow', 'Exoplanet Ring System', 'Solar Flare Corona', 'Asteroid Belt Drift', 'Quantum Vacuum Fluctuations', 'Deep Space Waypoint', 'Cosmic Frontier Outpost']
  },
  {
    num: 22,
    id: 'universe_bg',
    name: 'Universe Background',
    icon: '🌌',
    group: 'space',
    desc: 'Multiverse bubble dimensions, cosmic string geometry, grand cosmological web, and infinite space-time.',
    patternTypes: ['metatronsCube', 'torusMandala', 'strangeAttractor', 'voronoiCells'],
    baseColors: ['#030712', '#312e81', '#4f46e5', '#a855f7'],
    tags: ['universe', 'multiverse', 'cosmological web', 'space-time', 'infinite', 'dimensions', 'sacred cosmos', 'quantum'],
    subThemes: ['Cosmic Filament Web', 'Multiverse Bubble Planes', 'Space-Time Curvature', 'Infinite Singularity Horizon', 'Quantum Superposition Grid', 'Grand Unified Field', 'Dimensional Portal Rift', 'Primordial Creation Glow', 'Universal Hologram Net', 'Eternal Cosmic Cycle']
  },
  {
    num: 23,
    id: 'aurora_bg',
    name: 'Aurora Background',
    icon: '🟢',
    group: 'space',
    desc: 'Shimmering polar lights, emerald green magnetic curtains, violet ribbons, and atmospheric geomagnetic waves.',
    patternTypes: ['auroraBorealis', 'wave', 'plasmaDischarge', 'fluidTurbulence'],
    baseColors: ['#022c22', '#10b981', '#06b6d4', '#a855f7'],
    tags: ['aurora', 'borealis', 'polar lights', 'geomagnetic', 'emerald', 'curtain', 'shimmer', 'northern lights'],
    subThemes: ['Emerald Green Curtain', 'Violet & Teal Crown', 'Arctic Midnight Glow', 'Solar Wind Geomagnetic Wave', 'Norwegian Fjord Aurora', 'Neon Ribbon Sky', 'Pink Aurora Flash', 'Sub-polar Starlight Haze', 'Cosmic Aurora Stream', 'Ethereal Polar Veil']
  },
  {
    num: 24,
    id: 'light_bg',
    name: 'Light Background',
    icon: '💡',
    group: 'light',
    desc: 'Radiant optical beams, prismatic refractions, soft ambient studio illuminations, and glowing highlights.',
    patternTypes: ['supernovaBurst', 'guilloche', 'minimalLine', 'gradient'],
    baseColors: ['#0f172a', '#fbbf24', '#fef08a', '#ffffff'],
    tags: ['light', 'beam', 'ray', 'refraction', 'studio light', 'illuminated', 'bright', 'clean', 'radiant'],
    subThemes: ['Studio Softbox Radiance', 'Prismatic Refraction Ray', 'Volumetric Sunbeam Shaft', 'Golden Lens Flare', 'High-key Minimal Glow', 'Linear Optical Beam', 'Diffused Ambient Light', 'Crystalline Light Shard', 'Overexposed Dream Light', 'Pure White Caustics']
  },
  {
    num: 25,
    id: 'glow_bg',
    name: 'Glow Background',
    icon: '🌟',
    group: 'light',
    desc: 'Luminescent halation, soft neon blooms, radioactive gradients, and vibrant phosphorescent radiates.',
    patternTypes: ['plasmaDischarge', 'supernovaBurst', 'auroraBorealis', 'quantumDots'],
    baseColors: ['#050505', '#06b6d4', '#3b82f6', '#f43f5e'],
    tags: ['glow', 'luminescent', 'bloom', 'halation', 'phosphorescent', 'radiate', 'aura', 'vibrant', 'shine'],
    subThemes: ['Cyber Neon Aura Glow', 'Bioluminescent Ocean Glow', 'Radioactive Emerald Glow', 'Ultraviolet Bloom', 'Soft Peach Ambient Glow', 'Ethereal Soul Radiance', 'Laser Core Energy Glow', 'Candlelight Warm Bloom', 'Infrared Heat Glow', 'Electric Sky Halo']
  },
  {
    num: 26,
    id: 'neon_bg',
    name: 'Neon Background',
    icon: '⚡',
    group: 'light',
    desc: 'Electric gas tubes, retro synthwave grids, high-voltage signs, and futuristic cyberpunk vibrant lines.',
    patternTypes: ['cyberpunkCircuit', 'matrixRain', 'isometric', 'grid'],
    baseColors: ['#09090b', '#ff007f', '#00f0ff', '#39ff14'],
    tags: ['neon', 'electric', 'synthwave', 'cyberpunk', 'gas tube', 'glow', 'night city', 'fluorescent', 'high voltage'],
    subThemes: ['Tokyo Cyber Street Neon', 'Synthwave Sunset Grid', 'Magenta & Cyan Laser Lines', 'Neon Gas Typography Flow', 'Ultra-violet Club Lights', 'Electric Lime Wire', 'Neon Grid Runway', 'Fluorescent Sign Reflections', 'Acid Green Matrix Tube', 'Deep Midnight Neon Glow']
  },
  {
    num: 27,
    id: 'luminous_bg',
    name: 'Luminous Background',
    icon: '🔆',
    group: 'light',
    desc: 'Phosphorescent depths, glowing quantum energy spheres, self-illuminating minerals, and pure brilliance.',
    patternTypes: ['quantumDots', 'torusMandala', 'plasmaDischarge', 'supernovaBurst'],
    baseColors: ['#030712', '#10b981', '#6ee7b7', '#f0fdf4'],
    tags: ['luminous', 'phosphorescent', 'quantum', 'self-illuminating', 'brilliance', 'mineral', 'glow in dark'],
    subThemes: ['Phosphorescent Crystal', 'Quantum Energy Sphere', 'Deep Cave Bioluminescence', 'Glow-in-the-Dark Jellyfish', 'Luminous Marble Veins', 'Ethereal Spirit Light', 'Radiant Gold Thread', 'Luminous Water Caustic', 'Star Sapphire Glow', 'Nuclear Core Cherenkov']
  },
  {
    num: 28,
    id: 'shimmer_bg',
    name: 'Shimmer Background',
    icon: '🪩',
    group: 'light',
    desc: 'Iridescent pearl luster, heat-wave optical vibrations, delicate silk glints, and fluctuating surface highlights.',
    patternTypes: ['opArtWave', 'plasmaDischarge', 'wave', 'abstractLine'],
    baseColors: ['#1e1b4b', '#c084fc', '#f472b6', '#fdf4ff'],
    tags: ['shimmer', 'luster', 'pearl', 'heat wave', 'glint', 'silk', 'fluctuation', 'specular', 'subtle'],
    subThemes: ['Mother-of-Pearl Shimmer', 'Silk Fabric Specular Glint', 'Desert Heat Wave Mirage', 'Iridescent Soap Bubble', 'Champagne Surface Shimmer', 'Opal Gemstone Flashes', 'Glacier Ice Shimmer', 'Liquid Satin Wave', 'Rose Gold Luster', 'Diamond Dust Mirage']
  },
  {
    num: 29,
    id: 'sparkle_bg',
    name: 'Sparkle Background',
    icon: '❇️',
    group: 'light',
    desc: 'Crisp diamond star glints, festive celebration flashes, champagne bubbles, and magical fairy dust specks.',
    patternTypes: ['supernovaBurst', 'hexStar', 'quantumDots', 'guilloche'],
    baseColors: ['#0f172a', '#fbbf24', '#fef08a', '#ffffff'],
    tags: ['sparkle', 'glint', 'diamond', 'celebration', 'flash', 'fairy dust', 'magic', 'shine', 'points'],
    subThemes: ['Diamond Facet Sparkles', 'Fairy Tale Magic Specks', 'New Year Champagne Sparkle', 'Starlight Cross Bursts', 'Glitzy Glamour Flare', 'Golden Confetti Glints', 'Winter Frost Sparkles', 'Crystal Chandelier Gleam', 'Rose Gold Star Glints', 'Celestial Magic Flash']
  },
  {
    num: 30,
    id: 'glitter_bg',
    name: 'Glitter Background',
    icon: '💎',
    group: 'light',
    desc: 'High-density reflective micro-sequins, cosmetics glitter powder, festive metallic flakes, and dazzling textures.',
    patternTypes: ['quantumDots', 'gridNoise', 'polkaDot', 'cellularAutomata'],
    baseColors: ['#18181b', '#d4af37', '#f59e0b', '#ffffff'],
    tags: ['glitter', 'sequins', 'flakes', 'metallic', 'cosmetic', 'reflective', 'dazzle', 'festive', 'luxury'],
    subThemes: ['24K Liquid Gold Glitter', 'Midnight Onyx Black Glitter', 'Rose Gold Powder Texture', 'Silver Disco Sequin Wall', 'Holographic Glitter Dust', 'Emerald Gem Flake Texture', 'Ruby Red Festive Glitter', 'Amethyst Purple Dazzle', 'Sapphire Blue Sequins', 'Champagne Luxury Flakes']
  },
  {
    num: 31,
    id: 'particle_bg',
    name: 'Particle Background',
    icon: '⚛️',
    group: 'light',
    desc: 'Dynamic physics particle simulations, floating bokeh orbs, quantum point clouds, and constellation networks.',
    patternTypes: ['quantumDots', 'strangeAttractor', 'dendriteCrystal', 'matrixRain'],
    baseColors: ['#030712', '#38bdf8', '#818cf8', '#f8fafc'],
    tags: ['particle', 'simulation', 'physics', 'point cloud', 'network', 'quantum', 'constellation', 'floating'],
    subThemes: ['Plexus Network Constellation', 'Quantum Physics Point Cloud', 'Floating Bioluminescent Spores', 'Subatomic Collider Traces', 'Golden Dust Particle Field', 'Dynamic Swarm Movement', 'Data Node Cloud', 'Cosmic Dust Particles', 'Fluid Dynamics Particle Stream', 'Gravity Well Accretion']
  },
  {
    num: 32,
    id: 'dust_bg',
    name: 'Dust Background',
    icon: '🌪️',
    group: 'light',
    desc: 'Atmospheric light-shaft motes, vintage cinematic film dust, interstellar grains, and subtle micro-textures.',
    patternTypes: ['gridNoise', 'quantumDots', 'cellularAutomata'],
    baseColors: ['#1c1917', '#78716c', '#d6d3d1', '#fafaf9'],
    tags: ['dust', 'motes', 'sunbeam', 'film dust', 'vintage grain', 'micro texture', 'interstellar', 'ambient'],
    subThemes: ['Sunbeam Dust Motes', '35mm Vintage Film Dust', 'Cosmic Star Dust', 'Desert Sand Storm Haze', 'Antique Library Dust', 'Golden Studio Powder', 'Chalkboard Dust Texture', 'Industrial Fine Particles', 'Moon Dust Regolith', 'Velvet Dust Speckles']
  },
  {
    num: 33,
    id: 'energy_bg',
    name: 'Energy Background',
    icon: '🔋',
    group: 'light',
    desc: 'High-voltage electric arcs, plasma coils, sonic shockwaves, magnetic flux lines, and kinetic power fields.',
    patternTypes: ['plasmaDischarge', 'strangeAttractor', 'vectorFlowField', 'cyberpunkCircuit'],
    baseColors: ['#050510', '#3b82f6', '#06b6d4', '#ec4899'],
    tags: ['energy', 'voltage', 'plasma', 'electric', 'kinetic', 'shockwave', 'magnetic', 'power', 'force field'],
    subThemes: ['Tesla Coil Lightning Arc', 'Plasma Fusion Core', 'Magnetic Flux Lines', 'Sonic Shockwave Ring', 'Laser Beam Convergence', 'Kinetic Pulse Field', 'Cyber Energy Grid', 'Dark Matter Energy Blast', 'Bioluminescent Bio-energy', 'Quantum Vortex Power']
  },
  {
    num: 34,
    id: 'fire_bg',
    name: 'Fire Background',
    icon: '🔥',
    group: 'elements',
    desc: 'Blazing flame tongues, volcanic lava flows, floating campfire embers, and high-temperature thermal infernos.',
    patternTypes: ['fluidTurbulence', 'plasmaDischarge', 'supernovaBurst', 'organicFlow'],
    baseColors: ['#450a0a', '#dc2626', '#f97316', '#fef08a'],
    tags: ['fire', 'flame', 'blaze', 'lava', 'embers', 'inferno', 'heat', 'thermal', 'burning', 'campfire'],
    subThemes: ['Campfire Embers in Wind', 'Volcanic Magma Flow', 'High-heat Blue Gas Flame', 'Phoenix Fire Wings', 'Dragon Breath Inferno', 'Golden Sparks Shower', 'Abstract Flame Tongues', 'Smoldering Charcoal Glow', 'Solar Corona Prominence', 'Explosive Thermal Burst']
  },
  {
    num: 35,
    id: 'water_bg',
    name: 'Water Background',
    icon: '💧',
    group: 'elements',
    desc: 'Sunlight underwater caustics, tranquil pool ripples, splash droplets, and crystal-clear turquoise depths.',
    patternTypes: ['reactionDiffusion', 'wave', 'organicFlow', 'marble'],
    baseColors: ['#082f49', '#0284c7', '#38bdf8', '#f0f9ff'],
    tags: ['water', 'caustics', 'pool', 'ripple', 'droplet', 'turquoise', 'clear', 'fluid', 'aquatic', 'liquid'],
    subThemes: ['Underwater Sunlight Caustics', 'Tranquil Zen Pool Ripples', 'Crystal Clear Turquoise Lagoon', 'Raindrops on Water Surface', 'Deep Blue Ocean Wave', 'Fresh Splash Splatter', 'Liquid Glass Wavelets', 'Mineral Spring Bubbles', 'Seafoam Coastal Edge', 'Reflective Still Water']
  },
  {
    num: 36,
    id: 'ocean_bg',
    name: 'Ocean Background',
    icon: '🌊',
    group: 'elements',
    desc: 'Vast deep-sea abyssal depths, Pacific tidal swells, coral reef turquoise waters, and bioluminescent ocean floors.',
    patternTypes: ['deepSeaCoral', 'wave', 'organicFlow', 'fluidTurbulence'],
    baseColors: ['#020617', '#0369a1', '#06b6d4', '#99f6e4'],
    tags: ['ocean', 'deep sea', 'abyss', 'marine', 'swell', 'coral reef', 'waves', 'tide', 'pacific', 'aquatic'],
    subThemes: ['Midnight Abyssal Trench', 'Tropical Coral Atoll', 'Pacific Giant Swell', 'Bioluminescent Plankton Wave', 'Submarine Light Rays', 'Arctic Ice Ocean', 'Emerald Coastal Surf', 'Deep Sea Thermal Vent', 'Tidal Shoreline Foam', 'Pelagic Open Ocean']
  },
  {
    num: 37,
    id: 'ice_bg',
    name: 'Ice Background',
    icon: '🧊',
    group: 'elements',
    desc: 'Glacial frost cracks, frozen crystal snowflakes, blue ice caverns, and sub-zero winter textures.',
    patternTypes: ['dendriteCrystal', 'hexStar', 'isometric', 'gridNoise'],
    baseColors: ['#082f49', '#38bdf8', '#bae6fd', '#ffffff'],
    tags: ['ice', 'glacier', 'frost', 'frozen', 'snowflake', 'sub-zero', 'winter', 'crack', 'crystal', 'chilly'],
    subThemes: ['Glacial Crevasse Blue Ice', 'Window Pane Frost Flowers', 'Frozen Lake Cracking Lattice', 'Hexagonal Snowflake Crystalline', 'Antarctic Iceberg Wall', 'Frosted Glass Needle Crystals', 'Arctic Blizzard Texture', 'Diamond Ice Shards', 'Permafrost Stratum', 'Liquid Ice Melting Flow']
  },
  {
    num: 38,
    id: 'crystal_bg',
    name: 'Crystal Background',
    icon: '💎',
    group: 'elements',
    desc: 'Geological amethyst geodes, prism refractions, quartz cluster facets, and mineral crystal geometries.',
    patternTypes: ['crystalGeode', 'dendriteCrystal', 'isometric', 'diamond'],
    baseColors: ['#3b0764', '#9333ea', '#c084fc', '#fdf4ff'],
    tags: ['crystal', 'geode', 'quartz', 'amethyst', 'mineral', 'facet', 'prism', 'refraction', 'gemstone'],
    subThemes: ['Amethyst Geode Cavity', 'Clear Quartz Prism Facets', 'Emerald Beryl Crystal Cluster', 'Rose Quartz Soft Mineral', 'Obsidian Volcanic Glass', 'Bismuth Iridescent Stepped Crystal', 'Fluorite Octahedron', 'Diamond Crystalline Lattice', 'Ruby Corundum Matrix', 'Topaz Golden Facet']
  },
  {
    num: 39,
    id: 'glass_bg',
    name: 'Glass Background',
    icon: '🪟',
    group: 'materials',
    desc: 'Modern glassmorphism, transparent acrylic refractive panels, caustics, and sleek architectural glazing.',
    patternTypes: ['meshWireframe', 'minimalLine', 'squareGrid', 'isometric'],
    baseColors: ['#0f172a', '#64748b', '#cbd5e1', '#ffffff'],
    tags: ['glass', 'glassmorphism', 'transparent', 'acrylic', 'refractive', 'glazing', 'modern', 'clean', 'sleek'],
    subThemes: ['Ultra-clear Glassmorphism', 'Refractive Acrylic Prism', 'Tinted Smoked Glass', 'Stained Glass Architectural Art', 'Broken Glass Shards Mosaic', 'Curved Tempered Glass Panels', 'Laminated Bulletproof Layers', 'Chroma Dispersion Glass', 'Mirrored Glass Reflections', 'Minimalist Clean Glass']
  },
  {
    num: 40,
    id: 'frosted_glass_bg',
    name: 'Frosted Glass Background',
    icon: '🌫️',
    group: 'materials',
    desc: 'Matte translucent glass, blurred background diffusion, soft backlit UI cards, and frosted luxury partitions.',
    patternTypes: ['gridNoise', 'plasmaDischarge', 'minimalLine', 'meshWireframe'],
    baseColors: ['#18181b', '#3f3f46', '#a1a1aa', '#ffffff'],
    tags: ['frosted glass', 'matte', 'translucent', 'diffusion', 'blur', 'ui backdrop', 'soft', 'luxury partition'],
    subThemes: ['SaaS UI Frosted Glass Card', 'Acid-etched Architectural Glass', 'Backlit Neon Frosted Screen', 'Japanese Shoji Frosted Texture', 'Iceberg Matte Glass', 'Smoky Frosted Obsidian', 'Pastel Translucent Sheet', 'Ribbed Fluted Frosted Glass', 'Minimalist Off-White Frost', 'Luxury Perfume Bottle Frost']
  },
  {
    num: 41,
    id: 'metallic_bg',
    name: 'Metallic Background',
    icon: '🔩',
    group: 'materials',
    desc: 'Brushed industrial alloys, polished stainless steel, titanium sheen, and high-specular reflective plates.',
    patternTypes: ['diagonalStripe', 'stripe', 'woven', 'herringbone'],
    baseColors: ['#18181b', '#52525b', '#a1a1aa', '#e4e4e7'],
    tags: ['metallic', 'brushed steel', 'titanium', 'alloy', 'stainless', 'sheen', 'industrial', 'specular', 'plate'],
    subThemes: ['Brushed Titanium Anodized', 'Polished Stainless Steel Sheet', 'Industrial Tread Plate Grid', 'Gunmetal Dark Steel Texture', 'Aerospace Billet Aluminum', 'Radial Brushed Metal Disc', 'Damascus Pattern Welded Steel', 'Galvanized Zinc Spangle', 'Satin Nickel Finish', 'Liquid Metal Mercury']
  },
  {
    num: 42,
    id: 'gold_bg',
    name: 'Gold Background',
    icon: '🪙',
    group: 'materials',
    desc: '24K molten gold leaf, regal gold filigree, warm champagne metallic glows, and opulent baroque textures.',
    patternTypes: ['goldSpiral', 'versaceBaroque', 'artDecoFan', 'luxury'],
    baseColors: ['#0f0d04', '#d4af37', '#f5e6a3', '#aa7c11'],
    tags: ['gold', '24k', 'gold leaf', 'filigree', 'champagne', 'metallic', 'luxury', 'royal', 'opulent', 'baroque'],
    subThemes: ['24K Liquid Gold Wave', 'Hand-applied Gold Leaf Texture', 'Art Deco Champagne Gold Fan', 'Baroque Royal Gold Filigree', 'Kintsugi Gold Cracked Seam', 'Brushed Rose Gold Texture', 'Gold Glitter Dust Powder', 'Molten Ingot Pour', 'Golden Silk Weave', 'Antique Venetian Gilt']
  },
  {
    num: 43,
    id: 'silver_bg',
    name: 'Silver Background',
    icon: '🥈',
    group: 'materials',
    desc: 'Polished sterling silver, platinum sheen, chrome reflections, and cool lunar metallic luxury.',
    patternTypes: ['houndstoothPro', 'diagonalStripe', 'meshWireframe', 'guilloche'],
    baseColors: ['#0f172a', '#94a3b8', '#e2e8f0', '#ffffff'],
    tags: ['silver', 'sterling', 'platinum', 'chrome', 'lunar', 'metallic', 'cool', 'sheen', 'luxury', 'refined'],
    subThemes: ['Sterling Silver Mirror Plate', 'Hammered Silver Luxury Texture', 'Platinum Brushed Alloy', 'Liquid Quicksilver Droplets', 'Moonlight Silver Horizon', 'Fine Silver Mesh Weave', 'Antique Tarnished Silverware', 'Silver Glitter Frost', 'Cyber Silver Armor Grid', 'Frosted Silver Leaf']
  },
  {
    num: 44,
    id: 'copper_bg',
    name: 'Copper Background',
    icon: '🥉',
    group: 'materials',
    desc: 'Warm burnished copper, verdigris patina accents, hammered artisanal metal, and glowing bronze alloys.',
    patternTypes: ['basketWeavePro', 'herringbone', 'marquetryWood', 'diamond'],
    baseColors: ['#271206', '#b45309', '#d97706', '#fef3c7'],
    tags: ['copper', 'burnished', 'patina', 'verdigris', 'bronze', 'warm metal', 'hammered', 'artisanal', 'metallic'],
    subThemes: ['Burnished Copper Sheet', 'Oxidized Verdigris Turquoise Patina', 'Hand-hammered Copper Bowl Texture', 'Polished Rose Copper Sheen', 'Artisan Bronze Ingot', 'Industrial Copper Piping Grid', 'Molten Copper Glow', 'Brushed Warm Bronze', 'Copper Foil Flakes', 'Antique Aztec Bronze']
  },
  {
    num: 45,
    id: 'chrome_bg',
    name: 'Chrome Background',
    icon: '🪞',
    group: 'materials',
    desc: 'High-gloss mirror chrome, liquid mercury reflections, Y2K retro chrome typography, and specular distortion.',
    patternTypes: ['opArtTunnel', 'strangeAttractor', 'fluidTurbulence', 'wave'],
    baseColors: ['#09090b', '#71717a', '#e4e4e7', '#ffffff'],
    tags: ['chrome', 'mirror', 'mercury', 'reflection', 'y2k', 'specular', 'gloss', 'futuristic', 'sleek'],
    subThemes: ['Liquid Chrome Blob Reflection', 'Y2K Retro Chrome Wave', 'Hyper-specular Mirror Chrome', 'Curved Automotive Chrome Bumper', 'Cyberpunk Chrome Skeleton', 'Chrome Gradient Ribbon', 'Molten Metal Droplet', 'Distorted Chrome Reflection', 'Iridescent Chrome Glaze', 'High-polish Chrome Cylinder']
  },
  {
    num: 46,
    id: 'holographic_bg',
    name: 'Holographic Background',
    icon: '💿',
    group: 'materials',
    desc: 'Rainbow spectrum diffraction, foil stamping, retro-futuristic holographic vinyl, and dynamic iridescent sheen.',
    patternTypes: ['plasmaDischarge', 'auroraBorealis', 'opArtWave', 'gradient'],
    baseColors: ['#18181b', '#06b6d4', '#ec4899', '#fbbf24'],
    tags: ['holographic', 'rainbow', 'diffraction', 'foil', 'vinyl', 'iridescent', 'futuristic', 'y2k', 'spectrum'],
    subThemes: ['Holographic Foil Card Stamping', 'Rainbow Spectrum Diffraction Grating', 'Holographic Vinyl Sticker Texture', 'Cyberpunk Security Hologram', 'Pastel Holographic Haze', 'Futuristic 3D Hologram Grid', 'Liquid Holographic Wave', 'Opal Holographic Pearl', 'Holographic Glitter Flakes', 'Laser Holographic Projector']
  },
  {
    num: 47,
    id: 'iridescent_bg',
    name: 'Iridescent Background',
    icon: '🪲',
    group: 'materials',
    desc: 'Color-shifting thin-film interference, beetle wing luster, peacock feather blues, and oil slick refractions.',
    patternTypes: ['organicFlow', 'wave', 'plasmaDischarge', 'fluidTurbulence'],
    baseColors: ['#09090b', '#8b5cf6', '#06b6d4', '#ec4899'],
    tags: ['iridescent', 'color-shifting', 'thin-film', 'oil slick', 'peacock', 'beetle wing', 'luster', 'soap bubble'],
    subThemes: ['Oil Slick Asphalt Rainbow', 'Peacock Feather Structural Color', 'Jewel Beetle Wing Sheen', 'Iridescent Soap Bubble Film', 'Chameleon Color Shift Paint', 'Deep Sea Bioluminescent Membrane', 'Liquid Crystal Iridescence', 'Titanium Anodized Rainbow', 'Pearlized Velvet Luster', 'Iridescent Glass Shards']
  },
  {
    num: 48,
    id: 'chrome_gradient_bg',
    name: 'Chrome Gradient Background',
    icon: '🪩',
    group: 'materials',
    desc: 'High-contrast metallic spectrum ramps, liquid mercury sweeps, 90s aesthetic gradients, and ultra-glossy ribbons.',
    patternTypes: ['gradient', 'sineLattice', 'opArtWave', 'plasmaDischarge'],
    baseColors: ['#0f172a', '#e2e8f0', '#38bdf8', '#f43f5e'],
    tags: ['chrome gradient', 'metallic sweep', 'high contrast', 'mercury', '90s', 'glossy', 'spectrum ramp', 'y2k'],
    subThemes: ['Liquid Silver Chrome Ramp', 'Y2K Sunset Chrome Gradient', 'Cyberpunk Toxic Chrome Sweep', 'Luxury Gold & Chrome Fusion', 'Pastel Soft Chrome Ribbon', 'Deep Space Midnight Chrome', 'Multi-angle Metallic Specular', 'Neon Reflected Chrome Sweep', 'Mirror Finish Torus Gradient', 'Fluid Chrome Horizon']
  },
  {
    num: 49,
    id: 'three_d_bg',
    name: '3D Background',
    icon: '🧊',
    group: 'materials',
    desc: 'Volumetric geometric primitives, depth-map shadows, isometric spatial blocks, and floating floating cubes.',
    patternTypes: ['isometric', 'escherCubes', 'meshWireframe', 'squareGrid'],
    baseColors: ['#0f172a', '#3b82f6', '#818cf8', '#f8fafc'],
    tags: ['3d', 'volumetric', 'depth', 'shadow', 'isometric', 'spatial', 'cube', 'geometry', 'perspective'],
    subThemes: ['Floating Isometric Cubes', 'Tessellated 3D Polyhedra', 'Spatial Architecture Blocks', '3D Cylinder Maze', 'Volumetric Sphere Array', 'Minimal Depth Layering', '3D Torus Vortex', 'Perspective Grid Tunnel', 'Extruded Hexagonal Pillars', 'Abstract 3D Ribbon Lattice']
  },
  {
    num: 50,
    id: 'three_d_render_bg',
    name: '3D Render Background',
    icon: '🖥️',
    group: 'materials',
    desc: 'Photorealistic octane render aesthetics, raytraced subsurface scattering, soft ambient occlusion, and clay models.',
    patternTypes: ['isometric', 'meshWireframe', 'plasmaDischarge', 'fluidTurbulence'],
    baseColors: ['#1e1b4b', '#6366f1', '#f43f5e', '#ffffff'],
    tags: ['3d render', 'octane', 'raytracing', 'subsurface scattering', 'clay model', 'ambient occlusion', 'cinema 4d', 'blender'],
    subThemes: ['Octane Render Pastel Shapes', 'Subsurface Scattering Wax Pillars', 'Raytraced Glass & Chrome Spheres', 'Matte Clay Minimal Sculpture', 'Studio Lighting Product Backdrop', 'Cloth Simulation Silk Drapery', 'Fluids Simulation Droplet Freeze', 'Procedural Displaced Terrain', 'Volumetric Caustics Render', 'Sci-Fi Hard Surface Panel']
  },
  {
    num: 51,
    id: 'minimal_bg',
    name: 'Minimal Background',
    icon: '⚪',
    group: 'colors',
    desc: 'Negative space mastery, subtle fine pinstripes, Scandinavian restraint, and ultra-clean modern simplicity.',
    patternTypes: ['minimalLine', 'stripe', 'grid', 'squareGrid'],
    baseColors: ['#ffffff', '#e2e8f0', '#94a3b8', '#0f172a'],
    tags: ['minimal', 'negative space', 'clean', 'simple', 'scandinavian', 'restraint', 'pinstripe', 'subtle', 'modern'],
    subThemes: ['Ultra Clean White Pinstripe', 'Scandinavian Stone Gray', 'Japanese Wabi-Sabi Balanced Line', 'Warm Linen Off-White Texture', 'Single Red Accent Line on Charcoal', 'Balanced Architectural Grid', 'Micro-dot Minimalist Array', 'Subtle Tone-on-Tone Shadow', 'Zen Fine Stroke Geometry', 'Minimalist Editorial Layout']
  },
  {
    num: 52,
    id: 'white_bg',
    name: 'White Background',
    icon: '🤍',
    group: 'colors',
    desc: 'Pure crisp white canvas, subtle embossed shadows, off-white cotton grain, and modern alabaster minimalism.',
    patternTypes: ['minimalLine', 'squareGrid', 'gridNoise', 'isometric'],
    baseColors: ['#ffffff', '#f8fafc', '#f1f5f9', '#e2e8f0'],
    tags: ['white', 'pure', 'crisp', 'embossed', 'off-white', 'alabaster', 'clean', 'light', 'minimal', 'bright'],
    subThemes: ['Pure Alabaster White', 'Subtle Embossed Paper Shadow', 'Clean Studio White Backdrop', 'Snow White Minimal Grid', 'Off-white Cotton Texture', 'Architectural White Stucco', 'White Ceramic Tile Pattern', 'Frosted White Veil', 'Chalk White Minimal Lines', 'Geometric Low-poly White']
  },
  {
    num: 53,
    id: 'black_bg',
    name: 'Black Background',
    icon: '🖤',
    group: 'colors',
    desc: 'Pitch noir obsidian, deep velvet darkness, high-contrast monochrome, and sleek luxury carbon backdrops.',
    patternTypes: ['gridNoise', 'squareGrid', 'minimalLine', 'matrixRain'],
    baseColors: ['#000000', '#0a0a0a', '#171717', '#262626'],
    tags: ['black', 'dark', 'noir', 'obsidian', 'velvet', 'monochrome', 'carbon', 'sleek', 'luxury', 'pitch'],
    subThemes: ['Pitch Obsidian Pure Black', 'Matte Carbon Fiber Weave', 'High-end Luxury Velvet Black', 'Subtle Dark Gray Iso Grid', 'Deep Space Void Black', 'Textured Black Leather Grain', 'Minimal Charcoal Line Grid', 'Black Onyx Polished Surface', 'Gothic Noir Mist Backdrop', 'Monochrome Contrast Pinstripe']
  },
  {
    num: 54,
    id: 'dark_bg',
    name: 'Dark Background',
    icon: '🌑',
    group: 'colors',
    desc: 'Atmospheric charcoal shadows, moody midnight hues, deep slate blue tones, and sophisticated dark modes.',
    patternTypes: ['gridNoise', 'isometric', 'abstractLine', 'meshWireframe'],
    baseColors: ['#0b0f19', '#1e293b', '#334155', '#38bdf8'],
    tags: ['dark', 'dark mode', 'charcoal', 'midnight', 'slate', 'moody', 'shadow', 'sophisticated', 'night'],
    subThemes: ['Dark Mode UI Mesh Grid', 'Moody Midnight Slate Hue', 'Deep Navy Blue Texture', 'Charcoal Smoke Shading', 'Gunmetal Industrial Plate', 'Dark Forest Twilight', 'Deep Purple Cyber Shadows', 'Stealth Matte Black Iso', 'Subtle Noise Dark Gradient', 'Dark Bronze Ambient Glow']
  },
  {
    num: 55,
    id: 'pastel_bg',
    name: 'Pastel Background',
    icon: '🧁',
    group: 'colors',
    desc: 'Soft macaron tones, blush pinks, mint greens, lavender hazes, and soothing aesthetic color palettes.',
    patternTypes: ['polkaDot', 'memphis', 'floral', 'wave', 'gradient'],
    baseColors: ['#fef2f2', '#fce7f3', '#e0e7ff', '#dcfce7'],
    tags: ['pastel', 'soft', 'macaron', 'blush', 'mint', 'lavender', 'soothing', 'aesthetic', 'nursery', 'gentle'],
    subThemes: ['Macaron Pink & Pistachio', 'Soft Lavender Dream Haze', 'Mint Green Organic Wiggles', 'Baby Blue & Peach Cloud', 'Buttercup Yellow & Cream', 'Pastel Memphis Geometric', 'Watercolor Pastel Wash', 'Chalky Soft Duotone', 'Pastel Sunset Gradient', 'Cotton Candy Swirl']
  },
  {
    num: 56,
    id: 'colorful_bg',
    name: 'Colorful Background',
    icon: '🎨',
    group: 'colors',
    desc: 'High-saturation color explosions, vibrant celebratory palettes, kaleidoscopic energy, and rainbow mosaics.',
    patternTypes: ['memphis', 'supernovaBurst', 'randomGeometric', 'opArtWave'],
    baseColors: ['#ef4444', '#f59e0b', '#10b981', '#3b82f6'],
    tags: ['colorful', 'vibrant', 'saturated', 'celebration', 'kaleidoscope', 'rainbow', 'bright', 'energetic', 'joyful'],
    subThemes: ['Festival Rainbow Explosion', 'Vibrant CMYK Halftone Mix', 'Kaleidoscopic Prismatic Tiles', 'Tropical Carnival Punch', 'Pop Art Color Collision', 'Multi-color Fluid Splash', 'Holi Powder Dispersion', 'Electric Circus Geometric', 'Vivid Abstract Vector Patch', 'Joyful Confetti Symphony']
  },
  {
    num: 57,
    id: 'monochrome_bg',
    name: 'Monochrome Background',
    icon: '🏁',
    group: 'colors',
    desc: 'Single-hue tonal gradients, black-and-white photography purity, architectural grayscale, and subtle tinting.',
    patternTypes: ['houndstoothPro', 'grid', 'minimalLine', 'topographicIso'],
    baseColors: ['#000000', '#525252', '#a3a3a3', '#ffffff'],
    tags: ['monochrome', 'grayscale', 'black and white', 'tonal', 'single hue', 'pure', 'architectural', 'stark'],
    subThemes: ['Classic Stark Black & White', 'Architectural Grayscale Tonal Steps', 'Monochrome Cobalt Blue Waves', 'Sepia Monochrome Vintage', 'Emerald Forest Monotone Grid', 'Crimson Monochromatic Gradient', 'Graphite Sketch Paper Texture', 'Tonal Halftone Dot Array', 'Monochrome Topo Lines', 'High-key Grayscale Portrait Back']
  },
  {
    num: 58,
    id: 'duotone_bg',
    name: 'Duotone Background',
    icon: '🎭',
    group: 'colors',
    desc: 'High-contrast complementary two-tone palettes, Spotify aesthetic gradients, and editorial split-tones.',
    patternTypes: ['crossStripe', 'diagonalStripe', 'opArtWave', 'sineLattice'],
    baseColors: ['#1e1b4b', '#f43f5e', '#06b6d4', '#ffffff'],
    tags: ['duotone', 'two-tone', 'spotify aesthetic', 'high contrast', 'split-tone', 'complementary', 'editorial'],
    subThemes: ['Spotify Neon Blue & Magenta', 'Cyberpunk Cyan & Red', 'Classic Navy & Gold Duo', 'Warm Terracotta & Sage Green', 'Deep Plum & Mustard Yellow', 'Electric Violet & Acid Green', 'Charcoal & Bright Coral', 'Teal & Orange Hollywood', 'Indigo & Electric Peach', 'Monochrome Charcoal & White']
  },
  {
    num: 59,
    id: 'color_block_bg',
    name: 'Color Block Background',
    icon: '🧱',
    group: 'colors',
    desc: 'Bold modernist rectangular color fields, Mondrian-inspired partitions, vibrant intersecting planes, and poster art.',
    patternTypes: ['bauhausGeo', 'squareGrid', 'geometric', 'crossStripe'],
    baseColors: ['#dc2626', '#2563eb', '#facc15', '#0f172a'],
    tags: ['color block', 'mondrian', 'bauhaus', 'rectangles', 'modernist', 'bold', 'poster art', 'planes', 'graphic'],
    subThemes: ['Mondrian De Stijl Primary Blocks', 'Modernist Bauhaus Color Planes', 'Pastel Architectural Color Block', '70s Earthy Color Slices', 'Minimalist Asymmetric Quads', 'Neon Graphic Poster Blocks', 'Nordic Color Partition', 'High-fashion Color Block Panels', 'Diagonal Split Color Canvas', 'Monochrome Tonal Blocks']
  },
  {
    num: 60,
    id: 'memphis_bg',
    name: 'Memphis Background',
    icon: '🪅',
    group: 'geometric',
    desc: '80s Milan Memphis design, squiggles, confetti sprinkles, playful geometric shapes, and post-modernist fun.',
    patternTypes: ['memphis', 'polkaDot', 'randomGeometric', 'doodle'],
    baseColors: ['#f43f5e', '#06b6d4', '#facc15', '#0f172a'],
    tags: ['memphis', '80s', 'post-modern', 'squiggles', 'confetti', 'playful', 'retro 80s', 'geometric fun', 'pop'],
    subThemes: ['Classic 80s Memphis Squiggles', 'Pastel Memphis Confetti', 'Cyberpunk Dark Memphis', 'Neon Geometry Funky Grid', 'Abstract Memphis Confetti Mix', 'Bauhaus & Memphis Hybrid', 'Doodle Memphis Stationery', 'Vibrant Post-modern Pop Pattern', 'Terrazzo Memphis Flecks', 'Retro Arcade Memphis']
  },
  {
    num: 61,
    id: 'geometric_bg',
    name: 'Geometric Background',
    icon: '📐',
    group: 'geometric',
    desc: 'Polygonal precision, tessellations, angular mathematical patterns, and crisp multi-layered polyhedra.',
    patternTypes: ['geometric', 'triangle', 'diamond', 'hexagonal', 'isometric', 'penroseTiling', 'bauhausGeo'],
    baseColors: ['#0f172a', '#3b82f6', '#10b981', '#f8fafc'],
    tags: ['geometric', 'polygonal', 'tessellation', 'angular', 'mathematical', 'precision', 'triangles', 'hexagons'],
    subThemes: ['Penrose Non-periodic Tiling', 'Isometric 3D Polygonal Mesh', 'Bauhaus Multi-shape Geometry', 'Interlocking Hexagonal Hive', 'Fractal Triangle Sierpinski', 'Modernist Low-Poly Crystal', 'Precision Vector Polygon Grid', 'Gold & Charcoal Geometric Mosaic', 'Kaleidoscopic Star Polygons', 'Minimalist Tangram Patterns']
  },
  {
    num: 62,
    id: 'triangle_bg',
    name: 'Triangle Background',
    icon: '🔺',
    group: 'geometric',
    desc: 'Dynamic triangular meshes, delta tessellations, equilateral pyramids, and acute angular rhythms.',
    patternTypes: ['triangle', 'geometric', 'isometric', 'randomGeometric'],
    baseColors: ['#1e1b4b', '#6366f1', '#a855f7', '#f8fafc'],
    tags: ['triangle', 'delta', 'equilateral', 'pyramid', 'angular', 'tessellation', 'trilateral', 'mesh'],
    subThemes: ['Equilateral Triangle Mosaic', 'Sierpinski Fractal Triangles', 'Low-Poly Triangular Mountain', 'Neon Dynamic Delta Flow', 'Harlequin Diamond Triangles', 'Minimalist Fine Line Triangles', '3D Extruded Pyramids Grid', 'Intersecting Translucent Triangles', 'Modern Gold & Navy Triangles', 'Retro 80s Triangle Confetti']
  },
  {
    num: 63,
    id: 'circle_bg',
    name: 'Circle Background',
    icon: '⭕',
    group: 'geometric',
    desc: 'Concentric circular ripples, intersecting rings, polka dot arrays, and harmonious spherical arrangements.',
    patternTypes: ['flowerOfLife', 'seedOfLife', 'polkaDot', 'torusMandala', 'guilloche'],
    baseColors: ['#0f172a', '#ec4899', '#38bdf8', '#f8fafc'],
    tags: ['circle', 'concentric', 'rings', 'sphere', 'round', 'polka dot', 'radial', 'bubble', 'geometric'],
    subThemes: ['Flower of Life Sacred Rings', 'Concentric Water Drop Ripples', 'Polka Dot High-fashion Grid', 'Overlapping Translucent Bubbles', 'Op Art Optical Illusion Circles', 'Minimalist Single Monoline Circle', 'Planetary Orbit Rings', 'Bullseye Concentric Target', 'Halftone Spherical Dots', 'Golden Ring Interlocking Chain']
  },
  {
    num: 64,
    id: 'square_bg',
    name: 'Square Background',
    icon: '⏹️',
    group: 'geometric',
    desc: 'Orthogonal pixel grids, checkerboards, nesting square frames, and clean architectural cubic symmetries.',
    patternTypes: ['squareGrid', 'checkered', 'gingham', 'escherCubes'],
    baseColors: ['#18181b', '#3f3f46', '#a1a1aa', '#ffffff'],
    tags: ['square', 'orthogonal', 'checkerboard', 'pixel', 'grid', 'cubic', 'architectural', 'frames'],
    subThemes: ['Classic Checkerboard Floor', 'Nesting Concentric Square Frames', 'High-tech 8-Bit Pixel Matrix', 'Architectural Modern Square Tiles', 'Gingham Check Fabric Texture', 'Escher 3D Cubic Illusion', 'Minimal Fine Line Square Grid', 'Color Block Square Mosaic', 'Op Art Bulging Square Mesh', 'Gold & Slate Luxury Squares']
  },
  {
    num: 65,
    id: 'hexagon_bg',
    name: 'Hexagon Background',
    icon: '⬡',
    group: 'geometric',
    desc: 'Nature honeycomb lattices, carbon graphene rings, sci-fi cyber shields, and hexagonal tessellations.',
    patternTypes: ['hexagonal', 'hexStar', 'isometric', 'grid'],
    baseColors: ['#022c22', '#10b981', '#34d399', '#f0fdf4'],
    tags: ['hexagon', 'honeycomb', 'graphene', 'cyber shield', 'tessellation', 'hive', 'six-sided', 'nature'],
    subThemes: ['Golden Honeycomb Beehive', 'Graphene Carbon Nanotube Grid', 'Cyberpunk Energy Shield Hexagons', 'Isometric 3D Hexagonal Pillars', 'Minimalist Outline Hex Grid', 'Sci-Fi Space Station Floor Tiles', 'Luminescent Neon Hexagon Array', 'Organic Hexagonal Cellular Matrix', 'Gold & Emerald Luxury Hex Mosaic', 'Futuristic Hex Pulse Wave']
  },
  {
    num: 66,
    id: 'grid_bg',
    name: 'Grid Background',
    icon: '🔲',
    group: 'geometric',
    desc: 'Architectural blueprint grids, graph paper math sheets, synthwave horizon wireframes, and digital matrices.',
    patternTypes: ['grid', 'squareGrid', 'meshWireframe', 'crossStripe'],
    baseColors: ['#0f172a', '#38bdf8', '#818cf8', '#f8fafc'],
    tags: ['grid', 'blueprint', 'graph paper', 'matrix', 'wireframe', 'synthwave', 'architectural', 'digital', 'lines'],
    subThemes: ['Architectural Cyan Blueprint', 'Clean Millimeter Graph Paper', 'Retro Synthwave Horizon Grid', 'Matrix Digital Data Lattice', 'Isometric 3D Coordinate Grid', 'Minimalist Dot Matrix Grid', 'Subtle SaaS Dark Mode Grid', 'Perspective Runway Grid Tunnel', 'Crosshatch Fine Grid Weave', 'High-voltage Neon Grid Lines']
  },
  {
    num: 67,
    id: 'dot_bg',
    name: 'Dot Background',
    icon: '🔘',
    group: 'geometric',
    desc: 'Pop art halftones, stippling pointillism, polka dot fashion prints, and quantized LED digital matrix boards.',
    patternTypes: ['polkaDot', 'quantumDots', 'halftonePopArt', 'cellularAutomata'],
    baseColors: ['#0f172a', '#f43f5e', '#fbbf24', '#f8fafc'],
    tags: ['dot', 'polka dot', 'halftone', 'stippling', 'pointillism', 'led matrix', 'dots', 'spots', 'pop art'],
    subThemes: ['Roy Lichtenstein Pop Art Halftone', 'High-fashion Bold Polka Dots', 'LED Digital Stadium Jumbotron Dot', 'Japanese Yayoi Kusama Dot Field', 'Subtle Micro-dot Minimal Paper', 'Pointillism Impressionist Dots', 'Stippled Pen & Ink Texture', 'Quantum Dispersed Particle Dots', 'Gradient Sized Dot Waves', 'Pastel Confetti Dot Party']
  },
  {
    num: 68,
    id: 'line_bg',
    name: 'Line Background',
    icon: '📏',
    group: 'geometric',
    desc: 'Precision monoline drawings, dynamic parallel trajectories, vector laser beams, and delicate hatching.',
    patternTypes: ['lineart', 'minimalLine', 'abstractLine', 'stripe'],
    baseColors: ['#09090b', '#71717a', '#a1a1aa', '#fafafa'],
    tags: ['line', 'monoline', 'parallel', 'laser', 'hatching', 'stroke', 'vector', 'clean', 'drafting'],
    subThemes: ['Continuous Monoline Architectural', 'Parallel High-speed Laser Lines', 'Crosshatched Fine Ink Lines', 'Dynamic Diagonal Speed Streaks', 'Minimalist Single Horizontal Zen Line', 'Neon Linear Velocity Tracks', 'Topographical Contour Vector Lines', 'Golden Fine Filigree Lines', 'Op Art Converging Linear Illusion', 'Subtle Vertical Pinstripe Rhythms']
  },
  {
    num: 69,
    id: 'stripe_bg',
    name: 'Stripe Background',
    icon: '💈',
    group: 'geometric',
    desc: 'Bold nautical stripes, awning canvas bands, barcode barcodes, barcode linear rhythms, and multi-width bars.',
    patternTypes: ['stripe', 'diagonalStripe', 'multiStripe', 'crossStripe'],
    baseColors: ['#0f172a', '#3b82f6', '#f8fafc', '#ffffff'],
    tags: ['stripe', 'nautical', 'awning', 'bands', 'barcode', 'bars', 'linear', 'pinstripe', 'racing'],
    subThemes: ['French Breton Navy Nautical Stripe', 'Classic Awning Sunburst Canvas Stripe', '70s Groovy Multi-color Earth Stripes', 'High-contrast Barcode Linear Rhythm', 'Candy Cane Diagonal Red & White', 'Racing Sport Car Double Stripes', 'Pinstripe Wall Texture', 'Gradient Shaded 3D Stripe Bars', 'Monochrome Barcode Matrix', 'Vibrant Beach Umbrella Stripes']
  },
  {
    num: 70,
    id: 'wave_line_bg',
    name: 'Wave Line Background',
    icon: '〰️',
    group: 'geometric',
    desc: 'Guilloche banknote curves, optical wave distortions, topo contour lines, and fluid harmonic sinusoidal lines.',
    patternTypes: ['opArtWave', 'guilloche', 'sineLattice', 'chladniPlate'],
    baseColors: ['#0f172a', '#06b6d4', '#ec4899', '#f8fafc'],
    tags: ['wave line', 'guilloche', 'contour', 'sinusoidal', 'harmonic', 'undulating lines', 'banknote', 'optical'],
    subThemes: ['Banknote Security Guilloche Rosette', 'Japanese Seigaiha Ocean Waves', 'Op Art Optical Wavy Line Distort', 'Topographic Contour Line Map', 'Harmonic Sinusoidal Audio Waves', 'Fluid Dynamic Streamline Flow', 'Golden Ribbon Undulating Lines', 'Minimalist Black & White Wave Lines', 'Neon Cyber Sound Wave Spectrum', 'Subtle Organic Waterline Ripple']
  },
  {
    num: 71,
    id: 'seamless_bg',
    name: 'Seamless Background',
    icon: '🔁',
    group: 'geometric',
    desc: 'Flawlessly repeating edge-matched pattern tiles for endless wallpapers, textile fabrics, and surface prints.',
    patternTypes: ['plaid', 'tartan', 'houndstoothPro', 'herringbone', 'chevron'],
    baseColors: ['#1e1b4b', '#4338ca', '#818cf8', '#f8fafc'],
    tags: ['seamless', 'repeating', 'tileable', 'endless', 'wallpaper', 'textile', 'fabric', 'perfect match', 'modular'],
    subThemes: ['Scottish Tartan Royal Plaid Tile', 'Classic Houndstooth Wool Pattern', 'Herringbone Luxury Tweed Weave', 'Chevron Zigzag Seamless Tile', 'Moroccan Palace Zellige Repeating', 'Art Deco Wallpaper Endless Tile', 'Damask Luxury Repeating Floral', 'Modernist Geometric Repeating Tile', 'Botanical Seamless Jungle Wallpaper', 'Polka Dot Verified Seamless Grid']
  },
  {
    num: 72,
    id: 'pattern_bg',
    name: 'Pattern Background',
    icon: '🧩',
    group: 'geometric',
    desc: 'Intricate ornamental motifs, decorative friezes, cultural folk rhythms, and multi-layered repeating graphics.',
    patternTypes: ['arabesqueScroll', 'greekKeyMeander', 'versaceBaroque', 'moroccan'],
    baseColors: ['#0f172a', '#f59e0b', '#d97706', '#fef3c7'],
    tags: ['pattern', 'ornament', 'frieze', 'cultural', 'folk', 'repeating', 'decorative', 'motifs', 'tessellation'],
    subThemes: ['Greek Key Meander Frieze', 'Moroccan Arabesque Lattice', 'Versace Baroque Golden Scrollwork', 'Scandinavian Folk Art Floral', 'Aztec Indigenous Tribal Geometric', 'Japanese Asanoha Hemp Leaf', 'Indian Paisley Damask Rhythm', 'Celtic Knotwork Endless Ribbon', 'Victorian Filigree Wallpaper', 'Modernist Bauhaus Pattern Grid']
  },
  {
    num: 73,
    id: 'floral_bg',
    name: 'Floral Background',
    icon: '🌸',
    group: 'elements',
    desc: 'Delicate blossom petals, watercolor bouquets, vintage botanical roses, and romantic spring gardens.',
    patternTypes: ['floral', 'roseCurve', 'rhodoneaRose', 'botanical'],
    baseColors: ['#881337', '#f43f5e', '#fecdd3', '#fff1f2'],
    tags: ['floral', 'flower', 'blossom', 'rose', 'bouquet', 'spring', 'petal', 'romantic', 'watercolor', 'botanical'],
    subThemes: ['Japanese Sakura Cherry Blossom', 'English Country Garden Roses', 'Watercolor Peony Bouquet Wash', 'Vintage Dark Floral Tapestry', 'Minimalist Single Line Blossom', 'French Chintz Wildflower Pattern', 'Golden Outline Rose Bloom', 'Moody Midnight Violet Florals', 'Pastel Daisy Spring Field', 'Tropical Hibiscus Bloom']
  },
  {
    num: 74,
    id: 'botanical_bg',
    name: 'Botanical Background',
    icon: '🌿',
    group: 'elements',
    desc: 'Lush tropical foliage, monstera leaves, eucalyptus branches, and intricate greenhouse herbarium sketches.',
    patternTypes: ['botanical', 'leaves', 'barnsleyFern', 'dendriteCrystal'],
    baseColors: ['#022c22', '#059669', '#34d399', '#f0fdf4'],
    tags: ['botanical', 'foliage', 'monstera', 'eucalyptus', 'fern', 'greenery', 'jungle', 'herbarium', 'leaves'],
    subThemes: ['Monstera & Palm Tropical Jungle', 'Eucalyptus Branch Watercolor', 'Barnsley Fractal Fern Canopy', 'Deep Forest Pine Needles', 'Herbarium Pressed Flower Specimen', 'Golden Veined Velvet Foliage', 'Sage & Olive Minimalist Greenery', 'Amazonian Rainforest Canopy', 'Japanese Bonsai Needle Pattern', 'Succulent & Cactus Desert Garden']
  },
  {
    num: 75,
    id: 'leaf_bg',
    name: 'Leaf Background',
    icon: '🍃',
    group: 'elements',
    desc: 'Detailed leaf venation, autumn fallen foliage, ginkgo fans, and delicate chlorophyll micro-patterns.',
    patternTypes: ['leaves', 'botanical', 'barnsleyFern', 'reactionDiffusion'],
    baseColors: ['#14532d', '#22c55e', '#eab308', '#fef9c3'],
    tags: ['leaf', 'venation', 'autumn', 'ginkgo', 'foliage', 'chlorophyll', 'maple', 'nature', 'seasonal'],
    subThemes: ['Autumn Maple Golden Foliage', 'Ginkgo Biloba Fan Elegance', 'Microscopic Leaf Venation Network', 'Tropical Banana Leaf Wallpaper', 'Oak & Acorn Vintage Forest Pattern', 'Delicate Skeleton Leaf Transparency', 'Emerald Palm Frond Rhythm', 'Dewy Morning Clover Field', 'Olive Leaf Mediterranean Branch', 'Fallen Golden Leaves Cascade']
  },
  {
    num: 76,
    id: 'nature_bg',
    name: 'Nature Background',
    icon: '🌲',
    group: 'elements',
    desc: 'Panoramic scenic wilderness, mountain contour topography, river estuaries, and earthy landscapes.',
    patternTypes: ['topographicIso', 'crystalGeode', 'auroraBorealis', 'deepSeaCoral'],
    baseColors: ['#064e3b', '#047857', '#a7f3d0', '#fef3c7'],
    tags: ['nature', 'wilderness', 'landscape', 'mountain', 'topography', 'river', 'forest', 'earthy', 'scenic'],
    subThemes: ['Topographical Mountain Ridges', 'Pine Forest Morning Mist', 'Desert Sand Dune Sunset', 'Deep River Estuary Delta', 'Alpine Glacier Lake Horizon', 'Volcanic Basalt Columnar Rock', 'Savannah Sunset Wildlife Silhouette', 'Mossy Forest Floor Macro', 'Coastal Sea Cliff Crags', 'Enchanted Woodland Canopy']
  },
  {
    num: 77,
    id: 'marble_bg',
    name: 'Marble Background',
    icon: '🏛️',
    group: 'textures',
    desc: 'Carrara Italian white marble, liquid black obsidian veins, luxury gold-veined slab textures, and acrylic marbling.',
    patternTypes: ['marble', 'fluidTurbulence', 'reactionDiffusion'],
    baseColors: ['#09090b', '#d4af37', '#e4e4e7', '#ffffff'],
    tags: ['marble', 'carrara', 'calacatta', 'veins', 'stone', 'luxury', 'slab', 'acrylic marbling', 'granite'],
    subThemes: ['Italian Carrara White Gold Vein', 'Black Marquina Gold & White Veins', 'Emerald Green Malachite Marble', 'Rose Quartz Pink Marble Slab', 'Ocean Blue Sodalite Stone Vein', 'Calacatta Luxury Golden Ribbon', 'Fluid Acrylic Pour Marbling', 'Travertine Roman Warm Stone', 'Emperador Dark Chocolate Marble', 'Grey Bardiglio Cloud Veins']
  },
  {
    num: 78,
    id: 'stone_bg',
    name: 'Stone Background',
    icon: '🪨',
    group: 'textures',
    desc: 'Ancient slate quarries, granite mineral specks, river pebble mosaics, and weathered architectural stone.',
    patternTypes: ['gridNoise', 'cellularAutomata', 'voronoiCells'],
    baseColors: ['#1c1917', '#44403c', '#a8a29e', '#f5f5f4'],
    tags: ['stone', 'slate', 'granite', 'pebbles', 'quarry', 'rock', 'weathered', 'mineral', 'texture'],
    subThemes: ['Rough Natural Slate Quarry', 'Polished Granite Mineral Flecks', 'Zen River Pebble Mosaic', 'Limestone Fossilized Bedding', 'Sandstone Canyon Strata Layers', 'Basalt Volcanic Porous Rock', 'Flagstone Garden Pavement', 'Cobblestone Old Town Street', 'Weathered Cliff Rock Face', 'Terrazzo Stone Aggregate Flecks']
  },
  {
    num: 79,
    id: 'concrete_bg',
    name: 'Concrete Background',
    icon: '🏢',
    group: 'textures',
    desc: 'Raw brutalist concrete walls, industrial cement textures, weathered urban plaster, and modern architectural screed.',
    patternTypes: ['gridNoise', 'cellularAutomata', 'minimalLine'],
    baseColors: ['#27272a', '#52525b', '#a1a1aa', '#d4d4d8'],
    tags: ['concrete', 'cement', 'brutalist', 'industrial', 'urban', 'plaster', 'screed', 'architectural', 'wall'],
    subThemes: ['Brutalist Poured Formwork Concrete', 'Polished Modern Cement Screed', 'Industrial Weathered Concrete Wall', 'Urban Distressed Plaster Texture', 'Precast Concrete Architectural Panels', 'Cinder Block Construction Grid', 'Stained & Cracked Old Cement', 'Minimalist Off-White Micro-cement', 'Dark Anthracite Concrete Texture', 'Exposed Aggregate Concrete Surface']
  },
  {
    num: 80,
    id: 'paper_bg',
    name: 'Paper Background',
    icon: '📜',
    group: 'textures',
    desc: 'Handmade deckle-edge washi paper, vintage parchment scrolls, folded origami creases, and kraft paper textures.',
    patternTypes: ['gridNoise', 'minimalLine', 'squareGrid'],
    baseColors: ['#451a03', '#92400e', '#fef3c7', '#fffbeb'],
    tags: ['paper', 'washi', 'parchment', 'kraft', 'cardboard', 'deckle edge', 'origami', 'crumpled', 'texture'],
    subThemes: ['Handmade Japanese Washi Paper', 'Ancient Egyptian Papyrus Scroll', 'Crumpled Kraft Wrapping Paper', 'Vintage Watercolor Cold-press Sheet', 'Origami Geometric Creased Grid', 'Recycled Eco Cardboard Flecks', 'Architectural Drafting Vellum', 'Burned Edge Antique Parchment', 'Embossed Linen Business Card Paper', 'Clean Cream Cardstock Texture']
  },
  {
    num: 81,
    id: 'fabric_bg',
    name: 'Fabric Background',
    icon: '🧵',
    group: 'textures',
    desc: 'Natural organic linen weaves, heavy canvas textures, denim twill diagonals, and luxurious silk damasks.',
    patternTypes: ['woven', 'basketWeavePro', 'herringbone', 'houndstoothPro', 'abstractTextile'],
    baseColors: ['#1e1b4b', '#3b82f6', '#94a3b8', '#f8fafc'],
    tags: ['fabric', 'textile', 'linen', 'canvas', 'denim', 'silk', 'tweed', 'weave', 'cloth', 'threads'],
    subThemes: ['Natural Organic Flax Linen Weave', 'Indigo Blue Denim Twill Texture', 'Heavy Painter Raw Canvas', 'Luxury Silk Satin Drapery', 'Scottish Wool Tweed Herringbone', 'Waffle Knit Cotton Blanket', 'Corduroy Ribbed Velvet Fabric', 'Burlap Jute Rustic Sack Cloth', 'Cashmere Soft Knit Weave', 'Houndstooth Tailored Wool Cloth']
  },
  {
    num: 82,
    id: 'wood_bg',
    name: 'Wood Background',
    icon: '🪵',
    group: 'textures',
    desc: 'Natural oak annual growth rings, polished walnut parquet, rustic weathered barnwood planks, and mahogany grain.',
    patternTypes: ['marquetryWood', 'stripe', 'wave', 'reactionDiffusion'],
    baseColors: ['#451a03', '#78350f', '#b45309', '#fef3c7'],
    tags: ['wood', 'grain', 'oak', 'walnut', 'parquet', 'barnwood', 'planks', 'timber', 'rustic', 'lumber'],
    subThemes: ['Dark Polished American Walnut', 'Natural Light Scandinavian Oak', 'Rustic Reclaimed Barnwood Planks', 'Herringbone Parquet Hardwood Floor', 'Fine Growth Ring Wood Cross-section', 'Shou Sugi Ban Charred Japanese Wood', 'Rich Mahogany Luxury Marine Varnish', 'Distressed Bleached Driftwood', 'Bamboo Strip Sustainable Texture', 'Laser Marquetry Wood Inlay']
  },
  {
    num: 83,
    id: 'sand_bg',
    name: 'Sand Background',
    icon: '🏖️',
    group: 'textures',
    desc: 'Windswept desert dune ripples, tropical beach golden sands, zen garden raked gravel, and fine mineral grains.',
    patternTypes: ['wave', 'gridNoise', 'reactionDiffusion', 'sineLattice'],
    baseColors: ['#78350f', '#d97706', '#fcd34d', '#fef3c7'],
    tags: ['sand', 'desert', 'dunes', 'beach', 'zen garden', 'gravel', 'ripples', 'golden sand', 'mineral grains'],
    subThemes: ['Sahara Windblown Desert Dune Ripples', 'Tropical White Coral Beach Sand', 'Zen Garden Raked Gravel Spiral', 'Black Volcanic Sand Beach', 'Wet Shoreline Sand Reflection', 'Golden Quartz Sand Macro Grains', 'Desert Sandstorm Haze Texture', 'Pink Sand Island Shore', 'Layered Sandstone Dune Strata', 'Sand Dollar Ocean Tide Sand']
  },
  {
    num: 84,
    id: 'grain_bg',
    name: 'Grain Background',
    icon: '🌾',
    group: 'textures',
    desc: '35mm analog film grain, vintage photo noise overlays, textured cardstock speckles, and cinematic micro-noise.',
    patternTypes: ['gridNoise', 'quantumDots', 'cellularAutomata'],
    baseColors: ['#18181b', '#3f3f46', '#71717a', '#f4f4f5'],
    tags: ['grain', 'film grain', '35mm', 'analog', 'noise', 'speckles', 'vintage photo', 'micro noise', 'texture'],
    subThemes: ['Kodak Tri-X 400 Heavy 35mm Film Grain', 'Subtle 16mm Indie Movie Grain Overlay', 'Vintage Kodachrome Color Film Noise', 'Warm Textured Cardstock Specks', 'Cinematic Noir ISO 6400 Grain', 'Retro VHS Tape Grain & Scanline', 'Organic Oatmeal Paper Grain', 'Digital Sensor Noise Texture', 'Pastel Dust Grain Overlay', 'Micro-dot Fine Grain Screen']
  },
  {
    num: 85,
    id: 'noise_bg',
    name: 'Noise Background',
    icon: '📻',
    group: 'textures',
    desc: 'Perlin algorithmic turbulence, TV static white noise, value noise fields, and procedural fractal noise textures.',
    patternTypes: ['gridNoise', 'fluidTurbulence', 'strangeAttractor'],
    baseColors: ['#09090b', '#27272a', '#71717a', '#ffffff'],
    tags: ['noise', 'perlin', 'static', 'white noise', 'procedural', 'fractal noise', 'simplex', 'tv static'],
    subThemes: ['Perlin Fractal Noise Clouds', 'Simplex Organic Noise Flow', 'Analog TV Static White Noise', 'Glitch RGB Chromatic Noise', 'High-frequency Digital Salt & Pepper', 'Smooth Gradient Noise Wash', 'Cyberpunk Matrix Noise Field', 'Bioluminescent Noise Spores', 'Subtle UI Background Noise Texture', 'Quantum Vacuum Noise Dispersion']
  },
  {
    num: 86,
    id: 'halftone_bg',
    name: 'Halftone Background',
    icon: '📰',
    group: 'textures',
    desc: 'Vintage newsprint dot screens, comic book benday dots, screen printing gradients, and pop art reproduction textures.',
    patternTypes: ['halftonePopArt', 'polkaDot', 'cellularAutomata'],
    baseColors: ['#0f172a', '#dc2626', '#3b82f6', '#ffffff'],
    tags: ['halftone', 'newsprint', 'comic book', 'benday dots', 'screen print', 'pop art', 'cmyk', 'dots', 'vintage print'],
    subThemes: ['Golden Age Comic Ben-Day Dots', 'Vintage Newspaper Offset Print Screen', 'CMYK 4-Color Rosette Screen Print', 'Radial Halftone Sunburst Dot Pattern', 'Pop Art Lichtenstein Heavy Halftone', 'High-contrast Monochrome Dot Mesh', 'Distressed Grunge Halftone Overlay', 'Cyber Neon Halftone Wave', 'Pastel Comic Book Dots Backdrop', 'Halftone Typography Screening']
  },
  {
    num: 87,
    id: 'grunge_bg',
    name: 'Grunge Background',
    icon: '🎸',
    group: 'textures',
    desc: 'Distressed urban street textures, peeled paint graffiti, rust oxidation, scratched metal, and 90s alternative grit.',
    patternTypes: ['gridNoise', 'cellularAutomata', 'abstractLine'],
    baseColors: ['#1c1917', '#44403c', '#78716c', '#e7e5e4'],
    tags: ['grunge', 'distressed', 'peeled paint', 'rust', 'scratched', 'grit', '90s', 'urban', 'industrial', 'raw'],
    subThemes: ['Peeled Wall Paint & Graffiti Layers', 'Industrial Rust & Corrosion Texture', '90s Alternative Rock Album Grit', 'Scratched & Scuffed Metal Plate', 'Urban Concrete Grimy Wall', 'Distressed Ink Stains & Splatters', 'Torn Poster Billboard Paper', 'Dark Gothic Distressed Parchment', 'Acid Wash Denim Grunge', 'Skate Park Weathered Wood & Dirt']
  },
  {
    num: 88,
    id: 'vintage_bg',
    name: 'Vintage Background',
    icon: '🕰️',
    group: 'vintage',
    desc: 'Victorian copperplate engravings, antique damasks, heritage sepia botanicals, and classic art nouveau filigree.',
    patternTypes: ['versaceBaroque', 'artDecoFan', 'arabesqueScroll', 'houndstoothPro'],
    baseColors: ['#451a03', '#92400e', '#d97706', '#fef3c7'],
    tags: ['vintage', 'antique', 'victorian', 'heritage', 'sepia', 'copperplate', 'engraving', 'art nouveau', 'filigree'],
    subThemes: ['Victorian Copperplate Floral Engraving', '19th Century Antique Map Cartography', 'Art Nouveau Alphonse Mucha Curves', 'Heritage Damask Wallpaper in Sepia', 'Vintage Postcard & Postal Stamps', 'Aged Sepia Botanical Book Plate', 'Classical Baroque Gold Filigree Frieze', 'Old Apothecary Label & Script', 'Edwardian Lace Textile Wallpaper', 'Roaring 20s Gatsby Fan Pattern']
  },
  {
    num: 89,
    id: 'retro_bg',
    name: 'Retro Background',
    icon: '📺',
    group: 'vintage',
    desc: 'Mid-century atomic boomerangs, 70s groovy rainbow stripes, 80s arcade synthwaves, and retro psychedelic patterns.',
    patternTypes: ['retro', 'memphis', 'retrofuturism', 'wave'],
    baseColors: ['#7c2d12', '#ea580c', '#eab308', '#0284c7'],
    tags: ['retro', '70s', '80s', 'mid-century', 'atomic', 'groovy', 'arcade', 'synthwave', 'psychedelic', 'nostalgia'],
    subThemes: ['70s Warm Groovy Rainbow Waves', 'Mid-Century Modern Atomic Boomerangs', '80s Arcade Synthwave Grid Sunset', '60s Psychedelic Swirling Waves', 'Retro Cassette Tape Geometric Grid', 'Diner Checkerboard & Neon Stripes', 'Vintage Motel Keychain Art Deco', 'Retro Sci-Fi Horizon Wireframe', 'Space Age 1960s Pod Geometric', 'Vintage Bowling Alley Funky Carpet']
  },
  {
    num: 90,
    id: 'y2k_bg',
    name: 'Y2K Background',
    icon: '🛸',
    group: 'vintage',
    desc: 'Year 2000 millennium bug aesthetics, cyber chrome typography, liquid blob shapes, frutiger aero, and holographic stars.',
    patternTypes: ['opArtTunnel', 'fluidTurbulence', 'cyberpunkCircuit', 'gradient'],
    baseColors: ['#0f172a', '#06b6d4', '#ec4899', '#38bdf8'],
    tags: ['y2k', '2000s', 'frutiger aero', 'cyber chrome', 'liquid blob', 'holographic stars', 'millennium', 'nostalgia'],
    subThemes: ['Cyber Chrome 4-Point Metallic Stars', 'Frutiger Aero Water Droplets & Sky', 'Liquid Metallic Blob Morphing', 'CD-ROM Holographic Rainbow Glint', 'Matrix Green Code Screen Glitch', 'Cyber Fairy Sparkle Y2K Grid', 'Inflatable Plastic Translucent Shapes', 'Bubblegum Pop Pink & Silver Wave', 'Cyber Y2K Wireframe Butterfly', 'Futuristic 2000s Tech UI Portal']
  },
  {
    num: 91,
    id: 'cyberpunk_bg',
    name: 'Cyberpunk Background',
    icon: '🦾',
    group: 'tech',
    desc: 'Neon-lit rain-slicked mega-cities, glowing PCB circuitry, holographic glitches, high-tech noir, and cyber interfaces.',
    patternTypes: ['cyberpunkCircuit', 'matrixRain', 'isometric', 'grid'],
    baseColors: ['#050510', '#ff007f', '#00f0ff', '#39ff14'],
    tags: ['cyberpunk', 'pcb', 'circuit', 'neon', 'matrix', 'glitch', 'sci-fi', 'high-tech', 'noir', 'megacity'],
    subThemes: ['Glowing PCB Microchip Trace Lines', 'Rainy Tokyo Cyberpunk Alley Neon', 'Matrix Digital Green Binary Cascade', 'Holographic HUD Glitch & Scanline', 'High-voltage Magenta & Cyan Grid', 'Cyber Samurai Glowing Katana Stream', 'Dystopian Mega-corp Server Rack', 'Bionic Prosthetic Wireframe Net', 'Neural Link Synaptic Signal Glow', 'Dark Net Crypto Terminal Interface']
  },
  {
    num: 92,
    id: 'futuristic_bg',
    name: 'Futuristic Background',
    icon: '🚀',
    group: 'tech',
    desc: 'Clean spaceship interiors, hyperloop speed tunnels, quantum computer topologies, and sleek high-tech horizons.',
    patternTypes: ['opArtTunnel', 'isometric', 'meshWireframe', 'grid'],
    baseColors: ['#020617', '#0284c7', '#38bdf8', '#f8fafc'],
    tags: ['futuristic', 'sci-fi', 'spaceship', 'hyperloop', 'quantum', 'topology', 'high-tech', 'aerospace', 'modern'],
    subThemes: ['Hyperloop High-Speed Light Tunnel', 'Clean White Spaceship Corridor View', 'Quantum Computer Superconductor Core', 'Sci-Fi Warp Drive Gravitational Ring', 'Sleek Aerospace Hexagonal Armor', 'AI Neural Core Synapse Network', 'Futuristic Smart City Skyline Grid', 'Ion Thruster Blue Plasma Trail', 'Exoplanet Colony Dome Interior', 'Holographic Star Navigation Chart']
  },
  {
    num: 93,
    id: 'technology_bg',
    name: 'Technology Background',
    icon: '💻',
    group: 'tech',
    desc: 'Abstract digital data flows, server room optics, fiber optic pulses, cloud computing networks, and motherboard traces.',
    patternTypes: ['cyberpunkCircuit', 'matrixRain', 'squareGrid', 'vectorFlowField'],
    baseColors: ['#0b0f19', '#1d4ed8', '#38bdf8', '#e2e8f0'],
    tags: ['technology', 'tech', 'data', 'cloud', 'server', 'fiber optic', 'motherboard', 'digital', 'networking'],
    subThemes: ['Fiber Optic High-Speed Light Pulses', 'Global Cloud Server Network Grid', 'Abstract Big Data Velocity Streams', 'Silicon Microprocessor Die Architecture', 'AI Machine Learning Node Lattice', '5G Wireless Telecommunication Waves', 'Quantum Cryptography Qubit Grid', 'Automated DevOps Pipeline Matrix', 'Clean SaaS Platform Digital Canvas', 'High-frequency Financial Data Flow']
  },
  {
    num: 94,
    id: 'digital_bg',
    name: 'Digital Background',
    icon: '📱',
    group: 'tech',
    desc: 'Binary code cascades, digital glitch noise, pixel matrix displays, virtual reality voxels, and cyber spaces.',
    patternTypes: ['matrixRain', 'gridNoise', 'isometric', 'squareGrid'],
    baseColors: ['#030712', '#06b6d4', '#3b82f6', '#10b981'],
    tags: ['digital', 'binary', 'glitch', 'pixel', 'virtual reality', 'voxels', 'cyber space', 'matrix', 'screens'],
    subThemes: ['Cascade of Green Matrix Binary Digits', 'RGB Screen Pixel Sub-pixel Lattice', 'Digital Waveform Audio Visualizer', 'Virtual Reality 3D Voxel World', 'Digital Glitch Displacement Slice', 'LED Screen Broadcast Grid Texture', 'Cyber Space Infinite Coordinate Room', 'Dynamic Digital Particle Cloud', 'Pixel Art Retrowave Landscape', 'Cryptographic Hash Hexadecimal Stream']
  },
  {
    num: 95,
    id: 'blockchain_bg',
    name: 'Blockchain Background',
    icon: '⛓️',
    group: 'tech',
    desc: 'Decentralized peer-to-peer node webs, cryptographic block chains, tokenized digital asset networks, and ledger grids.',
    patternTypes: ['isometric', 'meshWireframe', 'interlockingGrid', 'hexagonal'],
    baseColors: ['#0f172a', '#f59e0b', '#3b82f6', '#f8fafc'],
    tags: ['blockchain', 'crypto', 'nodes', 'decentralized', 'p2p', 'cryptography', 'ledger', 'smart contracts', 'bitcoin'],
    subThemes: ['Decentralized P2P Node Network', 'Cryptographic Linked Block Chains', 'Smart Contract Distributed Ledger Grid', 'Ethereum Proof-of-Stake Validator Web', 'Bitcoin Golden Ingot Digital Mesh', 'DeFi Liquidity Pool Streamlines', 'Zero-Knowledge Proof Mathematical Graph', 'NFT Tokenized Hexagonal Vault', 'Cross-chain Interoperability Bridge', 'Consensus Algorithm Hash Matrix']
  },
  {
    num: 96,
    id: 'business_bg',
    name: 'Business Background',
    icon: '💼',
    group: 'business',
    desc: 'Corporate executive pinstripes, global financial charts, boardroom presentation backdrops, and modern enterprise grids.',
    patternTypes: ['business', 'squareGrid', 'stripe', 'isometric', 'houndstoothPro', 'grid'],
    baseColors: ['#0f172a', '#1e3a8a', '#3b82f6', '#f8fafc'],
    tags: ['business', 'corporate', 'finance', 'executive', 'enterprise', 'annual report', 'presentation', 'office', 'growth'],
    subThemes: ['Executive Navy Blue Pinstripe Elegance', 'Global Financial Growth Trendlines', 'Modern Corporate Annual Report Grid', 'Minimalist Slate Gray Presentation Slide', 'Enterprise SaaS Architecture Backdrop', 'Wall Street Stock Market Data Lattice', 'Sophisticated Executive Charcoal Texture', 'Clean Modernist Office Interior Lines', 'Gold & Dark Navy Corporate Crest Backdrop', 'Dynamic Global Business Trade Network']
  }
];

// Helper to generate 100 distinctive subcategories for a given category
function generateSubcategoriesForCategory(cat) {
  const subCats = [];
  const styles = [
    'Modern Minimalist', 'Luxury 24K Gold', 'High-Contrast Cyber', 'Subtle Tone-on-Tone',
    'Vibrant Neon Glow', 'Nordic Clean', 'Cinematic Noir', 'Pastel Aesthetic',
    '3D Volumetric Depth', 'Vintage Heritage'
  ];

  const modifiers = [
    'Ultra-High Resolution 8K Texture',
    'Seamless Repeating Edge-Matched Vector',
    'Dynamic Light Caustics & Specular Shimmer',
    'Moody Atmospheric Depth & Volumetric Shadow',
    'Clean Professional Presentation Backdrop',
    'Hyper-Detailed Generative Vector Flow',
    'Ethereal Ambient Glow with Soft Falloff',
    'Geometric Precision with Golden Ratio Symmetry',
    'High-End Editorial Stock Ready Artwork',
    'Sleek Glassmorphism with Smooth Blur Highlights'
  ];

  // Mix subThemes (10 themes) x 10 unique style variations = 100 sub-categories per category!
  let counter = 1;
  cat.subThemes.forEach((theme, tIdx) => {
    styles.forEach((style, sIdx) => {
      const id = `${cat.id}_${String(counter).padStart(3, '0')}`;
      const subName = `${theme} — ${style}`;
      const mod = modifiers[(tIdx + sIdx) % modifiers.length];
      const prompt = `${subName}: ${cat.desc} Features ${theme.toLowerCase()} with ${style.toLowerCase()} styling, curated color harmony, and ${mod.toLowerCase()}.`;
      
      // Compute specialized variation colors
      const colorSet = [...cat.baseColors];
      if (sIdx % 3 === 1) {
        colorSet[1] = '#f59e0b'; // Gold tint
      } else if (sIdx % 3 === 2) {
        colorSet[1] = '#06b6d4'; // Cyan tint
      }

      subCats.push({
        id,
        num: counter,
        name: subName,
        shortName: `${theme} (${style})`,
        theme: theme,
        style: style,
        prompt: prompt,
        colors: colorSet,
        patternType: cat.patternTypes[(tIdx + sIdx) % cat.patternTypes.length]
      });
      counter++;
    });
  });

  return subCats;
}

// Build complete data array
const FULL_CATEGORIES = CATEGORY_DEFINITIONS.map(cat => {
  const subCategories = generateSubcategoriesForCategory(cat);
  const suggestedPrompts = [
    subCategories[0].prompt,
    subCategories[25].prompt,
    subCategories[50].prompt
  ];

  return {
    num: cat.num,
    id: cat.id,
    name: cat.name,
    icon: cat.icon,
    group: cat.group,
    description: cat.desc,
    tags: cat.tags,
    patternTypes: cat.patternTypes,
    suggestedPrompts: suggestedPrompts,
    subCategoriesCount: subCategories.length,
    subCategories: subCategories
  };
});

// Output code for data/categories.js
const fileHeader = `'use strict';
/**
 * AI Pattern & Image Design Studio PRO — data/categories.js
 * Comprehensive 96 Background Categories with 100 Curated Sub-categories Each (Total 9,600 Sub-categories)
 * Each category contains: id, num, name, icon, group, description, tags, patternTypes, suggestedPrompts, subCategories
 */

const PATTERN_CATEGORIES = ${JSON.stringify(FULL_CATEGORIES, null, 2)};

// ─── Utility Helper Functions ───────────────────────────────────────────────
const CategoryEngine = {
  getAll() {
    return PATTERN_CATEGORIES;
  },

  getById(id) {
    if (!id) return null;
    return PATTERN_CATEGORIES.find(c => c.id === id || c.id.replace('_bg', '') === id.replace('_bg', '')) || null;
  },

  getByGroup(group) {
    if (!group || group === 'all') return PATTERN_CATEGORIES;
    return PATTERN_CATEGORIES.filter(c => c.group === group);
  },

  getSubCategories(catId) {
    const cat = this.getById(catId);
    return cat ? cat.subCategories : [];
  },

  search(query, group = 'all') {
    const q = (query || '').toLowerCase().trim();
    return PATTERN_CATEGORIES.filter(cat => {
      const matchGroup = group === 'all' || cat.group === group || (cat.tags && cat.tags.includes(group));
      if (!matchGroup) return false;
      if (!q) return true;
      return (
        cat.name.toLowerCase().includes(q) ||
        cat.description.toLowerCase().includes(q) ||
        (cat.tags && cat.tags.some(t => t.toLowerCase().includes(q))) ||
        (cat.subCategories && cat.subCategories.some(sub => sub.name.toLowerCase().includes(q) || sub.theme.toLowerCase().includes(q)))
      );
    });
  },

  getRandomSubcategory(catId = null) {
    let cat = catId ? this.getById(catId) : null;
    if (!cat) {
      cat = PATTERN_CATEGORIES[Math.floor(Math.random() * PATTERN_CATEGORIES.length)];
    }
    if (!cat || !cat.subCategories || cat.subCategories.length === 0) return null;
    const sub = cat.subCategories[Math.floor(Math.random() * cat.subCategories.length)];
    return { category: cat, subCategory: sub };
  }
};

if (typeof window !== 'undefined') {
  window.PATTERN_CATEGORIES = PATTERN_CATEGORIES;
  window.CategoryEngine = CategoryEngine;
}
if (typeof module !== 'undefined') {
  module.exports = PATTERN_CATEGORIES;
  module.exports.PATTERN_CATEGORIES = PATTERN_CATEGORIES;
  module.exports.CategoryEngine = CategoryEngine;
}
`;

const targetPath = path.join(__dirname, '../data/categories.js');
fs.writeFileSync(targetPath, fileHeader, 'utf8');
console.log(`✅ Successfully generated data/categories.js with ${FULL_CATEGORIES.length} categories and ${FULL_CATEGORIES.length * 100} total sub-categories.`);
