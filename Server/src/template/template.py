import os

def get_entity_template():
    TPL_ENT = """
    <mark class="entity" style="background: {bg}; padding: 0em 0em; margin: 0 0.25em; line-height: 1; border-radius: 0.35em;">
        {text}
        <span style="font-size: 0.8em; font-weight: bold; line-height: 1; border-radius: 0.35em; vertical-align: middle; margin-left: 0.5rem">{label}{kb_link}</span>
    </mark>
    """
    return TPL_ENT