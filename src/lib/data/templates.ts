import type { Template } from "@/lib/types/generation";

// ==========================================
// Lighting Templates
// ==========================================
export const lightingTemplates: Template[] = [
  // Natural Lighting
  {
    id: "lighting-golden-hour",
    name: "Golden Hour",
    description: "Warm, soft light during sunrise or sunset with golden tones",
    promptFragment: "golden hour lighting, warm sunlight, soft shadows",
  },
  {
    id: "lighting-natural",
    name: "Natural Light",
    description: "Soft, diffused natural daylight",
    promptFragment: "natural daylight, soft diffused light, ambient lighting",
  },
  {
    id: "lighting-overcast",
    name: "Overcast Day",
    description: "Soft, even lighting from cloudy sky",
    promptFragment: "overcast lighting, soft diffused clouds, even illumination, no harsh shadows",
  },
  {
    id: "lighting-blue-hour",
    name: "Blue Hour",
    description: "Cool twilight tones just before sunrise or after sunset",
    promptFragment: "blue hour lighting, twilight ambiance, cool blue tones, magical atmosphere",
  },
  {
    id: "lighting-harsh-sun",
    name: "Harsh Sunlight",
    description: "Direct midday sun with strong shadows",
    promptFragment: "harsh sunlight, direct sun, strong shadows, high contrast daylight",
  },
  {
    id: "lighting-dappled",
    name: "Dappled Light",
    description: "Light filtering through leaves creating patterns",
    promptFragment: "dappled sunlight, light filtering through leaves, natural patterns, forest light",
  },
  // Studio Lighting
  {
    id: "lighting-studio",
    name: "Studio Lighting",
    description: "Professional studio setup with controlled lighting",
    promptFragment: "professional studio lighting, softbox lighting, even illumination",
  },
  {
    id: "lighting-softbox",
    name: "Softbox Setup",
    description: "Soft, flattering light from diffused source",
    promptFragment: "softbox lighting, diffused light source, flattering illumination, minimal shadows",
  },
  {
    id: "lighting-ring-light",
    name: "Ring Light",
    description: "Even, flattering light popular for portraits",
    promptFragment: "ring light, even facial illumination, catchlight in eyes, beauty lighting",
  },
  {
    id: "lighting-rembrandt",
    name: "Rembrandt Lighting",
    description: "Classic portrait lighting with triangle under eye",
    promptFragment: "Rembrandt lighting, triangle shadow under eye, classic portrait style, artistic illumination",
  },
  {
    id: "lighting-butterfly",
    name: "Butterfly Lighting",
    description: "Glamour lighting from above creating butterfly shadow",
    promptFragment: "butterfly lighting, paramount lighting, shadow under nose, glamour portrait style",
  },
  {
    id: "lighting-split",
    name: "Split Lighting",
    description: "Half face lit, half in shadow for dramatic effect",
    promptFragment: "split lighting, half face illuminated, half in shadow, dramatic contrast",
  },
  // Dramatic & Artistic
  {
    id: "lighting-dramatic",
    name: "Dramatic Shadows",
    description: "High contrast lighting with deep shadows",
    promptFragment: "dramatic lighting, chiaroscuro, strong shadows, high contrast",
  },
  {
    id: "lighting-cinematic",
    name: "Cinematic",
    description: "Film-style lighting with dramatic atmosphere",
    promptFragment: "cinematic lighting, film noir style, moody atmosphere",
  },
  {
    id: "lighting-backlit",
    name: "Backlit",
    description: "Light source behind the subject creating silhouette effect",
    promptFragment: "backlit, rim lighting, silhouette effect, glowing edges",
  },
  {
    id: "lighting-rim",
    name: "Rim Light",
    description: "Highlights edges of subject from behind",
    promptFragment: "rim lighting, edge highlighting, subject separation, halo effect",
  },
  {
    id: "lighting-low-key",
    name: "Low Key",
    description: "Dark, moody lighting with minimal illumination",
    promptFragment: "low key lighting, dark atmosphere, minimal illumination, mysterious shadows",
  },
  {
    id: "lighting-high-key",
    name: "High Key",
    description: "Bright, even lighting with minimal shadows",
    promptFragment: "high key lighting, bright illumination, minimal shadows, clean look",
  },
  {
    id: "lighting-chiaroscuro",
    name: "Chiaroscuro",
    description: "Strong contrast between light and dark areas",
    promptFragment: "chiaroscuro lighting, dramatic light and shadow, Renaissance style, artistic contrast",
  },
  // Night & Artificial
  {
    id: "lighting-moonlight",
    name: "Moonlight",
    description: "Cool, ethereal moonlit atmosphere",
    promptFragment: "moonlight, cool blue tones, nighttime ambiance, ethereal glow",
  },
  {
    id: "lighting-neon",
    name: "Neon Glow",
    description: "Vibrant neon lights with colorful ambient glow",
    promptFragment: "neon lighting, vibrant colored lights, cyberpunk glow",
  },
  {
    id: "lighting-candlelight",
    name: "Candlelight",
    description: "Warm, flickering intimate lighting",
    promptFragment: "candlelight, warm flickering glow, intimate atmosphere, romantic lighting",
  },
  {
    id: "lighting-firelight",
    name: "Firelight",
    description: "Warm orange glow from fire source",
    promptFragment: "firelight, warm orange glow, dancing shadows, campfire atmosphere",
  },
  {
    id: "lighting-streetlamp",
    name: "Street Lamp",
    description: "Urban night lighting from street lamps",
    promptFragment: "street lamp lighting, urban night, pool of light, city ambiance",
  },
  {
    id: "lighting-neon-sign",
    name: "Neon Sign",
    description: "Colorful glow from neon signage",
    promptFragment: "neon sign lighting, colored glow, urban night atmosphere, vibrant illumination",
  },
  {
    id: "lighting-led-strip",
    name: "LED Strip",
    description: "Modern colored LED accent lighting",
    promptFragment: "LED strip lighting, colored accent lights, modern ambiance, gradient illumination",
  },
  // Special Effects
  {
    id: "lighting-foggy",
    name: "Foggy Atmosphere",
    description: "Diffused light through fog or mist",
    promptFragment: "foggy atmosphere, diffused misty light, atmospheric haze, soft ethereal glow",
  },
  {
    id: "lighting-volumetric",
    name: "Volumetric Light",
    description: "Visible light rays through atmosphere",
    promptFragment: "volumetric lighting, god rays, visible light beams, atmospheric rays",
  },
  {
    id: "lighting-rainbow",
    name: "Rainbow Light",
    description: "Prismatic colorful light spectrum",
    promptFragment: "rainbow lighting, prismatic colors, light spectrum, iridescent glow",
  },
  {
    id: "lighting-underwater",
    name: "Underwater Light",
    description: "Filtered blue-green aquatic lighting",
    promptFragment: "underwater lighting, caustic patterns, blue-green tones, aquatic ambiance",
  },
];

// ==========================================
// Camera/Composition Templates
// ==========================================
export const cameraTemplates: Template[] = [
  // Standard Shots
  {
    id: "camera-closeup",
    name: "Close-up",
    description: "Tight framing focusing on details",
    promptFragment: "close-up shot, detailed view, intimate framing",
  },
  {
    id: "camera-extreme-closeup",
    name: "Extreme Close-up",
    description: "Very tight framing on specific feature",
    promptFragment: "extreme close-up, tight framing on details, dramatic proximity",
  },
  {
    id: "camera-medium-shot",
    name: "Medium Shot",
    description: "Waist-up framing showing body language",
    promptFragment: "medium shot, waist-up framing, conversational distance",
  },
  {
    id: "camera-medium-closeup",
    name: "Medium Close-up",
    description: "Head and shoulders framing",
    promptFragment: "medium close-up, head and shoulders, interview style framing",
  },
  {
    id: "camera-wide",
    name: "Wide Shot",
    description: "Full scene view showing environment and context",
    promptFragment: "wide shot, full scene view, environmental context",
  },
  {
    id: "camera-extreme-wide",
    name: "Extreme Wide Shot",
    description: "Vast establishing shot showing full environment",
    promptFragment: "extreme wide shot, establishing shot, vast environment, epic scale",
  },
  {
    id: "camera-full-body",
    name: "Full Body Shot",
    description: "Complete figure from head to toe",
    promptFragment: "full body shot, head to toe framing, complete figure visible",
  },
  // Angles
  {
    id: "camera-low-angle",
    name: "Low Angle",
    description: "Shot from below looking up, making subject appear powerful",
    promptFragment: "low angle shot, looking up, heroic perspective",
  },
  {
    id: "camera-high-angle",
    name: "High Angle",
    description: "Shot from above looking down",
    promptFragment: "high angle shot, looking down, elevated perspective",
  },
  {
    id: "camera-birds-eye",
    name: "Bird's Eye",
    description: "Overhead view looking directly down",
    promptFragment: "bird's eye view, overhead shot, top-down perspective",
  },
  {
    id: "camera-worms-eye",
    name: "Worm's Eye View",
    description: "Extreme low angle from ground level",
    promptFragment: "worm's eye view, ground level, extreme low angle, dramatic upward perspective",
  },
  {
    id: "camera-dutch",
    name: "Dutch Angle",
    description: "Tilted camera creating dynamic, unsettling feel",
    promptFragment: "dutch angle, tilted frame, dynamic composition",
  },
  {
    id: "camera-eye-level",
    name: "Eye Level",
    description: "Neutral angle at subject's eye level",
    promptFragment: "eye level shot, neutral perspective, natural viewpoint",
  },
  // Portrait Specific
  {
    id: "camera-portrait",
    name: "Portrait",
    description: "Classic portrait framing with shallow depth of field",
    promptFragment: "portrait shot, shallow depth of field, bokeh background",
  },
  {
    id: "camera-headshot",
    name: "Headshot",
    description: "Professional head and shoulders portrait",
    promptFragment: "professional headshot, head and shoulders, clean composition",
  },
  {
    id: "camera-three-quarter",
    name: "Three-Quarter View",
    description: "Face turned slightly away from camera",
    promptFragment: "three-quarter view, face slightly turned, classic portrait angle",
  },
  {
    id: "camera-profile",
    name: "Profile Shot",
    description: "Side view of subject",
    promptFragment: "profile shot, side view, silhouette perspective",
  },
  // Creative & Technical
  {
    id: "camera-macro",
    name: "Macro",
    description: "Extreme close-up revealing tiny details",
    promptFragment: "macro photography, extreme close-up, fine details visible",
  },
  {
    id: "camera-over-shoulder",
    name: "Over-the-shoulder",
    description: "Shot from behind subject's shoulder",
    promptFragment: "over-the-shoulder shot, POV framing, conversational angle",
  },
  {
    id: "camera-pov",
    name: "Point of View",
    description: "First-person perspective as if through subject's eyes",
    promptFragment: "POV shot, first-person perspective, subjective view",
  },
  {
    id: "camera-tilt-shift",
    name: "Tilt-Shift",
    description: "Miniature effect with selective focus",
    promptFragment: "tilt-shift effect, miniature look, selective focus, toy-like appearance",
  },
  {
    id: "camera-fisheye",
    name: "Fisheye",
    description: "Ultra-wide angle with curved distortion",
    promptFragment: "fisheye lens, ultra-wide angle, curved distortion, extreme perspective",
  },
  {
    id: "camera-telephoto",
    name: "Telephoto Compression",
    description: "Compressed perspective from long lens",
    promptFragment: "telephoto compression, flattened perspective, background proximity",
  },
  // Composition Rules
  {
    id: "camera-rule-thirds",
    name: "Rule of Thirds",
    description: "Subject placed at intersection points",
    promptFragment: "rule of thirds composition, off-center subject, balanced framing",
  },
  {
    id: "camera-centered",
    name: "Centered Composition",
    description: "Subject placed directly in center",
    promptFragment: "centered composition, symmetrical framing, subject in middle",
  },
  {
    id: "camera-symmetrical",
    name: "Symmetrical",
    description: "Perfect symmetry in composition",
    promptFragment: "symmetrical composition, mirror balance, perfect symmetry",
  },
  {
    id: "camera-leading-lines",
    name: "Leading Lines",
    description: "Lines guiding eye to subject",
    promptFragment: "leading lines composition, visual guides to subject, depth perspective",
  },
  {
    id: "camera-framing",
    name: "Natural Frame",
    description: "Subject framed by environmental elements",
    promptFragment: "natural framing, subject framed by environment, frame within frame",
  },
  {
    id: "camera-negative-space",
    name: "Negative Space",
    description: "Lots of empty space around subject",
    promptFragment: "negative space composition, minimalist framing, isolated subject",
  },
  // Depth & Focus
  {
    id: "camera-shallow-dof",
    name: "Shallow Depth of Field",
    description: "Blurred background with sharp subject",
    promptFragment: "shallow depth of field, bokeh background, sharp subject focus, blurred surroundings",
  },
  {
    id: "camera-deep-focus",
    name: "Deep Focus",
    description: "Everything in sharp focus",
    promptFragment: "deep focus, everything sharp, full scene clarity, no blur",
  },
  {
    id: "camera-split-diopter",
    name: "Split Diopter",
    description: "Both foreground and background in focus",
    promptFragment: "split diopter effect, dual focus planes, foreground and background sharp",
  },
];

// ==========================================
// Style Templates
// ==========================================
export const styleTemplates: Template[] = [
  // Realistic
  {
    id: "style-photorealistic",
    name: "Photorealistic",
    description: "Hyper-realistic, photograph-like quality",
    promptFragment: "photorealistic, ultra-realistic, photograph quality, highly detailed",
  },
  {
    id: "style-hyperrealistic",
    name: "Hyperrealistic",
    description: "Beyond photo-real with enhanced details",
    promptFragment: "hyperrealistic, extreme detail, perfect clarity, lifelike rendering",
  },
  {
    id: "style-raw-photo",
    name: "Raw Photography",
    description: "Unprocessed, natural photo look",
    promptFragment: "raw photography style, unprocessed look, natural colors, authentic",
  },
  {
    id: "style-film-photography",
    name: "Film Photography",
    description: "Analog film aesthetic with grain",
    promptFragment: "film photography, analog film, natural grain, nostalgic color tones",
  },
  // 3D & CGI
  {
    id: "style-3d-animation",
    name: "3D Animation",
    description: "Modern 3D animated movie style like Pixar",
    promptFragment: "3D animation style, Pixar-like, CGI rendering, smooth surfaces",
  },
  {
    id: "style-3d-render",
    name: "3D Render",
    description: "Clean CGI rendered look",
    promptFragment: "3D render, CGI quality, clean surfaces, professional rendering",
  },
  {
    id: "style-unreal-engine",
    name: "Unreal Engine",
    description: "Game engine cinematic quality",
    promptFragment: "Unreal Engine style, game engine quality, cinematic rendering, RTX lighting",
  },
  {
    id: "style-octane-render",
    name: "Octane Render",
    description: "High-end GPU rendering aesthetic",
    promptFragment: "Octane render, GPU rendering, subsurface scattering, realistic materials",
  },
  {
    id: "style-claymation",
    name: "Claymation",
    description: "Stop-motion clay animation style",
    promptFragment: "claymation style, stop-motion, clay textures, handcrafted look",
  },
  // Illustration & Digital Art
  {
    id: "style-digital-art",
    name: "Digital Art",
    description: "Modern digital illustration style",
    promptFragment: "digital art, digital illustration, clean lines, vibrant colors",
  },
  {
    id: "style-concept-art",
    name: "Concept Art",
    description: "Professional concept art for games/movies",
    promptFragment: "concept art style, professional illustration, detailed environments",
  },
  {
    id: "style-matte-painting",
    name: "Matte Painting",
    description: "Cinematic background painting style",
    promptFragment: "matte painting, cinematic background, epic scale, detailed landscapes",
  },
  {
    id: "style-vector",
    name: "Vector Art",
    description: "Clean, scalable vector illustration",
    promptFragment: "vector art style, clean lines, flat colors, scalable illustration",
  },
  {
    id: "style-flat-design",
    name: "Flat Design",
    description: "Minimalist flat illustration style",
    promptFragment: "flat design, minimalist illustration, no gradients, simple shapes",
  },
  {
    id: "style-isometric",
    name: "Isometric",
    description: "Isometric 3D illustration style",
    promptFragment: "isometric design, 2.5D perspective, clean geometric shapes",
  },
  // Traditional Art
  {
    id: "style-oil-painting",
    name: "Oil Painting",
    description: "Classical oil painting with rich textures",
    promptFragment: "oil painting style, rich textures, classical art, brush stroke details",
  },
  {
    id: "style-watercolor",
    name: "Watercolor",
    description: "Soft, flowing watercolor painting aesthetic",
    promptFragment: "watercolor painting, soft washes, flowing colors, artistic brush strokes",
  },
  {
    id: "style-acrylic",
    name: "Acrylic Painting",
    description: "Bold acrylic paint texture",
    promptFragment: "acrylic painting, bold strokes, vibrant pigments, textured surface",
  },
  {
    id: "style-gouache",
    name: "Gouache",
    description: "Matte opaque watercolor style",
    promptFragment: "gouache painting, matte finish, opaque colors, vintage illustration",
  },
  {
    id: "style-pencil-sketch",
    name: "Pencil Sketch",
    description: "Hand-drawn pencil illustration",
    promptFragment: "pencil sketch, hand-drawn, graphite shading, sketch aesthetic",
  },
  {
    id: "style-charcoal",
    name: "Charcoal Drawing",
    description: "Expressive charcoal sketch style",
    promptFragment: "charcoal drawing, expressive strokes, dramatic contrast, fine art",
  },
  {
    id: "style-ink-wash",
    name: "Ink Wash",
    description: "Traditional ink wash painting style",
    promptFragment: "ink wash painting, sumi-e style, brush strokes, monochromatic elegance",
  },
  {
    id: "style-pastel",
    name: "Pastel Art",
    description: "Soft pastel chalk artwork",
    promptFragment: "pastel art, soft chalky texture, gentle colors, dreamy aesthetic",
  },
  // Animation Styles
  {
    id: "style-anime",
    name: "Anime",
    description: "Japanese animation style with expressive features",
    promptFragment: "anime style, Japanese animation, expressive eyes, cel shading",
  },
  {
    id: "style-manga",
    name: "Manga",
    description: "Japanese comic black and white style",
    promptFragment: "manga style, black and white, screentones, dynamic lines, Japanese comic",
  },
  {
    id: "style-studio-ghibli",
    name: "Studio Ghibli",
    description: "Whimsical Ghibli animation style",
    promptFragment: "Studio Ghibli style, whimsical, hand-painted backgrounds, warm atmosphere",
  },
  {
    id: "style-cartoon",
    name: "Cartoon",
    description: "Western cartoon animation style",
    promptFragment: "cartoon style, animated, exaggerated features, bold outlines",
  },
  {
    id: "style-disney",
    name: "Disney Classic",
    description: "Classic Disney animation aesthetic",
    promptFragment: "Disney animation style, classic hand-drawn, expressive characters, magical",
  },
  {
    id: "style-comic-book",
    name: "Comic Book",
    description: "Western comic book illustration",
    promptFragment: "comic book style, bold lines, halftone dots, dynamic poses, superhero aesthetic",
  },
  {
    id: "style-graphic-novel",
    name: "Graphic Novel",
    description: "Mature graphic novel illustration",
    promptFragment: "graphic novel style, detailed illustration, dramatic shading, mature themes",
  },
  // Vintage & Retro
  {
    id: "style-vintage",
    name: "Vintage",
    description: "Retro, nostalgic aesthetic with aged tones",
    promptFragment: "vintage style, retro aesthetic, faded colors, nostalgic feel",
  },
  {
    id: "style-film-noir",
    name: "Film Noir",
    description: "Classic black and white with high contrast",
    promptFragment: "film noir style, black and white, high contrast, vintage cinema",
  },
  {
    id: "style-retro-80s",
    name: "80s Retro",
    description: "1980s nostalgic aesthetic",
    promptFragment: "80s retro style, neon colors, synthwave, vintage 1980s aesthetic",
  },
  {
    id: "style-retro-70s",
    name: "70s Retro",
    description: "1970s groovy aesthetic",
    promptFragment: "70s retro style, groovy colors, disco era, warm earth tones",
  },
  {
    id: "style-art-deco",
    name: "Art Deco",
    description: "1920s Art Deco geometric style",
    promptFragment: "Art Deco style, geometric patterns, gold accents, elegant 1920s aesthetic",
  },
  {
    id: "style-art-nouveau",
    name: "Art Nouveau",
    description: "Organic flowing Art Nouveau style",
    promptFragment: "Art Nouveau style, organic curves, flowing lines, nature-inspired ornaments",
  },
  {
    id: "style-victorian",
    name: "Victorian",
    description: "Ornate Victorian era aesthetic",
    promptFragment: "Victorian style, ornate details, sepia tones, 19th century aesthetic",
  },
  // Modern Artistic Movements
  {
    id: "style-pop-art",
    name: "Pop Art",
    description: "Bold colors and graphic style inspired by Warhol",
    promptFragment: "pop art style, bold colors, graphic design, Andy Warhol inspired",
  },
  {
    id: "style-surrealism",
    name: "Surrealism",
    description: "Dreamlike surrealist imagery",
    promptFragment: "surrealism style, dreamlike, Salvador Dali inspired, impossible imagery",
  },
  {
    id: "style-impressionism",
    name: "Impressionism",
    description: "Soft brushwork capturing light",
    promptFragment: "impressionism style, visible brushstrokes, light and color focus, Monet inspired",
  },
  {
    id: "style-expressionism",
    name: "Expressionism",
    description: "Emotional, distorted artistic expression",
    promptFragment: "expressionism style, emotional intensity, distorted forms, bold colors",
  },
  {
    id: "style-cubism",
    name: "Cubism",
    description: "Geometric fragmented Picasso style",
    promptFragment: "cubism style, geometric fragments, multiple perspectives, Picasso inspired",
  },
  {
    id: "style-minimalist",
    name: "Minimalist",
    description: "Clean, simple aesthetic with limited elements",
    promptFragment: "minimalist style, clean design, simple composition, negative space",
  },
  {
    id: "style-abstract",
    name: "Abstract",
    description: "Non-representational abstract art",
    promptFragment: "abstract art style, non-representational, shapes and colors, conceptual",
  },
  // Genre Specific
  {
    id: "style-cyberpunk",
    name: "Cyberpunk",
    description: "Futuristic, neon-lit dystopian aesthetic",
    promptFragment: "cyberpunk style, neon colors, futuristic, dystopian aesthetic",
  },
  {
    id: "style-steampunk",
    name: "Steampunk",
    description: "Victorian-era mechanical aesthetic",
    promptFragment: "steampunk style, Victorian mechanics, brass and copper, gear aesthetic",
  },
  {
    id: "style-fantasy",
    name: "Fantasy Art",
    description: "Epic fantasy illustration style",
    promptFragment: "fantasy art style, magical, epic illustration, mythical creatures",
  },
  {
    id: "style-sci-fi",
    name: "Sci-Fi",
    description: "Science fiction futuristic aesthetic",
    promptFragment: "sci-fi style, futuristic technology, space age, advanced civilization",
  },
  {
    id: "style-horror",
    name: "Horror",
    description: "Dark, unsettling horror aesthetic",
    promptFragment: "horror style, dark atmosphere, unsettling imagery, gothic horror",
  },
  {
    id: "style-gothic",
    name: "Gothic",
    description: "Dark romantic gothic aesthetic",
    promptFragment: "gothic style, dark romantic, ornate architecture, mysterious atmosphere",
  },
  {
    id: "style-vaporwave",
    name: "Vaporwave",
    description: "Nostalgic internet aesthetic",
    promptFragment: "vaporwave style, pastel colors, glitch art, 90s internet aesthetic, retro digital",
  },
  {
    id: "style-dark-fantasy",
    name: "Dark Fantasy",
    description: "Grim dark fantasy world",
    promptFragment: "dark fantasy style, grim atmosphere, dark medieval, ominous mood",
  },
  // Special Effects
  {
    id: "style-double-exposure",
    name: "Double Exposure",
    description: "Multiple images blended together",
    promptFragment: "double exposure effect, blended imagery, artistic overlay, creative composite",
  },
  {
    id: "style-glitch-art",
    name: "Glitch Art",
    description: "Digital glitch aesthetic",
    promptFragment: "glitch art, digital corruption, RGB split, data distortion aesthetic",
  },
  {
    id: "style-holographic",
    name: "Holographic",
    description: "Iridescent holographic effect",
    promptFragment: "holographic style, iridescent colors, rainbow shimmer, futuristic effect",
  },
  {
    id: "style-neon-noir",
    name: "Neon Noir",
    description: "Dark noir with neon accents",
    promptFragment: "neon noir style, dark atmosphere, neon accents, cyberpunk noir",
  },
  {
    id: "style-low-poly",
    name: "Low Poly",
    description: "Geometric low polygon 3D style",
    promptFragment: "low poly style, geometric polygons, faceted surfaces, modern 3D",
  },
  {
    id: "style-pixel-art",
    name: "Pixel Art",
    description: "Retro pixel art game style",
    promptFragment: "pixel art, retro game style, 8-bit aesthetic, blocky pixels",
  },
];

// ==========================================
// Location Templates
// ==========================================
export const locationTemplates: Template[] = [
  // Urban
  {
    id: "location-urban",
    name: "Urban City",
    description: "Modern cityscape with buildings and streets",
    promptFragment: "urban city setting, modern architecture, city streets, metropolitan",
  },
  {
    id: "location-downtown",
    name: "Downtown District",
    description: "Busy downtown area with skyscrapers",
    promptFragment: "downtown setting, skyscrapers, busy streets, commercial district",
  },
  {
    id: "location-alley",
    name: "Back Alley",
    description: "Narrow urban alleyway",
    promptFragment: "back alley setting, narrow urban passage, brick walls, atmospheric",
  },
  {
    id: "location-rooftop",
    name: "Rooftop",
    description: "Building rooftop with city view",
    promptFragment: "rooftop setting, city skyline view, elevated perspective, urban backdrop",
  },
  {
    id: "location-subway",
    name: "Subway Station",
    description: "Underground metro station",
    promptFragment: "subway station, underground metro, tiled walls, urban transit",
  },
  {
    id: "location-parking-garage",
    name: "Parking Garage",
    description: "Multi-level parking structure",
    promptFragment: "parking garage, concrete structure, fluorescent lighting, industrial urban",
  },
  {
    id: "location-bridge",
    name: "City Bridge",
    description: "Urban bridge crossing",
    promptFragment: "city bridge, urban crossing, water below, architectural structure",
  },
  // Nature - Forests & Woods
  {
    id: "location-forest",
    name: "Forest",
    description: "Dense woodland with trees and natural elements",
    promptFragment: "forest setting, dense trees, woodland, natural greenery",
  },
  {
    id: "location-enchanted-forest",
    name: "Enchanted Forest",
    description: "Magical mystical woodland",
    promptFragment: "enchanted forest, magical woods, ethereal atmosphere, mystical trees",
  },
  {
    id: "location-bamboo-forest",
    name: "Bamboo Forest",
    description: "Tall bamboo grove",
    promptFragment: "bamboo forest, tall bamboo stalks, green filtered light, Asian aesthetic",
  },
  {
    id: "location-autumn-forest",
    name: "Autumn Forest",
    description: "Fall foliage woodland",
    promptFragment: "autumn forest, fall colors, orange and red leaves, seasonal beauty",
  },
  {
    id: "location-pine-forest",
    name: "Pine Forest",
    description: "Coniferous pine woodland",
    promptFragment: "pine forest, evergreen trees, needle floor, crisp atmosphere",
  },
  // Nature - Water
  {
    id: "location-beach",
    name: "Beach",
    description: "Coastal scene with sand and ocean",
    promptFragment: "beach setting, sandy shore, ocean waves, coastal scene",
  },
  {
    id: "location-tropical-beach",
    name: "Tropical Beach",
    description: "Paradise tropical shoreline",
    promptFragment: "tropical beach, palm trees, turquoise water, paradise setting",
  },
  {
    id: "location-rocky-coast",
    name: "Rocky Coastline",
    description: "Dramatic rocky shore",
    promptFragment: "rocky coastline, dramatic cliffs, crashing waves, rugged shore",
  },
  {
    id: "location-lake",
    name: "Lake",
    description: "Serene lakeside setting",
    promptFragment: "lake setting, calm waters, reflective surface, peaceful atmosphere",
  },
  {
    id: "location-waterfall",
    name: "Waterfall",
    description: "Cascading waterfall scene",
    promptFragment: "waterfall setting, cascading water, mist, natural wonder",
  },
  {
    id: "location-river",
    name: "River",
    description: "Flowing river setting",
    promptFragment: "river setting, flowing water, banks and stones, natural waterway",
  },
  {
    id: "location-underwater",
    name: "Underwater",
    description: "Beneath the water surface",
    promptFragment: "underwater setting, aquatic environment, ocean depths, marine atmosphere",
  },
  // Nature - Mountains & Terrain
  {
    id: "location-mountains",
    name: "Mountains",
    description: "Majestic mountain landscape",
    promptFragment: "mountain setting, majestic peaks, alpine landscape, rocky terrain",
  },
  {
    id: "location-snowy-peaks",
    name: "Snowy Peaks",
    description: "Snow-covered mountain tops",
    promptFragment: "snowy mountain peaks, white caps, alpine winter, pristine snow",
  },
  {
    id: "location-desert",
    name: "Desert",
    description: "Sandy desert landscape",
    promptFragment: "desert setting, sand dunes, arid landscape, dry climate",
  },
  {
    id: "location-canyon",
    name: "Canyon",
    description: "Deep canyon with rock walls",
    promptFragment: "canyon setting, deep gorge, layered rock walls, dramatic depth",
  },
  {
    id: "location-meadow",
    name: "Meadow",
    description: "Open grassy field",
    promptFragment: "meadow setting, open field, wildflowers, gentle grass",
  },
  {
    id: "location-hilltop",
    name: "Hilltop",
    description: "Elevated hillside view",
    promptFragment: "hilltop setting, elevated view, rolling hills, panoramic landscape",
  },
  {
    id: "location-cave",
    name: "Cave",
    description: "Underground cavern",
    promptFragment: "cave setting, underground cavern, rock formations, dark interior",
  },
  {
    id: "location-glacier",
    name: "Glacier",
    description: "Icy glacial landscape",
    promptFragment: "glacier setting, ice formations, blue ice, frozen landscape",
  },
  {
    id: "location-volcano",
    name: "Volcano",
    description: "Volcanic landscape",
    promptFragment: "volcanic setting, lava rock, dramatic terrain, primordial landscape",
  },
  // Indoor - Residential
  {
    id: "location-living-room",
    name: "Living Room",
    description: "Home living space",
    promptFragment: "living room setting, home interior, comfortable furnishings, domestic space",
  },
  {
    id: "location-bedroom",
    name: "Bedroom",
    description: "Personal bedroom space",
    promptFragment: "bedroom setting, personal space, bed and furnishings, intimate interior",
  },
  {
    id: "location-kitchen",
    name: "Kitchen",
    description: "Home kitchen area",
    promptFragment: "kitchen setting, cooking space, appliances and counters, domestic kitchen",
  },
  {
    id: "location-bathroom",
    name: "Bathroom",
    description: "Bathroom interior",
    promptFragment: "bathroom setting, tiled interior, fixtures, clean space",
  },
  {
    id: "location-home-office",
    name: "Home Office",
    description: "Residential workspace",
    promptFragment: "home office, residential workspace, desk setup, personal study",
  },
  // Indoor - Commercial
  {
    id: "location-cafe",
    name: "Cafe",
    description: "Cozy cafe or coffee shop interior",
    promptFragment: "cafe setting, coffee shop interior, cozy atmosphere, warm ambiance",
  },
  {
    id: "location-restaurant",
    name: "Restaurant",
    description: "Dining establishment interior",
    promptFragment: "restaurant setting, dining interior, elegant tables, fine dining atmosphere",
  },
  {
    id: "location-bar",
    name: "Bar",
    description: "Bar or pub interior",
    promptFragment: "bar setting, pub interior, dim lighting, bottles and glasses",
  },
  {
    id: "location-nightclub",
    name: "Nightclub",
    description: "Dance club interior",
    promptFragment: "nightclub setting, dance floor, colorful lights, party atmosphere",
  },
  {
    id: "location-hotel-lobby",
    name: "Hotel Lobby",
    description: "Grand hotel entrance",
    promptFragment: "hotel lobby, grand entrance, elegant decor, hospitality setting",
  },
  {
    id: "location-office",
    name: "Modern Office",
    description: "Corporate office space",
    promptFragment: "modern office, corporate setting, desks and computers, professional space",
  },
  {
    id: "location-library",
    name: "Library",
    description: "Room filled with books",
    promptFragment: "library setting, bookshelves, reading area, scholarly atmosphere",
  },
  {
    id: "location-gym",
    name: "Gym",
    description: "Fitness center interior",
    promptFragment: "gym setting, fitness equipment, workout space, athletic environment",
  },
  // Indoor - Special
  {
    id: "location-studio",
    name: "Studio Backdrop",
    description: "Clean studio background for focused portraits",
    promptFragment: "studio backdrop, clean background, professional setting, neutral backdrop",
  },
  {
    id: "location-photo-studio",
    name: "Photo Studio",
    description: "Professional photography studio",
    promptFragment: "photo studio, professional setup, lighting equipment, creative space",
  },
  {
    id: "location-art-gallery",
    name: "Art Gallery",
    description: "Museum or gallery space",
    promptFragment: "art gallery, museum interior, white walls, exhibition space",
  },
  {
    id: "location-theater",
    name: "Theater",
    description: "Performance venue interior",
    promptFragment: "theater setting, stage and seats, velvet curtains, performance venue",
  },
  {
    id: "location-warehouse",
    name: "Warehouse",
    description: "Industrial warehouse space",
    promptFragment: "warehouse setting, industrial space, high ceilings, raw brick and metal",
  },
  {
    id: "location-abandoned-building",
    name: "Abandoned Building",
    description: "Derelict structure interior",
    promptFragment: "abandoned building, derelict interior, decay and debris, atmospheric ruin",
  },
  // Fantasy & Sci-Fi
  {
    id: "location-futuristic",
    name: "Futuristic City",
    description: "Sci-fi environment with advanced technology",
    promptFragment: "futuristic setting, sci-fi environment, advanced technology, sleek design",
  },
  {
    id: "location-space-station",
    name: "Space Station",
    description: "Orbital space habitat",
    promptFragment: "space station interior, orbital habitat, futuristic corridors, zero gravity",
  },
  {
    id: "location-alien-planet",
    name: "Alien Planet",
    description: "Extraterrestrial world",
    promptFragment: "alien planet, extraterrestrial landscape, otherworldly terrain, sci-fi world",
  },
  {
    id: "location-medieval-castle",
    name: "Medieval Castle",
    description: "Fantasy castle interior",
    promptFragment: "medieval castle, stone walls, torches, fantasy architecture",
  },
  {
    id: "location-throne-room",
    name: "Throne Room",
    description: "Royal throne chamber",
    promptFragment: "throne room, royal chamber, grand architecture, regal setting",
  },
  {
    id: "location-magic-realm",
    name: "Magic Realm",
    description: "Mystical magical world",
    promptFragment: "magical realm, fantasy world, enchanted environment, mystical atmosphere",
  },
  {
    id: "location-cyberpunk-city",
    name: "Cyberpunk City",
    description: "Neon-lit dystopian metropolis",
    promptFragment: "cyberpunk city, neon lights, dystopian urban, high-tech low-life",
  },
  // Abstract & Creative
  {
    id: "location-abstract",
    name: "Abstract",
    description: "Non-representational, artistic background",
    promptFragment: "abstract background, artistic setting, non-representational, creative backdrop",
  },
  {
    id: "location-void",
    name: "Void Space",
    description: "Empty infinite space",
    promptFragment: "void background, infinite space, empty darkness, minimalist setting",
  },
  {
    id: "location-gradient",
    name: "Gradient Background",
    description: "Smooth color gradient backdrop",
    promptFragment: "gradient background, smooth color transition, professional backdrop",
  },
  {
    id: "location-bokeh",
    name: "Bokeh Background",
    description: "Blurred light circles",
    promptFragment: "bokeh background, blurred lights, dreamy circles, out of focus backdrop",
  },
  {
    id: "location-dreamscape",
    name: "Dreamscape",
    description: "Surreal dream environment",
    promptFragment: "dreamscape setting, surreal environment, dream world, ethereal atmosphere",
  },
];

// ==========================================
// Pose Templates
// ==========================================
export const poseTemplates: Template[] = [
  // Standing
  {
    id: "pose-standing",
    name: "Standing",
    description: "Upright standing position",
    promptFragment: "standing pose, upright position, confident stance",
  },
  {
    id: "pose-standing-relaxed",
    name: "Relaxed Standing",
    description: "Casual relaxed standing",
    promptFragment: "relaxed standing pose, casual stance, weight on one leg",
  },
  {
    id: "pose-standing-confident",
    name: "Power Pose",
    description: "Confident assertive stance",
    promptFragment: "power pose, confident stance, hands on hips, assertive posture",
  },
  {
    id: "pose-standing-crossed-arms",
    name: "Arms Crossed",
    description: "Standing with folded arms",
    promptFragment: "arms crossed pose, standing with folded arms, confident posture",
  },
  {
    id: "pose-hands-in-pockets",
    name: "Hands in Pockets",
    description: "Casual hands in pockets",
    promptFragment: "hands in pockets, casual stance, relaxed posture",
  },
  {
    id: "pose-contrapposto",
    name: "Contrapposto",
    description: "Classic weight shift pose",
    promptFragment: "contrapposto pose, weight shifted, classical stance, elegant posture",
  },
  // Sitting
  {
    id: "pose-sitting",
    name: "Sitting",
    description: "Seated position on chair or surface",
    promptFragment: "sitting pose, seated position, relaxed posture",
  },
  {
    id: "pose-sitting-crossed-legs",
    name: "Cross-Legged",
    description: "Sitting with legs crossed",
    promptFragment: "cross-legged sitting, elegant seated pose, legs crossed",
  },
  {
    id: "pose-sitting-floor",
    name: "Floor Sitting",
    description: "Sitting on the ground",
    promptFragment: "sitting on floor, ground-level pose, relaxed seating",
  },
  {
    id: "pose-sitting-edge",
    name: "Perched",
    description: "Sitting on edge of surface",
    promptFragment: "perched pose, sitting on edge, alert posture",
  },
  {
    id: "pose-lounging",
    name: "Lounging",
    description: "Relaxed lounging position",
    promptFragment: "lounging pose, relaxed recline, comfortable position",
  },
  {
    id: "pose-meditation",
    name: "Meditation",
    description: "Cross-legged meditation pose",
    promptFragment: "meditation pose, lotus position, zen posture, peaceful sitting",
  },
  // Leaning
  {
    id: "pose-leaning",
    name: "Leaning",
    description: "Leaning against wall or surface",
    promptFragment: "leaning pose, casual stance, resting against surface",
  },
  {
    id: "pose-leaning-wall",
    name: "Wall Lean",
    description: "Leaning against a wall",
    promptFragment: "leaning against wall, casual wall pose, relaxed stance",
  },
  {
    id: "pose-leaning-forward",
    name: "Forward Lean",
    description: "Leaning forward with interest",
    promptFragment: "forward lean pose, engaged posture, attentive stance",
  },
  {
    id: "pose-leaning-back",
    name: "Backward Lean",
    description: "Leaning back casually",
    promptFragment: "leaning back, relaxed recline, casual backward lean",
  },
  // Lying
  {
    id: "pose-lying",
    name: "Lying Down",
    description: "Horizontal resting position",
    promptFragment: "lying down pose, reclined position, horizontal posture",
  },
  {
    id: "pose-lying-side",
    name: "Side Lying",
    description: "Lying on one side",
    promptFragment: "side lying pose, resting on side, comfortable recline",
  },
  {
    id: "pose-lying-back",
    name: "Lying on Back",
    description: "Supine position facing up",
    promptFragment: "lying on back, supine position, face up recline",
  },
  {
    id: "pose-lying-stomach",
    name: "Lying on Stomach",
    description: "Prone position facing down",
    promptFragment: "lying on stomach, prone position, face down pose",
  },
  // Dynamic Movement
  {
    id: "pose-walking",
    name: "Walking",
    description: "Mid-stride walking motion",
    promptFragment: "walking pose, mid-stride, natural movement",
  },
  {
    id: "pose-running",
    name: "Running",
    description: "Dynamic running motion",
    promptFragment: "running pose, dynamic motion, athletic movement",
  },
  {
    id: "pose-jumping",
    name: "Jumping",
    description: "Mid-air jumping action",
    promptFragment: "jumping pose, mid-air, dynamic leap, energetic",
  },
  {
    id: "pose-crouching",
    name: "Crouching",
    description: "Low crouching or squatting position",
    promptFragment: "crouching pose, low stance, squatting position",
  },
  {
    id: "pose-kneeling",
    name: "Kneeling",
    description: "On one or both knees",
    promptFragment: "kneeling pose, on knees, lowered stance",
  },
  {
    id: "pose-turning",
    name: "Mid-Turn",
    description: "Caught mid-turn movement",
    promptFragment: "mid-turn pose, turning motion, dynamic twist",
  },
  {
    id: "pose-stepping",
    name: "Stepping Forward",
    description: "Taking a step forward",
    promptFragment: "stepping pose, forward movement, purposeful stride",
  },
  // Action Poses
  {
    id: "pose-reaching",
    name: "Reaching",
    description: "Reaching for something",
    promptFragment: "reaching pose, extended arm, grasping motion",
  },
  {
    id: "pose-pointing",
    name: "Pointing",
    description: "Pointing gesture",
    promptFragment: "pointing pose, directional gesture, indicating motion",
  },
  {
    id: "pose-waving",
    name: "Waving",
    description: "Hand wave gesture",
    promptFragment: "waving pose, greeting gesture, raised hand wave",
  },
  {
    id: "pose-stretching",
    name: "Stretching",
    description: "Full body stretch",
    promptFragment: "stretching pose, body stretch, extended limbs, flexible position",
  },
  {
    id: "pose-dancing",
    name: "Dance Pose",
    description: "Elegant dance position",
    promptFragment: "dance pose, elegant position, graceful stance",
  },
  {
    id: "pose-action-hero",
    name: "Action Hero",
    description: "Dynamic heroic stance",
    promptFragment: "action hero pose, dynamic stance, powerful position",
  },
  {
    id: "pose-defensive",
    name: "Defensive Stance",
    description: "Guarded protective position",
    promptFragment: "defensive pose, guarded stance, protective position",
  },
  // Professional/Casual
  {
    id: "pose-arms-behind-back",
    name: "Arms Behind Back",
    description: "Hands clasped behind",
    promptFragment: "arms behind back, hands clasped, formal stance",
  },
  {
    id: "pose-chin-rest",
    name: "Chin Rest",
    description: "Hand resting under chin",
    promptFragment: "chin rest pose, hand under chin, thoughtful position",
  },
  {
    id: "pose-head-tilt",
    name: "Head Tilt",
    description: "Slight head tilt",
    promptFragment: "head tilt pose, angled head, curious expression",
  },
  {
    id: "pose-looking-away",
    name: "Looking Away",
    description: "Gaze directed off-camera",
    promptFragment: "looking away pose, off-camera gaze, contemplative direction",
  },
  {
    id: "pose-over-shoulder",
    name: "Over Shoulder Look",
    description: "Looking back over shoulder",
    promptFragment: "over shoulder look, backward glance, turned pose",
  },
];

// ==========================================
// Action Templates
// ==========================================
export const actionTemplates: Template[] = [
  // Emotions/Expressions as Actions
  {
    id: "action-smiling",
    name: "Smiling",
    description: "Happy, smiling expression",
    promptFragment: "smiling, happy expression, warm smile",
  },
  {
    id: "action-laughing",
    name: "Laughing",
    description: "Genuine laughter expression",
    promptFragment: "laughing, genuine laughter, joyful expression",
  },
  {
    id: "action-thinking",
    name: "Thinking",
    description: "Contemplative, thoughtful expression",
    promptFragment: "thinking, contemplative expression, pensive mood",
  },
  {
    id: "action-talking",
    name: "Talking",
    description: "Engaged in conversation",
    promptFragment: "talking, mid-conversation, expressive gestures",
  },
  {
    id: "action-whispering",
    name: "Whispering",
    description: "Speaking softly, secretive",
    promptFragment: "whispering, speaking softly, secretive gesture",
  },
  {
    id: "action-shouting",
    name: "Shouting",
    description: "Calling out loudly",
    promptFragment: "shouting, calling out, raised voice, energetic",
  },
  // Work & Productivity
  {
    id: "action-working",
    name: "Working",
    description: "Engaged in work or task",
    promptFragment: "working, focused on task, productive activity",
  },
  {
    id: "action-typing",
    name: "Typing",
    description: "Typing on keyboard or device",
    promptFragment: "typing, keyboard work, focused on screen",
  },
  {
    id: "action-writing",
    name: "Writing",
    description: "Writing by hand",
    promptFragment: "writing, pen in hand, focused on paper",
  },
  {
    id: "action-reading",
    name: "Reading",
    description: "Reading a book or document",
    promptFragment: "reading, holding book, focused attention",
  },
  {
    id: "action-studying",
    name: "Studying",
    description: "Intense focused learning",
    promptFragment: "studying, concentrated learning, surrounded by materials",
  },
  {
    id: "action-presenting",
    name: "Presenting",
    description: "Giving a presentation",
    promptFragment: "presenting, public speaking, confident gesture",
  },
  {
    id: "action-meeting",
    name: "In a Meeting",
    description: "Participating in discussion",
    promptFragment: "in meeting, business discussion, collaborative setting",
  },
  // Physical Activities
  {
    id: "action-dancing",
    name: "Dancing",
    description: "Dynamic dancing movement",
    promptFragment: "dancing, dynamic movement, rhythmic motion",
  },
  {
    id: "action-exercising",
    name: "Exercising",
    description: "Physical workout activity",
    promptFragment: "exercising, workout activity, physical exertion",
  },
  {
    id: "action-yoga",
    name: "Yoga",
    description: "Yoga practice pose",
    promptFragment: "yoga pose, mindful stretching, zen practice",
  },
  {
    id: "action-running",
    name: "Running",
    description: "Jogging or sprinting",
    promptFragment: "running, athletic motion, active movement",
  },
  {
    id: "action-swimming",
    name: "Swimming",
    description: "Swimming motion",
    promptFragment: "swimming, in water motion, athletic stroke",
  },
  {
    id: "action-climbing",
    name: "Climbing",
    description: "Climbing activity",
    promptFragment: "climbing, ascending motion, gripping holds",
  },
  {
    id: "action-jumping",
    name: "Jumping",
    description: "Mid-jump action",
    promptFragment: "jumping, leaping motion, airborne action",
  },
  // Leisure Activities
  {
    id: "action-playing-music",
    name: "Playing Music",
    description: "Playing an instrument",
    promptFragment: "playing music, musical instrument, performance",
  },
  {
    id: "action-singing",
    name: "Singing",
    description: "Vocal performance",
    promptFragment: "singing, vocal performance, musical expression",
  },
  {
    id: "action-painting",
    name: "Painting",
    description: "Creating art",
    promptFragment: "painting, creating art, brush in hand, artistic activity",
  },
  {
    id: "action-cooking",
    name: "Cooking",
    description: "Preparing food",
    promptFragment: "cooking, preparing food, culinary activity",
  },
  {
    id: "action-gaming",
    name: "Gaming",
    description: "Playing video games",
    promptFragment: "gaming, playing video games, controller in hand",
  },
  {
    id: "action-gardening",
    name: "Gardening",
    description: "Tending to plants",
    promptFragment: "gardening, tending plants, outdoor activity",
  },
  {
    id: "action-photography",
    name: "Taking Photos",
    description: "Using a camera",
    promptFragment: "taking photos, camera in hand, capturing moment",
  },
  // Social Actions
  {
    id: "action-hugging",
    name: "Hugging",
    description: "Embracing someone",
    promptFragment: "hugging, embracing, affectionate gesture",
  },
  {
    id: "action-handshake",
    name: "Handshake",
    description: "Formal greeting",
    promptFragment: "handshake, formal greeting, business gesture",
  },
  {
    id: "action-waving",
    name: "Waving",
    description: "Greeting wave",
    promptFragment: "waving, greeting gesture, friendly wave",
  },
  {
    id: "action-cheering",
    name: "Cheering",
    description: "Celebratory cheering",
    promptFragment: "cheering, celebrating, excited gesture, arms raised",
  },
  {
    id: "action-applauding",
    name: "Applauding",
    description: "Clapping hands",
    promptFragment: "applauding, clapping, appreciation gesture",
  },
  {
    id: "action-toasting",
    name: "Toasting",
    description: "Raising glass for toast",
    promptFragment: "toasting, raising glass, celebratory gesture",
  },
  // Daily Activities
  {
    id: "action-eating",
    name: "Eating",
    description: "Enjoying food",
    promptFragment: "eating, enjoying food, dining activity",
  },
  {
    id: "action-drinking",
    name: "Drinking",
    description: "Having a beverage",
    promptFragment: "drinking, beverage in hand, refreshment",
  },
  {
    id: "action-coffee",
    name: "Drinking Coffee",
    description: "Enjoying coffee",
    promptFragment: "drinking coffee, holding coffee cup, morning routine",
  },
  {
    id: "action-sleeping",
    name: "Sleeping",
    description: "Asleep or resting",
    promptFragment: "sleeping, peaceful rest, eyes closed",
  },
  {
    id: "action-stretching",
    name: "Stretching",
    description: "Morning stretch or workout stretch",
    promptFragment: "stretching, extending limbs, flexible movement",
  },
  {
    id: "action-phone-call",
    name: "Phone Call",
    description: "On the phone",
    promptFragment: "on phone, phone call, conversation on mobile",
  },
  {
    id: "action-texting",
    name: "Texting",
    description: "Using smartphone",
    promptFragment: "texting, using phone, smartphone activity",
  },
  {
    id: "action-walking",
    name: "Walking",
    description: "Casual walking",
    promptFragment: "walking, casual stroll, moving forward",
  },
  // Contemplative Actions
  {
    id: "action-meditating",
    name: "Meditating",
    description: "Mindfulness practice",
    promptFragment: "meditating, mindfulness, peaceful concentration",
  },
  {
    id: "action-daydreaming",
    name: "Daydreaming",
    description: "Lost in thought",
    promptFragment: "daydreaming, lost in thought, distant gaze",
  },
  {
    id: "action-stargazing",
    name: "Stargazing",
    description: "Looking at the sky",
    promptFragment: "stargazing, looking up at sky, contemplative gaze",
  },
  {
    id: "action-watching",
    name: "Watching",
    description: "Observing something",
    promptFragment: "watching, observing intently, focused attention",
  },
];

// ==========================================
// Clothing Templates
// ==========================================
export const clothingTemplates: Template[] = [
  // Casual
  {
    id: "clothing-casual",
    name: "Casual",
    description: "Everyday casual wear",
    promptFragment: "casual clothing, everyday wear, relaxed outfit",
  },
  {
    id: "clothing-tshirt-jeans",
    name: "T-Shirt & Jeans",
    description: "Classic casual combination",
    promptFragment: "t-shirt and jeans, classic casual look, comfortable clothing",
  },
  {
    id: "clothing-hoodie",
    name: "Hoodie",
    description: "Comfortable hooded sweatshirt",
    promptFragment: "wearing hoodie, comfortable sweatshirt, casual streetwear",
  },
  {
    id: "clothing-sweater",
    name: "Sweater",
    description: "Cozy knit sweater",
    promptFragment: "wearing sweater, cozy knitwear, comfortable top",
  },
  {
    id: "clothing-cardigan",
    name: "Cardigan",
    description: "Button-up knit cardigan",
    promptFragment: "wearing cardigan, button-up knit, layered casual",
  },
  {
    id: "clothing-polo",
    name: "Polo Shirt",
    description: "Smart casual polo",
    promptFragment: "polo shirt, smart casual, collared casual top",
  },
  // Formal & Business
  {
    id: "clothing-formal",
    name: "Formal",
    description: "Business or formal attire",
    promptFragment: "formal attire, business wear, professional clothing",
  },
  {
    id: "clothing-suit",
    name: "Business Suit",
    description: "Professional suit and tie",
    promptFragment: "business suit, professional attire, formal suiting",
  },
  {
    id: "clothing-blazer",
    name: "Blazer",
    description: "Smart blazer jacket",
    promptFragment: "wearing blazer, smart jacket, semi-formal wear",
  },
  {
    id: "clothing-dress-shirt",
    name: "Dress Shirt",
    description: "Formal button-down shirt",
    promptFragment: "dress shirt, button-down formal, professional top",
  },
  {
    id: "clothing-tuxedo",
    name: "Tuxedo",
    description: "Black tie formal wear",
    promptFragment: "tuxedo, black tie attire, formal evening wear",
  },
  {
    id: "clothing-business-casual",
    name: "Business Casual",
    description: "Smart but relaxed office wear",
    promptFragment: "business casual, smart office wear, professional relaxed",
  },
  // Dresses & Skirts
  {
    id: "clothing-dress",
    name: "Dress",
    description: "Casual or formal dress",
    promptFragment: "wearing dress, one-piece outfit, feminine attire",
  },
  {
    id: "clothing-evening-gown",
    name: "Evening Gown",
    description: "Formal evening dress",
    promptFragment: "evening gown, formal long dress, elegant attire",
  },
  {
    id: "clothing-cocktail-dress",
    name: "Cocktail Dress",
    description: "Semi-formal short dress",
    promptFragment: "cocktail dress, semi-formal dress, party attire",
  },
  {
    id: "clothing-sundress",
    name: "Sundress",
    description: "Light summer dress",
    promptFragment: "sundress, light summer dress, casual feminine",
  },
  {
    id: "clothing-maxi-dress",
    name: "Maxi Dress",
    description: "Long flowing dress",
    promptFragment: "maxi dress, long flowing dress, bohemian style",
  },
  {
    id: "clothing-skirt",
    name: "Skirt",
    description: "Various skirt styles",
    promptFragment: "wearing skirt, feminine bottom wear, versatile style",
  },
  // Athletic & Active
  {
    id: "clothing-athletic",
    name: "Athletic",
    description: "Sports or workout clothing",
    promptFragment: "athletic wear, sports clothing, workout outfit",
  },
  {
    id: "clothing-yoga",
    name: "Yoga Wear",
    description: "Flexible yoga attire",
    promptFragment: "yoga wear, stretchy athletic, flexible clothing",
  },
  {
    id: "clothing-running-gear",
    name: "Running Gear",
    description: "Running attire",
    promptFragment: "running gear, athletic shorts and top, sports attire",
  },
  {
    id: "clothing-swimwear",
    name: "Swimwear",
    description: "Swimming attire",
    promptFragment: "swimwear, beach attire, swimming outfit",
  },
  {
    id: "clothing-sports-uniform",
    name: "Sports Uniform",
    description: "Team sports attire",
    promptFragment: "sports uniform, team jersey, athletic competition wear",
  },
  // Streetwear & Urban
  {
    id: "clothing-streetwear",
    name: "Streetwear",
    description: "Urban street fashion style",
    promptFragment: "streetwear, urban fashion, trendy street style",
  },
  {
    id: "clothing-hypebeast",
    name: "Hypebeast",
    description: "High-end streetwear",
    promptFragment: "hypebeast style, designer streetwear, exclusive urban fashion",
  },
  {
    id: "clothing-urban-layers",
    name: "Urban Layers",
    description: "Layered street style",
    promptFragment: "urban layered look, multiple layers, street fashion",
  },
  {
    id: "clothing-denim-jacket",
    name: "Denim Jacket",
    description: "Classic jean jacket",
    promptFragment: "denim jacket, jean jacket, classic casual outerwear",
  },
  {
    id: "clothing-bomber-jacket",
    name: "Bomber Jacket",
    description: "Classic bomber style",
    promptFragment: "bomber jacket, classic outerwear, casual cool",
  },
  // Elegant & Luxury
  {
    id: "clothing-elegant",
    name: "Elegant",
    description: "Sophisticated, upscale fashion",
    promptFragment: "elegant attire, sophisticated fashion, upscale clothing",
  },
  {
    id: "clothing-haute-couture",
    name: "Haute Couture",
    description: "High fashion designer wear",
    promptFragment: "haute couture, high fashion, designer clothing",
  },
  {
    id: "clothing-designer",
    name: "Designer Wear",
    description: "Luxury brand clothing",
    promptFragment: "designer clothing, luxury fashion, premium attire",
  },
  {
    id: "clothing-silk",
    name: "Silk Attire",
    description: "Luxurious silk garments",
    promptFragment: "silk clothing, luxurious fabric, elegant material",
  },
  // Vintage & Retro
  {
    id: "clothing-vintage",
    name: "Vintage",
    description: "Retro or period-appropriate clothing",
    promptFragment: "vintage clothing, retro fashion, period attire",
  },
  {
    id: "clothing-retro-50s",
    name: "1950s Style",
    description: "Classic 50s fashion",
    promptFragment: "1950s fashion, retro fifties style, classic vintage",
  },
  {
    id: "clothing-retro-70s",
    name: "1970s Style",
    description: "Groovy 70s fashion",
    promptFragment: "1970s fashion, seventies style, disco era clothing",
  },
  {
    id: "clothing-retro-80s",
    name: "1980s Style",
    description: "Bold 80s fashion",
    promptFragment: "1980s fashion, eighties style, bold retro",
  },
  {
    id: "clothing-retro-90s",
    name: "1990s Style",
    description: "90s grunge and minimalist",
    promptFragment: "1990s fashion, nineties style, grunge minimalist",
  },
  // Cultural & Traditional
  {
    id: "clothing-traditional",
    name: "Traditional Wear",
    description: "Cultural traditional clothing",
    promptFragment: "traditional clothing, cultural attire, heritage wear",
  },
  {
    id: "clothing-kimono",
    name: "Kimono",
    description: "Traditional Japanese garment",
    promptFragment: "wearing kimono, Japanese traditional, elegant robe",
  },
  {
    id: "clothing-hanbok",
    name: "Hanbok",
    description: "Traditional Korean attire",
    promptFragment: "wearing hanbok, Korean traditional, colorful formal",
  },
  {
    id: "clothing-saree",
    name: "Saree",
    description: "Traditional Indian garment",
    promptFragment: "wearing saree, Indian traditional, elegant draping",
  },
  {
    id: "clothing-cheongsam",
    name: "Cheongsam",
    description: "Traditional Chinese dress",
    promptFragment: "wearing cheongsam, Chinese traditional dress, elegant fitted",
  },
  // Special & Themed
  {
    id: "clothing-uniform",
    name: "Uniform",
    description: "Professional or school uniform",
    promptFragment: "wearing uniform, professional attire, standardized clothing",
  },
  {
    id: "clothing-military",
    name: "Military Style",
    description: "Military-inspired fashion",
    promptFragment: "military style clothing, tactical fashion, army aesthetic",
  },
  {
    id: "clothing-punk",
    name: "Punk",
    description: "Punk rock fashion",
    promptFragment: "punk fashion, rebellious style, leather and studs",
  },
  {
    id: "clothing-goth",
    name: "Gothic",
    description: "Gothic fashion style",
    promptFragment: "gothic fashion, dark clothing, dramatic black attire",
  },
  {
    id: "clothing-bohemian",
    name: "Bohemian",
    description: "Boho chic style",
    promptFragment: "bohemian style, boho chic, free-spirited fashion",
  },
  {
    id: "clothing-minimalist",
    name: "Minimalist",
    description: "Clean simple fashion",
    promptFragment: "minimalist fashion, clean simple lines, neutral colors",
  },
  // Outerwear
  {
    id: "clothing-winter-coat",
    name: "Winter Coat",
    description: "Heavy winter outerwear",
    promptFragment: "winter coat, heavy outerwear, cold weather clothing",
  },
  {
    id: "clothing-leather-jacket",
    name: "Leather Jacket",
    description: "Classic leather jacket",
    promptFragment: "leather jacket, classic outerwear, edgy style",
  },
  {
    id: "clothing-trench-coat",
    name: "Trench Coat",
    description: "Classic trench style",
    promptFragment: "trench coat, classic outerwear, sophisticated style",
  },
  {
    id: "clothing-raincoat",
    name: "Raincoat",
    description: "Weather protection",
    promptFragment: "raincoat, waterproof outerwear, weather protection",
  },
  // Fantasy & Costume
  {
    id: "clothing-fantasy-armor",
    name: "Fantasy Armor",
    description: "Medieval or fantasy armor",
    promptFragment: "fantasy armor, medieval plate, warrior attire",
  },
  {
    id: "clothing-royal-robes",
    name: "Royal Robes",
    description: "Regal royal garments",
    promptFragment: "royal robes, regal attire, majestic clothing",
  },
  {
    id: "clothing-futuristic",
    name: "Futuristic",
    description: "Sci-fi inspired fashion",
    promptFragment: "futuristic clothing, sci-fi fashion, advanced textiles",
  },
  {
    id: "clothing-cyberpunk",
    name: "Cyberpunk Fashion",
    description: "Tech-enhanced urban wear",
    promptFragment: "cyberpunk fashion, tech wear, neon accented clothing",
  },
];

// ==========================================
// Expression Templates
// ==========================================
export const expressionTemplates: Template[] = [
  // Positive Emotions
  {
    id: "expression-neutral",
    name: "Neutral",
    description: "Calm, neutral facial expression",
    promptFragment: "neutral expression, calm face, relaxed features",
  },
  {
    id: "expression-happy",
    name: "Happy",
    description: "Joyful, pleased expression",
    promptFragment: "happy expression, joyful face, pleased look",
  },
  {
    id: "expression-joyful",
    name: "Joyful",
    description: "Radiating with joy",
    promptFragment: "joyful expression, beaming happiness, radiant smile",
  },
  {
    id: "expression-content",
    name: "Content",
    description: "Peaceful satisfaction",
    promptFragment: "content expression, peaceful satisfaction, gentle smile",
  },
  {
    id: "expression-excited",
    name: "Excited",
    description: "Enthusiastic and thrilled",
    promptFragment: "excited expression, enthusiastic face, thrilled look",
  },
  {
    id: "expression-amused",
    name: "Amused",
    description: "Entertained smirk",
    promptFragment: "amused expression, entertained smirk, playful look",
  },
  {
    id: "expression-proud",
    name: "Proud",
    description: "Self-satisfied pride",
    promptFragment: "proud expression, self-satisfied look, accomplished face",
  },
  {
    id: "expression-loving",
    name: "Loving",
    description: "Warm affectionate gaze",
    promptFragment: "loving expression, warm affectionate gaze, tender look",
  },
  {
    id: "expression-hopeful",
    name: "Hopeful",
    description: "Optimistic and expecting",
    promptFragment: "hopeful expression, optimistic look, expectant face",
  },
  // Confident & Serious
  {
    id: "expression-confident",
    name: "Confident",
    description: "Self-assured, bold expression",
    promptFragment: "confident expression, self-assured look, bold demeanor",
  },
  {
    id: "expression-determined",
    name: "Determined",
    description: "Resolute and focused",
    promptFragment: "determined expression, resolute face, focused determination",
  },
  {
    id: "expression-serious",
    name: "Serious",
    description: "Focused, serious demeanor",
    promptFragment: "serious expression, focused look, determined face",
  },
  {
    id: "expression-stern",
    name: "Stern",
    description: "Strict serious look",
    promptFragment: "stern expression, strict look, unyielding face",
  },
  {
    id: "expression-intense",
    name: "Intense",
    description: "Deep concentrated gaze",
    promptFragment: "intense expression, concentrated gaze, penetrating look",
  },
  {
    id: "expression-stoic",
    name: "Stoic",
    description: "Emotionless and controlled",
    promptFragment: "stoic expression, emotionless face, controlled demeanor",
  },
  // Thoughtful & Contemplative
  {
    id: "expression-thoughtful",
    name: "Thoughtful",
    description: "Deep in thought",
    promptFragment: "thoughtful expression, deep in thought, contemplative face",
  },
  {
    id: "expression-pensive",
    name: "Pensive",
    description: "Lost in deep thought",
    promptFragment: "pensive expression, lost in thought, reflective look",
  },
  {
    id: "expression-curious",
    name: "Curious",
    description: "Interested and questioning",
    promptFragment: "curious expression, interested look, questioning face",
  },
  {
    id: "expression-wondering",
    name: "Wondering",
    description: "Imaginative pondering",
    promptFragment: "wondering expression, imaginative look, dreamy pondering",
  },
  {
    id: "expression-skeptical",
    name: "Skeptical",
    description: "Doubtful and questioning",
    promptFragment: "skeptical expression, doubtful look, questioning face",
  },
  {
    id: "expression-focused",
    name: "Focused",
    description: "Concentrated attention",
    promptFragment: "focused expression, concentrated look, attentive face",
  },
  // Surprised & Amazed
  {
    id: "expression-surprised",
    name: "Surprised",
    description: "Shocked or amazed expression",
    promptFragment: "surprised expression, shocked look, wide eyes",
  },
  {
    id: "expression-amazed",
    name: "Amazed",
    description: "Wonder and astonishment",
    promptFragment: "amazed expression, wonder-filled face, astonished look",
  },
  {
    id: "expression-shocked",
    name: "Shocked",
    description: "Stunned disbelief",
    promptFragment: "shocked expression, stunned look, disbelief face",
  },
  {
    id: "expression-bewildered",
    name: "Bewildered",
    description: "Confused amazement",
    promptFragment: "bewildered expression, confused look, puzzled face",
  },
  // Negative & Complex Emotions
  {
    id: "expression-sad",
    name: "Sad",
    description: "Sorrowful expression",
    promptFragment: "sad expression, sorrowful look, downcast face",
  },
  {
    id: "expression-melancholic",
    name: "Melancholic",
    description: "Deep sadness and longing",
    promptFragment: "melancholic expression, deep sadness, wistful look",
  },
  {
    id: "expression-worried",
    name: "Worried",
    description: "Anxious and concerned",
    promptFragment: "worried expression, anxious look, concerned face",
  },
  {
    id: "expression-fearful",
    name: "Fearful",
    description: "Scared and alarmed",
    promptFragment: "fearful expression, scared look, alarmed face",
  },
  {
    id: "expression-angry",
    name: "Angry",
    description: "Rage and frustration",
    promptFragment: "angry expression, furious look, enraged face",
  },
  {
    id: "expression-frustrated",
    name: "Frustrated",
    description: "Annoyed and vexed",
    promptFragment: "frustrated expression, annoyed look, vexed face",
  },
  {
    id: "expression-disgusted",
    name: "Disgusted",
    description: "Revulsion and distaste",
    promptFragment: "disgusted expression, revulsion, distaste face",
  },
  {
    id: "expression-disappointed",
    name: "Disappointed",
    description: "Let down and dismayed",
    promptFragment: "disappointed expression, let down look, dismayed face",
  },
  // Mysterious & Enigmatic
  {
    id: "expression-mysterious",
    name: "Mysterious",
    description: "Enigmatic, intriguing expression",
    promptFragment: "mysterious expression, enigmatic look, intriguing gaze",
  },
  {
    id: "expression-secretive",
    name: "Secretive",
    description: "Hiding something",
    promptFragment: "secretive expression, knowing look, hidden meaning",
  },
  {
    id: "expression-smirking",
    name: "Smirking",
    description: "Knowing half-smile",
    promptFragment: "smirking expression, knowing half-smile, clever look",
  },
  {
    id: "expression-mischievous",
    name: "Mischievous",
    description: "Playfully naughty",
    promptFragment: "mischievous expression, playful naughty look, impish grin",
  },
  {
    id: "expression-seductive",
    name: "Seductive",
    description: "Alluring and enticing",
    promptFragment: "seductive expression, alluring look, enticing gaze",
  },
  // Other Expressions
  {
    id: "expression-dreamy",
    name: "Dreamy",
    description: "Lost in fantasy",
    promptFragment: "dreamy expression, lost in fantasy, faraway look",
  },
  {
    id: "expression-sleepy",
    name: "Sleepy",
    description: "Drowsy and tired",
    promptFragment: "sleepy expression, drowsy look, tired eyes",
  },
  {
    id: "expression-bored",
    name: "Bored",
    description: "Uninterested and dull",
    promptFragment: "bored expression, uninterested look, dull face",
  },
  {
    id: "expression-embarrassed",
    name: "Embarrassed",
    description: "Flustered and shy",
    promptFragment: "embarrassed expression, flustered look, shy face",
  },
  {
    id: "expression-awkward",
    name: "Awkward",
    description: "Uncomfortable and uneasy",
    promptFragment: "awkward expression, uncomfortable look, uneasy face",
  },
  {
    id: "expression-blank",
    name: "Blank",
    description: "Empty expressionless face",
    promptFragment: "blank expression, expressionless face, vacant look",
  },
];

// ==========================================
// All Templates Export
// ==========================================
export const allTemplates = {
  lighting: lightingTemplates,
  camera: cameraTemplates,
  style: styleTemplates,
  location: locationTemplates,
  pose: poseTemplates,
  action: actionTemplates,
  clothing: clothingTemplates,
  expression: expressionTemplates,
};

export type TemplateCategory = keyof typeof allTemplates;

/**
 * Get templates by category
 */
export function getTemplatesByCategory(category: TemplateCategory): Template[] {
  return allTemplates[category];
}

/**
 * Get a template by ID from any category
 */
export function getTemplateById(id: string): Template | undefined {
  for (const templates of Object.values(allTemplates)) {
    const template = templates.find((t) => t.id === id);
    if (template) return template;
  }
  return undefined;
}
