ARG PUBLISH_IMAGE=ghcr.io/markdown-confluence/publish:7.0.0
FROM ${PUBLISH_IMAGE}

# GitHub mounts the checked-out repository for frontmatter updates.
USER root

COPY --chmod=755 entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
