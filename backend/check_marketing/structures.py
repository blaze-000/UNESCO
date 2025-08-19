from typing import List, Dict, Literal
from pydantic import BaseModel, Field, AnyUrl

# Response of Claim Extraction and query generation
class Claim(BaseModel):
    claim: str
    category: str
    search_queries: List

class Claims(BaseModel):
    claims: List[Claim]

# Articles
class Article(BaseModel):
    Title: str
    claim: str
    category: str
    url: str
    search_query: str

class Articles(BaseModel):
    claims: List[Article]

# Claim verificaton output
class ClaimVerification(BaseModel):
    claim: str
    category: str 
    status: Literal['True', 'False', 'Unverifiable']
    explanation: str
    citations: List[AnyUrl]