class AutoComplete:

    def __init__(self, words):
        self.token_mapping = {}
     
        for term in words:
            tokens = self.tokenize_term(term)

            for token in tokens:
                if token not in self.token_mapping:
                    self.token_mapping[token] = []
                self.token_mapping[token].append(term)
    

    def tokenize_term(self, term):
        # Modify this method to tokenize a term into tokens
        return [token.lower() for token in term.split()]

    def search(self ,word, max_cost=0 , size=3):
        # Implement your search logic here, considering all tokens
        word = word.lower()
        suggestions = set()

        for token in word.split():
            if token in self.token_mapping:
                for item in self.token_mapping[token]:
                    suggestions.add(item)
                    
        # print('suggestions',list(suggestions))
        return list(suggestions)

