DEFINE TABLE IF NOT EXISTS rag_answer SCHEMAFULL;
DEFINE FIELD IF NOT EXISTS answer ON TABLE rag_answer TYPE string
  ASSERT string::len($value) > 0;
DEFINE FIELD IF NOT EXISTS norm_answer ON TABLE rag_answer TYPE string
  ASSERT string::len($value) > 0;
