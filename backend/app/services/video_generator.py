import json
from typing import Dict, Any, List

def generate_video_reconstruction_data(
    title: str,
    timeline_steps: List[Dict[str, Any]],
    duration_seconds: int = 15
) -> Dict[str, Any]:
    """
    Synthesizes a schematic tactical crime reconstruction sequence with keyframes,
    stylized mannequin actors, camera vectors, and mandatory legal watermark.
    """
    if not timeline_steps:
        timeline_steps = [
            {
                "step": 1,
                "timestamp": "00:00:03",
                "title": "Perimeter Breach",
                "description": "Suspect in dark jacket enters rear service corridor through fire exit.",
                "camera_view": "Corridor CCTV Cam 04",
                "characters": [{"id": "S1", "role": "Suspect", "x": 120, "y": 280, "action": "Entering"}]
            },
            {
                "step": 2,
                "timestamp": "00:00:08",
                "title": "Teller Approach & Confrontation",
                "description": "Suspect approaches commercial teller window and brandishes tool.",
                "camera_view": "Teller Overhead Cam 01",
                "characters": [
                    {"id": "S1", "role": "Suspect", "x": 380, "y": 240, "action": "Demanding Access"},
                    {"id": "W1", "role": "Witness/Teller", "x": 480, "y": 240, "action": "Backing Away"}
                ]
            },
            {
                "step": 3,
                "timestamp": "00:00:14",
                "title": "Extraction to Alleyway",
                "description": "Suspect grabs black nylon duffel bag and exits via side alley door.",
                "camera_view": "Exterior Alleyway Cam 02",
                "characters": [{"id": "S1", "role": "Suspect", "x": 650, "y": 420, "action": "Sprinting West"}]
            }
        ]

    # Generate schematic video clips metadata
    clips = []
    for step in timeline_steps:
        clips.append({
            "clip_id": f"clip-0{step.get('step', 1)}",
            "title": step.get("title", "Event Clip"),
            "timestamp": step.get("timestamp", "00:00:00"),
            "camera": step.get("camera_view", "Tactical Overhead View"),
            "duration": round(duration_seconds / max(len(timeline_steps), 1), 1),
            "description": step.get("description", ""),
            "schematic_layout": {
                "characters": step.get("characters", [{"role": "Suspect", "x": 200, "y": 200}]),
                "grid_active": True,
                "trajectory_vector": [100, 250, 450, 300]
            }
        })

    return {
        "status": "READY",
        "duration_seconds": duration_seconds,
        "watermark_text": "AI RECONSTRUCTION: ILLUSTRATIVE ONLY, NOT ACTUAL FOOTAGE",
        "style": "SCHEMATIC_TACTICAL",
        "actor_style": "Stylized Schematic Mannequin (Non-Photorealistic)",
        "clips": clips,
        "timeline": timeline_steps
    }

