// EYEWITNESS CRANIOFACIAL COMPOSITE SUITE
// Single Source of Truth: Typed FaceState Model

export type FeatureSectionId = 
  | 'head_jaw'
  | 'hair'
  | 'eyebrows'
  | 'eyes'
  | 'nose'
  | 'mouth'
  | 'ears'
  | 'facial_hair'
  | 'glasses_headwear'
  | 'marks_scars'
  | 'skin_age';

export interface HeadJawState {
  shape: 'oval' | 'square' | 'round' | 'oblong' | 'heart' | 'diamond' | 'triangle' | 'rectangular';
  width: number; // 0.6 - 1.4 (default 1.0)
  jaw_angle: number; // 0.6 - 1.4 (default 1.0)
  chin_length: number; // 0.6 - 1.4 (default 1.0)
  chin_shape: 'pointed' | 'square' | 'round' | 'cleft' | 'receding' | 'protruding';
  chin_width: number; // 0.6 - 1.4 (default 1.0)
  cheekbone_prominence: number; // 0.6 - 1.4 (default 1.0)
}

export interface HairState {
  style: 
    | 'short_buzz' 
    | 'fade_undercut' 
    | 'wavy_parted' 
    | 'crew_cut' 
    | 'slick_back' 
    | 'curly_afro' 
    | 'shaved_bald' 
    | 'long_tied' 
    | 'receding_crop' 
    | 'shoulder_straight' 
    | 'caesar' 
    | 'side_part' 
    | 'none';
  hairline: 'straight' | 'widows_peak' | 'high' | 'receding_m' | 'round' | 'uneven';
  length: number; // 0.0 - 1.0
  density: number; // 0.0 - 1.0
  color: string; // Hex color code
  gray_percentage: number; // 0 - 100
}

export interface EyebrowState {
  shape: 'straight' | 'soft_arch' | 'hard_arch' | 'rounded' | 's_shaped' | 'bushy_straight' | 'thin_arched' | 'tapered';
  thickness: number; // 0.5 - 2.0 (default 1.0)
  spacing: number; // 0.6 - 1.5 (default 1.0)
  height: number; // 0.7 - 1.3 (default 1.0)
  tilt: number; // -15 to +15 degrees
  density: number; // 0.5 - 1.5 (default 1.0)
  color: string;
}

export interface EyeState {
  shape: 'almond' | 'round' | 'hooded' | 'deep_set' | 'monolid' | 'upturned' | 'downturned' | 'wide_set' | 'narrow';
  size: number; // 0.7 - 1.4 (default 1.0)
  spacing: number; // 0.7 - 1.4 (default 1.0)
  tilt: number; // -15 to +15 degrees
  eyelids: 'subtle' | 'prominent_double' | 'hooded' | 'monolid' | 'heavy_crease';
  color: 'dark_brown' | 'light_brown' | 'hazel' | 'blue' | 'gray' | 'green' | 'amber';
  vertical_position: number; // 0.8 - 1.2 (default 1.0)
  under_eye_bags: number; // 0.0 - 1.0
}

export interface NoseState {
  length: number; // 0.7 - 1.3 (default 1.0)
  width: number; // 0.7 - 1.4 (default 1.0)
  bridge: 'straight' | 'aquiline_hook' | 'concave' | 'broad_flat' | 'narrow_sharp' | 'broken_deviated';
  nostril_shape: 'flared' | 'narrow' | 'rounded' | 'angular' | 'arched';
  nostril_width: number; // 0.7 - 1.4 (default 1.0)
  tip: 'pointed' | 'bulbous' | 'upturned' | 'downturned' | 'flat' | 'bifid';
  vertical_position: number; // 0.8 - 1.2 (default 1.0)
}

export interface MouthState {
  shape: 'straight' | 'full' | 'thin' | 'cupids_bow' | 'wide' | 'narrow' | 'downturned_corners' | 'upturned_subtle';
  width: number; // 0.7 - 1.4 (default 1.0)
  upper_lip_thickness: number; // 0.5 - 2.0 (default 1.0)
  lower_lip_thickness: number; // 0.5 - 2.0 (default 1.0)
  vertical_position: number; // 0.8 - 1.2 (default 1.0)
  philtrum_depth: number; // 0.0 - 1.0
  philtrum_width: number; // 0.7 - 1.3
  corner_expression: number; // -0.5 to 0.5
}

export interface EarState {
  size: number; // 0.7 - 1.4 (default 1.0)
  vertical_position: number; // 0.8 - 1.2 (default 1.0)
  shape: 'oval' | 'round' | 'square_lobes' | 'attached_lobes' | 'free_lobes' | 'pointed_cauliflower';
  protrusion: number; // 0.6 - 1.5 (default 1.0)
}

export interface FacialHairState {
  beard: 'none' | 'five_o_clock_stubble' | 'short_boxed' | 'full_heavy' | 'goatee' | 'circle_beard' | 'chin_curtain' | 'chinstrap';
  moustache: 'none' | 'chevron' | 'horseshoe' | 'pencil' | 'handlebar' | 'walrus' | 'pyramidal';
  stubble_density: number; // 0.0 - 1.0
  color: string;
}

export interface GlassesState {
  style: 'none' | 'wireframe_aviator' | 'black_rectangular' | 'round_horn_rim' | 'tactical_wraparound' | 'browline' | 'semi_rimless' | 'vintage_oval';
  frame_thickness: number; // 0.6 - 1.6 (default 1.0)
  tint: 'clear' | 'gradient_gray' | 'dark_sunglasses' | 'yellow_tactical';
}

export interface HeadwearState {
  style: 'none' | 'baseball_cap_forward' | 'baseball_cap_backward' | 'tactical_beanie' | 'pulled_hoodie' | 'flat_ivy_cap' | 'beret' | 'knit_watch_cap';
  color: string;
}

export interface MarkScarItem {
  id: string;
  type: 'linear_scar' | 'surgical_scar' | 'mole' | 'freckles' | 'birthmark' | 'burn_texture' | 'stitch_mark';
  label: string;
  x: number; // Normalized coordinate percentage 0 - 100
  y: number; // Normalized coordinate percentage 0 - 100
  size: number; // Scale factor 0.4 - 2.5
  rotation: number; // Degrees -180 to 180
  opacity: number; // 0.1 - 1.0
}

export interface SkinAgeState {
  skin_tone: string; // Hex color code
  undertone: 'neutral' | 'warm' | 'cool' | 'olive';
  age_appearance: number; // 18 - 75
  forehead_wrinkles: number; // 0.0 - 1.0
  crows_feet: number; // 0.0 - 1.0
  nasolabial_folds: number; // 0.0 - 1.0
  marionette_lines: number; // 0.0 - 1.0
  neck_lines: number; // 0.0 - 1.0
}

export interface SymmetryLockState {
  eyes: boolean;
  eyebrows: boolean;
  ears: boolean;
}

export interface FaceState {
  version: number;
  seed: number;
  gender: 'male' | 'female' | 'androgynous';
  head_jaw: HeadJawState;
  hair: HairState;
  eyebrows: EyebrowState;
  eyes: EyeState;
  nose: NoseState;
  mouth: MouthState;
  ears: EarState;
  facial_hair: FacialHairState;
  glasses: GlassesState;
  headwear: HeadwearState;
  marks_scars: MarkScarItem[];
  skin_age: SkinAgeState;
  expression: 'neutral' | 'hardened_glare' | 'concerned' | 'grimace_slight';
  lighting: {
    direction: 'front_balanced' | 'key_left' | 'key_right' | 'top_ambient';
    contrast: number;
  };
  symmetry_locks: SymmetryLockState;
  confidence_ratings: Record<string, number>;
  locked_features: Record<string, boolean>;
  hidden_features: Record<string, boolean>;
}

export interface FeaturePreset<T> {
  id: string;
  label: string;
  description: string;
  data: Partial<T>;
  previewSvgSnippet?: string;
}

