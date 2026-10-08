import os
from typing import Generator, List, Dict, Optional
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY", "").strip()

# Lazy client initialization
_genai_client = None
_google_genai_legacy = None


def get_genai_client():
    """Initialize client using either google-genai or google.generativeai fallback."""
    global _genai_client, _google_genai_legacy

    if not API_KEY:
        print("[Gemini Service] Warning: GEMINI_API_KEY is not set.")
        return None, None

    if _genai_client is None and _google_genai_legacy is None:
        try:
            from google import genai
            _genai_client = genai.Client(api_key=API_KEY)
            print("[Gemini Service] Using new google-genai SDK Client.")
        except Exception as e:
            print(f"[Gemini Service] google-genai client init failed ({e}), falling back to google.generativeai...")
            try:
                import google.generativeai as legacy_genai
                legacy_genai.configure(api_key=API_KEY)
                _google_genai_legacy = legacy_genai
                print("[Gemini Service] Using google.generativeai legacy SDK.")
            except Exception as legacy_err:
                print(f"[Gemini Service] Could not initialize Gemini SDK: {legacy_err}")

    return _genai_client, _google_genai_legacy


SYSTEM_INSTRUCTION = """You are the official Gram Tarang Employability & AI Portal Assistant.
Gram Tarang Employability Training Services Pvt. Ltd. (GTET, incorporated in 2006, originating from Centurion University of Technology and Management roots established in 1999) is a leading social enterprise providing vocational skill training, workforce solutions, and high-retention industry placements across India. Co-founded by Prof. Mukti Kanta Mishra and Prof. D.N. Rao, Gram Tarang has trained and placed over 10.14 Lakh youth across 15+ states in partnership with NSDC, MSDE, MoRD (DDU-GKY), OSDA, and global corporate giants like Ashok Leyland, Tata Motors, Café Coffee Day, Yamaha, and Schneider Electric.

Guidelines for Answering:
1. Provide accurate, professional, comprehensive, and exhaustive answers based on official Gram Tarang records and context provided.
2. Structure your answers cleanly using bold section headings, clear bullet points (•), and structured tables or key highlights when comparing options.
3. When questions relate to Government Schemes (such as PMKVY 4.0, DDU-GKY, NAPS, WISTA, OSDA Sudakshya / Nutana Unnata Abhilasha, RPL, PM-Vishwakarma, or CSR programs):
   - Provide FULL scheme details: funding body, 100% free fee criteria, candidate eligibility (age limits, educational qualifications, target communities such as rural BPL, ST/SC, women, PwD), stipend amounts, residential boarding & lodging facilities, certifications awarded, and post-placement support.
4. When courses or sectors are asked (CNC, Automotive, Apparel, Electrical, Healthcare, Hospitality, Renewable Energy, etc.):
   - Detail duration, eligibility, hands-on industrial machinery used (e.g., 5-axis CNC, WEL production labs), certification bodies (NCVT, SSCs), recruiting employers, and entry-level salary packages.
5. When centres are asked:
   - Provide exact locations, parent campus details, facilities available, and contact persons.
6. When contact information is requested:
   - Always provide the official Gram Tarang helpline (+91 94386 03040 / +91-674-2386827) and email (info@gramtarang.org.in).
"""


def build_prompt(query: str, context: str = "", history: Optional[List[Dict[str, str]]] = None) -> str:
    """Construct prompt with system instructions, conversation history, and RAG context."""
    prompt_parts = []
    prompt_parts.append(SYSTEM_INSTRUCTION)

    if context:
        prompt_parts.append("\n=== RELEVANT GRAM TARANG DOCUMENTATION CONTEXT ===")
        prompt_parts.append(context)
        prompt_parts.append("=== END CONTEXT ===\n")

    if history:
        prompt_parts.append("\nRecent conversation context:")
        for msg in history[-4:]:
            role = "User" if msg.get("role") in ["user", "human"] else "Assistant"
            prompt_parts.append(f"{role}: {msg.get('content', '')}")

    prompt_parts.append(f"\nUser Question: {query}")
    prompt_parts.append("Answer:")

    return "\n\n".join(prompt_parts)


def generate_answer(query: str, context: str = "", history: Optional[List[Dict[str, str]]] = None) -> str:
    """Generate answer using Gemini."""
    client_new, client_legacy = get_genai_client()
    full_prompt = build_prompt(query, context, history)

    # 1. Try google-genai
    if client_new is not None:
        for model_candidate in ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"]:
            try:
                response = client_new.models.generate_content(
                    model=model_candidate,
                    contents=full_prompt
                )
                if response and response.text:
                    return response.text.strip()
            except Exception as err:
                print(f"[Gemini Service] Model {model_candidate} error: {err}")
                continue

    # 2. Try google.generativeai legacy
    if client_legacy is not None:
        for model_name in ["gemini-1.5-flash", "gemini-pro"]:
            try:
                model = client_legacy.GenerativeModel(model_name)
                response = model.generate_content(full_prompt)
                if response and response.text:
                    return response.text.strip()
            except Exception as err:
                print(f"[Gemini Service] Legacy model {model_name} error: {err}")
                continue

    # Fallback response if API key is invalid or quota exceeded
    if context:
        paragraphs = [
            p.strip() for p in context.split("\n\n")
            if len(p.strip()) > 30
        ]
        if paragraphs:
            cleaned_summary = "\n\n".join(paragraphs[:3])
        else:
            cleaned_summary = context[:600]
        return (
            "### Verified Information from Gram Tarang Knowledge Base\n\n"
            f"{cleaned_summary}\n\n"
            "---\n"
            "💡 *For personalized admissions, batch schedules, or hostel "
            "support, please reach out to the Gram Tarang Central Desk:* "
            "**+91-674-2386827** / **+91 94386 03040** or email "
            "**info@gramtarang.org.in**."
        )

    return (
        "Gram Tarang Employability Training Services provides "
        "industry-aligned skill programs (PMKVY, DDU-GKY, Ashok Leyland, "
        "CNC, Healthcare, Automotive). Please contact info@gramtarang.org.in "
        "or +91-674-2386827 for immediate assistance."
    )


def generate_answer_stream(query: str, context: str = "", history: Optional[List[Dict[str, str]]] = None) -> Generator[str, None, None]:
    """Streaming answer generator for Server-Sent Events."""
    client_new, client_legacy = get_genai_client()
    full_prompt = build_prompt(query, context, history)

    if client_new is not None:
        try:
            response_stream = client_new.models.generate_content_stream(
                model="gemini-2.5-flash",
                contents=full_prompt
            )
            for chunk in response_stream:
                if chunk.text:
                    yield chunk.text
            return
        except Exception as e:
            print(f"[Gemini Stream Error] {e}")

    # Fallback non-streaming chunking
    full_text = generate_answer(query, context, history)
    words = full_text.split(" ")
    for i in range(0, len(words), 3):
        yield " ".join(words[i:i+3]) + " "
