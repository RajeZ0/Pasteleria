import logging
from typing import Iterable, Optional

import requests
from django.conf import settings

logger = logging.getLogger(__name__)


def send_ntfy_message(
    message: str,
    *,
    title: Optional[str] = None,
    tags: Optional[Iterable[str]] = None,
    priority: Optional[int] = None,
) -> None:
    """
    Send a notification to an ntfy topic if it is configured.

    The function is a no-op when NTFY_TOPIC is blank so it can be
    enabled per environment without code changes.
    """
    topic = getattr(settings, "NTFY_TOPIC", None)
    if not topic:
        return

    url = f"{settings.NTFY_SERVER}/{topic}"
    headers = {}

    if settings.NTFY_TOKEN:
        headers["Authorization"] = f"Bearer {settings.NTFY_TOKEN}"
    if title:
        headers["Title"] = title
    if tags:
        headers["Tags"] = ",".join(tags)
    if priority:
        headers["Priority"] = str(priority)

    try:
        response = requests.post(
            url,
            data=message.encode("utf-8"),
            headers=headers,
            timeout=5,
        )
        response.raise_for_status()
    except requests.RequestException as exc:
        logger.warning("Failed to send ntfy notification: %s", exc)
