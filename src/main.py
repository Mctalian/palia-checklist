from dotenv import load_dotenv
from mwclient import Site
from mwclient.page import Page

# Import our custom logger
from utils.logger import setup_logger
from utils.params import get_wiki_config, is_dry_run

load_dotenv()

reset_text = """{{Weekly Wants
  |
  |
  |
  |
}}"""


def main():
    # Set up the logger with the same functionality as your Node.js logger
    logger = setup_logger("PaliaWeeklyReset")

    user_agent = "PaliaWeeklyResetBot (User:McTalian)"
    wiki_config = get_wiki_config()
    dry_run = is_dry_run()

    logger.info("Starting Palia Weekly Reset Bot...")
    if dry_run:
        logger.warning("Dry run mode is enabled. No changes will be made to the wiki.")

    site = Site("palia.wiki.gg", path="/", clients_useragent=user_agent)
    site.login(username=wiki_config["username"], password=wiki_config["password"])

    logger.info("Logged in to the wiki successfully.")

    template_weekly_wants = Page(site, "Template:Weekly Wants")
    logger.info("Finding Weekly Wants pages...")
    transcluders = template_weekly_wants.embeddedin(namespace=0, max_items=500)
    pages_found = 0
    page_names = []

    for transcluder in transcluders:
        if "/Weekly Wants" in transcluder.name:
            page_names.append(transcluder.name)
            pages_found += 1

    logger.info(f"Done! Total pages found: {pages_found}")

    for page_name in page_names:
        npc_name = page_name.split("/")[0]
        page = Page(site, page_name)
        if dry_run:
            logger.info(f"Dry run enabled. Not making changes to {page.name}.")
            logger.info(f"Can edit? {page.can('edit')}")
        else:
            logger.warning(f"Resetting Weekly Wants for {npc_name}...")
            try:
                page.edit(
                    reset_text,
                    summary="Resetting weekly wants",
                    bot=True,
                    minor=True,
                )
                logger.info(f"Successfully reset {page.name}.")
            except Exception as e:
                logger.error(f"Failed to reset {page.name}. Error: {e}")


if __name__ == "__main__":
    main()
