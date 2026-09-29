import httpx

from app.core.config import settings
import logging

logger=logging.getLogger(__name__)


class NodeAPIError(Exception):

    pass


class NodeClient:

    def __init__(self):

        self.base_url = (
            settings.NODE_BACKEND_URL.rstrip("/")
        )

    async def post(
        self,
        endpoint: str,
        payload: dict
    ):

        url = (
            f"{self.base_url}"
            f"/{endpoint.lstrip('/')}"
        )

        logger.info(
            "Calling Node API POST %s",
            url
        )

        try:

            async with httpx.AsyncClient(
                timeout=15.0
            ) as client:

                response = await client.post(
                    url,
                    json=payload
                )

            if response.status_code >= 400:

                logger.error(
                    "Node API error: %s %s",
                    response.status_code,
                    response.text
                )

                raise NodeAPIError(
                    f"Node API returned "
                    f"{response.status_code}"
                )

            return response.json()

        except httpx.TimeoutException:

            logger.error(
                "Node API timeout: %s",
                url
            )

            raise NodeAPIError(
                "Node backend timeout"
            )

        except httpx.RequestError as exc:

            logger.error(
                "Node API connection error: %s",
                exc
            )

            raise NodeAPIError(
                "Unable to connect to Node backend"
            )

    async def get(
        self,
        endpoint: str,
        params: dict | None = None
    ):

        url = (
            f"{self.base_url}"
            f"/{endpoint.lstrip('/')}"
        )

        logger.info(
            "Calling Node API GET %s",
            url
        )

        try:

            async with httpx.AsyncClient(
                timeout=15.0
            ) as client:

                response = await client.get(
                    url,
                    params=params
                )

            if response.status_code >= 400:

                logger.error(
                    "Node API error: %s %s",
                    response.status_code,
                    response.text
                )

                raise NodeAPIError(
                    f"Node API returned "
                    f"{response.status_code}"
                )

            return response.json()

        except httpx.TimeoutException:

            raise NodeAPIError(
                "Node backend timeout"
            )

        except httpx.RequestError:

            raise NodeAPIError(
                "Unable to connect to Node backend"
            )


node_client = NodeClient()