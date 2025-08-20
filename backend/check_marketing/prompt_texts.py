from langchain.prompts import PromptTemplate


def validation_prompt(parser):
    return PromptTemplate(
        template="""
            
    You are an expert marketing claim analyzer and fact-verification assistant.  
    Your task is to:  
    1. Read the given product description.  
    2. Identify and extract all distinct claims made in the text.  
    3. Classify each claim into ONE of the following categories:  
    - Performance & Superlative Claims  
    - Scientific & Technological Claims  
    - Ingredient, Origin, or Purity Claims  
    - Testimonial, Endorsement, & Award Claims  
    - Ethical & Environmental Claims  
    - Price, Value, & Offer Claims  
    - Emotional & Lifestyle Claims  
    - Sensory & Experiential Claims  

    4. For EACH claim, generate 5–8 highly relevant and diverse Google search queries that could help verify or fact-check the claim.  
    - Include variations with keywords like: "review", "independent test", "comparison", "is it true", "scientific evidence", "consumer reports", "lab test", "government report", "criticism", "lawsuit", etc.  
    - Use the product name and important keywords from the claim.  
    - Avoid overly generic queries; make them specific to the claim.

    5. Format 
    {format_instruction}

    Here is the product description to analyze:  

    {text}

    """,
        input_variables=["text"],
        partial_variables={"format_instruction": parser.get_format_instructions()},
    )


def compress_and_improve_prompt(parser):
    return PromptTemplate(
        template="""

        You are an expert in marketing claim verification.  
        You are given a JSON list of claims from a marketing campaign, each with a category and search queries.

        Your task:
        1. Select the 3–5 most important claims whose truthfulness would have the highest impact on determining if the marketing is deceptive.
        2. For each selected claim, choose the 3 most relevant search queries. You may slightly improve them for clarity or effectiveness in finding evidence online.

        Search Query Generation Rules:

        - Query 1 (Broad Credibility): A natural phrase containing the claim’s main idea plus credibility keywords such as scientific study, fact check, official statement, research evidence. No site filters.

        - Query 2 (Filtered Authority): Keep it general but add one or two credible site filters from this set: site:.gov, site:.edu, site:who.int, site:.org, site:bbc.com, site:reuters.com. Avoid stacking too many filters.

        - Query 3 (Technical Specificity): Include scientific or technical terms relevant to the claim such as peer-reviewed, clinical trial, meta-analysis, systematic review. No site filters.

        3. Format
        {format_instruction}

        Here is the data to work with:
        {claims_json}
    """,
        input_variables=["claims_json"],
        partial_variables={"format_instruction": parser.get_format_instructions()},
    )


def select_most_relavent(parser):
    return PromptTemplate(
        template="""

        You are an expert research assistant with deep knowledge of oral health, dentistry, and evidence-based product evaluation.

        You are given a list of articles. Each article has a Title, URL, and a Search Query.

        Your task is to select 5-7 articles that are:
        1. **Most relevant** to the specific product(s) or ingredients mentioned in the search queries.
        2. **Most authentic and credible**, prioritizing:
        - Peer-reviewed journals
        - Reputable institutions (.gov, .edu, recognized health organizations)
        - Clinical trials or systematic reviews
        3. **Product-specific or brand-related studies** should be favored over generic oral health studies, unless the generic study is directly about an active ingredient used in the product.
        4. Return Claim and category as it is.

        Format:
        {format_information}

        Articles:
        {articles}

        """,
        input_variables=["articles"],
        partial_variables={"format_information": parser.get_format_instructions()},
    )


def final_prompt():
    return PromptTemplate(
        template="""
        You are an expert marketing fact-checker and consumer safety analyst. 

        You are provided with three things:
        1. The original product description: 
        {text}

        2. A list of extracted claims verification with summary:
        {claim_verificaton}

        Your task:
        - Analyze each claim and check whether it is supported, partially supported, or unsupported by the documents.
        - Determine if any claims are potentially deceptive, exaggerated, or misleading.
        - For each claim put the article link from the context
        - Provide a concise summary of your assessment:
        * Overall authenticity of the product marketing
        * Any misleading claims and why
        * Strength of supporting evidence
        - Be factual and objective. Base conclusions only on the documents and extracted claims.

        If you don't have context for the certain claim don't try to answer out of no where just that you don't have context for that particular claim.

        """,
        input_variables=["text", "claim_verificaton"],
    )


def verify_claim_prompt(parser):
    return PromptTemplate(
        template="""
You are a fact-checking assistant.

Your task is to verify the following claim using the provided supporting documents. 
Each document has a `content` and a `source`. 
If the claim is supported by the documents, mark it as "True". 
If it is contradicted, mark it as "False". 
If the documents do not give enough information, mark it as "Unverifiable".
Please return 1 line explanation of the claim and the supporting documents.

Return your answer in strict JSON format:
{format_instruction}

---
Claim - category:
{claim}


Supporting Documents:
{document}

""",
        input_variables=["claim", "document"],
        partial_variables={"format_instruction": parser.get_format_instructions()},
    )
