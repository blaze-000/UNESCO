from check_marketing.prompt_texts import *
from check_marketing.structures import Claims, Articles, ClaimVerification
from langchain_groq import ChatGroq
from dotenv import load_dotenv
from langchain.schema import Document
from check_marketing.handel_search import google_search, deduplicate, get_from_url
from langchain_core.output_parsers import PydanticOutputParser
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
import json
import sys

sys.stdout.reconfigure(encoding="utf-8")

load_dotenv()
model_name = "sentence-transformers/all-MiniLM-L6-v2"
embeddings = embeddings = HuggingFaceEmbeddings(model_name=model_name)


llm = ChatGroq(model="openai/gpt-oss-120b", temperature=0.3)

parser_Claims = PydanticOutputParser(pydantic_object=Claims)
parser_Articles = PydanticOutputParser(pydantic_object=Articles)
parser_ClaimsVerification = PydanticOutputParser(pydantic_object=ClaimVerification)


def CheckMarketing(text, progress_callback=None):
    # Step 1
    if progress_callback:
        progress_callback("🦆 Step 1 - Extracting Claims And Generating Search Queries.")
    else:
        print("🦆 Step 1 - Extracting Claims And Generating Search Queries.")

    prompt_to_extract_claims_queries = validation_prompt(parser=parser_Claims).invoke(
        {"text": text}
    )
    claims_queries = llm.invoke(prompt_to_extract_claims_queries)

    # Step 2
    if progress_callback:
        progress_callback("🦆 Step 2 - Reranking and Compressing the Claims And Search Queries.")
    else:
        print("🦆 Step 2 - Reranking and Compressing the Claims And Search Queries.")

    compress_claims_prompt = compress_and_improve_prompt(parser=parser_Claims).invoke(
        claims_queries.content
    )
    result = llm.invoke(compress_claims_prompt)


    # step 3
    if progress_callback:
        progress_callback("🦆 Step 3 - Finding Related Articles.")
    else:
        print("🦆 Step 3 - Finding Related Articles.")

    claims = json.loads(result.content)["claims"]


    datas = []
    for claim in claims:
        for query in claim["search_queries"]:

            datas.append(
                {
                    "claim": claim["claim"],
                    "category": claim["category"],
                    "search": google_search(query),
                }
            )


    datas = deduplicate(datas)


    # step 4
    if progress_callback:
        progress_callback("🦆 Step 4 - Reranking Articles")
    else:
        print("🦆 Step 4 - Reranking Articles")

    select_relavent_prompt = select_most_relavent(parser_Articles).invoke(
        {"articles": datas}
    )
    result = llm.invoke(select_relavent_prompt)


    #step 5
    if progress_callback:
        progress_callback("🦆 Step 5 - Loading And Splitting the Articles")
    else:
        print("🦆 Step 5 - Loading And Splitting the Articles")

    # result.content is a JSON string → convert to Python object
    data = json.loads(result.content)


    all_docs = []
    for i in data["claims"]:
        url = i["url"]
        category = i["category"]
        text = get_from_url(url)

        doc = Document(page_content=text, metadata={"source": url, "category": category})

        all_docs.append(doc)


    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
<<<<<<< HEAD
        chunk_overlap=150,
=======
        chunk_overlap=100,
>>>>>>> 4b6ac2c21804f83c38330b231a65eaaa3a72f933
        separators=["\n\n", "\n", ".", "!", "?", ",", " ", ""],
    )

    chunks = splitter.split_documents(all_docs)


    #step 6
    if progress_callback:
        progress_callback("🦆 Step 6 - Verifying claim")
    else:
        print("🦆 Step 6 - Verifying claim")

    vectorstore = FAISS.from_documents(chunks, embeddings)

    claim_verificaton_list = []
    for i, claim in enumerate(claims):

<<<<<<< HEAD
        simmi = vectorstore.similarity_search(claim["claim"], k=5)
=======
        simmi = vectorstore.similarity_search(claim["claim"], k=1)
>>>>>>> 4b6ac2c21804f83c38330b231a65eaaa3a72f933

        content = ""

        for idx, doc in enumerate(simmi):
            content += f"""
    # {idx+1}
    content: 
    {doc.page_content}

    article Url: {doc.metadata.get('source', 'Unknown Source')}
            """
        
        # call llm
        prompt = verify_claim_prompt(parser_ClaimsVerification).invoke(
            {"claim": claim["claim"] + "-" + claim["category"], "document": content}
        )
        response = llm.invoke(prompt)

        verification_data = json.loads(response.content)
        claim_verificaton_list.append(verification_data)

        if i >= 6:
            break

    #step 7
    if progress_callback:
        progress_callback("🦆 Step 7- Generating Final Response")
    else:
        print("🦆 Step 7- Generating Final Response")

    final_prompt_ = final_prompt().invoke(
<<<<<<< HEAD
        {"text": text, "claim_verificaton": claim_verificaton_list}
=======
        {"text": text, "claim_verificaton": claim_verificaton_list[0]}
>>>>>>> 4b6ac2c21804f83c38330b231a65eaaa3a72f933
    )

    return llm.invoke(final_prompt_).content

# =============================

