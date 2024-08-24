DEFINE TABLE IF NOT EXISTS rag_qna SCHEMAFULL;
DEFINE FIELD IF NOT EXISTS question ON TABLE rag_qna TYPE string
  ASSERT string::len($value) > 0;
DEFINE FIELD IF NOT EXISTS norm_question ON TABLE rag_qna TYPE string
  ASSERT string::len($value) > 0;
DEFINE FIELD IF NOT EXISTS question_vector ON TABLE rag_qna TYPE array<float>
  ASSERT array::len($value) = 768;
DEFINE FIELD IF NOT EXISTS rag_answer ON TABLE rag_qna TYPE record<rag_answer>;
DEFINE INDEX IF NOT EXISTS question_vector_index ON rag_qna 
  FIELDS question_vector
  MTREE DIMENSION 768
  DIST COSINE;
