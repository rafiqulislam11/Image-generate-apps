'use strict';
/**
 * AI Pattern & Image Design Studio PRO — data/categories.js
 * 30 Searchable Pattern & Design Categories
 * Each contains: id, name, icon, description, tags, suggestedPrompts, patternTypes
 */

const PATTERN_CATEGORIES = [
  {
    id: 'geometric',
    name: 'Geometric',
    icon: '📐',
    description: 'Polygonal, tessellated, and mathematical angular structures with sharp precision.',
    suggestedPrompts: [
      'Modern bauhaus geometric pattern with deep obsidian and champagne gold',
      'Minimalist interlocking triangular grid with subtle cyan gradients',
      'Futuristic isometric cube lattice in monochrome dark gray'
    ],
    patternTypes: ['geometric', 'squareGrid', 'grid', 'triangle', 'diamond', 'hexagonal', 'isometric', 'interlockingGrid', 'bauhausGeo', 'penroseTiling', 'escherCubes']
  },
  {
    id: 'floral',
    name: 'Floral',
    icon: '🌸',
    description: 'Delicate flower blossoms, petals, and decorative bouquets in vintage and modern arrangements.',
    suggestedPrompts: [
      'Delicate cherry blossom seamless floral pattern with pastel pink and ivory',
      'Vintage watercolor rose bouquet pattern on dark navy background',
      'Artistic line art floral blossoms with gold accents'
    ],
    patternTypes: ['floral', 'roseCurve', 'botanical', 'leaves', 'organicFlow', 'rhodoneaRose']
  },
  {
    id: 'botanical',
    name: 'Botanical',
    icon: '🌿',
    description: 'Natural leaves, ferns, foliage, and jungle greenery with rich organic rhythms.',
    suggestedPrompts: [
      'Tropical monstera and palm leaves wallpaper pattern in emerald and sage',
      'Hand-drawn eucalyptus foliage with warm earth tones and beige',
      'Lush forest botanical canopy with golden veins'
    ],
    patternTypes: ['botanical', 'leaves', 'floral', 'organic', 'dendriteCrystal', 'barnsleyFern']
  },
  {
    id: 'islamic',
    name: 'Islamic',
    icon: '🕌',
    description: 'Sacred geometric girih stars, arabesques, and intricate eightfold tessellations.',
    suggestedPrompts: [
      'Traditional Islamic 8-point geometric star zellige in cobalt blue and gold',
      'Moroccan royal palace mosaic tile pattern with rich turquoise and ochre',
      'Complex Islamic arabesque floral scroll with midnight black background'
    ],
    patternTypes: ['islamic', 'moroccan', 'arabesqueScroll', 'hexStar', 'mandala', 'sacredGeometry', 'penroseTiling']
  },
  {
    id: 'mandala',
    name: 'Mandala',
    icon: '☸️',
    description: 'Spiritual circular and radial symmetries designed for meditation, yoga, and luxury accents.',
    suggestedPrompts: [
      'Sacred geometry Sri Yantra mandala with vibrant neon glow',
      'Intricate Tibetan radial medallion with metallic copper and deep teal',
      'Minimalist single-line zen mandala on off-white textured paper'
    ],
    patternTypes: ['mandala', 'flowerOfLife', 'seedOfLife', 'metatronsCube', 'torusMandala', 'sriYantra', 'guilloche']
  },
  {
    id: 'abstract',
    name: 'Abstract',
    icon: '🎨',
    description: 'Fluid, experimental, and non-representational generative forms and chaotic flows.',
    suggestedPrompts: [
      'Liquid marble acrylic pour pattern with gold foil highlights',
      'Dynamic vector flow field with high-energy magenta and electric cyan',
      'Strange attractor chaotic particle ribbon in cosmic nebula atmosphere'
    ],
    patternTypes: ['abstractLine', 'abstractTextile', 'vectorFlowField', 'fluidTurbulence', 'strangeAttractor', 'marble', 'wave']
  },
  {
    id: 'minimal',
    name: 'Minimal',
    icon: '⚪',
    description: 'Clean whitespace, subtle pinstripes, and ultra-refined structural simplicity.',
    suggestedPrompts: [
      'Ultra clean minimal architectural pinstripe pattern on charcoal black',
      'Japanese wabi-sabi fine line rhythm in warm stone gray and bone white',
      'Modern Scandinavian geometric lines with balanced negative space'
    ],
    patternTypes: ['minimalLine', 'stripe', 'grid', 'crossStripe', 'squareGrid', 'diagonalStripe']
  },
  {
    id: 'seamless',
    name: 'Seamless',
    icon: '🔁',
    description: 'Flawlessly repeating edge-matched designs engineered for endless fabric and wallpaper tiles.',
    suggestedPrompts: [
      'Seamless repeating tartan plaid fabric in royal navy and hunter green',
      'Endless repeating geometric chevron pattern with verified edge match',
      'Seamless luxury damask wallpaper pattern in champagne and obsidian'
    ],
    patternTypes: ['plaid', 'tartan', 'checkered', 'gingham', 'chevron', 'herringbone', 'woven', 'houndstoothPro']
  },
  {
    id: 'lineart',
    name: 'Line Art',
    icon: '✏️',
    description: 'Continuous contour sketches, delicate monoline strokes, and intricate wire drawings.',
    suggestedPrompts: [
      'Continuous line art botanical illustration with ultra-fine strokes',
      'Modern minimalist monoline face and abstract shapes pattern',
      'Delicate architectural line drawings on parchment background'
    ],
    patternTypes: ['lineart', 'minimalLine', 'abstractLine', 'doodle', 'meshWireframe']
  },
  {
    id: 'organic',
    name: 'Organic',
    icon: '🌊',
    description: 'Biomorphic curves, cellular structures, flowing waterways, and living textures.',
    suggestedPrompts: [
      'Microscopic cellular automata pattern in glowing bioluminescent teal',
      'Fluid ocean wave swell curves with gentle seafoam gradients',
      'Natural organic contour lines inspired by topographical river beds'
    ],
    patternTypes: ['organic', 'organicFlow', 'cellularAutomata', 'reactionDiffusion', 'wave', 'marble', 'topographicIso']
  },
  {
    id: 'kids',
    name: 'Kids',
    icon: '🎈',
    description: 'Playful doodles, joyful pastel characters, and cheerful nursery prints.',
    suggestedPrompts: [
      'Cute playful animal doodles for nursery wallpaper in soft pastel mint and yellow',
      'Joyful Scandinavian rainbow and star pattern for children textile',
      'Fun cartoon confetti and geometric shapes in bright primary colors'
    ],
    patternTypes: ['kids', 'doodle', 'polkaDot', 'memphis', 'randomGeometric']
  },
  {
    id: 'animal',
    name: 'Animal',
    icon: '🐾',
    description: 'Exotic animal prints, leopard spots, zebra stripes, and wildlife-inspired textures.',
    suggestedPrompts: [
      'Modern luxury leopard skin pattern with muted rose gold spots',
      'Abstract zebra stripe wave pattern in high-contrast black and white',
      'Delicate bird feather plumage texture with iridescent violet sheen'
    ],
    patternTypes: ['tartarugaTortoise', 'fishScales', 'reactionDiffusion', 'organic', 'wave']
  },
  {
    id: 'food',
    name: 'Food',
    icon: '☕',
    description: 'Culinary motifs, coffee beans, kitchen tiles, and artisanal culinary patterns.',
    suggestedPrompts: [
      'Artisan coffee roaster bean and leaf pattern in espresso brown and cream',
      'Minimalist citrus fruit slices seamless pattern in sunny lemon and lime',
      'Vintage Italian bakery tile pattern with wheat and olive branches'
    ],
    patternTypes: ['polkaDot', 'doodle', 'organic', 'retro', 'gingham']
  },
  {
    id: 'nature',
    name: 'Nature',
    icon: '🌲',
    description: 'Scenic landscapes, river contours, woodgrains, and natural geology.',
    suggestedPrompts: [
      'Topographic contour elevation map pattern with forest green and stone',
      'Deep crystal geode rock strata with amethyst purple and gold veins',
      'Aurora borealis light wave curtains in polar midnight sky'
    ],
    patternTypes: ['topographicIso', 'crystalGeode', 'auroraBorealis', 'deepSeaCoral', 'marquetryWood', 'marble']
  },
  {
    id: 'retro',
    name: 'Retro',
    icon: '📻',
    description: 'Mid-century modern shapes, 60s psychedelic waves, and 70s earthy curves.',
    suggestedPrompts: [
      '70s warm groovy rainbow wave stripes in burnt orange, mustard, and brown',
      'Mid-century atomic boomerang pattern in olive green and teal',
      'Retro cassette and boombox 80s arcade pattern'
    ],
    patternTypes: ['retro', 'retrofuturism', 'memphis', 'wave', 'halftonePopArt']
  },
  {
    id: 'vintage',
    name: 'Vintage',
    icon: '🕰️',
    description: 'Victorian engravings, antique textures, sepia aging, and heritage filigrees.',
    suggestedPrompts: [
      'Antique Victorian damask fabric in rich burgundy and aged gold filigree',
      'Vintage engraved botanical book illustration pattern with sepia ink',
      'Heritage baroque scrollwork on aged parchment texture'
    ],
    patternTypes: ['versaceBaroque', 'artDecoFan', 'houndstoothPro', 'arabesqueScroll', 'harlequinDiamond']
  },
  {
    id: 'luxury',
    name: 'Luxury',
    icon: '👑',
    description: '24K liquid gold, black obsidian, marble veins, and haute couture opulence.',
    suggestedPrompts: [
      'Royal 24K gold geometric fan wallpaper on velvet black obsidian',
      'Haute couture metallic chevron pattern in champagne and platinum',
      'Luxury packaging pattern with fine embossed gold line filigree'
    ],
    patternTypes: ['luxury', 'artDecoFan', 'versaceBaroque', 'artDecoChevron', 'goldSpiral', 'marble']
  },
  {
    id: 'christmas',
    name: 'Christmas',
    icon: '🎄',
    description: 'Festive snowflakes, holiday pines, winter tartans, and cheerful seasonal motifs.',
    suggestedPrompts: [
      'Festive holiday snowflake crystalline pattern in ruby red, emerald, and gold',
      'Cozy winter tartan plaid pattern with deep pine green and holly berry red',
      'Scandinavian minimalist Nordic winter tree and reindeer pattern'
    ],
    patternTypes: ['christmas', 'hexStar', 'tartan', 'plaid', 'cross']
  },
  {
    id: 'halloween',
    name: 'Halloween',
    icon: '🎃',
    description: 'Spooky webs, mystic gothic motifs, jack-o-lanterns, and midnight enchantments.',
    suggestedPrompts: [
      'Mystic gothic spiderweb and crescent moon pattern in violet and obsidian',
      'Playful candy corn and haunted ghost pattern in pumpkin orange and black',
      'Victorian gothic haunted damask with subtle skull silhouettes'
    ],
    patternTypes: ['halloween', 'gridNoise', 'doodle', 'strangeAttractor', 'matrixRain']
  },
  {
    id: 'newyear',
    name: 'New Year',
    icon: '✨',
    description: 'Champagne sparkle, metallic confetti, fireworks, and celebratory countdown glamour.',
    suggestedPrompts: [
      'Glamorous New Year champagne sparkle burst in gold glitter and dark midnight',
      'Geometric art deco celebratory clockwork in silver and onyx',
      'Radiant supernova burst with celebratory starlight points'
    ],
    patternTypes: ['supernovaBurst', 'quantumDots', 'artDecoFan', 'luxury', 'guilloche']
  },
  {
    id: 'wedding',
    name: 'Wedding',
    icon: '💍',
    description: 'Bridal lace, delicate monogram frames, soft ivory damask, and romantic pastels.',
    suggestedPrompts: [
      'Elegant bridal lace floral pattern with blush pink and pearl white',
      'Romantic gold monogram filigree pattern for luxury wedding stationery',
      'Soft pastel watercolor floral wreaths on ivory silk background'
    ],
    patternTypes: ['wedding', 'valentine', 'floral', 'roseCurve', 'rhodoneaRose', 'versaceBaroque']
  },
  {
    id: 'business',
    name: 'Business',
    icon: '💼',
    description: 'Corporate pinstripes, clean technology grids, financial blueprints, and executive textures.',
    suggestedPrompts: [
      'Corporate executive navy and slate gray fine pinstripe pattern',
      'High-tech global financial data lattice grid in steel blue and white',
      'Modern professional geometric polygon mosaic for annual report background'
    ],
    patternTypes: ['business', 'squareGrid', 'grid', 'stripe', 'isometric', 'houndstoothPro']
  },
  {
    id: 'textile',
    name: 'Textile',
    icon: '🧵',
    description: 'Woven yarns, tweed herringbone, linen meshes, and authentic fabric cross-stitches.',
    suggestedPrompts: [
      'Authentic Scottish wool tweed herringbone weave in heather gray and oatmeal',
      'Heavy canvas cross-stitch weave texture with natural organic fibers',
      'Sophisticated houndstooth wool textile pattern in classic black and white'
    ],
    patternTypes: ['woven', 'herringbone', 'basketWeavePro', 'houndstoothPro', 'abstractTextile', 'plaid', 'tartan']
  },
  {
    id: 'wallpaper',
    name: 'Wallpaper',
    icon: '🖼️',
    description: 'Large-scale decorative murals, damasks, botanical prints, and feature-wall designs.',
    suggestedPrompts: [
      'Large scale Victorian botanical wallpaper mural in deep forest green and gold',
      'Modern art deco fan geometric wallpaper for luxury boutique hotel',
      'Dramatic Japanese ukiyo-e wave pattern in indigo and cloud white'
    ],
    patternTypes: ['artDecoFan', 'versaceBaroque', 'damask', 'moroccan', 'floral', 'wave', 'opArtTunnel']
  },
  {
    id: 'background',
    name: 'Background',
    icon: '🌄',
    description: 'Subtle gradients, micro-textures, paper grains, and unobtrusive presentation backdrops.',
    suggestedPrompts: [
      'Subtle minimalist textured paper grain background with warm neutral tones',
      'Soft atmospheric gradient glow backdrop for digital mockups',
      'Monochrome subtle isometric grid texture for SaaS website background'
    ],
    patternTypes: ['gridNoise', 'minimalLine', 'squareGrid', 'paper', 'gradient', 'plasmaDischarge']
  },
  {
    id: 'decorative',
    name: 'Decorative',
    icon: '💎',
    description: 'Rich border flourishes, ornamental friezes, guilloche security patterns, and crests.',
    suggestedPrompts: [
      'Intricate bank note security guilloche rosette pattern in emerald and silver',
      'Classical Renaissance decorative frieze with acanthus scrolls',
      'Modern geometric decorative border ribbon in champagne gold'
    ],
    patternTypes: ['guilloche', 'arabesqueScroll', 'greekKeyMeander', 'versaceBaroque', 'epitrochoid']
  },
  {
    id: 'monogram',
    name: 'Monogram',
    icon: '🔤',
    description: 'Interlocking initials, heraldic insignias, luxury fashion house lattices, and crests.',
    suggestedPrompts: [
      'Haute couture interlocking monogram lattice pattern in cognac brown and gold',
      'Minimalist typographic geometric alphabet mosaic in modern black and white',
      'Heraldic luxury crest pattern with refined repeating emblems'
    ],
    patternTypes: ['interlockingGrid', 'geometric', 'cross', 'diamond', 'harlequinDiamond']
  },
  {
    id: 'damask',
    name: 'Damask',
    icon: '⚜️',
    description: 'Classic reversible figured fabric motifs, symmetrical acanthus florals, and royal elegance.',
    suggestedPrompts: [
      'Regal French royal damask pattern with symmetrical floral bouquets in midnight and gold',
      'Modern tone-on-tone matte black damask wallpaper for luxury interior',
      'Venetian velvet damask with intricate leaf medallions'
    ],
    patternTypes: ['versaceBaroque', 'artDecoFan', 'arabesqueScroll', 'moroccan', 'mandala']
  },
  {
    id: 'tribal',
    name: 'Tribal',
    icon: '🏹',
    description: 'Indigenous geometric arrows, Aztec zigzags, African mudcloth, and folk heritage art.',
    suggestedPrompts: [
      'African mudcloth geometric symbol pattern in natural earth ochre and charcoal',
      'Southwestern Aztec zigzag diamond woven blanket pattern with vibrant turquoise',
      'Pacific Polynesian tattoo triangle band pattern in bold black ink'
    ],
    patternTypes: ['zigzag', 'chevron', 'diamond', 'triangle', 'cross', 'moroccan']
  },
  {
    id: 'zentangle',
    name: 'Zentangle',
    icon: '🌀',
    description: 'Meditative repetitive tangles, spontaneous fine-line doodles, and structured optical art.',
    suggestedPrompts: [
      'Intricate meditative zentangle pen drawing with curling feather tangles',
      'Optical illusion zentangle tunnel pattern with hypnotic curving lines',
      'Delicate black ink stippling and micro-pattern zentangle on cream paper'
    ],
    patternTypes: ['doodle', 'lineart', 'opArtTunnel', 'opArtWave', 'spiral', 'fractalTree', 'voronoiCells']
  }
];

if (typeof window !== 'undefined') {
  window.PATTERN_CATEGORIES = PATTERN_CATEGORIES;
}
if (typeof module !== 'undefined') {
  module.exports = PATTERN_CATEGORIES;
}
