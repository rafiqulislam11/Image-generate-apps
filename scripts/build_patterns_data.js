'use strict';
/**
 * scripts/build_patterns_data.js
 * Generates the complete 100 Core Pattern Categories dataset with 100 sub-patterns each (total 10,000 sub-patterns).
 */

const fs = require('fs');
const path = require('path');

const PATTERN_CATEGORY_DEFINITIONS = [
  {
    num: 1,
    id: 'geometric_pattern',
    name: 'Geometric Pattern',
    icon: '📐',
    group: 'geometric',
    desc: 'Mathematical tessellations, precise polygons, interlocking isometric structures, and clean modern angles.',
    patternTypes: ['geometric', 'isometric', 'squareGrid', 'triangle', 'diamond', 'hexagonal', 'bauhausGeo'],
    baseColors: ['#0f172a', '#3b82f6', '#10b981', '#f8fafc'],
    tags: ['geometric', 'polygonal', 'tessellation', 'isometric', 'cubes', 'angles', 'modern', 'seamless', 'minimal'],
    subThemes: ['Isometric Cube Matrix', 'Tessellated Polygon Mesh', 'Bauhaus Multi-shape Geometry', 'Interlocking Hexagonal Hive', 'Fractal Sierpinski Triangles', 'Low-Poly 3D Facet Grid', 'Diamond Harlequin Lattice', 'Penrose Non-periodic Tile', 'Minimalist Tangram Rhythm', 'Precision Vector Polygonal Flow']
  },
  {
    num: 2,
    id: 'abstract_pattern',
    name: 'Abstract Pattern',
    icon: '🎨',
    group: 'abstract',
    desc: 'Fluid dynamic flow fields, non-representational generative lines, chaotic vectors, and vibrant artistic rhythms.',
    patternTypes: ['abstractLine', 'abstractTextile', 'vectorFlowField', 'fluidTurbulence', 'strangeAttractor', 'marble'],
    baseColors: ['#0f172a', '#ec4899', '#6366f1', '#f8fafc'],
    tags: ['abstract', 'fluid', 'flow field', 'generative', 'chaos', 'artistic', 'modern', 'vibrant', 'vector'],
    subThemes: ['Dynamic Flow Field Ribbons', 'Chaotic Strange Attractor', 'Prismatic Marble Turbulence', 'Abstract Vector Brush Strokes', 'Minimalist Linear Tension', 'Generative Fluid Ribbon Mesh', 'Cosmic Dispersion Flow', 'High-energy Splatter Dynamics', 'Abstract Textile Thread Weave', 'Deconstructed Shape Collage']
  },
  {
    num: 3,
    id: 'floral_pattern',
    name: 'Floral Pattern',
    icon: '🌸',
    group: 'botanical',
    desc: 'Delicate blossom bouquets, romantic English roses, cherry blossoms, and blooming petals.',
    patternTypes: ['floral', 'roseCurve', 'rhodoneaRose', 'botanical'],
    baseColors: ['#881337', '#f43f5e', '#fecdd3', '#fff1f2'],
    tags: ['floral', 'flower', 'blossom', 'rose', 'bouquet', 'petals', 'spring', 'romantic', 'vintage floral', 'wallpaper'],
    subThemes: ['Vintage Victorian Rose Bouquet', 'Japanese Sakura Cherry Blossom', 'English Chintz Wildflowers', 'Watercolor Peony & Hydrangea', 'Delicate Daisy Meadow', 'Golden Outline Botanical Rose', 'Dark Moody Midnight Florals', 'French Countryside Blossom', 'Baroque Acanthus Flower Scroll', 'Pastel Botanical Flower Bed']
  },
  {
    num: 4,
    id: 'botanical_pattern',
    name: 'Botanical Pattern',
    icon: '🌿',
    group: 'botanical',
    desc: 'Lush tropical greenery, monstera foliage, eucalyptus sprigs, and pressed herbarium sketches.',
    patternTypes: ['botanical', 'leaves', 'barnsleyFern', 'dendriteCrystal'],
    baseColors: ['#022c22', '#059669', '#34d399', '#f0fdf4'],
    tags: ['botanical', 'foliage', 'monstera', 'eucalyptus', 'fern', 'greenery', 'jungle', 'herbarium', 'leaves'],
    subThemes: ['Monstera & Palm Tropical Jungle', 'Eucalyptus Sprig Watercolor', 'Fractal Barnsley Fern Canopy', 'Deep Forest Pine Needles', 'Pressed Herbarium Specimen Sheet', 'Golden Veined Velvet Foliage', 'Sage & Olive Minimalist Greenery', 'Amazonian Rainforest Canopy', 'Japanese Bonsai Needle Pattern', 'Succulent & Cactus Desert Garden']
  },
  {
    num: 5,
    id: 'leaf_pattern',
    name: 'Leaf Pattern',
    icon: '🍃',
    group: 'botanical',
    desc: 'Intricate leaf venation, autumn maple foliage, ginkgo biloba fans, and tropical fronds.',
    patternTypes: ['leaves', 'botanical', 'barnsleyFern', 'reactionDiffusion'],
    baseColors: ['#14532d', '#22c55e', '#eab308', '#fef9c3'],
    tags: ['leaf', 'leaves', 'foliage', 'ginkgo', 'autumn', 'venation', 'chlorophyll', 'maple', 'palm frond'],
    subThemes: ['Autumn Golden Maple Leaf Fall', 'Ginkgo Biloba Fan Elegance', 'Microscopic Leaf Venation Network', 'Tropical Banana Leaf Wallpaper', 'Oak & Acorn Vintage Forest Pattern', 'Delicate Skeleton Leaf Transparency', 'Emerald Palm Frond Rhythm', 'Dewy Morning Clover Field', 'Olive Leaf Mediterranean Branch', 'Fallen Golden Leaves Cascade']
  },
  {
    num: 6,
    id: 'flower_pattern',
    name: 'Flower Pattern',
    icon: '🌻',
    group: 'botanical',
    desc: 'Sunny sunflowers, tulips, lotus blooms, orchids, and vibrant botanical garden flora.',
    patternTypes: ['floral', 'roseCurve', 'rhodoneaRose', 'mandala'],
    baseColors: ['#78350f', '#eab308', '#facc15', '#fefce8'],
    tags: ['flower', 'sunflower', 'tulip', 'lotus', 'orchid', 'bloom', 'garden', 'flora', 'petals'],
    subThemes: ['Golden Sunflower Summer Field', 'Dutch Vibrant Tulip Garden', 'Sacred Lotus Pond Petals', 'Exotic Orchid Greenhouse Bloom', 'Minimalist Monoline Tulip Sketch', 'Daffodil Springtime Meadow', 'Poppy Flower Crimson Meadow', 'Lavender Spike Provence Field', 'Carnation Bouquet Vintage Print', 'Jasmine Night Blossom Garland']
  },
  {
    num: 7,
    id: 'tropical_pattern',
    name: 'Tropical Pattern',
    icon: '🌴',
    group: 'botanical',
    desc: 'Vibrant jungle paradises, hibiscus blooms, toucans, palm leaves, and Caribbean exotic vibes.',
    patternTypes: ['botanical', 'leaves', 'floral', 'organic'],
    baseColors: ['#064e3b', '#10b981', '#f43f5e', '#fbbf24'],
    tags: ['tropical', 'jungle', 'paradise', 'hibiscus', 'palm', 'caribbean', 'exotic', 'hawaiian', 'summer'],
    subThemes: ['Hawaiian Hibiscus & Palm Fronds', 'Caribbean Paradise Jungle', 'Exotic Toucan & Flora Tapestry', 'Tiki Island Vintage Print', 'Lush Banana Palm Tropicana', 'Amazonian Parrot & Greenery', 'Neon Tropical Night Safari', 'Pastel Resort Palm Silhouette', 'Balinese Tropical Garden Villa', 'Plumeria Frangipani Blossom']
  },
  {
    num: 8,
    id: 'nature_pattern',
    name: 'Nature Pattern',
    icon: '🌲',
    group: 'nature',
    desc: 'Topographic contour ridges, river waterways, woodland landscapes, and organic wilderness.',
    patternTypes: ['topographicIso', 'crystalGeode', 'auroraBorealis', 'deepSeaCoral'],
    baseColors: ['#064e3b', '#047857', '#a7f3d0', '#fef3c7'],
    tags: ['nature', 'wilderness', 'topography', 'mountain', 'river', 'forest', 'woodland', 'scenic', 'organic'],
    subThemes: ['Topographical Mountain Ridges', 'Pine Forest Morning Mist', 'Desert Sand Dune Sunset', 'Deep River Estuary Delta', 'Alpine Glacier Lake Horizon', 'Volcanic Basalt Columnar Rock', 'Savannah Sunset Wildlife Silhouette', 'Mossy Forest Floor Macro', 'Coastal Sea Cliff Crags', 'Enchanted Woodland Canopy']
  },
  {
    num: 9,
    id: 'animal_pattern',
    name: 'Animal Pattern',
    icon: '🐆',
    group: 'animals',
    desc: 'High-fashion leopard spots, zebra stripes, tiger stripes, cheetah coats, and exotic wildlife skins.',
    patternTypes: ['tartarugaTortoise', 'reactionDiffusion', 'organicFlow', 'wave'],
    baseColors: ['#451a03', '#d97706', '#fde68a', '#18181b'],
    tags: ['animal', 'leopard', 'zebra', 'cheetah', 'tiger', 'wildlife', 'skin', 'fur', 'fashion print', 'safari'],
    subThemes: ['Luxury Haute Couture Leopard Spot', 'High-Contrast Zebra Wave Stripes', 'Bengal Tiger Striped Fur Texture', 'Cheetah Fine Spotted Coat', 'Giraffe Hexagonal Skin Patches', 'Cowhide Rustic Ranch Pattern', 'Snake Scale Exotic Leather Texture', 'Crocodile Embossed Luxury Skin', 'Dalmatian Spot Fashion Print', 'Snow Leopard Muted Silver Spots']
  },
  {
    num: 10,
    id: 'bird_pattern',
    name: 'Bird Pattern',
    icon: '🦜',
    group: 'animals',
    desc: 'Exotic parrots, soaring swallows, flamingos, peacocks, and delicate feathered plumage.',
    patternTypes: ['organicFlow', 'floral', 'doodle', 'wave'],
    baseColors: ['#0c4a6e', '#0284c7', '#ec4899', '#fef08a'],
    tags: ['bird', 'swallow', 'flamingo', 'peacock', 'parrot', 'feathers', 'flight', 'wings', 'avian'],
    subThemes: ['Vintage Soaring Swallow Silhouette', 'Tropical Pink Flamingo Lagoon', 'Majestic Peacock Feather Fan', 'Exotic Amazonian Macaw Birds', 'Hummingbird & Nectar Blossoms', 'Nordic Flying Crane Migration', 'Minimalist Single Line Flying Birds', 'Owl & Moon Midnight Forest', 'Japanese Oriole Cherry Tree', 'Golden Eagle Wing Feather Texture']
  },
  {
    num: 11,
    id: 'butterfly_pattern',
    name: 'Butterfly Pattern',
    icon: '🦋',
    group: 'animals',
    desc: 'Iridescent monarch wings, fluttering morpho butterflies, chrysalis moths, and delicate botanical flights.',
    patternTypes: ['roseCurve', 'rhodoneaRose', 'mandala', 'organicFlow'],
    baseColors: ['#1e1b4b', '#6366f1', '#ec4899', '#38bdf8'],
    tags: ['butterfly', 'monarch', 'morpho', 'wings', 'flutter', 'moth', 'chrysalis', 'delicate', 'entomology'],
    subThemes: ['Blue Morpho Iridescent Wings', 'Monarch Orange Stained Glass Wing', 'Vintage Entomology Specimen Chart', 'Fluttering Garden Butterfly Swarm', 'Golden Filigree Butterfly Silhouette', 'Mystic Luna Moth Crescent Moon', 'Watercolor Pastel Butterfly Flight', 'Minimalist Monoline Butterfly Sketch', 'Neon Cyberpunk Butterfly Wireframe', 'Botanical Meadow with Butterflies']
  },
  {
    num: 12,
    id: 'insect_pattern',
    name: 'Insect Pattern',
    icon: '🐝',
    group: 'animals',
    desc: 'Honeybees, jewel beetles, dragonflies, ladybugs, and intricate entomological illustrations.',
    patternTypes: ['hexagonal', 'doodle', 'polkaDot', 'cellularAutomata'],
    baseColors: ['#78350f', '#f59e0b', '#10b981', '#0f172a'],
    tags: ['insect', 'honeybee', 'beetle', 'dragonfly', 'ladybug', 'entomology', 'hive', 'bugs', 'nature'],
    subThemes: ['Golden Honeybee & Hex Comb', 'Iridescent Jewel Scarab Beetle', 'Delicate Dragonfly Gossamer Wings', 'Cute Red & Black Ladybug Dots', 'Vintage Victorian Insect Illustration', 'Geometric Origami Insects', 'Firefly Night Glow Meadow', 'Cicada Wing Fine Lacework', 'Bioluminescent Cave Insects', 'Minimalist Brass Bug Silhouettes']
  },
  {
    num: 13,
    id: 'fish_pattern',
    name: 'Fish Pattern',
    icon: '🐟',
    group: 'marine',
    desc: 'Japanese koi carp in lotus ponds, tropical reef fish, schooling sardines, and shimmering fish scales.',
    patternTypes: ['fishScales', 'wave', 'organicFlow', 'reactionDiffusion'],
    baseColors: ['#0f172a', '#ea580c', '#38bdf8', '#ffffff'],
    tags: ['fish', 'koi', 'carp', 'scales', 'school of fish', 'pond', 'aquarium', 'marine', 'swimming'],
    subThemes: ['Traditional Japanese Koi Pond', 'Tropical Coral Clownfish & Tangs', 'Synchronized Schooling Sardines', 'Golden Fish Scale Repeating Tile', 'Minimalist Ink Brush Koi Swirl', 'Deep Sea Bioluminescent Angler', 'Watercolor Goldfish in Water', 'Betta Fighting Fish Flowing Fins', 'Salmon River Upstream Migration', 'Geometric Origami Fish Grid']
  },
  {
    num: 14,
    id: 'ocean_pattern',
    name: 'Ocean Pattern',
    icon: '🌊',
    group: 'marine',
    desc: 'Undulating sea swells, seigaiha wave arches, marine caustics, and deep blue abyssal horizons.',
    patternTypes: ['wave', 'deepSeaCoral', 'organicFlow', 'fluidTurbulence'],
    baseColors: ['#020617', '#0369a1', '#06b6d4', '#e0f2fe'],
    tags: ['ocean', 'sea', 'waves', 'seigaiha', 'swell', 'marine', 'tide', 'surf', 'water'],
    subThemes: ['Japanese Seigaiha Arch Waves', 'Deep Pacific Cresting Swell', 'Sunlit Turquoise Coral Lagoon', 'Bioluminescent Midnight Surf', 'Submarine Light Ray Columns', 'Foamy Shoreline Wave Crests', 'Vintage Nautical Ocean Map', 'Minimalist Fine Line Sea Waves', 'Abstract Fluid Wave Turbulence', 'Arctic Ice Floe Ocean Current']
  },
  {
    num: 15,
    id: 'marine_pattern',
    name: 'Marine Pattern',
    icon: '⚓',
    group: 'marine',
    desc: 'Nautical ship anchors, sailing compasses, sea turtles, octopuses, and ocean explorer motifs.',
    patternTypes: ['wave', 'deepSeaCoral', 'stripe', 'doodle'],
    baseColors: ['#0f172a', '#1e3a8a', '#dc2626', '#f8fafc'],
    tags: ['marine', 'nautical', 'anchor', 'compass', 'octopus', 'sea turtle', 'sailing', 'navy', 'ocean'],
    subThemes: ['Classic Navy Nautical Anchor & Rope', 'Mystic Giant Octopus Tentacles', 'Sea Turtle Swimming Reef', 'Vintage Brass Maritime Compass', 'Breton Navy & Red Nautical Stripes', 'Jellyfish Flowing Bioluminescent Tentacles', 'Submerged Ancient Shipwreck & Coral', 'Starfish & Sea Urchin Floor', 'Deep Ocean Submersible Wireframe', 'Sailboat Horizon Sketch Pattern']
  },
  {
    num: 16,
    id: 'shell_pattern',
    name: 'Shell Pattern',
    icon: '🐚',
    group: 'marine',
    desc: 'Nautilus golden spirals, scallop shells, sea conches, cowrie beads, and beach treasure mosaics.',
    patternTypes: ['goldSpiral', 'archimedeanSpiral', 'wave', 'polkaDot'],
    baseColors: ['#78350f', '#d97706', '#fde68a', '#fffbeb'],
    tags: ['shell', 'seashell', 'scallop', 'nautilus', 'conch', 'cowrie', 'spiral', 'beach', 'coastal'],
    subThemes: ['Fibonacci Golden Nautilus Spiral', 'Classic Venus Scallop Shell Tile', 'Spiral Conch & Sand Dunes', 'Polished Mother-of-Pearl Shell Inlay', 'Cowrie Shell Tribal Necklace Rhythm', 'Sea Snail Fossilized Spiral Stone', 'Pastel Coastal Beach Shell Mosaic', 'Minimalist Line Art Scallop Fan', 'Watercolor Beachcomber Treasures', 'Vintage Sea Shell Scientific Plate']
  },
  {
    num: 17,
    id: 'fruit_pattern',
    name: 'Fruit Pattern',
    icon: '🍋',
    group: 'food',
    desc: 'Sunny lemons, citrus slices, strawberries, watermelons, pineapples, and orchard harvests.',
    patternTypes: ['polkaDot', 'doodle', 'randomGeometric', 'organic'],
    baseColors: ['#78350f', '#facc15', '#ef4444', '#f0fdf4'],
    tags: ['fruit', 'citrus', 'lemon', 'strawberry', 'watermelon', 'pineapple', 'orchard', 'fresh', 'summer'],
    subThemes: ['Sun-drenched Amalfi Lemon Orchard', 'Crisp Citrus Orange & Lime Slices', 'Sweet Summer Strawberry Patch', 'Juicy Watermelon Seed Pattern', 'Tropical Gold Pineapple Grid', 'Autumn Red Apple Harvest', 'Delicate Cherry Blossom & Fruit', 'Exotic Dragonfruit & Kiwi Slices', 'Minimalist Line Art Pear & Peach', 'Pastel Fruit Salad Confetti']
  },
  {
    num: 18,
    id: 'vegetable_pattern',
    name: 'Vegetable Pattern',
    icon: '🥕',
    group: 'food',
    desc: 'Garden carrots, heirloom tomatoes, artichokes, radishes, and organic farmer harvest prints.',
    patternTypes: ['doodle', 'polkaDot', 'botanical', 'organic'],
    baseColors: ['#14532d', '#ea580c', '#dc2626', '#fef9c3'],
    tags: ['vegetable', 'garden', 'farmer market', 'carrot', 'tomato', 'artichoke', 'radish', 'harvest', 'organic'],
    subThemes: ['Farmers Market Heirloom Tomatoes', 'Vintage Botanical Artichoke Sketch', 'Crunchy Garden Carrots with Greens', 'Crimson Radish & Beetroot Roots', 'Italian Kitchen Garlic & Herbs', 'Mushroom & Fungi Forest Foraging', 'Fresh Green Pea Pod Rows', 'Eggplant & Bell Pepper Mosaic', 'Minimalist Line Art Veggie Grid', 'Rustic Kitchen Garden Harvest']
  },
  {
    num: 19,
    id: 'food_pattern',
    name: 'Food Pattern',
    icon: '🍕',
    group: 'food',
    desc: 'Artisanal pizzas, burgers, taco street food, sushi rolls, and international culinary delights.',
    patternTypes: ['doodle', 'memphis', 'polkaDot', 'gingham'],
    baseColors: ['#450a0a', '#dc2626', '#f59e0b', '#fffbeb'],
    tags: ['food', 'culinary', 'pizza', 'sushi', 'burger', 'taco', 'street food', 'dining', 'kitchen'],
    subThemes: ['Neapolitan Wood-fired Pizza Slices', 'Tokyo Nigiri & Maki Sushi Rolls', 'American Diner Burger & Fries', 'Mexican Street Food Taco Fiesta', 'Italian Pasta Ravioli & Herbs', 'Dim Sum Steamer Basket Delights', 'Cheese Wedge & Wine Tasting', 'Barbecue Skewer Grilling Grid', 'Fast Food Retro Memphis Pattern', 'Cute Kawaii Food Doodle Array']
  },
  {
    num: 20,
    id: 'dessert_pattern',
    name: 'Dessert Pattern',
    icon: '🧁',
    group: 'food',
    desc: 'French macarons, cupcakes with frosting, ice cream cones, chocolate truffles, and sweet treats.',
    patternTypes: ['polkaDot', 'doodle', 'memphis', 'floral'],
    baseColors: ['#831843', '#f472b6', '#fbcfe8', '#fff1f2'],
    tags: ['dessert', 'cupcake', 'macaron', 'ice cream', 'sweet', 'chocolate', 'bakery', 'treats', 'cute'],
    subThemes: ['Parisian Pastel Macaron Tower', 'Swirl Frosted Cupcake Confetti', 'Gelato Ice Cream Waffle Cones', 'Belgian Chocolate Truffle Assortment', 'Glazed Donut Sprinkles Pattern', 'Popsicle & Sundae Summer Treats', 'Strawberry Shortcake Slice Grid', 'Cotton Candy Fairground Swirl', 'Cute Kawaii Dessert Characters', 'Gourmet Patisserie Tart Array']
  },
  {
    num: 21,
    id: 'bakery_pattern',
    name: 'Bakery Pattern',
    icon: '🥐',
    group: 'food',
    desc: 'Fresh French croissants, sourdough baguettes, golden wheat stalks, and artisanal bakery aesthetics.',
    patternTypes: ['doodle', 'herringbone', 'gingham', 'woven'],
    baseColors: ['#451a03', '#92400e', '#d97706', '#fef3c7'],
    tags: ['bakery', 'croissant', 'bread', 'baguette', 'wheat', 'pastry', 'artisanal', 'flour', 'baking'],
    subThemes: ['Flaky French Butter Croissants', 'Rustic Sourdough Boule & Scoring', 'Golden Wheat Sheaf Stalks', 'Artisan Baguette & Bread Basket', 'Pretzel Bavarian Twist Pattern', 'Rolling Pin & Flour Whisk Kitchen', 'Morning Cinnamon Roll Glaze Swirls', 'Vintage Paris Bakery Tile Print', 'Gingham Tablecloth Bakery Setup', 'Minimalist Bread Loaf Line Art']
  },
  {
    num: 22,
    id: 'coffee_pattern',
    name: 'Coffee Pattern',
    icon: '☕',
    group: 'food',
    desc: 'Roasted espresso beans, latte art rosettas, moka pots, chemex drippers, and cafe culture icons.',
    patternTypes: ['polkaDot', 'doodle', 'spiral', 'marquetryWood'],
    baseColors: ['#271206', '#78350f', '#b45309', '#fef3c7'],
    tags: ['coffee', 'espresso', 'roaster', 'beans', 'latte art', 'barista', 'moka pot', 'cafe', 'roast'],
    subThemes: ['Roasted Arabica Coffee Bean Grid', 'Barista Latte Art Heart & Rosettas', 'Classic Italian Moka Pot Silhouette', 'Chemex & V60 Pour Over Drippers', 'Espresso Cup & Steam Swirls', 'Cold Brew Dripping Droplets', 'Vintage Coffee Roastery Sack Label', 'Coffee Cherry Botanical Branch', 'Minimalist Line Art Cafe Items', 'Dark Roasted Espresso Bean Mosaic']
  },
  {
    num: 23,
    id: 'tea_pattern',
    name: 'Tea Pattern',
    icon: '🍵',
    group: 'food',
    desc: 'Japanese matcha bowls, porcelain teapots, delicate tea leaves, herbal infusions, and afternoon tea sets.',
    patternTypes: ['botanical', 'floral', 'doodle', 'minimalLine'],
    baseColors: ['#064e3b', '#059669', '#6ee7b7', '#f0fdf4'],
    tags: ['tea', 'matcha', 'teapot', 'tea leaves', 'porcelain', 'herbal', 'infusion', 'afternoon tea', 'zen'],
    subThemes: ['Japanese Matcha Whisk & Green Tea', 'Vintage English Floral China Teapot', 'Fresh Green Camellia Tea Leaves', 'Afternoon High Tea Cup & Saucers', 'Herbal Chamomile & Mint Infusion', 'Ceramic Gaiwan & Gongfu Tea Set', 'Steam Whirling from Tea Mug', 'Tea Plantation Terraced Hills', 'Minimalist Monoline Teapot Sketch', 'Chai Spices Star Anise & Cinnamon']
  },
  {
    num: 24,
    id: 'beverage_pattern',
    name: 'Beverage Pattern',
    icon: '🍹',
    group: 'food',
    desc: 'Tropical cocktails with umbrella garnishes, sparkling soda bubbles, wine glasses, and refreshing juices.',
    patternTypes: ['polkaDot', 'doodle', 'wave', 'gradient'],
    baseColors: ['#0f172a', '#06b6d4', '#f43f5e', '#fbbf24'],
    tags: ['beverage', 'cocktail', 'drink', 'juice', 'soda', 'bubbles', 'wine', 'bar', 'refreshing'],
    subThemes: ['Tropical Tiki Cocktail with Umbrella', 'Effervescent Soda Fizzy Bubbles', 'Wine Tasting Goblet & Grape Vines', 'Boba Bubble Tea Tapioca Pearls', 'Fresh Squeezed Citrus Lemonade', 'Champagne Flutes & Sparkles', 'Craft Beer Mug & Hops Vines', 'Mojito Mint Lime & Ice Cubes', 'Iced Matcha Latte Layered Glass', 'Vintage Cocktail Bar Menu Icons']
  },
  {
    num: 25,
    id: 'kitchen_pattern',
    name: 'Kitchen Pattern',
    icon: '🍳',
    group: 'food',
    desc: 'Culinary chef utensils, cast iron skillets, ceramic spice jars, whisks, and home cooking motifs.',
    patternTypes: ['gingham', 'checkered', 'doodle', 'grid'],
    baseColors: ['#1e293b', '#dc2626', '#94a3b8', '#ffffff'],
    tags: ['kitchen', 'cooking', 'chef', 'utensils', 'skillet', 'whisk', 'spices', 'home cooking', 'culinary'],
    subThemes: ['Chef Kitchen Knife & Wooden Board', 'Cast Iron Skillet & Cooking Pots', 'Ceramic Spice Jars with Herbs', 'Wire Whisks & Wooden Spoons', 'Red & White Gingham Kitchen Cloth', 'Vintage Enamelware Kettle & Mugs', 'Measuring Spoons & Baking Tools', 'Pattern of Kitchen Timers & Clocks', 'Minimalist Outline Cooking Icons', 'Mediterranean Olive Oil Bottles']
  },
  {
    num: 26,
    id: 'fashion_pattern',
    name: 'Fashion Pattern',
    icon: '👠',
    group: 'fashion',
    desc: 'Haute couture runways, stilettos, luxury handbags, sunglasses, perfume bottles, and chic illustrations.',
    patternTypes: ['houndstoothPro', 'artDecoFan', 'luxury', 'doodle'],
    baseColors: ['#09090b', '#d4af37', '#f43f5e', '#ffffff'],
    tags: ['fashion', 'haute couture', 'luxury', 'stiletto', 'handbag', 'runway', 'chic', 'perfume', 'glamour'],
    subThemes: ['Haute Couture Runway Silhouette', 'Luxury French Perfume Bottle Grid', 'Stiletto High Heels & Handbags', 'Chic Designer Sunglasses Array', 'Golden Brooch & Jewelry Accents', 'Fashion Sketch Figure Poses', 'Lipstick & Cosmetics Glamour Print', 'Milan Fashion Week Monogram Lattice', 'Silk Scarf Luxury Border Pattern', 'Vintage Vogue Magazine Cover Art']
  },
  {
    num: 27,
    id: 'clothing_pattern',
    name: 'Clothing Pattern',
    icon: '👗',
    group: 'fashion',
    desc: 'Dresses, tailored blazers, trench coats, hats, buttons, zippers, and apparel sketches.',
    patternTypes: ['houndstoothPro', 'herringbone', 'stripe', 'doodle'],
    baseColors: ['#1e1b4b', '#4338ca', '#94a3b8', '#f8fafc'],
    tags: ['clothing', 'apparel', 'dress', 'blazer', 'trench coat', 'garment', 'tailor', 'wardrobe', 'wear'],
    subThemes: ['Tailored Bespoke Suit & Tie Grid', 'Summer Sundress & Sunhat Outfits', 'Classic Trench Coat & Fedora Silhouette', 'Sewn Garment Construction Blueprints', 'Vintage Sewing Buttons & Snaps', 'Cozy Knit Sweater & Scarf Array', 'Denim Jacket & Jeans Stitching', 'Evening Ballgown Flowing Silk', 'Minimalist Wardrobe Capsule Icons', 'Sportswear Sneaker & Tracksuit Grid']
  },
  {
    num: 28,
    id: 'textile_pattern',
    name: 'Textile Pattern',
    icon: '🧵',
    group: 'textile',
    desc: 'Woven yarn interlacing, Scottish wool tweeds, herringbone twills, and authentic fabric cross-stitches.',
    patternTypes: ['woven', 'herringbone', 'basketWeavePro', 'houndstoothPro', 'abstractTextile', 'plaid', 'tartan'],
    baseColors: ['#1e293b', '#3b82f6', '#94a3b8', '#f8fafc'],
    tags: ['textile', 'woven', 'yarn', 'tweed', 'herringbone', 'tartan', 'houndstooth', 'fiber', 'threads', 'fabric'],
    subThemes: ['Scottish Wool Tweed Herringbone', 'Heavy Canvas Cross-stitch Weave', 'Sophisticated Houndstooth Wool Weave', 'Interlaced Warp & Weft Yarn Grid', 'Loom Shuttle Woven Rhythm', 'Textured Linen Slub Thread Pattern', 'Boucle Wool Soft Loop Texture', 'Jacquard Loom Intricate Tapestry', 'Diamond Twill Woolen Weave', 'Vintage Cashmere Soft Thread Mesh']
  },
  {
    num: 29,
    id: 'fabric_pattern',
    name: 'Fabric Pattern',
    icon: '🥻',
    group: 'textile',
    desc: 'Silk satins, denim diagonals, velvet cords, organza transparencies, and rich drapery textures.',
    patternTypes: ['woven', 'diagonalStripe', 'basketWeavePro', 'houndstoothPro'],
    baseColors: ['#18181b', '#3b82f6', '#94a3b8', '#ffffff'],
    tags: ['fabric', 'silk', 'denim', 'velvet', 'linen', 'satin', 'drapery', 'textile', 'cloth', 'twill'],
    subThemes: ['Indigo Blue Denim Twill Diagonals', 'Luxury Liquid Silk Satin Drapery', 'Ribbed Velvet Corduroy Fabric', 'Sheer Translucent Organza Layers', 'Organic Natural Flax Linen Surface', 'Soft Flannel Cotton Plaid Texture', 'Heavy Painter Raw Canvas Fabric', 'Quilted Padded Diamond Fabric', 'Taffeta Crisp Shimmering Cloth', 'Grosgrain Ribbed Ribbon Fabric']
  },
  {
    num: 30,
    id: 'sewing_pattern',
    name: 'Sewing Pattern',
    icon: '🪡',
    group: 'textile',
    desc: 'Tailor shears, sewing machine needles, spools of thread, tape measures, and dressmaker chalk lines.',
    patternTypes: ['doodle', 'minimalLine', 'grid', 'crossStripe'],
    baseColors: ['#1e293b', '#e11d48', '#fbbf24', '#f8fafc'],
    tags: ['sewing', 'tailor', 'thread', 'needle', 'spool', 'shears', 'scissors', 'stitch', 'dressmaker'],
    subThemes: ['Vintage Tailor Shears & Golden Thimble', 'Wooden Spools with Colorful Thread', 'Dotted Dressmaker Pattern Tracing Lines', 'Tape Measure & Safety Pin Grid', 'Sewing Machine Stitches & Needles', 'Button Box Assorted Colorful Buttons', 'Mannequin Dress Form Silhouette', 'Cross-stitch Embroidery Sampler', 'Basting Stitch Running Dash Line', 'Patchwork Quilting Block Geometry']
  },
  {
    num: 31,
    id: 'lace_pattern',
    name: 'Lace Pattern',
    icon: '🕸️',
    group: 'textile',
    desc: 'Delicate Chantilly bridal lace, intricate guipure motifs, Victorian lace borders, and fine mesh nets.',
    patternTypes: ['guilloche', 'roseCurve', 'versaceBaroque', 'floral'],
    baseColors: ['#18181b', '#f43f5e', '#fecdd3', '#ffffff'],
    tags: ['lace', 'bridal', 'chantilly', 'guipure', 'victorian', 'mesh', 'filigree', 'delicate', 'embroidery'],
    subThemes: ['Chantilly French Bridal Lace Net', 'Venetian Needlepoint Guipure Lace', 'Victorian Gothic Black Lace Filigree', 'Antique Tatting Lace Doily Rosette', 'Delicate Scalloped Lace Edging Border', 'Alencon Beaded Floral Lace', 'Spanish Mantilla Lace Veil Rhythm', 'Macrame Knot Lace Tapestry', 'Laser-cut Modern Geometric Lace', 'Ivory Silk Wedding Lace Floral']
  },
  {
    num: 32,
    id: 'crochet_pattern',
    name: 'Crochet Pattern',
    icon: '🧶',
    group: 'textile',
    desc: 'Classic granny square crochet blocks, lace doily mandalas, textured bobble stitches, and yarn loops.',
    patternTypes: ['squareGrid', 'mandala', 'cellularAutomata', 'hexStar'],
    baseColors: ['#3b0764', '#c084fc', '#f472b6', '#fdf4ff'],
    tags: ['crochet', 'granny square', 'yarn', 'doily', 'hook', 'stitch', 'handmade', 'craft', 'textile'],
    subThemes: ['Classic Vintage Granny Square Block', 'Circular Lace Crochet Doily Mandala', 'Textured Bobble & Popcorn Stitch', 'Waffle Stitch Crochet Texture', 'Tunisian Simple Stitch Grid', 'Amigurumi Yarn Stitches Array', 'Filet Crochet Geometric Silhouette', 'Pastel Chevron Ripple Crochet Blanket', 'Crochet Hook & Wool Ball Sketch', 'Boho Shell Stitch Crochet Mesh']
  },
  {
    num: 33,
    id: 'knitting_pattern',
    name: 'Knitting Pattern',
    icon: '🪡',
    group: 'textile',
    desc: 'Chunky cable knit weaves, fair isle nordic sweaters, ribbing rows, and stocking stitches.',
    patternTypes: ['herringbone', 'chevron', 'woven', 'cross'],
    baseColors: ['#0f172a', '#3b82f6', '#94a3b8', '#f8fafc'],
    tags: ['knitting', 'cable knit', 'fair isle', 'sweater', 'yarn', 'wool', 'stitch', 'cozy', 'winter'],
    subThemes: ['Chunky Irish Aran Cable Knit', 'Nordic Fair Isle Reindeer Snowflake', 'Classic Stockinette V-Stitch Rows', 'Garter Stitch Textured Wool Blanket', 'Brioche Two-color Ribbed Knitting', 'Intarsia Color Block Knit Texture', 'Knitting Needles & Yarn Ball Sketch', 'Honeycomb Cable Wool Pattern', 'Seed Stitch Textured Knit Surface', 'Pastel Baby Wool Blanket Knitting']
  },
  {
    num: 34,
    id: 'islamic_pattern',
    name: 'Islamic Pattern',
    icon: '🕌',
    group: 'cultural',
    desc: 'Eightfold girih geometric star tessellations, Alhambra zellige tiles, and arabesque geometric lattices.',
    patternTypes: ['islamic', 'moroccan', 'hexStar', 'arabesqueScroll', 'penroseTiling'],
    baseColors: ['#042f2e', '#0d9488', '#f59e0b', '#fef3c7'],
    tags: ['islamic', 'girih', 'zellige', 'alhambra', 'star', 'arabic', 'tessellation', 'sacred', 'geometric'],
    subThemes: ['Traditional 8-Point Girih Star', 'Alhambra Royal Palace Mosaic Tile', '12-Point Complex Islamic Star Rosette', 'Cobalt Blue & Gold Zellige Grid', 'Intricate Arabesque Floral Scroll', 'Isfahan Mosque Dome Tessellation', 'Mamluk Geometric Brass Inlay', 'Ottoman Iznik Floral Ceramic Tile', 'Modernist Islamic Minimalist Star', 'Sacred Islamic 16-Fold Geometry']
  },
  {
    num: 35,
    id: 'arabic_pattern',
    name: 'Arabic Pattern',
    icon: '🌙',
    group: 'cultural',
    desc: 'Ornate mashrabiya latticework screens, calligraphy flourishes, crescent stars, and desert palace motifs.',
    patternTypes: ['arabesqueScroll', 'islamic', 'moroccan', 'guilloche'],
    baseColors: ['#0f172a', '#d4af37', '#06b6d4', '#fffbeb'],
    tags: ['arabic', 'mashrabiya', 'calligraphy', 'crescent', 'palace', 'arabesque', 'ornament', 'middle east'],
    subThemes: ['Carved Wooden Mashrabiya Window', 'Kufic Calligraphic Geometric Lattice', 'Arabian Nights Star & Crescent Veil', 'Damascus Brass Inlay Arabesque', 'Desert Palace Carved Plaster Frieze', 'Gold Leaf Diwani Script Flourishes', 'Bedouin Tent Sadu Woven Geometric', 'Arabian Horse Filigree Silhouette', 'Incense Burner Smoke Arabesque', 'Royal Emerald & Gold Arabic Scroll']
  },
  {
    num: 36,
    id: 'moroccan_pattern',
    name: 'Moroccan Pattern',
    icon: '🏺',
    group: 'cultural',
    desc: 'Marrakech quatrefoil arches, vibrant zellige clay tiles, kasbah geometrics, and Fez ceramic mosaics.',
    patternTypes: ['moroccan', 'islamic', 'arabesqueScroll', 'hexStar'],
    baseColors: ['#1e3a8a', '#0284c7', '#f59e0b', '#fef3c7'],
    tags: ['moroccan', 'marrakech', 'zellige', 'quatrefoil', 'kasbah', 'fez', 'tiles', 'mosaic', 'terracotta'],
    subThemes: ['Marrakech Quatrefoil Arch Lattice', 'Fez Royal Blue & White Mosaic Tile', 'Beni Ourain Diamond Wool Rug Pattern', 'Kasbah Sun-baked Clay Geometrics', 'Moroccan Lantern Pierced Metal Shimmer', 'Handmade Encaustic Floor Tile', 'Terracotta & Turquoise Star Tile', 'Atlas Mountain Berber Geometric', 'Exotic Souk Spice Sack Stenciling', 'Moroccan Zellij Intricate Rosette']
  },
  {
    num: 37,
    id: 'persian_pattern',
    name: 'Persian Pattern',
    icon: '🦁',
    group: 'cultural',
    desc: 'Isfahan royal carpet medallions, boteh paisley swirls, turquoise mosaic domes, and Shahnameh florals.',
    patternTypes: ['versaceBaroque', 'arabesqueScroll', 'mandala', 'floral'],
    baseColors: ['#450a0a', '#b91c1c', '#0d9488', '#fef3c7'],
    tags: ['persian', 'carpet', 'isfahan', 'boteh', 'paisley', 'medallion', 'iranian', 'silk', 'rug'],
    subThemes: ['Isfahan Silk Carpet Central Medallion', 'Classic Persian Boteh Paisley Rhythm', 'Tabriz Royal Floral Arabesque Border', 'Shiraz Tribal Geometric Wool Kilim', 'Kashan Turquoise Ceramic Mosque Tile', 'Persian Miniature Garden Cypress & Rose', 'Herati Fish Floral Repeating Pattern', 'Gorgan Glazed Lusterware Pottery', 'Gold & Crimson Persian Court Tapestry', 'Persepolis Ancient Relief Palmette']
  },
  {
    num: 38,
    id: 'indian_pattern',
    name: 'Indian Pattern',
    icon: '🦚',
    group: 'cultural',
    desc: 'Rajasthani woodblock prints, intricate henna mehndi motifs, bandhani tie-dye dots, and royal sarees.',
    patternTypes: ['mandala', 'arabesqueScroll', 'polkaDot', 'floral'],
    baseColors: ['#831843', '#f59e0b', '#06b6d4', '#fef08a'],
    tags: ['indian', 'rajasthani', 'block print', 'mehndi', 'henna', 'bandhani', 'saree', 'peacock', 'diwali'],
    subThemes: ['Rajasthani Hand Block-printed Floral', 'Intricate Henna Mehndi Bridal Lace', 'Bandhani Tie-dye Micro-dot Clusters', 'Royal Banarasi Gold Brocade Saree', 'Kalamkari Hand-painted Mythological Art', 'Kashmir Paisley Embroidered Shawl', 'Diwali Rangoli Colored Powder Geometric', 'Jaipur Blue Pottery Floral Tile', 'Mughal Arch Inlay Pietra Dura', 'Chikankari White Shadow Embroidery']
  },
  {
    num: 39,
    id: 'mandala_pattern',
    name: 'Mandala Pattern',
    icon: '☸️',
    group: 'cultural',
    desc: 'Sacred radial meditation wheels, Sri Yantra geometries, Tibetan sand mandalas, and spiritual rosettes.',
    patternTypes: ['mandala', 'flowerOfLife', 'seedOfLife', 'metatronsCube', 'torusMandala', 'sriYantra', 'guilloche'],
    baseColors: ['#0f172a', '#f59e0b', '#ec4899', '#f8fafc'],
    tags: ['mandala', 'radial', 'sri yantra', 'sacred geometry', 'meditation', 'zen', 'spiritual', 'circle'],
    subThemes: ['Sacred Geometry Sri Yantra Medallion', 'Tibetan Tantric Sand Mandala Wheel', 'Flower of Life Interlocking Circles', 'Metatron Cube Cosmic Geometry', 'Zen Minimalist Line Art Mandala', 'Golden Luxury Radial Rosette', 'Boho Kaleidoscope Floral Mandala', 'Torus Vortex Sacred Energy Grid', 'Bioluminescent Neon Mandala Wheel', 'Chakra Energy Radial Symmetries']
  },
  {
    num: 40,
    id: 'paisley_pattern',
    name: 'Paisley Pattern',
    icon: '💧',
    group: 'cultural',
    desc: 'Curving teardrop boteh motifs, psychedelic 60s bandanas, luxury silk jacquards, and Persian flourishes.',
    patternTypes: ['arabesqueScroll', 'roseCurve', 'floral', 'retro'],
    baseColors: ['#3b0764', '#d946ef', '#06b6d4', '#ffffff'],
    tags: ['paisley', 'boteh', 'teardrop', 'bandana', '60s', 'psychedelic', 'jacquard', 'flourish', 'retro'],
    subThemes: ['Classic Rock Bandana Paisley Print', 'Luxury Silk Tie Mini Paisley Dot', '60s Psychedelic Swirling Paisley', 'Kashmir Wool Shawl Boteh Border', 'Minimalist Outline Modern Paisley', 'Gold Gilded Regal Paisley Tapestry', 'Boho Gypsy Colorful Paisley Grid', 'Subtle Tone-on-Tone Jacquard Paisley', 'Vintage Victorian Paisley Wallpaper', 'Neon Cyberpunk Paisley Wave']
  },
  {
    num: 41,
    id: 'aztec_pattern',
    name: 'Aztec Pattern',
    icon: '🏛️',
    group: 'cultural',
    desc: 'Ancient Mesoamerican sun stones, stepped pyramids, geometric zigzags, and Southwestern blanket weaves.',
    patternTypes: ['zigzag', 'chevron', 'diamond', 'triangle', 'geometric'],
    baseColors: ['#7c2d12', '#ea580c', '#0d9488', '#fef3c7'],
    tags: ['aztec', 'mesoamerican', 'pyramid', 'southwestern', 'stepped', 'tribal', 'mexican', 'blanket', 'maya'],
    subThemes: ['Sun Stone Calendar Radial Glyphs', 'Southwestern Woven Blanket Zigzags', 'Stepped Pyramid Geometric Diamond', 'Feathered Serpent Quetzalcoatl Wave', 'Terracotta & Turquoise Aztec Border', 'Ancient Mayan Hieroglyphic Grid', 'Navajo-inspired Diamond Tapestry', 'Mexican Serape Colorful Stripes', 'Obsidian Blade Geometric Mosaic', 'Vintage Tribal Aztec Rug Weave']
  },
  {
    num: 42,
    id: 'tribal_pattern',
    name: 'Tribal Pattern',
    icon: '🏹',
    group: 'cultural',
    desc: 'Indigenous geometric arrows, Polynesian tattoo bands, African mudcloth, and folk heritage symbols.',
    patternTypes: ['zigzag', 'chevron', 'diamond', 'triangle', 'cross'],
    baseColors: ['#1c1917', '#44403c', '#d97706', '#fafaf9'],
    tags: ['tribal', 'indigenous', 'arrows', 'polynesian', 'tattoo', 'mudcloth', 'folk', 'heritage', 'ethnic'],
    subThemes: ['African Mudcloth Bogolanfini Symbols', 'Polynesian Maori Tattoo Chevron Bands', 'Amazonian Indigenous Geometric Lines', 'Native American Arrowhead Tapestry', 'Pacific Island Tapa Cloth Print', 'Hand-stamped Earth Ochre Tribal Grid', 'Tribal Beadwork Colorful Chevron', 'Ancient Cave Art Petroglyph Icons', 'Boho Tribal Diamond Repeat Tile', 'Rustic Woodblock Tribal Motif']
  },
  {
    num: 43,
    id: 'african_pattern',
    name: 'African Pattern',
    icon: '🌍',
    group: 'cultural',
    desc: 'Ghanaian Kente cloth strips, vibrant Ankara wax prints, Maasai beadworks, and earthy Bogolan motifs.',
    patternTypes: ['crossStripe', 'diamond', 'triangle', 'woven', 'geometric'],
    baseColors: ['#78350f', '#eab308', '#dc2626', '#10b981'],
    tags: ['african', 'kente', 'ankara', 'wax print', 'maasai', 'bogolan', 'ghana', 'vibrant', 'ethnic'],
    subThemes: ['Ghanaian Royal Kente Cloth Weave', 'Vibrant Nigerian Ankara Wax Print', 'Maasai Warrior Red & Blue Plaid', 'Malian Mudcloth Geometric Chevron', 'Ndebele Painted House Geometric Wall', 'Shweshwe Indigo Discharge Print', 'African Safari Sunset Wildlife Silhouette', 'Zulu Beaded Diamond Necklace Rhythm', 'Earthy Ochre & Charcoal Tribal Cloth', 'Wax Block Print Botanical Fan']
  },
  {
    num: 44,
    id: 'japanese_pattern',
    name: 'Japanese Pattern',
    icon: '⛩️',
    group: 'cultural',
    desc: 'Traditional Wagara patterns: Asanoha hemp leaves, Seigaiha ocean waves, Shippo seven treasures, and Ukiyo-e.',
    patternTypes: ['wave', 'hexagonal', 'circle', 'grid', 'geometric'],
    baseColors: ['#0f172a', '#1e3a8a', '#dc2626', '#f8fafc'],
    tags: ['japanese', 'wagara', 'asanoha', 'seigaiha', 'shippo', 'kimono', 'ukiyo-e', 'zen', 'traditional'],
    subThemes: ['Asanoha Sacred Hemp Leaf Geometric', 'Seigaiha Overlapping Ocean Waves', 'Shippo Seven Treasures Interlocking Rings', 'Sayagata Swastika Key Frets Frieze', 'Kikkou Tortoiseshell Hexagon Grid', 'Karakusa Curving Vine Arabesque', 'Ukiyo-e Great Wave Blue Gradient', 'Yagasuri Fletched Arrow Weave', 'Kanoko Shibori Dappled Dye Dots', 'Sakura Blossom Falling Petals']
  },
  {
    num: 45,
    id: 'chinese_pattern',
    name: 'Chinese Pattern',
    icon: '🐉',
    group: 'cultural',
    desc: 'Imperial dragon scales, auspicious cloud spirals, Ming blue-and-white porcelain, and lattice windows.',
    patternTypes: ['cloud', 'spiral', 'squareGrid', 'versaceBaroque'],
    baseColors: ['#450a0a', '#b91c1c', '#f59e0b', '#ffffff'],
    tags: ['chinese', 'dragon', 'auspicious cloud', 'ming porcelain', 'lattice', 'imperial', 'qing', 'silk'],
    subThemes: ['Auspicious Ruyi Cloud Spirals', 'Imperial Golden Dragon Scale Mesh', 'Ming Dynasty Blue & White Porcelain', 'Traditional Wooden Window Lattice Grid', 'Longevity Shou Character Geometric', 'Silk Brocade Peony & Phoenix Tapestry', 'Chinese Red Lantern Gold Filigree', 'Koi Fish Yin Yang Balance Pond', 'Bamboo Forest Ink Brush Wash', 'Qing Dynasty Cloisonne Enamel Floral']
  },
  {
    num: 46,
    id: 'korean_pattern',
    name: 'Korean Pattern',
    icon: '🌺',
    group: 'cultural',
    desc: 'Dancheong temple roof paintwork, traditional Hanbok silk grids, Taegeuk dual swirls, and Jogakbo patchwork.',
    patternTypes: ['spiral', 'squareGrid', 'colorBlock', 'geometric'],
    baseColors: ['#1e1b4b', '#dc2626', '#0284c7', '#facc15'],
    tags: ['korean', 'dancheong', 'hanbok', 'taegeuk', 'jogakbo', 'patchwork', 'temple', 'joseon', 'traditional'],
    subThemes: ['Dancheong Palace Roof Lotus Painting', 'Jogakbo Translucent Silk Patchwork', 'Taegeuk Dual Red & Blue Swirls', 'Hanbok Traditional Ribbon & Silk Grid', 'Mugunghwa Rose of Sharon Blossom', 'Traditional Korean Hanji Paper Texture', 'Joseon White Porcelain Moon Jar Art', 'Celadon Inlaid Crane & Cloud Motif', 'Najeonchilgi Mother-of-Pearl Lacquer', 'Traditional Wooden Changhoji Lattice']
  },
  {
    num: 47,
    id: 'scandinavian_pattern',
    name: 'Scandinavian Pattern',
    icon: '🦌',
    group: 'cultural',
    desc: 'Nordic minimalist forest trees, reindeer silhouettes, Dala horse folk art, and warm hygge geometry.',
    patternTypes: ['minimalLine', 'retro', 'polkaDot', 'triangle'],
    baseColors: ['#0f172a', '#3b82f6', '#e2e8f0', '#ffffff'],
    tags: ['scandinavian', 'nordic', 'hygge', 'minimalist', 'forest', 'reindeer', 'dala horse', 'folk art', 'clean'],
    subThemes: ['Minimalist Nordic Pine Tree Silhouette', 'Dala Horse Swedish Folk Art Painting', 'Geometric Scandinavian Chevron Weave', 'Hygge Cozy Winter Sweater Grid', 'Pastel Mid-century Nordic Leaves', 'Arctic Reindeer Snowfall Landscape', 'Clean Scandinavian Black & White Lines', 'Stockholm Modernist Graphic Shapes', 'Folk Floral Wallpaper in Warm Grey', 'Nordic Abstract Linear Symphony']
  },
  {
    num: 48,
    id: 'celtic_pattern',
    name: 'Celtic Pattern',
    icon: '☘️',
    group: 'cultural',
    desc: 'Endless interlaced knotwork ribbons, Trinity triquetras, Irish spirals, and Book of Kells illuminated borders.',
    patternTypes: ['interlockingGrid', 'spiral', 'guilloche', 'arabesqueScroll'],
    baseColors: ['#022c22', '#059669', '#d4af37', '#fef3c7'],
    tags: ['celtic', 'knotwork', 'triquetra', 'irish', 'knot', 'interlace', 'book of kells', 'emerald', 'shamrock'],
    subThemes: ['Endless Celtic Knotwork Ribbon Weave', 'Trinity Triquetra Sacred Triangle', 'Book of Kells Illuminated Border Frieze', 'Triskelion Triple Spiral of Life', 'Celtic Cross Stone Carving Texture', 'Emerald Green Shamrock Garland', 'Highland Plaid with Celtic Interlace', 'Viking & Celtic Dragon Knotwork', 'Golden Filigree Celtic Knot Ring', 'Antique Bronze Irish Knotwork Plaque']
  },
  {
    num: 49,
    id: 'vintage_pattern',
    name: 'Vintage Pattern',
    icon: '🕰️',
    group: 'vintage',
    desc: 'Victorian copperplate engravings, antique damasks, heritage sepia botanicals, and classic art nouveau.',
    patternTypes: ['versaceBaroque', 'artDecoFan', 'arabesqueScroll', 'houndstoothPro'],
    baseColors: ['#451a03', '#92400e', '#d97706', '#fef3c7'],
    tags: ['vintage', 'antique', 'victorian', 'heritage', 'sepia', 'copperplate', 'engraving', 'art nouveau', 'filigree'],
    subThemes: ['Victorian Copperplate Floral Engraving', '19th Century Antique Map Cartography', 'Art Nouveau Alphonse Mucha Curves', 'Heritage Damask Wallpaper in Sepia', 'Vintage Postcard & Postal Stamps', 'Aged Sepia Botanical Book Plate', 'Classical Baroque Gold Filigree Frieze', 'Old Apothecary Label & Script', 'Edwardian Lace Textile Wallpaper', 'Roaring 20s Gatsby Fan Pattern']
  },
  {
    num: 50,
    id: 'retro_pattern',
    name: 'Retro Pattern',
    icon: '📺',
    group: 'vintage',
    desc: 'Mid-century atomic boomerangs, 70s groovy rainbow stripes, 80s arcade synthwaves, and psychedelic curves.',
    patternTypes: ['retro', 'memphis', 'retrofuturism', 'wave'],
    baseColors: ['#7c2d12', '#ea580c', '#eab308', '#0284c7'],
    tags: ['retro', '70s', '80s', 'mid-century', 'atomic', 'groovy', 'arcade', 'synthwave', 'psychedelic', 'nostalgia'],
    subThemes: ['70s Warm Groovy Rainbow Waves', 'Mid-Century Modern Atomic Boomerangs', '80s Arcade Synthwave Grid Sunset', '60s Psychedelic Swirling Waves', 'Retro Cassette Tape Geometric Grid', 'Diner Checkerboard & Neon Stripes', 'Vintage Motel Keychain Art Deco', 'Retro Sci-Fi Horizon Wireframe', 'Space Age 1960s Pod Geometric', 'Vintage Bowling Alley Funky Carpet']
  }
];

// Add Remaining 50 categories (51 to 100) systematically
const REMAINING_50 = [
  { num: 51, id: 'y2k_pattern', name: 'Y2K Pattern', icon: '🛸', group: 'vintage', desc: 'Millennium bug chrome stars, frutiger aero liquid drops, and holographic blobs.', types: ['opArtTunnel', 'fluidTurbulence', 'cyberpunkCircuit'] },
  { num: 52, id: 'memphis_pattern', name: 'Memphis Pattern', icon: '🪅', group: 'vintage', desc: '80s Milan Memphis squiggles, confetti sprinkles, and post-modernist fun.', types: ['memphis', 'polkaDot', 'randomGeometric'] },
  { num: 53, id: 'psychedelic_pattern', name: 'Psychedelic Pattern', icon: '🍄', group: 'vintage', desc: 'Hypnotic trippy spirals, liquid light shows, and optical illusion vortexes.', types: ['opArtTunnel', 'spiral', 'fluidTurbulence'] },
  { num: 54, id: 'boho_pattern', name: 'Boho Pattern', icon: '🪶', group: 'vintage', desc: 'Bohemian dreamcatchers, sunburst mandalas, arrows, and earthy fringe.', types: ['mandala', 'zigzag', 'floral'] },
  { num: 55, id: 'minimal_pattern', name: 'Minimal Pattern', icon: '⚪', group: 'geometric', desc: 'Negative space purity, subtle fine lines, and Scandinavian simplicity.', types: ['minimalLine', 'stripe', 'grid'] },
  { num: 56, id: 'line_pattern', name: 'Line Pattern', icon: '📏', group: 'geometric', desc: 'Continuous monoline contours, parallel laser lines, and fine architectural hatching.', types: ['lineart', 'minimalLine', 'stripe'] },
  { num: 57, id: 'dot_pattern', name: 'Dot Pattern', icon: '🔘', group: 'geometric', desc: 'Polka dots, pop art halftones, stippling pointillism, and quantized LED matrices.', types: ['polkaDot', 'quantumDots', 'halftonePopArt'] },
  { num: 58, id: 'stripe_pattern', name: 'Stripe Pattern', icon: '💈', group: 'geometric', desc: 'Nautical Breton stripes, awning canvas bands, and racing pinstripes.', types: ['stripe', 'diagonalStripe', 'multiStripe'] },
  { num: 59, id: 'wave_pattern', name: 'Wave Pattern', icon: '〰️', group: 'geometric', desc: 'Harmonic sine waves, ocean ripples, guilloche curves, and audio frequencies.', types: ['wave', 'opArtWave', 'sineLattice'] },
  { num: 60, id: 'grid_pattern', name: 'Grid Pattern', icon: '🔲', group: 'geometric', desc: 'Architectural blueprint grids, graph paper, and perspective horizon meshes.', types: ['grid', 'squareGrid', 'meshWireframe'] },
  { num: 61, id: 'checkered_pattern', name: 'Checkered Pattern', icon: '🏁', group: 'geometric', desc: 'Classic racing flags, chessboard tiles, and high-contrast square blocks.', types: ['checkered', 'squareGrid', 'escherCubes'] },
  { num: 62, id: 'plaid_pattern', name: 'Plaid Pattern', icon: '🧣', group: 'geometric', desc: 'Scottish tartan plaids, flannel checks, and multi-colored criss-cross bands.', types: ['plaid', 'tartan', 'gingham'] },
  { num: 63, id: 'chevron_pattern', name: 'Chevron Pattern', icon: '⏩', group: 'geometric', desc: 'V-shaped herringbone chevrons, inverted arrows, and dynamic zigzag bands.', types: ['chevron', 'herringbone', 'zigzag'] },
  { num: 64, id: 'zigzag_pattern', name: 'Zigzag Pattern', icon: '⚡', group: 'geometric', desc: 'Sharp saw-tooth lines, chevron oscillations, and geometric lightning bolts.', types: ['zigzag', 'chevron', 'wave'] },
  { num: 65, id: 'spiral_pattern', name: 'Spiral Pattern', icon: '🌀', group: 'geometric', desc: 'Fibonacci golden ratio spirals, Archimedean coils, and vortex arms.', types: ['spiral', 'goldSpiral', 'archimedeanSpiral'] },
  { num: 66, id: 'circle_pattern', name: 'Circle Pattern', icon: '⭕', group: 'geometric', desc: 'Concentric water ripples, overlapping rings, and flower of life grids.', types: ['flowerOfLife', 'seedOfLife', 'torusMandala'] },
  { num: 67, id: 'triangle_pattern', name: 'Triangle Pattern', icon: '🔺', group: 'geometric', desc: 'Delta tessellations, Sierpinski fractals, and low-poly 3D facets.', types: ['triangle', 'geometric', 'isometric'] },
  { num: 68, id: 'square_pattern', name: 'Square Pattern', icon: '⏹️', group: 'geometric', desc: 'Orthogonal cubic matrices, nesting frames, and modern square mosaics.', types: ['squareGrid', 'escherCubes', 'checkered'] },
  { num: 69, id: 'hexagon_pattern', name: 'Hexagon Pattern', icon: '⬡', group: 'geometric', desc: 'Nature honeycombs, graphene lattices, and isometric hexagonal hives.', types: ['hexagonal', 'hexStar', 'isometric'] },
  { num: 70, id: 'polygon_pattern', name: 'Polygon Pattern', icon: '🔷', group: 'geometric', desc: 'Multi-sided polyhedra, complex tessellations, and crystal facets.', types: ['geometric', 'penroseTiling', 'bauhausGeo'] },
  { num: 71, id: 'diamond_pattern', name: 'Diamond Pattern', icon: '💠', group: 'geometric', desc: 'Harlequin diamond tiles, argyle weaves, and rhomboid facets.', types: ['diamond', 'harlequinDiamond', 'crossStripe'] },
  { num: 72, id: 'star_pattern', name: 'Star Pattern', icon: '⭐', group: 'geometric', desc: '5-point stars, 8-point Islamic rosettes, and celestial starfields.', types: ['hexStar', 'supernovaBurst', 'islamic'] },
  { num: 73, id: 'heart_pattern', name: 'Heart Pattern', icon: '❤️', group: 'geometric', desc: 'Romantic Valentine hearts, interlocking love emblems, and cute doodles.', types: ['wedding', 'valentine', 'doodle'] },
  { num: 74, id: 'doodle_pattern', name: 'Doodle Pattern', icon: '✏️', group: 'artistic', desc: 'Hand-drawn spontaneous doodles, cartoon squiggles, and whimsical sketches.', types: ['doodle', 'lineart', 'memphis'] },
  { num: 75, id: 'hand_drawn_pattern', name: 'Hand Drawn Pattern', icon: '🖊️', group: 'artistic', desc: 'Organic pen-and-ink lines, human-crafted imperfections, and sketched art.', types: ['lineart', 'doodle', 'minimalLine'] },
  { num: 76, id: 'sketch_pattern', name: 'Sketch Pattern', icon: '📝', group: 'artistic', desc: 'Pencil shading, crosshatch charcoal lines, and architectural drafting.', types: ['lineart', 'minimalLine', 'meshWireframe'] },
  { num: 77, id: 'watercolor_pattern', name: 'Watercolor Pattern', icon: '🖌️', group: 'artistic', desc: 'Soft pigment bleeds, wet-on-wet watercolor washes, and translucent stains.', types: ['marble', 'organicFlow', 'plasmaDischarge'] },
  { num: 78, id: 'brush_pattern', name: 'Brush Pattern', icon: '🎨', group: 'artistic', desc: 'Bold acrylic brushstrokes, Japanese sumi-e strokes, and painterly textures.', types: ['abstractLine', 'vectorFlowField', 'wave'] },
  { num: 79, id: 'ink_pattern', name: 'Ink Pattern', icon: '✒️', group: 'artistic', desc: 'Black calligraphy ink splatters, dip pen hatching, and sumi-e ink washes.', types: ['abstractLine', 'lineart', 'marble'] },
  { num: 80, id: 'grunge_pattern', name: 'Grunge Pattern', icon: '🎸', group: 'textures', desc: 'Distressed urban walls, rust oxidation, scratched metal, and 90s grit.', types: ['gridNoise', 'cellularAutomata', 'abstractLine'] },
  { num: 81, id: 'concrete_pattern', name: 'Concrete Pattern', icon: '🏢', group: 'textures', desc: 'Raw brutalist concrete screed, industrial cement, and weathered urban walls.', types: ['gridNoise', 'cellularAutomata'] },
  { num: 82, id: 'marble_pattern', name: 'Marble Pattern', icon: '🏛️', group: 'textures', desc: 'Italian Carrara veins, Black Marquina gold seams, and liquid marbling.', types: ['marble', 'fluidTurbulence', 'reactionDiffusion'] },
  { num: 83, id: 'stone_pattern', name: 'Stone Pattern', icon: '🪨', group: 'textures', desc: 'Granite mineral flecks, slate quarries, and cobblestone pavements.', types: ['gridNoise', 'cellularAutomata', 'voronoiCells'] },
  { num: 84, id: 'wood_pattern', name: 'Wood Pattern', icon: '🪵', group: 'textures', desc: 'Oak annual growth rings, walnut parquet, and rustic barnwood planks.', types: ['marquetryWood', 'stripe', 'wave'] },
  { num: 85, id: 'paper_pattern', name: 'Paper Pattern', icon: '📜', group: 'textures', desc: 'Japanese washi paper, vintage parchment scrolls, and kraft paper creases.', types: ['gridNoise', 'minimalLine', 'squareGrid'] },
  { num: 86, id: 'metal_pattern', name: 'Metal Pattern', icon: '🔩', group: 'textures', desc: 'Brushed steel plates, titanium sheen, industrial tread plates, and alloys.', types: ['diagonalStripe', 'stripe', 'woven'] },
  { num: 87, id: 'gold_pattern', name: 'Gold Pattern', icon: '🪙', group: 'luxury', desc: '24K liquid gold leaf, opulent baroque filigree, and champagne glows.', types: ['goldSpiral', 'versaceBaroque', 'artDecoFan', 'luxury'] },
  { num: 88, id: 'holographic_pattern', name: 'Holographic Pattern', icon: '💿', group: 'luxury', desc: 'Rainbow spectrum diffraction, iridescent foil stamping, and holo vinyl.', types: ['plasmaDischarge', 'auroraBorealis', 'gradient'] },
  { num: 89, id: 'gradient_pattern', name: 'Gradient Pattern', icon: '🌈', group: 'luxury', desc: 'Multi-stop color fades, chromatic transitions, and vibrant spectrum sweeps.', types: ['gradient', 'meshWireframe', 'auroraBorealis'] },
  { num: 90, id: 'neon_pattern', name: 'Neon Pattern', icon: '⚡', group: 'luxury', desc: 'Electric gas tubes, synthwave wireframes, and vibrant glowing signs.', types: ['cyberpunkCircuit', 'matrixRain', 'grid'] },
  { num: 91, id: 'glow_pattern', name: 'Glow Pattern', icon: '🌟', group: 'luxury', desc: 'Luminescent halation, soft neon blooms, and phosphorescent radiates.', types: ['plasmaDischarge', 'supernovaBurst', 'quantumDots'] },
  { num: 92, id: 'three_d_pattern', name: '3D Pattern', icon: '🧊', group: 'tech', desc: 'Volumetric isometric cubes, depth-map shadows, and spatial polyhedra.', types: ['isometric', 'escherCubes', 'meshWireframe'] },
  { num: 93, id: 'technology_pattern', name: 'Technology Pattern', icon: '💻', group: 'tech', desc: 'Fiber optic light streams, global data networks, and server matrices.', types: ['cyberpunkCircuit', 'matrixRain', 'squareGrid'] },
  { num: 94, id: 'circuit_pattern', name: 'Circuit Pattern', icon: '🔌', group: 'tech', desc: 'PCB motherboard copper traces, microchip pins, and soldering pathways.', types: ['cyberpunkCircuit', 'grid', 'matrixRain'] },
  { num: 95, id: 'digital_pattern', name: 'Digital Pattern', icon: '📱', group: 'tech', desc: 'Binary code cascades, pixel matrices, and virtual reality voxels.', types: ['matrixRain', 'gridNoise', 'isometric'] },
  { num: 96, id: 'cyberpunk_pattern', name: 'Cyberpunk Pattern', icon: '🦾', group: 'tech', desc: 'Neon rain megacity grids, holographic glitches, and high-tech noir.', types: ['cyberpunkCircuit', 'matrixRain', 'grid'] },
  { num: 97, id: 'futuristic_pattern', name: 'Futuristic Pattern', icon: '🚀', group: 'tech', desc: 'Spaceship corridor hulls, hyperloop tunnels, and quantum cores.', types: ['opArtTunnel', 'isometric', 'meshWireframe'] },
  { num: 98, id: 'luxury_pattern', name: 'Luxury Pattern', icon: '👑', group: 'events', desc: '24K gold damask, Art Deco champagne fans, and velvet obsidian opulence.', types: ['luxury', 'artDecoFan', 'versaceBaroque'] },
  { num: 99, id: 'wedding_pattern', name: 'Wedding Pattern', icon: '💍', group: 'events', desc: 'Romantic bridal lace, blush monogram frames, and ivory floral wreaths.', types: ['wedding', 'valentine', 'floral', 'roseCurve'] },
  { num: 100, id: 'seasonal_pattern', name: 'Seasonal Pattern', icon: '🎄', group: 'events', desc: 'Christmas snowflakes, holiday pines, autumn leaves, and festive confetti.', types: ['christmas', 'hexStar', 'tartan', 'plaid'] }
];

// Combine all 100 definitions
const ALL_100_DEFS = [...PATTERN_CATEGORY_DEFINITIONS];
REMAINING_50.forEach(item => {
  ALL_100_DEFS.push({
    num: item.num,
    id: item.id,
    name: item.name,
    icon: item.icon,
    group: item.group,
    desc: item.desc,
    patternTypes: item.types,
    baseColors: ['#0f172a', '#3b82f6', '#ec4899', '#f8fafc'],
    tags: [item.name.toLowerCase().replace(' pattern', ''), 'pattern', 'seamless', 'repeating', 'tile', 'vector', 'design'],
    subThemes: [
      `${item.name.replace(' Pattern', '')} Primary Classic`,
      `${item.name.replace(' Pattern', '')} Modern Geometric`,
      `${item.name.replace(' Pattern', '')} Luxury Gold Accent`,
      `${item.name.replace(' Pattern', '')} Vibrant Pop Color`,
      `${item.name.replace(' Pattern', '')} Minimalist Monoline`,
      `${item.name.replace(' Pattern', '')} Vintage Heritage`,
      `${item.name.replace(' Pattern', '')} High-Contrast Cyber`,
      `${item.name.replace(' Pattern', '')} Watercolor Soft Wash`,
      `${item.name.replace(' Pattern', '')} Dynamic Wave Flow`,
      `${item.name.replace(' Pattern', '')} Seamless Repeating Tile`
    ]
  });
});

// Helper to generate 100 distinctive sub-patterns for a given pattern category
function generateSubPatternsForCategory(cat) {
  const subPatterns = [];
  const styles = [
    'Modern Minimalist', 'Luxury 24K Gold', 'High-Contrast Cyber', 'Subtle Tone-on-Tone',
    'Vibrant Neon Glow', 'Nordic Clean', 'Cinematic Noir', 'Pastel Aesthetic',
    '3D Volumetric Depth', 'Vintage Heritage'
  ];

  const modifiers = [
    'Seamless Repeating Tile with Edge Precision',
    'Ultra-Detailed Mathematical Vector Nodes',
    'High-Resolution Commercial Stock Wallpaper',
    'Curated Harmonious Colorway Combination',
    'Clean Professional Textile & Surface Print',
    'Dynamic Light Accents & Shimmering Lines',
    'Geometric Balance with Golden Ratio Rhythms',
    'Ethereal Depth with Balanced Contrast',
    'Handcrafted Artisanal Line Work',
    'State-of-the-Art Generative Symmetry'
  ];

  let counter = 1;
  cat.subThemes.forEach((theme, tIdx) => {
    styles.forEach((style, sIdx) => {
      const id = `${cat.id}_${String(counter).padStart(3, '0')}`;
      const subName = `${theme} — ${style}`;
      const mod = modifiers[(tIdx + sIdx) % modifiers.length];
      const prompt = `${subName}: ${cat.desc} Features ${theme.toLowerCase()} pattern structure with ${style.toLowerCase()} styling, refined symmetry, and ${mod.toLowerCase()}.`;

      const colorSet = [...cat.baseColors];
      if (sIdx % 3 === 1) {
        colorSet[1] = '#d4af37'; // Gold
      } else if (sIdx % 3 === 2) {
        colorSet[1] = '#06b6d4'; // Cyan
      }

      subPatterns.push({
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

  return subPatterns;
}

// Build complete data array
const FULL_PATTERN_CATEGORIES = ALL_100_DEFS.map(cat => {
  const subPatterns = generateSubPatternsForCategory(cat);
  const suggestedPrompts = [
    subPatterns[0].prompt,
    subPatterns[25].prompt,
    subPatterns[50].prompt
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
    subCategoriesCount: subPatterns.length,
    subCategories: subPatterns,
    subPatterns: subPatterns
  };
});

// Output code for data/pattern-categories.js
const fileContent = `'use strict';
/**
 * AI Pattern & Image Design Studio PRO — data/pattern-categories.js
 * Comprehensive 100 Core Pattern Categories with 100 Curated Sub-Patterns Each (Total 10,000 Sub-Patterns)
 * Each category contains: id, num, name, icon, group, description, tags, patternTypes, suggestedPrompts, subCategories, subPatterns
 */

const CORE_PATTERN_CATEGORIES = ${JSON.stringify(FULL_PATTERN_CATEGORIES, null, 2)};

// ─── Utility Helper Functions ───────────────────────────────────────────────
const PatternCategoryEngine = {
  getAll() {
    return CORE_PATTERN_CATEGORIES;
  },

  getById(id) {
    if (!id) return null;
    return CORE_PATTERN_CATEGORIES.find(c => c.id === id || c.id.replace('_pattern', '') === id.replace('_pattern', '')) || null;
  },

  getByGroup(group) {
    if (!group || group === 'all') return CORE_PATTERN_CATEGORIES;
    return CORE_PATTERN_CATEGORIES.filter(c => c.group === group);
  },

  getSubPatterns(catId) {
    const cat = this.getById(catId);
    return cat ? cat.subPatterns : [];
  },

  search(query, group = 'all') {
    const q = (query || '').toLowerCase().trim();
    return CORE_PATTERN_CATEGORIES.filter(cat => {
      const matchGroup = group === 'all' || cat.group === group || (cat.tags && cat.tags.includes(group));
      if (!matchGroup) return false;
      if (!q) return true;
      return (
        cat.name.toLowerCase().includes(q) ||
        cat.description.toLowerCase().includes(q) ||
        (cat.tags && cat.tags.some(t => t.toLowerCase().includes(q))) ||
        (cat.subPatterns && cat.subPatterns.some(sub => sub.name.toLowerCase().includes(q) || sub.theme.toLowerCase().includes(q)))
      );
    });
  },

  getRandomSubpattern(catId = null) {
    let cat = catId ? this.getById(catId) : null;
    if (!cat) {
      cat = CORE_PATTERN_CATEGORIES[Math.floor(Math.random() * CORE_PATTERN_CATEGORIES.length)];
    }
    if (!cat || !cat.subPatterns || cat.subPatterns.length === 0) return null;
    const sub = cat.subPatterns[Math.floor(Math.random() * cat.subPatterns.length)];
    return { category: cat, subCategory: sub, subPattern: sub };
  }
};

if (typeof window !== 'undefined') {
  window.CORE_PATTERN_CATEGORIES = CORE_PATTERN_CATEGORIES;
  window.PatternCategoryEngine = PatternCategoryEngine;
}
if (typeof module !== 'undefined') {
  module.exports = CORE_PATTERN_CATEGORIES;
  module.exports.CORE_PATTERN_CATEGORIES = CORE_PATTERN_CATEGORIES;
  module.exports.PatternCategoryEngine = PatternCategoryEngine;
}
`;

const targetPath = path.join(__dirname, '../data/pattern-categories.js');
fs.writeFileSync(targetPath, fileContent, 'utf8');
console.log(`✅ Successfully generated data/pattern-categories.js with ${FULL_PATTERN_CATEGORIES.length} categories and ${FULL_PATTERN_CATEGORIES.length * 100} total sub-patterns.`);
