from pathlib import Path
from typing import List, Any

from langchain_community.document_loaders import (
    PyPDFLoader,
    TextLoader,
    CSVLoader,
    Docx2txtLoader,
    JSONLoader,
)

from langchain_community.document_loaders.excel import (
    UnstructuredExcelLoader
)


def Load_all_document(
    data_dir: str
) -> List[Any]:

    documents = []

    path_dir = Path(data_dir).resolve()

    if not path_dir.exists():
        raise FileNotFoundError(
            f"Directory not found: {path_dir}"
        )

    if not path_dir.is_dir():
        raise ValueError(
            f"Expected directory but received: {path_dir}"
        )

    # =========================================================
    # PDF
    # =========================================================

    pdf_files = list(path_dir.glob("**/*.pdf"))

    print(f"Found {len(pdf_files)} Pdf files")

    for pdf_file in pdf_files:

        print(f"Loading file: {pdf_file}")

        try:

            loader = PyPDFLoader(
                str(pdf_file)
            )

            docs = loader.load()

            for doc in docs:

                doc.metadata["source"] = pdf_file.name
                doc.metadata["file_name"] = pdf_file.name

            documents.extend(docs)

        except Exception as e:

            print(
                f"Error loading PDF {pdf_file}: {e}"
            )

    # =========================================================
    # TXT
    # =========================================================

    text_files = list(
        path_dir.glob("**/*.txt")
    )

    print(
        f"Found {len(text_files)} text files"
    )

    for text_file in text_files:

        print(
            f"Loading file: {text_file}"
        )

        try:

            loader = TextLoader(
                str(text_file),
                encoding="utf-8"
            )

            docs = loader.load()

            for doc in docs:

                doc.metadata["source"] = text_file.name
                doc.metadata["file_name"] = text_file.name

            documents.extend(docs)

        except Exception as e:

            print(
                f"Error loading TXT {text_file}: {e}"
            )

    # =========================================================
    # CSV
    # =========================================================

    csv_files = list(
        path_dir.glob("**/*.csv")
    )

    print(
        f"Found {len(csv_files)} CSV files"
    )

    for csv_file in csv_files:

        print(
            f"Loading CSV file: {csv_file}"
        )

        try:

            loader = CSVLoader(
                str(csv_file)
            )

            docs = loader.load()

            for doc in docs:

                doc.metadata["source"] = csv_file.name
                doc.metadata["file_name"] = csv_file.name

            documents.extend(docs)

        except Exception as e:

            print(
                f"Error loading CSV {csv_file}: {e}"
            )

    # =========================================================
    # EXCEL
    # =========================================================

    excel_files = list(
        path_dir.glob("**/*.xlsx")
    )

    print(
        f"Found {len(excel_files)} Excel files"
    )

    for excel_file in excel_files:

        print(
            f"Loading Excel file: {excel_file}"
        )

        try:

            loader = UnstructuredExcelLoader(
                str(excel_file)
            )

            docs = loader.load()

            for doc in docs:

                doc.metadata["source"] = excel_file.name
                doc.metadata["file_name"] = excel_file.name

            documents.extend(docs)

        except Exception as e:

            print(
                f"Error loading Excel {excel_file}: {e}"
            )

    # =========================================================
    # DOCX
    # =========================================================

    word_files = list(
        path_dir.glob("**/*.docx")
    )

    print(
        f"Found {len(word_files)} Word files"
    )

    for word_file in word_files:

        print(
            f"Loading Word file: {word_file}"
        )

        try:

            loader = Docx2txtLoader(
                str(word_file)
            )

            docs = loader.load()

            for doc in docs:

                doc.metadata["source"] = word_file.name
                doc.metadata["file_name"] = word_file.name

            documents.extend(docs)

        except Exception as e:

            print(
                f"Error loading Word {word_file}: {e}"
            )

    # =========================================================
    # JSON
    # =========================================================

    json_files = list(
        path_dir.glob("**/*.json")
    )

    print(
        f"Found {len(json_files)} JSON files"
    )

    for json_file in json_files:

        print(
            f"Loading JSON file: {json_file}"
        )

        try:

            loader = JSONLoader(
                file_path=str(json_file),
                jq_schema=".",
                text_content=False
            )

            docs = loader.load()

            for doc in docs:

                doc.metadata["source"] = json_file.name
                doc.metadata["file_name"] = json_file.name

            documents.extend(docs)

        except Exception as e:

            print(
                f"Error loading JSON {json_file}: {e}"
            )

    print(
        f"Total documents loaded: {len(documents)}"
    )

    return documents