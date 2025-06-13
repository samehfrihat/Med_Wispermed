def prompt(abstract):
    return f"""
You are given a medical abstract and four predefined aspects. For each aspect, perform the following two tasks:

1. If present, extract the sentence(s) that clearly describe the aspect. Provide the **index(es)** of these sentence(s), starting from 0.
2. Write a **concise one-sentence summary** of the aspect based on the extracted sentence(s). If no relevant sentence is found, write "Not mentioned."

# Abstract:
{abstract}

# Aspect 1:  
Objective or purpose of the study.

# Aspect 2:  
Involved participants (e.g., number, age, diagnosis).

# Aspect 3:  
Adverse events.

# Aspect 4:  
Names of the medicines involved.

# Aspect 5:  
Intervention details (e.g., dosage, route, frequency).


Respond in the following format for each aspect:

# Aspect X:
1. Indexes of Extracted Sentences: [<index1>, <index2>, ...]  
2. Summary: <one-sentence summary or "Not mentioned">
"""
