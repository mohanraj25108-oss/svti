import re
from typing import Dict, Any, List

def parse_witness_narrative(narrative: str) -> Dict[str, Any]:
    text = narrative.lower()
    
    # 1. Age extraction
    age_match = re.search(r'(\d{2})s|\b(\d{2})\s*(?:years?|yrs?)\s*old|\b(late|early|mid)[\s-](\d{2})s|\b(teenager|elderly|middle[\s-]aged|young)\b', text)
    age_range = "30-35"
    if age_match:
        if "elderly" in text or "60" in text or "70" in text:
            age_range = "60-65"
        elif "middle-aged" in text or "40" in text or "50" in text:
            age_range = "45-50"
        elif "late 20" in text or "28" in text or "29" in text:
            age_range = "28-32"
        elif "early 20" in text or "teenager" in text or "young" in text:
            age_range = "20-25"
        elif "30" in text:
            age_range = "32-37"
            
    # 2. Gender extraction
    gender = "Male"
    if "female" in text or "woman" in text or "girl" in text or "lady" in text:
        gender = "Female"

    # 3. Face shape
    face_shape = "Oval"
    if "square" in text or "angular" in text or "sharp jaw" in text or "box" in text:
        face_shape = "Square"
    elif "round" in text or "chubby" in text or "circular" in text:
        face_shape = "Round"
    elif "oblong" in text or "long face" in text:
        face_shape = "Oblong"
    elif "heart" in text or "pointed chin" in text:
        face_shape = "Heart"

    # 4. Skin tone
    skin_tone = "Medium Olive"
    if "fair" in text or "pale" in text or "light skin" in text or "caucasian" in text:
        skin_tone = "Fair / Pale"
    elif "dark" in text or "deep brown" in text or "black" in text:
        skin_tone = "Dark / Deep Brown"
    elif "tan" in text or "bronze" in text or "olive" in text:
        skin_tone = "Tanned / Medium Olive"
    elif "south asian" in text or "brown" in text:
        skin_tone = "Wheatish / Medium Brown"

    # 5. Hair
    hair_style = "Short Crop Buzz"
    hair_color = "Black"
    if "bald" in text or "shaved head" in text or "no hair" in text:
        hair_style = "Bald / Shaved"
    elif "curly" in text:
        hair_style = "Curly Medium Length"
    elif "wavy" in text:
        hair_style = "Wavy Tapered"
    elif "long" in text or "ponytail" in text:
        hair_style = "Long Tied Back"
    elif "undercut" in text or "fade" in text:
        hair_style = "Fade / Undercut"

    if "blonde" in text or "blond" in text or "yellow hair" in text:
        hair_color = "Blonde"
    elif "brown" in text or "brunette" in text:
        hair_color = "Dark Brown"
    elif "grey" in text or "gray" in text or "silver" in text or "white hair" in text:
        hair_color = "Salt & Pepper / Grey"
    elif "red" in text or "ginger" in text:
        hair_color = "Auburn / Red"

    # 6. Facial Hair
    facial_hair = "Clean Shaven"
    if "beard" in text and "clean-shaven" not in text and "clean shaven" not in text:
        if "thick" in text or "full" in text:
            facial_hair = "Full Heavy Beard"
        else:
            facial_hair = "Short Trimmed Beard"
    elif "stubble" in text or "shadow" in text:
        facial_hair = "Heavy 5-o'clock Stubble"
    elif "mustache" in text or "moustache" in text:
        facial_hair = "Horseshoe Mustache"
    elif "goatee" in text:
        facial_hair = "Goatee"

    # 7. Glasses
    glasses = "None"
    if "glasses" in text or "spectacles" in text or "shades" in text or "sunglasses" in text:
        if "wire" in text or "thin" in text:
            glasses = "Thin Wireframe Aviator"
        elif "black frame" in text or "thick" in text:
            glasses = "Black Rectangular Frame"
        elif "sunglasses" in text or "dark" in text:
            glasses = "Dark Tactical Sunglasses"
        else:
            glasses = "Standard Reading Glasses"

    # 8. Scars and distinctive marks
    scars_marks = "None observed"
    if "scar" in text:
        if "cheek" in text:
            scars_marks = "Linear surgical scar across left cheek"
        elif "eyebrow" in text:
            scars_marks = "Notched scar cutting through right eyebrow"
        elif "lip" in text:
            scars_marks = "Cleft scar along upper lip"
        else:
            scars_marks = "Visible facial laceration scar"
    elif "tattoo" in text:
        scars_marks = "Tattoo on right side of neck / jawline"
    elif "mole" in text:
        scars_marks = "Raised mole beside right nostril"

    # 9. Nose & Eyes
    nose_shape = "Aquiline / Straight"
    if "crooked" in text or "broken" in text:
        nose_shape = "Broken / Deviated Septum"
    elif "wide" in text or "broad" in text:
        nose_shape = "Broad / Flattened"
    elif "pointed" in text or "sharp" in text:
        nose_shape = "Pointed / Sharp"

    eye_shape = "Almond"
    eye_color = "Dark Brown"
    if "blue" in text:
        eye_color = "Piercing Blue"
    elif "green" in text or "hazel" in text:
        eye_color = "Hazel / Green"
    if "hooded" in text or "deep-set" in text or "tired" in text:
        eye_shape = "Deep-Set / Hooded"

    # 10. Headwear & Clothing
    headwear = "None"
    if "cap" in text or "baseball" in text:
        headwear = "Dark Baseball Cap"
    elif "beanie" in text or "knit hat" in text:
        headwear = "Black Tactical Beanie"
    elif "hood" in text or "hoodie" in text:
        headwear = "Pulled-up Dark Hoodie"

    clothing = "Dark Utility Jacket"
    if "hoodie" in text:
        clothing = "Charcoal Oversized Hoodie"
    elif "jacket" in text:
        clothing = "Black Tactical Field Jacket"
    elif "suit" in text or "blazer" in text:
        clothing = "Dark Tailored Suit"

    # Detect Contradictions
    contradictions = []
    if ("clean shaven" in text or "clean-shaven" in text) and ("beard" in text or "heavy stubble" in text):
        contradictions.append({
            "field": "facial_hair",
            "message": "Conflict detected: Narrative mentions both 'clean-shaven' and 'beard/stubble'.",
            "resolution": "Flagged for investigator clarification."
        })
    if ("bald" in text or "shaved" in text) and ("long hair" in text or "flowing" in text):
        contradictions.append({
            "field": "hair_style",
            "message": "Conflict detected: Narrative references both 'bald' and 'long hair'.",
            "resolution": "Witness may have seen a wig or separate accomplice."
        })
    if ("teenager" in text or "young boy" in text) and ("elderly" in text or "wrinkles" in text):
        contradictions.append({
            "field": "age_range",
            "message": "Conflict detected: Significant age disparity across statements.",
            "resolution": "Evaluate if multiple perpetrators were present."
        })

    # Clarifying questions
    clarifying_questions = []
    if glasses == "None":
        clarifying_questions.append("Did the suspect wear eyeglasses, sunglasses, or any facial cover during the encounter?")
    if scars_marks == "None observed":
        clarifying_questions.append("Were there any noticeable skin blemishes, tattoos, piercings, or scars visible under lighting?")
    if headwear == "None":
        clarifying_questions.append("Was the suspect wearing a hat, hoodie, or headband that might conceal the hairline or ears?")

    attributes = {
        "age_range": age_range,
        "gender": gender,
        "face_shape": face_shape,
        "skin_tone": skin_tone,
        "eye_shape": eye_shape,
        "eye_color": eye_color,
        "eyebrows": "Thick Defined",
        "nose_shape": nose_shape,
        "lip_shape": "Medium Straight",
        "jawline": "Sharp Angular" if face_shape in ["Square", "Oblong"] else "Rounded",
        "hair_style": hair_style,
        "hair_color": hair_color,
        "facial_hair": facial_hair,
        "glasses": glasses,
        "scars_marks": scars_marks,
        "headwear": headwear,
        "clothing": clothing,
        "confidence_ratings": {
            "age_range": 85,
            "face_shape": 90,
            "hair_style": 80,
            "facial_hair": 75,
            "scars_marks": 95 if scars_marks != "None observed" else 60
        }
    }

    return {
        "attributes": attributes,
        "contradictions": contradictions,
        "clarifying_questions": clarifying_questions
    }

