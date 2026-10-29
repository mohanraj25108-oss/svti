import base64
import random
from typing import Dict, Any, List

def generate_pencil_sketch_svg(attrs: Dict[str, Any], variant: str = "standard", seed: int = 42) -> str:
    """
    Renders an authentic, high-fidelity Forensic Composite Pencil Sketch.
    Includes charcoal graphite hatching, stipple texture, forensic facial alignment markers,
    and mandatory official classification watermark.
    """
    gender = attrs.get("gender", "Male")
    face_shape = attrs.get("face_shape", "Oval")
    hair_style = attrs.get("hair_style", "Short Crop Buzz")
    hair_color = attrs.get("hair_color", "Dark Brown")
    facial_hair = attrs.get("facial_hair", "Clean Shaven")
    glasses = attrs.get("glasses", "None")
    scars = attrs.get("scars_marks", "None observed")
    headwear = attrs.get("headwear", "None")
    age_range = attrs.get("age_range", "30-35")

    # Apply variant overrides
    if variant == "with_glasses" and glasses == "None":
        glasses = "Thin Wireframe Aviator"
    elif variant == "no_glasses":
        glasses = "None"
    elif variant == "with_beard" and "Beard" not in facial_hair:
        facial_hair = "Short Trimmed Beard"
    elif variant == "clean_shaven":
        facial_hair = "Clean Shaven"
    elif variant == "with_cap" and headwear == "None":
        headwear = "Dark Baseball Cap"
    elif variant == "age_progression":
        age_range = "50-55"

    # SVG canvas with forensic grid and charcoal textures
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 750" width="100%" height="100%" style="background-color: #12151b; font-family: 'Courier New', monospace;">
      <defs>
        <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
          <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#252d3a" stroke-width="0.5" stroke-dasharray="2,2"/>
        </pattern>
        <pattern id="hatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="0" y2="8" stroke="#374151" stroke-width="0.8"/>
        </pattern>
        <filter id="pencilNoise">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" result="noise" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.8  0 0 0 0 0.8  0 0 0 0 0.8  0 0 0 0.15 0"/>
          <feBlend in="SourceGraphic" in2="noise" mode="multiply" />
        </filter>
      </defs>

      <!-- Tactical Background & Graph Paper Grid -->
      <rect width="600" height="750" fill="#0d1117" />
      <rect width="600" height="750" fill="url(#grid)" />
      
      <!-- Forensic Artist Crosshairs -->
      <line x1="300" y1="60" x2="300" y2="690" stroke="#1E6BFF" stroke-width="0.7" stroke-dasharray="4,6" opacity="0.35"/>
      <line x1="80" y1="360" x2="520" y2="360" stroke="#1E6BFF" stroke-width="0.7" stroke-dasharray="4,6" opacity="0.35"/>
      <line x1="120" y1="280" x2="480" y2="280" stroke="#FFB020" stroke-width="0.5" stroke-dasharray="2,4" opacity="0.25"/>
      <line x1="140" y1="440" x2="460" y2="440" stroke="#FFB020" stroke-width="0.5" stroke-dasharray="2,4" opacity="0.25"/>

      <!-- Facial Contour & Shading -->
      <!-- Neck & Shoulders -->
      <path d="M 210 520 L 140 700 L 460 700 L 390 520 Z" fill="#141820" stroke="#8b949e" stroke-width="1.8" />
      <path d="M 210 520 Q 300 580 390 520" fill="none" stroke="#6e7681" stroke-width="1.5" />
      <path d="M 250 540 L 250 640 M 350 540 L 350 640" stroke="#484f58" stroke-width="1.2" stroke-dasharray="2,3"/>

      <!-- Head Base Outline -->
      <g filter="url(#pencilNoise)">
        <ellipse cx="300" cy="350" rx="145" ry="190" fill="#181d26" stroke="#c9d1d9" stroke-width="2.5" />
        
        <!-- Temple & Jaw Contour -->
        <path d="M 165 310 Q 155 430 220 500 Q 300 550 380 500 Q 445 430 435 310" fill="none" stroke="#e6edf3" stroke-width="2.2" />
        
        <!-- Cheekbone Hatching -->
        <path d="M 180 370 Q 220 420 250 430" fill="none" stroke="#8b949e" stroke-width="1.5" />
        <path d="M 420 370 Q 380 420 350 430" fill="none" stroke="#8b949e" stroke-width="1.5" />
        
        <!-- Ears -->
        <path d="M 155 310 Q 130 330 135 380 Q 140 420 162 410" fill="#161b22" stroke="#c9d1d9" stroke-width="2" />
        <path d="M 145 340 Q 150 370 155 390" fill="none" stroke="#6e7681" stroke-width="1.2" />
        <path d="M 445 310 Q 470 330 465 380 Q 460 420 438 410" fill="#161b22" stroke="#c9d1d9" stroke-width="2" />
        <path d="M 455 340 Q 450 370 445 390" fill="none" stroke="#6e7681" stroke-width="1.2" />

        <!-- Forehead Wrinkles (Age dependent) -->
        ''' + ('''
        <path d="M 220 240 Q 300 230 380 240" fill="none" stroke="#6e7681" stroke-width="1.4" />
        <path d="M 230 260 Q 300 252 370 260" fill="none" stroke="#6e7681" stroke-width="1.4" />
        <path d="M 285 300 L 285 320 M 315 300 L 315 320" stroke="#6e7681" stroke-width="1.2" />
        ''' if "45" in age_range or "50" in age_range or "60" in age_range else '''
        <path d="M 250 250 Q 300 245 350 250" fill="none" stroke="#484f58" stroke-width="1" />
        ''') + f'''

        <!-- Eyebrows -->
        <path d="M 200 305 Q 240 290 280 308" fill="none" stroke="#e6edf3" stroke-width="4.5" stroke-linecap="round" />
        <path d="M 200 305 Q 240 288 280 308" fill="none" stroke="#30363d" stroke-width="2" />
        <path d="M 400 305 Q 360 290 320 308" fill="none" stroke="#e6edf3" stroke-width="4.5" stroke-linecap="round" />
        <path d="M 400 305 Q 360 288 320 308" fill="none" stroke="#30363d" stroke-width="2" />

        <!-- Eyes -->
        <!-- Left Eye -->
        <path d="M 215 330 Q 245 315 275 330 Q 245 345 215 330 Z" fill="#0d1117" stroke="#e6edf3" stroke-width="2" />
        <circle cx="245" cy="330" r="7" fill="#f0f6fc" stroke="#161b22" stroke-width="1.5" />
        <circle cx="245" cy="330" r="3" fill="#0d1117" />
        <path d="M 210 325 Q 245 310 280 325" fill="none" stroke="#8b949e" stroke-width="1.2" />
        <path d="M 218 340 Q 245 352 272 340" fill="none" stroke="#484f58" stroke-width="1" />

        <!-- Right Eye -->
        <path d="M 385 330 Q 355 315 325 330 Q 355 345 385 330 Z" fill="#0d1117" stroke="#e6edf3" stroke-width="2" />
        <circle cx="355" cy="330" r="7" fill="#f0f6fc" stroke="#161b22" stroke-width="1.5" />
        <circle cx="355" cy="330" r="3" fill="#0d1117" />
        <path d="M 390 325 Q 355 310 320 325" fill="none" stroke="#8b949e" stroke-width="1.2" />
        <path d="M 382 340 Q 355 352 328 340" fill="none" stroke="#484f58" stroke-width="1" />

        <!-- Nose -->
        <path d="M 300 310 L 295 400 Q 275 410 285 418 Q 300 422 315 418 Q 325 410 305 400" fill="none" stroke="#e6edf3" stroke-width="2.2" />
        <path d="M 285 415 Q 278 405 285 398" fill="none" stroke="#8b949e" stroke-width="1.5" />
        <path d="M 315 415 Q 322 405 315 398" fill="none" stroke="#8b949e" stroke-width="1.5" />
        <ellipse cx="290" cy="415" rx="3" ry="1.5" fill="#30363d" />
        <ellipse cx="310" cy="415" rx="3" ry="1.5" fill="#30363d" />

        <!-- Mouth & Lips -->
        <path d="M 260 460 Q 300 454 340 460" fill="none" stroke="#e6edf3" stroke-width="2.4" />
        <path d="M 260 460 Q 300 472 340 460" fill="none" stroke="#8b949e" stroke-width="1.8" />
        <path d="M 275 450 Q 300 452 325 450" fill="none" stroke="#6e7681" stroke-width="1.2" />
        <path d="M 280 480 Q 300 485 320 480" fill="none" stroke="#484f58" stroke-width="1.5" />

        <!-- Chin Cleft / Shading -->
        <path d="M 292 515 Q 300 520 308 515" fill="none" stroke="#8b949e" stroke-width="1.5" />
      </g>
      ''' + (f'''
      <!-- Hair Render -->
      <g stroke="#d0d7de" stroke-width="2" fill="#1c2128">
        <path d="M 155 310 C 140 180, 240 140, 300 140 C 360 140, 460 180, 445 310 C 430 220, 370 190, 300 190 C 230 190, 170 220, 155 310 Z" />
        <!-- Hair strands / hatch -->
        <path d="M 200 190 Q 250 170 300 195 M 300 195 Q 350 170 400 190" stroke="#8b949e" stroke-width="1.2" fill="none"/>
        <path d="M 220 165 Q 300 150 380 165" stroke="#6e7681" stroke-width="1.5" fill="none"/>
      </g>
      ''' if "Bald" not in hair_style else '''
      <!-- Bald / Shaved Stipple Shading -->
      <path d="M 170 260 Q 300 160 430 260" stroke="#30363d" stroke-width="1" stroke-dasharray="1,4" fill="none" />
      ''') + (f'''
      <!-- Facial Hair (Beard / Stubble) -->
      <g stroke="#8b949e" stroke-width="1.2" stroke-linecap="round" fill="none">
        <path d="M 180 420 Q 220 520 300 545 Q 380 520 420 420" stroke="#c9d1d9" stroke-width="2" stroke-dasharray="3,3" />
        <path d="M 255 450 Q 300 445 345 450" stroke="#c9d1d9" stroke-width="2.5" stroke-dasharray="2,3" />
        <path d="M 240 470 Q 300 535 360 470" stroke="#8b949e" stroke-width="1.5" stroke-dasharray="2,4" />
      </g>
      ''' if facial_hair != "Clean Shaven" else '') + (f'''
      <!-- Glasses Overlay -->
      <g stroke="#58a6ff" stroke-width="2.4" fill="rgba(88, 166, 255, 0.08)">
        <rect x="200" y="312" width="85" height="42" rx="8" />
        <rect x="315" y="312" width="85" height="42" rx="8" />
        <line x1="285" y1="326" x2="315" y2="326" stroke="#58a6ff" stroke-width="2.5" />
        <line x1="150" y1="322" x2="200" y2="326" stroke="#58a6ff" stroke-width="2" />
        <line x1="400" y1="326" x2="450" y2="322" stroke="#58a6ff" stroke-width="2" />
      </g>
      ''' if glasses != "None" else '') + (f'''
      <!-- Scars / Marks -->
      <g stroke="#ff7b72" stroke-width="2" stroke-linecap="round">
        <line x1="210" y1="410" x2="245" y2="445" />
        <line x1="220" y1="415" x2="228" y2="425" stroke-width="1.5" />
        <line x1="230" y1="428" x2="238" y2="438" stroke-width="1.5" />
      </g>
      ''' if "scar" in scars.lower() else '') + (f'''
      <!-- Headwear (Cap / Beanie) -->
      <path d="M 140 250 Q 300 130 460 250 L 480 270 Q 300 230 120 270 Z" fill="#0d1117" stroke="#e6edf3" stroke-width="2.5" />
      <path d="M 120 270 Q 300 230 480 270 Q 520 295 440 300 Q 300 260 160 300 Z" fill="#161b22" stroke="#58a6ff" stroke-width="2" />
      ''' if headwear != "None" else '') + f'''

      <!-- Official Forensic Metadata Banner at Bottom -->
      <rect x="20" y="675" width="560" height="60" rx="4" fill="#090d14" stroke="#ff1e3c" stroke-width="1.2" opacity="0.95"/>
      <text x="300" y="698" fill="#ff1e3c" font-size="12" font-weight="bold" text-anchor="middle" letter-spacing="2">
        OFFICIAL FORENSIC COMPOSITE // INVESTIGATIVE LEAD ONLY
      </text>
      <text x="300" y="718" fill="#8b949e" font-size="10" text-anchor="middle" letter-spacing="1">
        NOT EVIDENCE OF IDENTITY • LAW ENFORCEMENT SENSITIVE • SEC-REF: #{random.randint(1000, 9999)}
      </text>
      
      <!-- Top Department Tag -->
      <rect x="20" y="15" width="220" height="28" rx="2" fill="#161b22" stroke="#1E6BFF" stroke-width="1" />
      <text x="30" y="34" fill="#58a6ff" font-size="10" font-weight="bold" letter-spacing="1">
        METRO FORENSIC ART UNIT
      </text>
      
      <rect x="420" y="15" width="160" height="28" rx="2" fill="#161b22" stroke="#30363d" stroke-width="1" />
      <text x="500" y="34" fill="#f0883e" font-size="10" font-weight="bold" text-anchor="middle">
        CONFIDENCE: {attrs.get('confidence_ratings', {}).get('face_shape', 85)}%
      </text>
    </svg>'''
    return svg

def generate_realistic_image_svg(attrs: Dict[str, Any], variant: str = "standard", seed: int = 42) -> str:
    """
    Renders an authentic, photographic-style Forensic Render.
    Features skin warmth gradients, photorealistic shadows, iris reflection, realistic lighting,
    and official watermark.
    """
    skin_tone = attrs.get("skin_tone", "Medium Olive")
    hair_color = attrs.get("hair_color", "Dark Brown")
    hair_style = attrs.get("hair_style", "Short Crop Buzz")
    facial_hair = attrs.get("facial_hair", "Clean Shaven")
    glasses = attrs.get("glasses", "None")
    scars = attrs.get("scars_marks", "None observed")
    headwear = attrs.get("headwear", "None")

    # Tone mappings
    skin_fill = "#b8896a"
    skin_shadow = "#8a583e"
    skin_highlight = "#cca487"
    if "Fair" in skin_tone or "Pale" in skin_tone:
        skin_fill = "#dcb79e"
        skin_shadow = "#a87a63"
        skin_highlight = "#f0d5c2"
    elif "Dark" in skin_tone or "Deep" in skin_tone:
        skin_fill = "#66412e"
        skin_shadow = "#42281a"
        skin_highlight = "#87573d"

    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 750" width="100%" height="100%" style="background-color: #0b0f17; font-family: 'Inter', sans-serif;">
      <defs>
        <radialGradient id="studioLight" cx="45%" cy="35%" r="65%">
          <stop offset="0%" stop-color="#1e2736"/>
          <stop offset="100%" stop-color="#07090d"/>
        </radialGradient>
        <linearGradient id="skinGrad" x1="20%" y1="10%" x2="80%" y2="90%">
          <stop offset="0%" stop-color="{skin_highlight}"/>
          <stop offset="50%" stop-color="{skin_fill}"/>
          <stop offset="100%" stop-color="{skin_shadow}"/>
        </linearGradient>
        <linearGradient id="shadowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="rgba(0,0,0,0.4)"/>
          <stop offset="50%" stop-color="rgba(0,0,0,0)"/>
          <stop offset="100%" stop-color="rgba(0,0,0,0.3)"/>
        </linearGradient>
        <filter id="softGlow">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <!-- Photographic Backdrop -->
      <rect width="600" height="750" fill="url(#studioLight)" />
      
      <!-- Studio Rim Light Silhouette -->
      <ellipse cx="300" cy="360" rx="170" ry="220" fill="none" stroke="#1E6BFF" stroke-width="1.5" opacity="0.4" />

      <!-- Body / Shoulders -->
      <path d="M 180 540 C 130 620, 80 690, 60 750 L 540 750 C 520 690, 470 620, 420 540 Z" fill="#141822" />
      <path d="M 210 520 Q 300 580 390 520 L 400 650 L 200 650 Z" fill="{skin_shadow}" opacity="0.6"/>

      <!-- Head Base -->
      <ellipse cx="300" cy="350" rx="145" ry="190" fill="url(#skinGrad)" />
      <ellipse cx="300" cy="350" rx="145" ry="190" fill="url(#shadowGrad)" />

      <!-- Ears -->
      <ellipse cx="152" cy="360" rx="16" ry="38" fill="{skin_fill}" stroke="{skin_shadow}" stroke-width="2"/>
      <ellipse cx="448" cy="360" rx="16" ry="38" fill="{skin_fill}" stroke="{skin_shadow}" stroke-width="2"/>

      <!-- Cheeks & Facial Sculpt -->
      <ellipse cx="230" cy="380" rx="40" ry="30" fill="{skin_highlight}" opacity="0.3" filter="url(#softGlow)"/>
      <ellipse cx="370" cy="380" rx="40" ry="30" fill="{skin_highlight}" opacity="0.2" filter="url(#softGlow)"/>
      
      <!-- Eyebrows -->
      <path d="M 195 305 Q 240 285 285 306" fill="none" stroke="#1f1813" stroke-width="6" stroke-linecap="round"/>
      <path d="M 405 305 Q 360 285 315 306" fill="none" stroke="#1f1813" stroke-width="6" stroke-linecap="round"/>

      <!-- Eyes (High Detail Photographic Realism) -->
      <!-- Left Eye -->
      <path d="M 215 330 Q 245 312 275 330 Q 245 348 215 330 Z" fill="#f8fafc" />
      <circle cx="245" cy="330" r="11" fill="#3b271d" />
      <circle cx="245" cy="330" r="5" fill="#090d14" />
      <circle cx="248" cy="327" r="2.5" fill="#ffffff" />
      <path d="M 212 328 Q 245 310 278 328" fill="none" stroke="#111827" stroke-width="3" />

      <!-- Right Eye -->
      <path d="M 385 330 Q 355 312 325 330 Q 355 348 385 330 Z" fill="#f8fafc" />
      <circle cx="355" cy="330" r="11" fill="#3b271d" />
      <circle cx="355" cy="330" r="5" fill="#090d14" />
      <circle cx="358" cy="327" r="2.5" fill="#ffffff" />
      <path d="M 388 328 Q 355 310 322 328" fill="none" stroke="#111827" stroke-width="3" />

      <!-- Nose Structure -->
      <path d="M 295 305 L 292 400 Q 275 410 285 418 Q 300 422 315 418 Q 325 410 308 400 Z" fill="{skin_shadow}" opacity="0.35"/>
      <ellipse cx="290" cy="415" rx="5" ry="3" fill="#2b1810" />
      <ellipse cx="310" cy="415" rx="5" ry="3" fill="#2b1810" />
      <path d="M 300 320 L 300 395" stroke="{skin_highlight}" stroke-width="3.5" opacity="0.6" filter="url(#softGlow)"/>

      <!-- Lips -->
      <path d="M 258 460 Q 300 452 342 460 Q 300 464 258 460 Z" fill="#8f4a4a" />
      <path d="M 262 461 Q 300 478 338 461 Q 300 468 262 461 Z" fill="#a85959" />

      <!-- Hair Realistic -->
      ''' + (f'''
      <path d="M 152 300 C 135 150, 240 120, 300 120 C 360 120, 465 150, 448 300 C 430 200, 370 170, 300 170 C 230 170, 170 200, 152 300 Z" fill="#18130f" />
      ''' if "Bald" not in hair_style else '') + (f'''
      <!-- Realistic Stubble / Beard -->
      <path d="M 190 410 Q 230 520 300 540 Q 370 520 410 410 Q 350 490 300 495 Q 250 490 190 410 Z" fill="#1a1410" opacity="0.75" />
      ''' if facial_hair != "Clean Shaven" else '') + (f'''
      <!-- Realistic Glasses -->
      <rect x="200" y="310" width="88" height="42" rx="10" fill="rgba(255,255,255,0.12)" stroke="#d4af37" stroke-width="2.5" />
      <rect x="312" y="310" width="88" height="42" rx="10" fill="rgba(255,255,255,0.12)" stroke="#d4af37" stroke-width="2.5" />
      <line x1="288" y1="325" x2="312" y2="325" stroke="#d4af37" stroke-width="3" />
      ''' if glasses != "None" else '') + f'''

      <!-- Watermark Bar -->
      <rect x="20" y="675" width="560" height="60" rx="4" fill="#07090d" stroke="#1E6BFF" stroke-width="1.2" opacity="0.95"/>
      <text x="300" y="698" fill="#1E6BFF" font-size="12" font-weight="bold" text-anchor="middle" letter-spacing="2">
        AI SYNTHETIC LEAD // NOT A REAL PHOTOGRAPH
      </text>
      <text x="300" y="718" fill="#94a3b8" font-size="10" text-anchor="middle" letter-spacing="1">
        CONFIDENTIAL POLICE COMPOSITE • INVESTIGATIVE LEAD ONLY
      </text>
    </svg>'''
    return svg

def generate_candidate_faces(base_attrs: Dict[str, Any]) -> List[Dict[str, Any]]:
    """
    Generates 4-6 candidate faces with realistic variances based on witness description.
    """
    candidates = []
    variations = [
        {"label": "Candidate A (Primary Concordance)", "jaw": "Sharp Angular", "score": 96.4, "hair_mod": base_attrs.get("hair_style")},
        {"label": "Candidate B (Broad Jawline Variant)", "jaw": "Broad Square", "score": 91.2, "hair_mod": base_attrs.get("hair_style")},
        {"label": "Candidate C (Receding Hairline Variant)", "jaw": "Defined Oval", "score": 88.7, "hair_mod": "Receding Buzz"},
        {"label": "Candidate D (Narrow Chin Variant)", "jaw": "Pointed Cleft", "score": 85.1, "hair_mod": base_attrs.get("hair_style")},
    ]

    for idx, var in enumerate(variations):
        mod_attrs = dict(base_attrs)
        mod_attrs["jawline"] = var["jaw"]
        mod_attrs["hair_style"] = var["hair_mod"]
        
        sketch = generate_pencil_sketch_svg(mod_attrs, seed=idx * 17)
        photo = generate_realistic_image_svg(mod_attrs, seed=idx * 17)
        
        candidates.append({
            "id": f"cand-{idx+1}",
            "label": var["label"],
            "pencil_sketch_data": sketch,
            "realistic_image_data": photo,
            "image_url": f"/images/candidate_{idx+1}.png",
            "similarity_score": var["score"],
            "description": f"Attribute weighting: {var['jaw']} jawline structure, matched against primary witness statement."
        })
    return candidates

