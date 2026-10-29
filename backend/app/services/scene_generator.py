import json
from typing import Dict, Any, List

def generate_scene_technical_plan_svg(
    location_type: str,
    room_layout: str,
    markers: List[Dict[str, Any]],
    measurements: List[Dict[str, Any]]
) -> str:
    """
    Renders an authentic, high-precision technical floor plan sketch.
    Includes blueprint grid, scale ruler, architectural walls, door swings,
    and interactive numbered evidence tags.
    """
    # SVG canvas with blueprint style
    svg_elements = []
    
    # Blueprint grid & base walls
    svg_elements.append('''
      <!-- Blueprint Grid Background -->
      <rect width="800" height="600" fill="#07101b" />
      <defs>
        <pattern id="sceneGridSmall" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#12273f" stroke-width="0.6"/>
        </pattern>
        <pattern id="sceneGridMajor" width="100" height="100" patternUnits="userSpaceOnUse">
          <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#1b395d" stroke-width="1.2"/>
        </pattern>
      </defs>
      <rect width="800" height="600" fill="url(#sceneGridSmall)" />
      <rect width="800" height="600" fill="url(#sceneGridMajor)" />

      <!-- Exterior & Interior Architectural Walls -->
      <!-- Room Bounds (e.g. Bank / Commercial Vault) -->
      <rect x="100" y="80" width="600" height="440" fill="none" stroke="#3b82f6" stroke-width="4"/>
      
      <!-- Partition Walls -->
      <line x1="100" y1="260" x2="380" y2="260" stroke="#3b82f6" stroke-width="3" />
      <line x1="380" y1="260" x2="380" y2="160" stroke="#3b82f6" stroke-width="3" />
      
      <!-- Countertop / Teller Area -->
      <rect x="420" y="180" width="220" height="50" fill="#132438" stroke="#60a5fa" stroke-width="2" stroke-dasharray="4,2"/>
      <text x="530" y="210" fill="#93c5fd" font-size="11" text-anchor="middle" font-family="monospace">TELLER COUNTER // DESK A</text>

      <!-- Vault Safe / Storage Unit -->
      <rect x="140" y="110" width="160" height="100" fill="#1e293b" stroke="#f59e0b" stroke-width="2.5"/>
      <text x="220" y="165" fill="#fbbf24" font-size="12" font-weight="bold" text-anchor="middle" font-family="monospace">SECURE VAULT AREA</text>

      <!-- Entry / Exit Door Swings -->
      <!-- Main Entrance (South) -->
      <line x1="340" y1="520" x2="420" y2="520" stroke="#07101b" stroke-width="6"/> <!-- opening -->
      <path d="M 340 520 Q 380 470 420 520" fill="none" stroke="#22c55e" stroke-width="2" stroke-dasharray="3,3"/>
      <line x1="340" y1="520" x2="380" y2="470" stroke="#22c55e" stroke-width="2.5"/>
      <text x="380" y="545" fill="#4ade80" font-size="11" text-anchor="middle" font-family="monospace">MAIN ENTRY [PT-1]</text>

      <!-- Emergency Rear Exit (West) -->
      <line x1="100" y1="360" x2="100" y2="420" stroke="#07101b" stroke-width="6"/>
      <path d="M 100 360 Q 60 390 100 420" fill="none" stroke="#ef4444" stroke-width="2" stroke-dasharray="3,3"/>
      <text x="80" y="445" fill="#f87171" font-size="10" text-anchor="end" font-family="monospace">FIRE EXIT [PT-2]</text>

      <!-- Suspect Path Trajectory (Red Dashed Line) -->
      <path d="M 380 500 L 450 360 L 510 250 L 320 220 L 100 390" fill="none" stroke="#ef4444" stroke-width="2.5" stroke-dasharray="6,4"/>
      <circle cx="380" cy="500" r="5" fill="#ef4444" />
      <polygon points="100,390 115,382 115,398" fill="#ef4444" />
      <text x="470" y="380" fill="#fca5a5" font-size="10" font-family="monospace">SUSPECT TRAJECTORY</text>

      <!-- Witness View Cone -->
      <polygon points="640,460 480,240 380,360" fill="rgba(30, 107, 255, 0.12)" stroke="#1E6BFF" stroke-width="1.2" stroke-dasharray="2,2"/>
      <circle cx="640" cy="460" r="7" fill="#1E6BFF"/>
      <text x="655" y="465" fill="#93c5fd" font-size="10" font-family="monospace">WITNESS #1 POV</text>
    ''')

    # Render Evidence Markers
    if not markers:
        markers = [
            {"id": 1, "label": "9mm Casing (Federal)", "x": 480, "y": 320, "type": "ballistics"},
            {"id": 2, "label": "Partial Palm Print on Glass", "x": 460, "y": 180, "type": "latent"},
            {"id": 3, "label": "Dropped Black Cable Ties", "x": 280, "y": 240, "type": "physical"},
            {"id": 4, "label": "Pry Marks on Safe Lock", "x": 160, "y": 140, "type": "tool_mark"},
            {"id": 5, "label": "Torn Fabric Snag", "x": 105, "y": 380, "type": "fiber"}
        ]

    for m in markers:
        mx = m.get("x", 200)
        my = m.get("y", 200)
        mid = m.get("id", 1)
        mlabel = m.get("label", "Evidence")
        svg_elements.append(f'''
          <!-- Evidence Marker #{mid} -->
          <g transform="translate({mx}, {my})" cursor="pointer">
            <polygon points="0,-16 14,8 -14,8" fill="#facc15" stroke="#713f12" stroke-width="1.5" />
            <text x="0" y="4" fill="#000000" font-size="11" font-weight="bold" text-anchor="middle" font-family="sans-serif">{mid}</text>
            <rect x="18" y="-14" width="{len(mlabel)*7 + 16}" height="20" rx="3" fill="#0f172a" stroke="#eab308" stroke-width="1" />
            <text x="24" y="0" fill="#fef08a" font-size="10" font-family="monospace">#{mid}: {mlabel}</text>
          </g>
        ''')

    # Dimension calipers / measurements
    svg_elements.append('''
      <!-- Dimension Lines -->
      <g stroke="#94a3b8" stroke-width="1" font-family="monospace" font-size="10" fill="#94a3b8">
        <!-- South Wall Length -->
        <line x1="100" y1="550" x2="700" y2="550" marker-start="url(#dot)" marker-end="url(#dot)"/>
        <line x1="100" y1="540" x2="100" y2="560" />
        <line x1="700" y1="540" x2="700" y2="560" />
        <text x="400" y="568" text-anchor="middle">TOTAL SPAN: 18.25 METERS</text>
      </g>
      
      <!-- Compass Rose -->
      <g transform="translate(730, 130)">
        <circle cx="0" cy="0" r="24" fill="#0f172a" stroke="#3b82f6" stroke-width="1.5"/>
        <polygon points="0,-20 5,-4 0,-7 -5,-4" fill="#ef4444" />
        <polygon points="0,20 5,4 0,7 -5,4" fill="#94a3b8" />
        <text x="0" y="-8" fill="#ef4444" font-size="9" font-weight="bold" text-anchor="middle" font-family="sans-serif">N</text>
      </g>

      <!-- Official Banner Watermark -->
      <rect x="20" y="20" width="340" height="42" rx="3" fill="#090d16" stroke="#1E6BFF" stroke-width="1.2"/>
      <text x="32" y="38" fill="#60a5fa" font-size="11" font-weight="bold" font-family="sans-serif">CRIME SCENE DIAGRAM // SEC-FORENSIC</text>
      <text x="32" y="52" fill="#94a3b8" font-size="9" font-family="monospace">SCALE: 1:50 METRIC • OFFICIAL POLICE RECORD</text>
    ''')

    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
      {''.join(svg_elements)}
    </svg>'''

def generate_scene_realistic_render_svg(location_type: str, room_layout: str) -> str:
    """
    Renders an authentic, perspective 3D-styled crime scene visualization.
    """
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%" style="background-color: #05080f;">
      <defs>
        <linearGradient id="wallFloorGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#0c1322"/>
          <stop offset="60%" stop-color="#151e30"/>
          <stop offset="100%" stop-color="#080c14"/>
        </linearGradient>
        <radialGradient id="floodlight" cx="60%" cy="30%" r="70%">
          <stop offset="0%" stop-color="#2a3c5a" stop-opacity="0.8"/>
          <stop offset="100%" stop-color="#05080f" stop-opacity="0.95"/>
        </radialGradient>
      </defs>

      <!-- 3D Perspective Room -->
      <rect width="800" height="600" fill="url(#wallFloorGrad)"/>
      <rect width="800" height="600" fill="url(#floodlight)"/>

      <!-- Vanishing Point Perspective Grid -->
      <line x1="0" y1="0" x2="400" y2="280" stroke="#1e293b" stroke-width="1.5"/>
      <line x1="800" y1="0" x2="400" y2="280" stroke="#1e293b" stroke-width="1.5"/>
      <line x1="0" y1="600" x2="400" y2="280" stroke="#1e293b" stroke-width="2"/>
      <line x1="800" y1="600" x2="400" y2="280" stroke="#1e293b" stroke-width="2"/>

      <!-- Rear Vault Door Structure -->
      <rect x="330" y="190" width="140" height="180" fill="#1b2434" stroke="#475569" stroke-width="3"/>
      <circle cx="400" cy="275" r="35" fill="#0f172a" stroke="#f59e0b" stroke-width="3"/>
      <line x1="400" y1="240" x2="400" y2="310" stroke="#f59e0b" stroke-width="4"/>
      <line x1="365" y1="275" x2="435" y2="275" stroke="#f59e0b" stroke-width="4"/>

      <!-- Police Evidence Tape In Foreground -->
      <polygon points="0,520 800,480 800,510 0,550" fill="#eab308" opacity="0.9" stroke="#ca8a04"/>
      <text x="400" y="534" fill="#000000" font-size="14" font-weight="bold" letter-spacing="4" text-anchor="middle" font-family="sans-serif">
        CRIME SCENE - DO NOT ENTER - FORENSIC INVESTIGATION DIVISION
      </text>

      <!-- 3D Evidence Cones -->
      <polygon points="460,420 480,455 440,455" fill="#facc15" stroke="#713f12" stroke-width="1.5"/>
      <text x="460" y="450" fill="#000000" font-size="12" font-weight="bold" text-anchor="middle">1</text>
      
      <polygon points="260,390 278,422 242,422" fill="#facc15" stroke="#713f12" stroke-width="1.5"/>
      <text x="260" y="418" fill="#000000" font-size="12" font-weight="bold" text-anchor="middle">2</text>

      <!-- Watermark Stamp -->
      <rect x="20" y="20" width="420" height="40" rx="3" fill="#090d14" stroke="#ff1e3c" stroke-width="1"/>
      <text x="32" y="44" fill="#ff1e3c" font-size="11" font-weight="bold" font-family="sans-serif">
        PERSPECTIVE VISUALIZATION // RECONSTRUCTION LEAD ONLY
      </text>
    </svg>'''

