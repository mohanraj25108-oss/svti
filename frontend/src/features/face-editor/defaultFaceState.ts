import { FaceState, FeaturePreset, HeadJawState, HairState, EyebrowState, EyeState, NoseState, MouthState, EarState, FacialHairState, GlassesState, HeadwearState, SkinAgeState, MarkScarItem } from './types';

export const INITIAL_FACE_STATE: FaceState = {
  version: 1,
  seed: 4921,
  gender: 'male',
  head_jaw: {
    shape: 'square',
    width: 1.05,
    jaw_angle: 1.15,
    chin_length: 1.02,
    chin_shape: 'square',
    chin_width: 1.1,
    cheekbone_prominence: 1.1
  },
  hair: {
    style: 'short_buzz',
    hairline: 'straight',
    length: 0.25,
    density: 0.85,
    color: '#1C1917',
    gray_percentage: 10
  },
  eyebrows: {
    shape: 'bushy_straight',
    thickness: 1.15,
    spacing: 0.95,
    height: 1.0,
    tilt: 2,
    density: 1.1,
    color: '#1C1917'
  },
  eyes: {
    shape: 'almond',
    size: 1.0,
    spacing: 1.0,
    tilt: 0,
    eyelids: 'hooded',
    color: 'dark_brown',
    vertical_position: 1.0,
    under_eye_bags: 0.3
  },
  nose: {
    length: 1.05,
    width: 1.0,
    bridge: 'straight',
    nostril_shape: 'narrow',
    nostril_width: 1.0,
    tip: 'pointed',
    vertical_position: 1.0
  },
  mouth: {
    shape: 'straight',
    width: 1.02,
    upper_lip_thickness: 0.95,
    lower_lip_thickness: 1.05,
    vertical_position: 1.0,
    philtrum_depth: 0.6,
    philtrum_width: 1.0,
    corner_expression: 0
  },
  ears: {
    size: 1.0,
    vertical_position: 1.0,
    shape: 'free_lobes',
    protrusion: 1.0
  },
  facial_hair: {
    beard: 'five_o_clock_stubble',
    moustache: 'none',
    stubble_density: 0.65,
    color: '#1C1917'
  },
  glasses: {
    style: 'none',
    frame_thickness: 1.0,
    tint: 'clear'
  },
  headwear: {
    style: 'none',
    color: '#18181B'
  },
  marks_scars: [
    {
      id: 'scar_cheek_1',
      type: 'linear_scar',
      label: 'Cheek Linear Scar',
      x: 38,
      y: 58,
      size: 1.2,
      rotation: -25,
      opacity: 0.85
    }
  ],
  skin_age: {
    skin_tone: '#DCB289', // Fitzpatrick III / Medium Olive
    undertone: 'olive',
    age_appearance: 34,
    forehead_wrinkles: 0.25,
    crows_feet: 0.3,
    nasolabial_folds: 0.4,
    marionette_lines: 0.15,
    neck_lines: 0.2
  },
  expression: 'neutral',
  lighting: {
    direction: 'front_balanced',
    contrast: 1.0
  },
  symmetry_locks: {
    eyes: true,
    eyebrows: true,
    ears: true
  },
  confidence_ratings: {
    jawline: 95,
    hair_style: 85,
    scars_marks: 95,
    eyes: 80,
    nose: 85,
    mouth: 80,
    age: 90
  },
  locked_features: {
    head_jaw: false,
    hair: false,
    eyebrows: false,
    eyes: false,
    nose: false,
    mouth: false,
    ears: false,
    facial_hair: false,
    glasses_headwear: false,
    marks_scars: false,
    skin_age: false
  },
  hidden_features: {
    hair: false,
    facial_hair: false,
    glasses: false,
    headwear: false,
    marks_scars: false
  }
};

// -------------------------------------------------------------
// PRESETS (At least 8-12 presets per major feature)
// -------------------------------------------------------------

export const HEAD_JAW_PRESETS: FeaturePreset<HeadJawState>[] = [
  { id: 'square_angular', label: 'Square Angular', description: 'Prominent mandibular angle with squared chin', data: { shape: 'square', width: 1.1, jaw_angle: 1.25, chin_shape: 'square', chin_width: 1.15 } },
  { id: 'oval_balanced', label: 'Oval Balanced', description: 'Harmonious classic forensic oval proportion', data: { shape: 'oval', width: 1.0, jaw_angle: 1.0, chin_shape: 'round', chin_width: 1.0 } },
  { id: 'round_soft', label: 'Round / Full', description: 'Curvilinear jaw contour with full cheeks', data: { shape: 'round', width: 1.18, jaw_angle: 0.85, chin_shape: 'round', chin_width: 1.05 } },
  { id: 'oblong_long', label: 'Oblong / Elongated', description: 'Extended vertical craniofacial axis', data: { shape: 'oblong', width: 0.92, jaw_angle: 1.05, chin_length: 1.25, chin_shape: 'pointed' } },
  { id: 'heart_tapered', label: 'Heart / Pointed', description: 'Broad temple with tapering sharp chin', data: { shape: 'heart', width: 1.08, jaw_angle: 0.9, chin_shape: 'pointed', chin_width: 0.8 } },
  { id: 'diamond_prominent', label: 'Diamond Cheekbones', description: 'Widest at zygomatic arch, narrow chin', data: { shape: 'diamond', width: 0.95, cheekbone_prominence: 1.35, chin_shape: 'pointed' } },
  { id: 'rectangular_broad', label: 'Broad Rectangular', description: 'Wide temple and heavy wide jaw base', data: { shape: 'rectangular', width: 1.2, jaw_angle: 1.3, chin_shape: 'square', chin_width: 1.25 } },
  { id: 'triangular_base', label: 'Triangular Base', description: 'Narrow forehead widening to heavy jaw', data: { shape: 'triangle', width: 1.15, jaw_angle: 1.2, chin_shape: 'square' } },
  { id: 'chin_cleft', label: 'Pronounced Chin Cleft', description: 'Deep central mandibular furrow', data: { chin_shape: 'cleft', chin_length: 1.1, chin_width: 1.15 } },
  { id: 'receding_mandible', label: 'Receding Mandible', description: 'Posteriorly displaced chin contour', data: { chin_shape: 'receding', chin_length: 0.85, chin_width: 0.9 } },
  { id: 'protruding_chin', label: 'Protruding Chin', description: 'Anterior projection of mental protuberance', data: { chin_shape: 'protruding', chin_length: 1.2, chin_width: 1.1 } },
  { id: 'sharp_chiseled', label: 'Sharp Chiseled', description: 'Low body fat, acute mandibular border', data: { width: 0.94, jaw_angle: 1.35, cheekbone_prominence: 1.3, chin_shape: 'pointed' } }
];

export const HAIR_PRESETS: FeaturePreset<HairState>[] = [
  { id: 'short_buzz', label: 'Short Crop Buzz', description: 'High tactical clipper cut', data: { style: 'short_buzz', length: 0.2, density: 0.9 } },
  { id: 'fade_undercut', label: 'Fade / Undercut', description: 'Tight tapered sides, longer top', data: { style: 'fade_undercut', length: 0.45, density: 0.9 } },
  { id: 'wavy_parted', label: 'Wavy Parted', description: 'Medium wavy texture combed to side', data: { style: 'wavy_parted', length: 0.65, density: 0.8 } },
  { id: 'crew_cut', label: 'Classic Crew Cut', description: 'Graduated taper with upright front', data: { style: 'crew_cut', length: 0.35, density: 0.85 } },
  { id: 'slick_back', label: 'Slicked Back', description: 'Straight smooth back combed silhouette', data: { style: 'slick_back', length: 0.6, density: 0.95 } },
  { id: 'curly_afro', label: 'Tight Curly / Afro', description: 'Dense coiled texture volume', data: { style: 'curly_afro', length: 0.5, density: 1.0 } },
  { id: 'shaved_bald', label: 'Completely Bald', description: 'Full cranium exposure with micro-stipple', data: { style: 'shaved_bald', length: 0.0, density: 0.0 } },
  { id: 'receding_crop', label: 'Receding M-Pattern', description: 'Bitemporal hair recession', data: { style: 'receding_crop', hairline: 'receding_m', length: 0.3, density: 0.65 } },
  { id: 'long_tied', label: 'Long Tied Back', description: 'Pulled back ponytail silhouette', data: { style: 'long_tied', length: 0.85, density: 0.8 } },
  { id: 'shoulder_straight', label: 'Shoulder Straight', description: 'Mid-length hanging straight down', data: { style: 'shoulder_straight', length: 0.75, density: 0.85 } },
  { id: 'caesar_fringe', label: 'Caesar Forward Fringe', description: 'Horizontally cropped straight bangs', data: { style: 'caesar', length: 0.35, density: 0.9 } },
  { id: 'side_part', label: 'Executive Side Part', description: 'Formal left-to-right combed line', data: { style: 'side_part', length: 0.5, density: 0.85 } }
];

export const EYEBROW_PRESETS: FeaturePreset<EyebrowState>[] = [
  { id: 'bushy_straight', label: 'Bushy Straight', description: 'Heavy dense brow with minimal arch', data: { shape: 'bushy_straight', thickness: 1.4, density: 1.3 } },
  { id: 'soft_arch', label: 'Soft Natural Arch', description: 'Subtle forensic curvature', data: { shape: 'soft_arch', thickness: 1.0, density: 1.0 } },
  { id: 'hard_arch', label: 'High Angular Arch', description: 'Sharply peak at lateral third', data: { shape: 'hard_arch', thickness: 0.9, tilt: 5 } },
  { id: 'straight_flat', label: 'Flat Horizontal', description: 'Straight across supraorbital ridge', data: { shape: 'straight', thickness: 1.1, tilt: 0 } },
  { id: 'rounded_arc', label: 'Smooth Rounded', description: 'Continuous curved browline', data: { shape: 'rounded', thickness: 0.95 } },
  { id: 'thin_arched', label: 'Sparse / Thin Arched', description: 'Plucked or naturally narrow brow', data: { shape: 'thin_arched', thickness: 0.6, density: 0.7 } },
  { id: 'tapered_outer', label: 'Thick to Tapered', description: 'Heavy medial bulb narrowing outwards', data: { shape: 'tapered', thickness: 1.2 } },
  { id: 's_shaped', label: 'S-Shaped Subtle', description: 'Slight double curve contour', data: { shape: 's_shaped', thickness: 0.95 } },
  { id: 'low_heavy', label: 'Low Hooding Brow', description: 'Positioned close over eye sockets', data: { height: 0.78, thickness: 1.35, tilt: 3 } },
  { id: 'spaced_wide', label: 'Wide Glabella Spacing', description: 'Significant gap between inner brows', data: { spacing: 1.4 } },
  { id: 'unibrow_close', label: 'Meeting Medial Brow', description: 'Very narrow spacing across bridge', data: { spacing: 0.65, thickness: 1.2 } },
  { id: 'upward_tilted', label: 'Alert Lateral Tilt', description: 'Outer tail elevated', data: { tilt: 8 } }
];

export const EYE_PRESETS: FeaturePreset<EyeState>[] = [
  { id: 'almond_neutral', label: 'Almond Classic', description: 'Symmetrical forensic standard palpebral fissure', data: { shape: 'almond', tilt: 0, eyelids: 'subtle' } },
  { id: 'hooded_prominent', label: 'Hooded Heavy Crease', description: 'Skin fold covers tarsal plate', data: { shape: 'hooded', eyelids: 'hooded' } },
  { id: 'deep_set', label: 'Deep Set / Recessed', description: 'Set deep into orbital cavity with shadow', data: { shape: 'deep_set', size: 0.95 } },
  { id: 'monolid_crease_free', label: 'Monolid Epicanthic', description: 'Smooth upper lid without superior crease', data: { shape: 'monolid', eyelids: 'monolid' } },
  { id: 'round_wide', label: 'Large Rounded', description: 'Large palpebral aperture showing sclera', data: { shape: 'round', size: 1.2 } },
  { id: 'upturned_cat', label: 'Upturned Canthus', description: 'Lateral canthus higher than medial', data: { shape: 'upturned', tilt: 6 } },
  { id: 'downturned_sad', label: 'Downturned Lateral', description: 'Lateral canthus slopes downward', data: { shape: 'downturned', tilt: -5 } },
  { id: 'narrow_squint', label: 'Narrow / Piercing', description: 'Constricted slit palpebral opening', data: { shape: 'narrow', size: 0.82 } },
  { id: 'wide_spaced', label: 'Wide Interpupillary', description: 'Broad spacing greater than one eye width', data: { spacing: 1.25 } },
  { id: 'close_set', label: 'Narrow Interpupillary', description: 'Close spacing less than one eye width', data: { spacing: 0.8 } },
  { id: 'prominent_bags', label: 'Fatigued Eye Bags', description: 'Infraorbital fat pad protrusion', data: { under_eye_bags: 0.8 } },
  { id: 'dark_sunken', label: 'Sunken Orbitals', description: 'Periorbital hollows and dark rings', data: { size: 0.9, under_eye_bags: 0.6 } }
];

export const NOSE_PRESETS: FeaturePreset<NoseState>[] = [
  { id: 'straight_aquiline', label: 'Aquiline Straight', description: 'Clean straight dorsum with refined tip', data: { bridge: 'straight', tip: 'pointed', width: 1.0 } },
  { id: 'hooked_roman', label: 'Roman Convex Hump', description: 'Pronounced dorsal convexity / hook', data: { bridge: 'aquiline_hook', tip: 'downturned', length: 1.15 } },
  { id: 'bulbous_fleshy', label: 'Bulbous Fleshy Tip', description: 'Expanded spherical lobule cartilage', data: { bridge: 'straight', tip: 'bulbous', width: 1.2 } },
  { id: 'upturned_button', label: 'Upturned Button', description: 'Short concave bridge with elevated tip', data: { bridge: 'concave', tip: 'upturned', length: 0.85 } },
  { id: 'broad_flat', label: 'Broad Flat Bridge', description: 'Low nasal root with wide alar base', data: { bridge: 'broad_flat', width: 1.35, nostril_shape: 'flared' } },
  { id: 'narrow_sharp', label: 'Pinched / Chiseled', description: 'Extremely narrow dorsal line', data: { bridge: 'narrow_sharp', width: 0.75, tip: 'pointed' } },
  { id: 'broken_deviated', label: 'Deviated Septum', description: 'Traumatic asymmetry / lateral shift', data: { bridge: 'broken_deviated', width: 1.1 } },
  { id: 'flared_nostrils', label: 'Wide Flared Alae', description: 'Expanded lateral alar wings', data: { nostril_shape: 'flared', nostril_width: 1.35 } },
  { id: 'drooping_columella', label: 'Drooping Nasal Tip', description: 'Tip descends toward upper lip', data: { tip: 'downturned', length: 1.2 } },
  { id: 'bifid_tip', label: 'Bifid Cleft Tip', description: 'Visible vertical groove between alar cartilages', data: { tip: 'bifid' } },
  { id: 'short_compact', label: 'Short Compact', description: 'Reduced vertical nasal length', data: { length: 0.8, vertical_position: 0.9 } },
  { id: 'long_prominent', label: 'Long Prominent', description: 'Dominant facial projection', data: { length: 1.25, width: 1.1 } }
];

export const MOUTH_PRESETS: FeaturePreset<MouthState>[] = [
  { id: 'straight_neutral', label: 'Medium Straight', description: 'Balanced vermilion border and lip ratio', data: { shape: 'straight', upper_lip_thickness: 1.0, lower_lip_thickness: 1.0 } },
  { id: 'full_plump', label: 'Full / Heavy Lips', description: 'Voluminous upper and lower vermilion', data: { shape: 'full', upper_lip_thickness: 1.45, lower_lip_thickness: 1.5 } },
  { id: 'thin_compressed', label: 'Thin Compressed', description: 'Narrow lips with tight oral fissure', data: { shape: 'thin', upper_lip_thickness: 0.6, lower_lip_thickness: 0.65 } },
  { id: 'cupids_bow', label: 'Distinct Cupid’s Bow', description: 'Sharp philtral ridges and prolabium', data: { shape: 'cupids_bow', upper_lip_thickness: 1.15 } },
  { id: 'wide_mouth', label: 'Wide Commissures', description: 'Mouth corners extend beyond eye pupils', data: { shape: 'wide', width: 1.3 } },
  { id: 'narrow_pout', label: 'Narrow Centralized', description: 'Reduced horizontal aperture width', data: { shape: 'narrow', width: 0.78 } },
  { id: 'downturned_corners', label: 'Downturned Severe', description: 'Corners angle down giving stern demeanor', data: { corner_expression: -0.35 } },
  { id: 'heavy_lower', label: 'Dominant Lower Lip', description: 'Disproportionately thicker bottom lip', data: { upper_lip_thickness: 0.75, lower_lip_thickness: 1.4 } },
  { id: 'heavy_upper', label: 'Overhanging Upper Lip', description: 'Upper lip projects forward', data: { upper_lip_thickness: 1.4, lower_lip_thickness: 0.85 } },
  { id: 'flat_philtrum', label: 'Flat Smooth Philtrum', description: 'Absence of pronounced vertical groove', data: { philtrum_depth: 0.1 } },
  { id: 'deep_philtrum', label: 'Deep Pronounced Groove', description: 'Sharp distinct vertical columns', data: { philtrum_depth: 0.95 } },
  { id: 'subtle_smirk', label: 'Slight Asymmetric Smile', description: 'One corner faintly lifted', data: { corner_expression: 0.2 } }
];

export const EAR_PRESETS: FeaturePreset<EarState>[] = [
  { id: 'free_lobes_standard', label: 'Free Detached Lobes', description: 'Classic ear with separated pendulous lobe', data: { shape: 'free_lobes', size: 1.0, protrusion: 1.0 } },
  { id: 'attached_lobes', label: 'Attached Lobes', description: 'Lobe connects directly to cheek contour', data: { shape: 'attached_lobes', size: 0.95 } },
  { id: 'protruding_prominent', label: 'Protruding Prominent', description: 'Stands out markedly from cranium', data: { protrusion: 1.45 } },
  { id: 'close_flat', label: 'Flat Adherent', description: 'Lies tight against temporal bone', data: { protrusion: 0.7 } },
  { id: 'pointed_cauliflower', label: 'Traumatic Cauliflower', description: 'Blunt injury thickening / auricular hematoma', data: { shape: 'pointed_cauliflower' } },
  { id: 'large_elongated', label: 'Large Elongated', description: 'Extended vertical ear height', data: { size: 1.3 } },
  { id: 'small_compact', label: 'Small Compact', description: 'Reduced anatomical dimensions', data: { size: 0.75 } },
  { id: 'square_lobes', label: 'Square Lobes', description: 'Broad flat horizontal lobe boundary', data: { shape: 'square_lobes' } },
  { id: 'high_placed', label: 'High Position', description: 'Superior helix above browline', data: { vertical_position: 0.88 } },
  { id: 'low_placed', label: 'Low Position', description: 'Helix below eye line', data: { vertical_position: 1.15 } },
  { id: 'round_helix', label: 'Curved Round Helix', description: 'Circular upper rim', data: { shape: 'round' } },
  { id: 'pointed_darwin', label: 'Darwinian Point', description: 'Subtle acute angle on posterior helix', data: { shape: 'pointed_cauliflower', size: 1.05 } }
];

export const FACIAL_HAIR_PRESETS: FeaturePreset<FacialHairState>[] = [
  { id: 'clean_shaven', label: 'Clean Shaven', description: 'No facial growth or stubble visible', data: { beard: 'none', moustache: 'none', stubble_density: 0.0 } },
  { id: 'five_o_clock', label: 'Heavy 5 O’Clock Stubble', description: '2-3 days dark coarse growth shadow', data: { beard: 'five_o_clock_stubble', moustache: 'none', stubble_density: 0.75 } },
  { id: 'short_boxed_beard', label: 'Trimmed Boxed Beard', description: 'Neat full beard with defined cheekline', data: { beard: 'short_boxed', moustache: 'chevron', stubble_density: 0.9 } },
  { id: 'full_heavy_beard', label: 'Full Heavy Beard', description: 'Dense thick beard covering jaw and neck', data: { beard: 'full_heavy', moustache: 'walrus', stubble_density: 1.0 } },
  { id: 'goatee_chinstrap', label: 'Goatee with Moustache', description: 'Isolated chin hair connected to moustache', data: { beard: 'goatee', moustache: 'chevron' } },
  { id: 'circle_beard', label: 'Circle Beard', description: 'Standard neat goatee ring', data: { beard: 'circle_beard', moustache: 'pencil' } },
  { id: 'chin_curtain', label: 'Chin Curtain (No Moustache)', description: 'Beard follows jawline without moustache', data: { beard: 'chin_curtain', moustache: 'none' } },
  { id: 'chinstrap_thin', label: 'Thin Chinstrap', description: 'Pencil-thin contour tracing mandible edge', data: { beard: 'chinstrap', moustache: 'none' } },
  { id: 'chevron_mustache', label: 'Police Chevron Moustache', description: 'Thick full moustache covering upper lip', data: { beard: 'none', moustache: 'chevron' } },
  { id: 'horseshoe_mustache', label: 'Horseshoe Moustache', description: 'Vertical bars extending down past jaw corners', data: { beard: 'none', moustache: 'horseshoe' } },
  { id: 'pencil_mustache', label: 'Thin Pencil Moustache', description: 'Narrow straight horizontal strip above lip', data: { beard: 'none', moustache: 'pencil' } },
  { id: 'handlebar_mustache', label: 'Curled Handlebar', description: 'Groomed moustache with upward-curled tips', data: { beard: 'none', moustache: 'handlebar' } }
];

export const GLASSES_PRESETS: FeaturePreset<GlassesState>[] = [
  { id: 'none', label: 'None Observed', description: 'No corrective or protective eyewear', data: { style: 'none' } },
  { id: 'wireframe_aviator', label: 'Thin Wireframe Aviator', description: 'Metallic double-bridge teardrop shape', data: { style: 'wireframe_aviator', frame_thickness: 0.8, tint: 'clear' } },
  { id: 'black_rectangular', label: 'Black Rectangular Thick', description: 'Heavy acetate dark optical frames', data: { style: 'black_rectangular', frame_thickness: 1.3, tint: 'clear' } },
  { id: 'round_horn_rim', label: 'Round Horn-Rimmed', description: 'Circular retro intellectual style', data: { style: 'round_horn_rim', frame_thickness: 1.1, tint: 'clear' } },
  { id: 'tactical_wraparound', label: 'Tactical Wraparound', description: 'Curved athletic sunglasses', data: { style: 'tactical_wraparound', tint: 'dark_sunglasses' } },
  { id: 'browline_clubmaster', label: 'Browline Classic', description: 'Heavy upper frame with wire lower rim', data: { style: 'browline', frame_thickness: 1.2 } },
  { id: 'semi_rimless', label: 'Semi-Rimless Narrow', description: 'Minimalist metallic business frame', data: { style: 'semi_rimless', frame_thickness: 0.7 } },
  { id: 'vintage_oval', label: 'Vintage Small Oval', description: 'Compact oval metal frames', data: { style: 'vintage_oval', frame_thickness: 0.9 } },
  { id: 'yellow_tint_safety', label: 'Yellow Tint Ballistic', description: 'Amber/yellow shooting safety glasses', data: { style: 'tactical_wraparound', tint: 'yellow_tactical' } },
  { id: 'dark_sunglasses', label: 'Dark Tint Aviators', description: 'High opacity mirrored / black lenses', data: { style: 'wireframe_aviator', tint: 'dark_sunglasses' } },
  { id: 'gradient_gray_lens', label: 'Gradient Gray Shades', description: 'Dark top fading to light bottom lens', data: { style: 'black_rectangular', tint: 'gradient_gray' } },
  { id: 'heavy_nerd_frame', label: 'Oversized Acetate', description: 'Extra wide statement frames', data: { style: 'black_rectangular', frame_thickness: 1.6 } }
];

export const HEADWEAR_PRESETS: FeaturePreset<HeadwearState>[] = [
  { id: 'none', label: 'None Observed', description: 'Bare cranium / uncovered hair', data: { style: 'none' } },
  { id: 'baseball_cap_forward', label: 'Dark Baseball Cap (Forward)', description: 'Standard curved brim low over forehead', data: { style: 'baseball_cap_forward', color: '#18181B' } },
  { id: 'baseball_cap_backward', label: 'Baseball Cap (Reversed)', description: 'Worn backward exposing forehead', data: { style: 'baseball_cap_backward', color: '#27272A' } },
  { id: 'tactical_beanie', label: 'Black Tactical Beanie', description: 'Fitted ribbed knit cap covering hairline', data: { style: 'tactical_beanie', color: '#18181B' } },
  { id: 'pulled_hoodie', label: 'Pulled-Up Dark Hoodie', description: 'Fabric hood casting shadow over upper face', data: { style: 'pulled_hoodie', color: '#09090B' } },
  { id: 'flat_ivy_cap', label: 'Flat Ivy / Scally Cap', description: 'Wool tweed newsboy flat cap', data: { style: 'flat_ivy_cap', color: '#3F3F46' } },
  { id: 'beret_military', label: 'Military Style Beret', description: 'Tilted side wool beret', data: { style: 'beret', color: '#1C1917' } },
  { id: 'knit_watch_cap', label: 'Cuffed Watch Cap', description: 'Rolled cuff maritime beanie', data: { style: 'knit_watch_cap', color: '#2E3440' } }
];

export const MARKS_SCARS_PRESETS: FeaturePreset<MarkScarItem>[] = [
  { id: 'linear_scar_cheek', label: 'Linear Cheek Scar', description: 'Straight slash scar across cheek', data: { type: 'linear_scar', x: 38, y: 58, size: 1.2, rotation: -25, opacity: 0.9 } },
  { id: 'eyebrow_notch_scar', label: 'Eyebrow Notch Scar', description: 'Vertical scar gap splitting eyebrow', data: { type: 'linear_scar', x: 37, y: 39, size: 0.7, rotation: 80, opacity: 0.95 } },
  { id: 'lip_cleft_scar', label: 'Lip Vermilion Scar', description: 'Vertical scar cutting through lip', data: { type: 'linear_scar', x: 48, y: 64, size: 0.8, rotation: 90, opacity: 0.9 } },
  { id: 'chin_surgical_scar', label: 'Chin Surgical Scar', description: 'Curved incision scar near mandible base', data: { type: 'surgical_scar', x: 50, y: 72, size: 1.1, rotation: 0, opacity: 0.85 } },
  { id: 'cheek_prominent_mole', label: 'Dark Facial Mole', description: 'Circumscribed hyperpigmented papule', data: { type: 'mole', x: 62, y: 54, size: 1.0, rotation: 0, opacity: 1.0 } },
  { id: 'subocular_mole', label: 'Under-Eye Tear Mole', description: 'Small dark mole under right eye', data: { type: 'mole', x: 60, y: 46, size: 0.7, rotation: 0, opacity: 1.0 } },
  { id: 'scattered_freckles', label: 'Bridge Freckles', description: 'Ephelides across nose and cheekbones', data: { type: 'freckles', x: 50, y: 50, size: 1.5, rotation: 0, opacity: 0.7 } },
  { id: 'port_wine_birthmark', label: 'Vascular Birthmark', description: 'Irregular erythema patch', data: { type: 'birthmark', x: 35, y: 50, size: 1.8, rotation: 15, opacity: 0.6 } },
  { id: 'burn_keloid_texture', label: 'Burn Texture / Scar', description: 'Contracted cicatricial tissue', data: { type: 'burn_texture', x: 65, y: 60, size: 1.6, rotation: -10, opacity: 0.75 } },
  { id: 'forehead_stitch_marks', label: 'Laceration Stitches', description: 'Suture cross-hatch marks on forehead', data: { type: 'stitch_mark', x: 52, y: 32, size: 1.2, rotation: -15, opacity: 0.85 } },
  { id: 'temple_scar', label: 'Temple Blunt Trauma', description: 'Irregular jagged scar near hairline', data: { type: 'linear_scar', x: 30, y: 35, size: 0.9, rotation: 45, opacity: 0.85 } },
  { id: 'nasal_bridge_scar', label: 'Nose Bridge Fracture Scar', description: 'Transverse scar across nasal bone', data: { type: 'linear_scar', x: 50, y: 44, size: 0.8, rotation: 0, opacity: 0.9 } }
];

export const SKIN_AGE_PRESETS: FeaturePreset<SkinAgeState>[] = [
  { id: 'young_adult_22', label: 'Young Adult (20-25)', description: 'Taut skin, minimal facial lines', data: { age_appearance: 22, forehead_wrinkles: 0.05, crows_feet: 0.05, nasolabial_folds: 0.1, marionette_lines: 0.0 } },
  { id: 'prime_adult_32', label: 'Prime Adult (30-35)', description: 'Initial dynamic expression lines', data: { age_appearance: 32, forehead_wrinkles: 0.2, crows_feet: 0.25, nasolabial_folds: 0.35, marionette_lines: 0.1 } },
  { id: 'mature_adult_45', label: 'Mature Adult (40-48)', description: 'Definite glabellar and nasolabial creases', data: { age_appearance: 45, forehead_wrinkles: 0.55, crows_feet: 0.6, nasolabial_folds: 0.65, marionette_lines: 0.4 } },
  { id: 'middle_aged_55', label: 'Middle Aged (50-58)', description: 'Pronounced gravitational sagging and folds', data: { age_appearance: 55, forehead_wrinkles: 0.8, crows_feet: 0.85, nasolabial_folds: 0.85, marionette_lines: 0.7 } },
  { id: 'elderly_68', label: 'Elderly (65-75)', description: 'Extensive solar elastosis and deep furrows', data: { age_appearance: 68, forehead_wrinkles: 1.0, crows_feet: 1.0, nasolabial_folds: 1.0, marionette_lines: 0.95 } },
  { id: 'fair_fitzpatrick_1', label: 'Fitzpatrick I (Pale / Fair)', description: 'Very fair, ivory skin tone', data: { skin_tone: '#F9EBEA', undertone: 'cool' } },
  { id: 'light_fitzpatrick_2', label: 'Fitzpatrick II (Fair / Beige)', description: 'European fair peach tone', data: { skin_tone: '#F5CBA7', undertone: 'warm' } },
  { id: 'medium_olive_fitzpatrick_3', label: 'Fitzpatrick III (Medium Olive)', description: 'Mediterranean / Hispanic light olive', data: { skin_tone: '#DCB289', undertone: 'olive' } },
  { id: 'tan_fitzpatrick_4', label: 'Fitzpatrick IV (Moderate Brown)', description: 'Middle Eastern / South Asian golden tan', data: { skin_tone: '#B78759', undertone: 'warm' } },
  { id: 'dark_brown_fitzpatrick_5', label: 'Fitzpatrick V (Dark Brown)', description: 'Rich dark brown tone', data: { skin_tone: '#875734', undertone: 'neutral' } },
  { id: 'deep_ebony_fitzpatrick_6', label: 'Fitzpatrick VI (Deep Ebony)', description: 'Deepest dark brown / ebony tone', data: { skin_tone: '#4B3322', undertone: 'cool' } },
  { id: 'weathered_rugged', label: 'Weathered / Rugged Outdoor', description: 'Accentuated wrinkles with sun damage', data: { age_appearance: 48, forehead_wrinkles: 0.85, crows_feet: 0.9, nasolabial_folds: 0.75 } }
];

// Helper to randomize face while strictly respecting locked features
export function randomizeFaceState(current: FaceState): FaceState {
  const pickRandom = <T>(arr: FeaturePreset<T>[]): Partial<T> => {
    return arr[Math.floor(Math.random() * arr.length)].data;
  };

  const safeCurrent = {
    ...INITIAL_FACE_STATE,
    ...(current || {}),
    head_jaw: { ...INITIAL_FACE_STATE.head_jaw, ...(current?.head_jaw || {}) },
    hair: { ...INITIAL_FACE_STATE.hair, ...(current?.hair || {}) },
    eyebrows: { ...INITIAL_FACE_STATE.eyebrows, ...(current?.eyebrows || {}) },
    eyes: { ...INITIAL_FACE_STATE.eyes, ...(current?.eyes || {}) },
    nose: { ...INITIAL_FACE_STATE.nose, ...(current?.nose || {}) },
    mouth: { ...INITIAL_FACE_STATE.mouth, ...(current?.mouth || {}) },
    ears: { ...INITIAL_FACE_STATE.ears, ...(current?.ears || {}) },
    facial_hair: { ...INITIAL_FACE_STATE.facial_hair, ...(current?.facial_hair || {}) },
    glasses: { ...INITIAL_FACE_STATE.glasses, ...(current?.glasses || {}) },
    headwear: { ...INITIAL_FACE_STATE.headwear, ...(current?.headwear || {}) },
    marks_scars: current?.marks_scars || INITIAL_FACE_STATE.marks_scars,
    skin_age: { ...INITIAL_FACE_STATE.skin_age, ...(current?.skin_age || {}) },
    locked_features: { ...INITIAL_FACE_STATE.locked_features, ...(current?.locked_features || {}) },
    hidden_features: { ...INITIAL_FACE_STATE.hidden_features, ...(current?.hidden_features || {}) }
  };

  const next: FaceState = JSON.parse(JSON.stringify(safeCurrent));
  next.seed = Math.floor(Math.random() * 100000);

  if (!next.locked_features.head_jaw) {
    const p = pickRandom(HEAD_JAW_PRESETS);
    next.head_jaw = { ...next.head_jaw, ...p, width: 0.9 + Math.random() * 0.25, jaw_angle: 0.9 + Math.random() * 0.35 };
  }
  if (!next.locked_features.hair) {
    const p = pickRandom(HAIR_PRESETS);
    next.hair = { ...next.hair, ...p };
  }
  if (!next.locked_features.eyebrows) {
    const p = pickRandom(EYEBROW_PRESETS);
    next.eyebrows = { ...next.eyebrows, ...p, thickness: 0.8 + Math.random() * 0.6 };
  }
  if (!next.locked_features.eyes) {
    const p = pickRandom(EYE_PRESETS);
    next.eyes = { ...next.eyes, ...p, size: 0.88 + Math.random() * 0.24 };
  }
  if (!next.locked_features.nose) {
    const p = pickRandom(NOSE_PRESETS);
    next.nose = { ...next.nose, ...p, width: 0.88 + Math.random() * 0.28 };
  }
  if (!next.locked_features.mouth) {
    const p = pickRandom(MOUTH_PRESETS);
    next.mouth = { ...next.mouth, ...p, width: 0.9 + Math.random() * 0.25 };
  }
  if (!next.locked_features.ears) {
    const p = pickRandom(EAR_PRESETS);
    next.ears = { ...next.ears, ...p };
  }
  if (!next.locked_features.facial_hair) {
    const p = pickRandom(FACIAL_HAIR_PRESETS);
    next.facial_hair = { ...next.facial_hair, ...p };
  }
  if (!next.locked_features.glasses_headwear) {
    // 30% chance of glasses or headwear
    if (Math.random() < 0.3) {
      const g = pickRandom(GLASSES_PRESETS);
      next.glasses = { ...next.glasses, ...g };
    } else {
      next.glasses.style = 'none';
    }
  }
  if (!next.locked_features.skin_age) {
    const p = pickRandom(SKIN_AGE_PRESETS);
    next.skin_age = { ...next.skin_age, ...p };
  }

  return next;
}
