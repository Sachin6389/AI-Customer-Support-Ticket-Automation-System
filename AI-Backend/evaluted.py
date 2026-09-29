import asyncio
import json

from pathlib import Path

from app.Evaluator.Evaluator import (
    evaluate_retrieval
)


async def main():

    # ============================================================
    # LOAD EVALUATION QUESTIONS
    # ============================================================

    path = Path(
        "evalution_Question/evalution_q.json"
    )

    if not path.exists():

        print(
            f"\nERROR: File not found:"
        )

        print(
            path.resolve()
        )

        return

    questions = json.loads(
        path.read_text(
            encoding="utf-8"
        )
    )

    total = len(questions)

    correct = 0

    # ============================================================
    # START EVALUATION
    # ============================================================

    print(
        "\n=============================================="
    )

    print(
        "          RAG / CHAT EVALUATION"
    )

    print(
        "==============================================\n"
    )

    for index, item in enumerate(
        questions,
        start=1
    ):

        # IMPORTANT:
        # evaluate_retrieval is async
        # therefore await is required
        result = await evaluate_retrieval(
            question=item["question"],
            expected_keywords=item[
                "expected_keywords"
            ]
        )

        # ========================================================
        # COUNT PASSED TESTS
        # ========================================================

        if result["retrieval_hit"]:

            correct += 1

        # ========================================================
        # PRINT RESULT
        # ========================================================

        print(
            f"\nTest Case: {index}/{total}"
        )

        print(
            "-" * 60
        )

        print(
            f"Question:\n"
            f"{result['question']}"
        )

        print(
            f"\nHit: "
            f"{result['retrieval_hit']}"
        )

        print(
            f"Keyword Accuracy: "
            f"{result['keyword_accuracy']:.2%}"
        )

        print(
            f"\nMatched Keywords:"
        )

        print(
            result["matched_keywords"]
        )

        print(
            f"\nMissing Keywords:"
        )

        print(
            result["missing_keywords"]
        )

        print(
            f"\nResponse:"
        )

        print(
            result["response"]
        )

        print(
            "-" * 60
        )

    # ============================================================
    # FINAL SUMMARY
    # ============================================================

    accuracy = (
        correct / total
        if total
        else 0
    )

    print(
        "\n=============================================="
    )

    print(
        "             EVALUATION SUMMARY"
    )

    print(
        "=============================================="
    )

    print(
        f"Total Questions : {total}"
    )

    print(
        f"Passed          : {correct}"
    )

    print(
        f"Failed          : {total - correct}"
    )

    print(
        f"Accuracy        : {accuracy:.2%}"
    )

    print(
        "==============================================\n"
    )


if __name__ == "__main__":

    asyncio.run(main())