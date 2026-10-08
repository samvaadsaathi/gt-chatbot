from typing import Optional
from fastapi import APIRouter, Query

router = APIRouter(prefix="/api", tags=["FAQs"])

FAQS = [
    {
        "id": 1,
        "category": "About",
        "question": "What is Gram Tarang Employability Training Services?",
        "answer": "Gram Tarang Employability Training Services is a pioneering social entrepreneurial initiative committed to providing high-quality vocational education and skill training to marginalized and unemployed youth across India. Incorporated in 1999, the organization focuses on bridging the immense gap between the demand for skilled professionals in various industry sectors and the supply of untrained youth. Through strategic partnerships with government bodies, sector skill councils, and prominent industry leaders, Gram Tarang ensures that the training aligns precisely with market requirements, thereby facilitating meaningful employment, empowering communities, and helping youth build sustainable, long-term careers in the organized sector."
    },
    {
        "id": 2,
        "category": "Schemes",
        "question": "What is Pradhan Mantri Kaushal Vikas Yojana (PMKVY)?",
        "answer": "Pradhan Mantri Kaushal Vikas Yojana (PMKVY) is the flagship skill development scheme of the Ministry of Skill Development and Entrepreneurship (MSDE), implemented by the National Skill Development Corporation (NSDC). Its primary objective is to enable Indian youth to take up industry-relevant skill training that helps them secure a better livelihood. The scheme heavily subsidizes or completely sponsors training for unemployed youth and school/college dropouts. PMKVY also includes a Recognition of Prior Learning (RPL) component to assess and certify individuals with existing experience, ultimately working to create a massive, standardized workforce to make India the skill capital of the world."
    },
    {
        "id": 3,
        "category": "Schemes",
        "question": "What is Deen Dayal Upadhyaya Grameen Kaushalya Yojana (DDU-GKY)?",
        "answer": "Deen Dayal Upadhyaya Grameen Kaushalya Yojana (DDU-GKY) is a highly specialized, demand-driven, and placement-linked skill training initiative under the Ministry of Rural Development (MoRD). Uniquely designed for the rural poor youth aged between 15 and 35 years, DDU-GKY aims to create income diversity within impoverished families and assist rural youth in realizing their career aspirations. The scheme not only provides free face-to-face counseling, guidance, and high-quality vocational training, but it also mandates a minimum 75% placement rate for successful candidates. It provides crucial post-placement support, helping rural youth transition smoothly into formal sector jobs in urban areas."
    },
    {
        "id": 4,
        "category": "Programs",
        "question": "What types of skill training courses are offered at Gram Tarang?",
        "answer": "Gram Tarang offers a diverse portfolio of skill training programs carefully tailored to meet the dynamic needs of today’s industries. Our training encompasses multiple high-growth sectors including Manufacturing, Automotive, Apparel and Textiles, Healthcare, Retail, and Agriculture. Candidates can enroll in highly specialized roles such as CNC Operator, Industrial Electrician, Sewing Machine Operator, Medical Lab Technician, and Commercial Vehicle Mechanic. These courses combine rigorous theoretical knowledge with extensive practical, hands-on experience, ensuring that graduates are immediately deployable and possess the exact technical competencies demanded by top-tier corporate partners and local businesses alike."
    },
    {
        "id": 5,
        "category": "Admissions",
        "question": "How can an interested candidate apply for a training program?",
        "answer": "Interested candidates can apply for Gram Tarang training programs through both offline and online channels. To apply offline, you can visit the nearest Gram Tarang training center, where dedicated counselors will guide you through the available courses, evaluate your aptitude, and help you fill out the application form. Alternatively, candidates can reach out via our official contact number, +91-674-2386827, or email us directly at info@gramtarang.org.in. You will need to submit fundamental documents such as an Aadhaar card, recent passport-sized photographs, address proof, and any relevant educational certificates to complete the registration and enrollment process successfully."
    },
    {
        "id": 6,
        "category": "Fees",
        "question": "Are there any financial fees associated with these training courses?",
        "answer": "Most of the vocational training programs offered through Gram Tarang are entirely free for eligible candidates, as they are fully funded by prominent government schemes like PMKVY and DDU-GKY. The Indian Government sponsors these initiatives to ensure that financial constraints do not prevent unemployed youth or school dropouts from acquiring critical employability skills. In programs specifically governed by PMKVY or DDU-GKY, candidates are not required to pay tuition. However, certain specialized, non-subsidized industry programs or advanced corporate upskilling courses may entail a nominal fee. Counselors always clarify the fee structure during the initial admission inquiry."
    },
    {
        "id": 7,
        "category": "Placements",
        "question": "Does Gram Tarang provide placement assistance after course completion?",
        "answer": "Yes, placement assistance is a foundational pillar of Gram Tarang’s mission. We do not just train youth; we are deeply committed to securing their livelihoods. Programs under DDU-GKY specifically mandate a 75% placement rate, guaranteeing that a vast majority of successful trainees step straight into a job. Gram Tarang leverages a vast network of over 25 industry partners, including industry giants like Ashok Leyland, Tata Motors, and Café Coffee Day. We organize regular campus recruitment drives, prepare candidates for interviews, and provide continuous support to ensure they successfully transition into stable, well-paying careers in the organized sector."
    },
    {
        "id": 8,
        "category": "Admissions",
        "question": "What are the basic eligibility criteria for enrolling in PMKVY courses?",
        "answer": "To be eligible for the Pradhan Mantri Kaushal Vikas Yojana (PMKVY) courses, applicants must primarily be Indian citizens aged between 15 and 45 years. The scheme is specifically tailored to empower unemployed youth, school dropouts, and college dropouts who are struggling to find formal employment. Depending on the specific job role and sector skill council guidelines, some courses might require a minimum educational background, such as passing the 8th or 10th standard. Furthermore, applicants must possess a valid Aadhaar card for biometric attendance and identity verification, along with an active bank account to receive any applicable stipends or financial support."
    },
    {
        "id": 9,
        "category": "Programs",
        "question": "How long do the skill training programs typically last?",
        "answer": "The duration of skill training programs at Gram Tarang varies significantly based on the chosen sector, the complexity of the job role, and the specific government scheme funding the course. Typically, Short-Term Training (STT) modules under PMKVY range from 150 to 300 hours, which usually translates to 2 to 3 months of intensive daily classes. Residential programs under DDU-GKY or specialized automotive programs, such as the Ashok Leyland Service Technician course, can extend to 3 or 4 months. This duration ensures that candidates receive a balanced mix of classroom theory, soft skills training, and crucial hands-on laboratory experience."
    },
    {
        "id": 10,
        "category": "Certificates",
        "question": "Will candidates receive a recognized certificate upon completion?",
        "answer": "Absolutely. Upon successfully completing the training program and passing the final assessments, candidates receive a highly respected, government-recognized skill certificate. For PMKVY programs, this certification is issued directly by the National Skill Development Corporation (NSDC) and the respective Sector Skill Council (SSC). This certificate serves as a valid testament to the candidate's technical proficiency and is universally recognized by employers across India. Alongside the certificate, trainees receive a Skill India card, which acts as a portable proof of their qualifications, significantly boosting their credibility and negotiating power when applying for jobs in the open market."
    },
    {
        "id": 11,
        "category": "Centers",
        "question": "Where are the Gram Tarang training centers located?",
        "answer": "Gram Tarang operates a vast, pan-India network of training centers strategically located to reach rural and semi-urban populations. While our headquarters and primary mother campuses are closely integrated with Centurion University in Bhubaneswar, Odisha, we have expanded our footprint to cover over 15 states. We maintain active operational hubs in Andhra Pradesh, Assam, Punjab, Jharkhand, Chhattisgarh, and other regions. Our centers range from large-scale residential facilities equipped with state-of-the-art laboratories to smaller satellite centers designed to provide accessible education directly within remote communities, ensuring that geographical barriers do not hinder youth from acquiring valuable skills."
    },
    {
        "id": 12,
        "category": "Admissions",
        "question": "What documents are required for admission into these programs?",
        "answer": "The documentation process is straightforward and designed to be hassle-free. To successfully enroll in a skill training program, applicants must submit a self-certified copy of their Aadhaar card, which is mandatory for government verification and biometric attendance. Additionally, you will need a valid proof of address, such as a voter ID card, bank passbook, or a recent utility bill. Two recent passport-sized photographs are required for your ID card and official files. Finally, depending on the course prerequisites, you must provide copies of your latest educational certificates, such as 10th or 12th-grade mark sheets, school leaving certificates, or ITI diplomas."
    },
    {
        "id": 13,
        "category": "Programs",
        "question": "Does the training include anything beyond technical skills?",
        "answer": "Yes, Gram Tarang recognizes that long-term career success requires much more than just technical know-how. Therefore, our curriculum adopts a holistic approach to youth development. Alongside rigorous sector-specific training, every candidate undergoes mandatory modules in soft skills, spoken English, basic computer literacy, and digital fluency. We also provide vital training in financial literacy, teaching youth how to manage bank accounts, savings, and digital transactions. This comprehensive educational model ensures that our graduates are not only skilled workers but also confident, adaptable, and professional individuals ready to seamlessly integrate into modern corporate environments and society."
    },
    {
        "id": 14,
        "category": "Schemes",
        "question": "What is the Recognition of Prior Learning (RPL) under PMKVY?",
        "answer": "Recognition of Prior Learning (RPL) is a unique and empowering component of the PMKVY scheme designed specifically for individuals who already possess informal skills and work experience but lack formal certification. Many workers in India acquire skills through traditional family trades or on-the-job experience. RPL assesses these existing competencies, bridges any minor knowledge gaps through short orientation courses, and awards a formal government-recognized certificate. This process validates their hard-earned expertise, boosts their self-esteem, and formally integrates them into the organized workforce, allowing them to negotiate better wages and pursue advanced career opportunities that require official credentials."
    },
    {
        "id": 15,
        "category": "Schemes",
        "question": "Can a candidate do multiple courses under PMKVY?",
        "answer": "The primary objective of the Pradhan Mantri Kaushal Vikas Yojana (PMKVY) is to provide initial employability skills to as many unique, untrained individuals as possible across the country. Therefore, a candidate is generally permitted to enroll in and complete only one core skill training course under the free PMKVY grant scheme. This prevents duplication and ensures government funds reach maximum beneficiaries. However, after successful placement and gaining industry experience, candidates may be eligible to return for specialized, advanced upskilling or reskilling programs under subsequent phases of the scheme to further enhance their career trajectory."
    },
    {
        "id": 16,
        "category": "Certificates",
        "question": "How do I verify the authenticity of a Gram Tarang certificate?",
        "answer": "Every certificate issued through Gram Tarang upon the completion of government-sponsored programs like PMKVY and DDU-GKY is completely authentic, nationally recognized, and digitally verifiable. Certificates are awarded directly by the National Skill Development Corporation (NSDC) or the relevant Sector Skill Council, not by Gram Tarang independently. Each certificate features a unique candidate ID, a high-security QR code, and an official watermark. Employers and candidates can instantly verify the authenticity of the certificate by scanning the QR code or entering the unique certification number into the official Skill India portal’s digital verification registry."
    },
    {
        "id": 17,
        "category": "Placements",
        "question": "What is the role of a Placement Officer?",
        "answer": "The Placement Officer at Gram Tarang is a dedicated professional whose sole mission is to bridge the gap between trained youth and prospective employers. From day one of the training, the placement officer works closely with candidates to build their resumes, conduct rigorous mock interviews, and develop their professional communication skills. Simultaneously, they constantly network with industry HR departments, organize job fairs, and schedule campus interviews. Post-placement, the officer acts as a crucial mentor and mediator, remaining in contact with the alumni to ensure they are settling comfortably into their new city and workplace environment."
    },
    {
        "id": 18,
        "category": "Programs",
        "question": "Are these programs available in local regional languages?",
        "answer": "Yes, recognizing that language should never be a barrier to acquiring vital technical skills, Gram Tarang implements a highly adaptable, multilingual training pedagogy. While technical terminologies and professional communication modules are taught in English to ensure corporate readiness, the core theoretical concepts and complex practical instructions are delivered in the candidate's local regional language. Our trainers are fluent in Odia, Hindi, Telugu, Assamese, and other regional dialects, ensuring that rural youth can fully comprehend the subject matter, ask questions comfortably, and build a strong foundational understanding before transitioning to English-dominated workplace environments."
    },
    {
        "id": 19,
        "category": "Programs",
        "question": "What is Business Incubation and how does it help?",
        "answer": "While Gram Tarang excels in wage employment placements, we also deeply support the entrepreneurial ambitions of our youth through our Business Incubation program. For graduates who wish to start their own businesses—such as opening an independent automotive repair garage, a tailoring boutique, or a specialized agricultural service—our incubation center provides crucial end-to-end support. This includes expert mentorship in business planning, financial management, and marketing. Furthermore, we assist these young entrepreneurs in securing initial seed capital through government micro-finance schemes like Mudra Yojana, and we help establish vital market linkages to ensure their new enterprise is sustainable and profitable."
    }
]

@router.get("/faq")
def get_faqs(category: Optional[str] = Query(None, description="Filter FAQs by category")):
    """Retrieve FAQs with optional category filtering."""
    if category and category.lower() != "all":
        filtered = [f for f in FAQS if f["category"].lower() == category.lower()]
        return {"faqs": filtered, "total": len(filtered)}
    return {"faqs": FAQS, "total": len(FAQS)}